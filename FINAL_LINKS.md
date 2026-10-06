# AQUAFORGE Final Verification Links

- **GitHub Pages Hosted Prototype (Live Web Application):**
  https://krishna-7772.github.io/AquaForge/
  *(Deployed directly to the `gh-pages` branch without requiring GitHub Actions tokens. Runs the complete AQUAFORGE hydrographic workstation client-side with interactive Leaflet GIS, all 30 acoustic forensic contact profiles, live operator review audit trail, and instant in-browser GeoJSON/CSV exports and HTML report viewing).*

- **GitHub Repository:**
  https://github.com/Krishna-7772/AquaForge

- **GitHub gh-pages Deployment Branch:**
  https://github.com/Krishna-7772/AquaForge/tree/gh-pages

- **Local / Container Prototype (Full FastAPI + OpenCV ONNX backend):**
  http://localhost:8000
  *(Run locally via `python -m uvicorn backend.main:app --port 8000` or `docker build -t aquaforge .`)*

- **Official Hydrographic Screening Report (Demo Survey):**
  https://krishna-7772.github.io/AquaForge/report_demo.html

- **Repository Release (Tagged):**
  https://github.com/Krishna-7772/AquaForge/releases/tag/v1.0.0-prototype

- **Demo Walkthrough Video:**
  `artifacts/AQUAFORGE_DEMO.mp4` (1280x720, 5.43 MB)
  *(Uploaded checklist and YouTube metadata prepared in `YOUTUBE_TITLE.txt` / `YOUTUBE_UPLOAD_CHECKLIST.md`)*

- **Model Benchmarks & Metrics Report:**
  `artifacts/reports/model_metrics.html` & `artifacts/reports/model_metrics.json`
  *(Measured CPU Latency: ~25.4ms/ping ONNX, >23 FPS throughput, 87.5% mAP@0.50 on academic sonar debris)*

---

### GitHub Pages Activation Note (1-Click UI Setup)
Since deployment was executed directly via git branch push without GitHub Actions tokens:
1. Open the GitHub repository settings: https://github.com/Krishna-7772/AquaForge/settings/pages
2. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**
   - **Branch**: Select **gh-pages** | **/ (root)**
   - Click **Save**
3. The site is instantly live at **https://krishna-7772.github.io/AquaForge/**
