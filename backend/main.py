import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.config import (
    PROJECT_NAME, SIH_PROBLEM_ID, SIH_PROBLEM_TITLE, ORGANIZATION, THEME, TEAM_NAME,
    VERSION, BASE_DIR, REPORTS_DIR, UPLOADS_DIR
)
from backend.db.database import init_db
from backend.api.routes import router as api_router

# Initialize database
init_db()

app = FastAPI(
    title=PROJECT_NAME,
    description=f"{SIH_PROBLEM_TITLE} (MoES / NIOT - SIH26057)",
    version=VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount artifacts static directory for crops, reports, and preprocessed sonographs
artifacts_dir = BASE_DIR / "artifacts"
artifacts_dir.mkdir(parents=True, exist_ok=True)
app.mount("/artifacts", StaticFiles(directory=str(artifacts_dir)), name="artifacts")

# Register API routes
app.include_router(api_router)

# Mount Frontend static files if built
frontend_dist = BASE_DIR / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="frontend_assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Don't intercept API or artifact routes
        if full_path.startswith("api") or full_path.startswith("artifacts"):
            return None
        file_candidate = frontend_dist / full_path
        if file_candidate.is_file():
            return FileResponse(str(file_candidate))
        return FileResponse(str(frontend_dist / "index.html"))

@app.on_event("startup")
def startup_banner():
    print("=" * 70)
    print(f" {PROJECT_NAME} — SIDE-SCAN SONAR ANOMALY DETECTION PLATFORM")
    print(f" Problem: {SIH_PROBLEM_ID} | Org: {ORGANIZATION}")
    print(f" Team: {TEAM_NAME} | Theme: {THEME} | Version: {VERSION}")
    print("=" * 70)
