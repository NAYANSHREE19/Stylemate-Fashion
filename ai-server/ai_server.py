"""
StyleMate AI Server — Production-ready SDXL Turbo
==================================================
• Model: stabilityai/sdxl-turbo  (1-4 steps, 512x512, fastest SD variant)
• Loaded ONCE at startup via FastAPI lifespan
• Async non-blocking — runs generation in a thread pool so other requests
  can be received while inference is in progress
• 6-second timeout — returns {"error": "timeout"} if exceeded
• GPU (float16) auto-detected, falls back to CPU (float32) with
  attention slicing for lower RAM usage
"""

import asyncio
import base64
import io
import os
import warnings
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

import torch
from diffusers import AutoPipelineForText2Image
from fastapi import FastAPI
from pydantic import BaseModel, Field

warnings.filterwarnings("ignore")

# ── Configuration ──────────────────────────────────────────────────────────────
MODEL_ID   = os.getenv("SDXL_MODEL_ID",   "stabilityai/sdxl-turbo")
STEPS      = int(os.getenv("SDXL_STEPS",  "4"))         # 1-4 for turbo
WIDTH      = int(os.getenv("SD_WIDTH",    "512"))
HEIGHT     = int(os.getenv("SD_HEIGHT",   "512"))
GUIDANCE   = float(os.getenv("SDXL_GUIDANCE", "0.0"))   # 0.0 = turbo style
TIMEOUT_S  = float(os.getenv("SDXL_TIMEOUT", "6.0"))    # seconds before timeout

NEGATIVE_PROMPT = (
    "cartoon, anime, illustration, 3d render, watermark, logo, text, "
    "blurry, lowres, ugly, deformed, bad anatomy, extra limbs"
)

# ── Global state ───────────────────────────────────────────────────────────────
_pipeline  = None
_device    = None
_executor  = ThreadPoolExecutor(max_workers=1)  # one generation at a time


# ── Lifespan: load model ONCE at startup ───────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _pipeline, _device

    print("🔥 Loading SDXL Turbo model at startup…")
    cuda_ok = torch.cuda.is_available()
    _device  = "cuda" if cuda_ok else "cpu"
    dtype    = torch.float16 if cuda_ok else torch.float32

    print(f"   ▶ Device : {_device.upper()}")
    print(f"   ▶ Model  : {MODEL_ID}")
    print(f"   ▶ Steps  : {STEPS}  |  Size: {WIDTH}×{HEIGHT}")

    _pipeline = AutoPipelineForText2Image.from_pretrained(
        MODEL_ID,
        torch_dtype=dtype,
        variant="fp16" if cuda_ok else None,
        use_safetensors=True,
    )
    _pipeline = _pipeline.to(_device)

    # Memory optimizations
    _pipeline.enable_attention_slicing()
    if hasattr(_pipeline, "vae") and hasattr(_pipeline.vae, "enable_slicing"):
        _pipeline.vae.enable_slicing()
    if cuda_ok and hasattr(_pipeline, "enable_xformers_memory_efficient_attention"):
        try:
            _pipeline.enable_xformers_memory_efficient_attention()
            print("   ✅ xformers enabled")
        except Exception:
            pass

    print("✅ Model ready!")
    yield

    # Cleanup on shutdown
    print("🛑 Shutting down — releasing model from memory…")
    del _pipeline
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    _executor.shutdown(wait=False)


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="StyleMate AI Server",
    description="Fast image generation with SDXL Turbo",
    version="2.0.0",
    lifespan=lifespan,
)


# ── Request / Response models ──────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    prompt:          str = Field(..., min_length=3, max_length=1000)
    negative_prompt: str = Field(default=NEGATIVE_PROMPT)
    steps:           int = Field(default=STEPS, ge=1, le=20)
    width:           int = Field(default=WIDTH)
    height:          int = Field(default=HEIGHT)


# ── Synchronous generation (runs inside thread pool) ──────────────────────────
def _generate_sync(prompt: str, negative_prompt: str, steps: int, width: int, height: int) -> str:
    """Run the pipeline synchronously — called in a background thread."""
    result = _pipeline(
        prompt=prompt,
        negative_prompt=negative_prompt if GUIDANCE > 0 else None,
        num_inference_steps=steps,
        guidance_scale=GUIDANCE,
        width=width,
        height=height,
    )
    image  = result.images[0]
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    """Quick health check."""
    return {
        "ok":      _pipeline is not None,
        "device":  _device,
        "model":   MODEL_ID,
        "steps":   STEPS,
        "size":    f"{WIDTH}x{HEIGHT}",
        "timeout": TIMEOUT_S,
        "cuda":    torch.cuda.is_available(),
    }


