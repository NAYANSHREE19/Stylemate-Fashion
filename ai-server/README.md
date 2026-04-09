# StyleMate AI Server — SDXL Turbo

Fast local image generation using **SDXL Turbo** (4 steps, 512×512, under 5–8 sec on GPU).

---

## Quick Start (Windows)

### Step 1 — Setup (run ONCE)
Double-click **`setup.bat`** or run in terminal:
```
cd ai-server
setup.bat
```
This creates a `.venv312` virtual environment and installs all dependencies.

---

### Step 2 — Start the server
Double-click **`start_server.bat`** or run:
```
start_server.bat
```
The server starts at **http://localhost:8000**

> ⚠️ **First run downloads the SDXL Turbo model (~6 GB)**. This only happens once — it caches automatically.

---

### Step 3 — Verify
```
curl http://localhost:8000/health
```
You should see `"ok": true`.

---

## API

### `POST /generate`
```json
// Request
{ "prompt": "minimalist date night outfit, fashion editorial" }

// Response (success)
{ "image_base64": "<base64 PNG string>" }

// Response (timeout)
{ "error": "timeout" }
```

### `GET /health`
```json
{
  "ok": true,
  "device": "cuda",
  "model": "stabilityai/sdxl-turbo",
  "steps": 4,
  "size": "512x512",
  "timeout": 6.0,
  "cuda": true
}
```

---

## GPU Setup (CUDA — Much Faster)

If you have an NVIDIA GPU, install CUDA-enabled PyTorch for 3–5x speedup:

```
.venv312\Scripts\pip.exe install torch==2.2.2 torchvision --index-url https://download.pytorch.org/whl/cu121
```

Then restart the server.

---

## Environment Variables (optional)

| Variable | Default | Description |
|---|---|---|
| `SDXL_MODEL_ID` | `stabilityai/sdxl-turbo` | Model to load |
| `SDXL_STEPS` | `4` | Inference steps (1–20) |
| `SD_WIDTH` | `512` | Image width |
| `SD_HEIGHT` | `512` | Image height |
| `SDXL_TIMEOUT` | `6.0` | Timeout in seconds |
| `SDXL_GUIDANCE` | `0.0` | CFG scale (0 = turbo style) |

---

## Troubleshooting

**`No module named uvicorn`** — venv not activated, use `start_server.bat` instead.

**`CUDA out of memory`** — Reduce `SD_WIDTH`/`SD_HEIGHT` to `384`, or use CPU mode.

**Generation too slow on CPU** — Reduce `SDXL_STEPS` to `2` or `1`. The Pexels API in the main backend is recommended for production instead.
