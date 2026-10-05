# AQUAFORGE Deployment & Operations Guide

AQUAFORGE is designed for lightweight deployment: a single multi-stage Docker container runs both the React SPA and the FastAPI Python inference engine on a single port.

---

## 1. Local Development Setup

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ (Node 22 recommended)

### Step 1: Install Python Requirements
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 2: Build Frontend SPA
```bash
cd frontend
npm ci
npm run build
cd ..
```

### Step 3: Run Hardware Benchmark & Export ONNX Model
```bash
python scripts/export_onnx.py
python scripts/benchmark.py
```

### Step 4: Launch AQUAFORGE Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Open your browser at `http://localhost:8000`.

---

## 2. Docker Container Deployment

### Build Container
```bash
docker build -t aquaforge:latest .
```

### Run Container
```bash
docker run -d -p 8000:8000 --name aquaforge-app aquaforge:latest
```

### Run via Docker Compose
```bash
docker-compose up --build -d
```

Verify health:
```bash
curl http://localhost:8000/api/health
```

---

## 3. Cloud Deployment (Render / Hugging Face Spaces)

### Render (1-Click Deployment via `render.yaml`)
1. Push repository to GitHub.
2. In Render, select **New > Blueprint** and link the repository.
3. Render reads `render.yaml`, builds the multi-stage Dockerfile, and assigns a public HTTPS URL.

### Hugging Face Spaces (Docker Space)
1. Create a new Space on Hugging Face with **Docker** SDK.
2. Push this repository to the Space remote.
3. Hugging Face builds the Dockerfile on port 8000 automatically.

---

## 4. Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | HTTP port exposed by Uvicorn server |
| `HOST` | `0.0.0.0` | Network binding interface |
| `DATABASE_URL` | `sqlite:///./artifacts/aquaforge.db` | Database connection string (PostgreSQL or SQLite) |
| `PUBLIC_APP_URL` | `http://localhost:8000` | Publicly accessible URL for report generation links |