@app.post("/generate")
async def generate_image(payload: GenerateRequest):
    """
    Generate an image from a text prompt.
    Returns base64-encoded PNG or {"error": "timeout"} if generation
    exceeds TIMEOUT_S seconds.
    """
    if _pipeline is None:
        return {"error": "model_not_loaded"}

    loop = asyncio.get_event_loop()

    future = loop.run_in_executor(
        _executor,
        _generate_sync,
        payload.prompt,
        payload.negative_prompt,
        payload.steps,
        payload.width,
        payload.height,
    )

    try:
        image_base64 = await asyncio.wait_for(future, timeout=TIMEOUT_S)
        return {"image_base64": image_base64}
    except asyncio.TimeoutError:
        return {"error": "timeout"}
    except Exception as exc:
        return {"error": str(exc)}


# ── Clothing Analysis (Background Removal + Auto-Tagging) ─────────────────────
from fastapi import File, UploadFile
from PIL import Image
import numpy as np

# Lazy-load rembg session to avoid slow startup
_rembg_session = None

def _get_rembg_session():
    global _rembg_session
    if _rembg_session is None:
        from rembg import new_session
        _rembg_session = new_session("u2net")
        print("✅ rembg model loaded")
    return _rembg_session


def _extract_dominant_color(img: Image.Image) -> dict:
    """Extract dominant color name and hex from a PIL image."""
    # Resize for speed
    small = img.convert("RGB").resize((100, 100))
    pixels = np.array(small).reshape(-1, 3)

    # Remove near-transparent / near-black / near-white pixels
    mask = (pixels.sum(axis=1) > 30) & (pixels.sum(axis=1) < 700)
    pixels = pixels[mask]

    if len(pixels) == 0:
        return {"name": "Unknown", "hex": "#888888"}

    try:
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=min(5, len(pixels)), random_state=42, n_init=10)
        kmeans.fit(pixels)
        # Pick the cluster with the most members
        counts = np.bincount(kmeans.labels_)
        dominant = kmeans.cluster_centers_[counts.argmax()].astype(int)
    except Exception:
        dominant = pixels.mean(axis=0).astype(int)

    r, g, b = int(dominant[0]), int(dominant[1]), int(dominant[2])
    hex_color = f"#{r:02x}{g:02x}{b:02x}"
    color_name = _rgb_to_name(r, g, b)
    return {"name": color_name, "hex": hex_color}


def _rgb_to_name(r, g, b):
    """Map an RGB value to a human-readable color name."""
    colors = {
        "Black":   (0, 0, 0),
        "White":   (255, 255, 255),
        "Red":     (220, 50, 50),
        "Blue":    (50, 80, 220),
        "Navy":    (0, 0, 128),
        "Green":   (50, 180, 50),
        "Yellow":  (240, 220, 50),
        "Orange":  (240, 150, 30),
        "Pink":    (240, 130, 170),
        "Purple":  (150, 60, 200),
        "Brown":   (139, 90, 43),
        "Beige":   (220, 200, 170),
        "Grey":    (140, 140, 140),
        "Teal":    (0, 128, 128),
        "Maroon":  (128, 0, 0),
        "Olive":   (128, 128, 0),
        "Coral":   (255, 127, 80),
        "Lavender":(200, 180, 240),
    }
    min_dist = float("inf")
    best = "Unknown"
    for name, (cr, cg, cb) in colors.items():
        dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2
        if dist < min_dist:
            min_dist = dist
            best = name
    return best


def _guess_category_from_aspect(width, height):
    """Heuristic: guess clothing category based on image aspect ratio."""
    ratio = height / max(width, 1)
    if ratio > 1.8:
        return "Dresses"
    elif ratio > 1.3:
        return "Tops"
    elif ratio < 0.7:
        return "Accessories"
    else:
        return "Tops"


def _remove_bg_sync(image_bytes: bytes) -> dict:
    """Remove background and extract metadata — runs in thread pool."""
    from rembg import remove
    session = _get_rembg_session()

    # Remove background
    result_bytes = remove(image_bytes, session=session)
    result_img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")

    # Extract color from the foreground only
    color_info = _extract_dominant_color(result_img)

    # Guess category
    category = _guess_category_from_aspect(result_img.width, result_img.height)

    # Encode result as base64 PNG
    buffer = io.BytesIO()
    result_img.save(buffer, format="PNG")
    img_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {
        "image_base64": img_b64,
        "color": color_info,
        "category": category,
        "width": result_img.width,
        "height": result_img.height,
    }


@app.post("/analyze-clothing")
async def analyze_clothing(file: UploadFile = File(...)):
    """
    Accepts a clothing image upload.
    Returns: background-removed base64 PNG, detected color, guessed category.
    """
    image_bytes = await file.read()

    loop = asyncio.get_event_loop()
    future = loop.run_in_executor(_executor, _remove_bg_sync, image_bytes)

    try:
        result = await asyncio.wait_for(future, timeout=30.0)
        return result
    except asyncio.TimeoutError:
        return {"error": "timeout"}
    except Exception as exc:
        return {"error": str(exc)}

