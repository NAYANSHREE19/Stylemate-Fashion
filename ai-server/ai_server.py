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
