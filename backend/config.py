import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
DATA_DIR = BASE_DIR / "data"
DEMO_DIR = BASE_DIR / "demo"
MODELS_DIR = BASE_DIR / "models"
REPORTS_DIR = BASE_DIR / "artifacts" / "reports"
UPLOADS_DIR = BASE_DIR / "artifacts" / "uploads"

# Ensure runtime directories exist
for p in [REPORTS_DIR, UPLOADS_DIR, DATA_DIR / "raw", DATA_DIR / "processed", DATA_DIR / "sample"]:
    p.mkdir(parents=True, exist_ok=True)

# Database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/artifacts/aquaforge.db")

# Host / Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
PUBLIC_APP_URL = os.getenv("PUBLIC_APP_URL", f"http://localhost:{PORT}")

# Security
MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB
ALLOWED_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/tiff",
    "application/octet-stream",  # for raw sonar logs like .xtf, .jsf
}
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".xtf", ".jsf", ".json"}

# Project Metadata
PROJECT_NAME = "AQUAFORGE"
SIH_PROBLEM_ID = "SIH26057"
SIH_PROBLEM_TITLE = "AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery"
ORGANIZATION = "Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)"
THEME = "Disaster Management"
TEAM_NAME = "PRAYAS"
VERSION = "1.0.0-prototype"
