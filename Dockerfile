# ==============================================================================
# AQUAFORGE - Production Multi-Stage Dockerfile
# Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)
# Problem Statement: SIH26057 | Team: PRAYAS
# ==============================================================================

# Stage 1: Build Frontend SPA
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Production Environment
FROM python:3.12-slim AS final

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8000

WORKDIR /app

# Install system runtime dependencies for OpenCV and image codecs
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, scripts, and model assets
COPY backend/ ./backend/
COPY models/ ./models/
COPY demo/ ./demo/
COPY data/ ./data/
COPY scripts/ ./scripts/

# Copy built frontend assets from stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure runtime directories exist
RUN mkdir -p artifacts/reports artifacts/uploads data/raw data/processed data/sample

# Initialize demo fixtures and run ONNX export during build
RUN python scripts/export_onnx.py && python scripts/run_demo.py

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

EXPOSE 8000

# Start Uvicorn serving both API and Frontend SPA
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
