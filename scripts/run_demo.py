import os
import sys
from pathlib import Path
from typing import Tuple, Dict, Any

# Ensure repository root is on PYTHONPATH
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

import cv2
import json
import math
import numpy as np
from sqlalchemy.orm import Session

from backend.config import BASE_DIR, DEMO_DIR, UPLOADS_DIR
from backend.db.database import SessionLocal, init_db
from backend.db.models import Survey, SurveyFile
from backend.sonar.pipeline import SonarPerceptionPipeline

def generate_demo_sonar_waterfall() -> Tuple[Path, Path]:
    """
    Generates a realistic dual-channel (Port & Starboard) Side-Scan Sonar waterfall
    with physics-based acoustic backscatter, nadir water column, and distinct benthic targets:
    1. Derelict fishing gear / ghost net cluster (high contrast highlight, irregular mesh shadow)
    2. Sunken shipwreck hull section (large rectilinear body with long relief shadow)
    3. Subsea pipeline conduit (linear high-aspect-ratio cylinder)
    4. Cylindrical steel container / drum (compact highlight with trailing shadow)
    5. Natural bedrock ridge / sand ripples (diffuse, low contrast)
    6. Out-of-distribution acoustic anomaly (high novelty contact)
    """
    demo_survey_dir = DEMO_DIR / "survey"
    demo_survey_dir.mkdir(parents=True, exist_ok=True)
    
    img_path = demo_survey_dir / "demo_coastal_survey_waterfall.png"
    meta_path = demo_survey_dir / "demo_coastal_survey_waterfall.json"

    # Image dimensions: 800 pings (height) x 1024 range samples (width)
    h, w = 800, 1024
    half_w = w // 2

    # 1. Base acoustic seabed backscatter with speckle noise
    np.random.seed(42)
    # Background intensity: mean 110 with Rayleigh/Gamma speckle distribution
    seabed = np.random.gamma(shape=9.0, scale=12.0, size=(h, w)).astype(np.float32)

    # 2. Transducer Beam Pattern & Range Falloff (acoustic attenuation with range)
    x_coords = np.arange(w)
    dist_from_nadir = np.abs(x_coords - half_w)
    # Range gain falloff curve
    range_falloff = 1.0 - 0.45 * (dist_from_nadir / half_w)**1.4
    seabed *= range_falloff[np.newaxis, :]

    # 3. Nadir blind zone (water column beneath towfish where sound travels through water before bottom hit)
    nadir_half_width = 38
    nadir_left = half_w - nadir_half_width
    nadir_right = half_w + nadir_half_width
    # Water column return is very dark with mild water reverberation
    water_column = np.random.normal(18.0, 4.0, size=(h, nadir_right - nadir_left))
    seabed[:, nadir_left:nadir_right] = water_column

    # Add nadir first bottom return reflection stripe (bright bottom arrival)
    seabed[:, nadir_left:nadir_left+3] = np.random.normal(190.0, 15.0, size=(h, 3))
    seabed[:, nadir_right-3:nadir_right] = np.random.normal(190.0, 15.0, size=(h, 3))

    # Helper to stamp coupled highlight + acoustic shadow
    # In SSS, shadow always falls down-range away from center nadir!
    def stamp_target(cy, cx, length, width, angle_deg, is_starboard, target_intensity=230, shadow_length=45):
        # 1. Highlight
        rot_rect = ((cx, cy), (width, length), angle_deg)
        box = cv2.boxPoints(rot_rect).astype(np.int32)
        cv2.fillPoly(seabed, [box], float(target_intensity))

        # 2. Acoustic Shadow: occluded zone projected away from center
        shadow_dir = 1.0 if is_starboard else -1.0
        sx = cx + shadow_dir * (width / 2.0 + shadow_length / 2.0)
        shadow_rect = ((sx, cy), (shadow_length, length * 1.1), angle_deg)
        s_box = cv2.boxPoints(shadow_rect).astype(np.int32)
        cv2.fillPoly(seabed, [s_box], 12.0)  # Acoustic void

    # Target 1: Derelict Gear / Ghost Net (Multi-ping persistent contact on Starboard)
    # Stamped across pings 160-190 to demonstrate multi-ping continuity!
    for py in [165, 175, 185]:
        stamp_target(py, 680, length=28, width=22, angle_deg=25, is_starboard=True, target_intensity=225, shadow_length=40)

    # Target 2: Shipwreck Hull Section (High confidence large contact on Starboard)
    stamp_target(360, 780, length=70, width=35, angle_deg=-15, is_starboard=True, target_intensity=245, shadow_length=65)

    # Target 3: Subsea Pipeline Conduit (Elongated continuous body crossing Port swath)
    for py in range(480, 540, 15):
        stamp_target(py, 320, length=24, width=14, angle_deg=75, is_starboard=False, target_intensity=220, shadow_length=32)

    # Target 4: Cylindrical Steel Container (Compact man-made object on Port)
    stamp_target(640, 240, length=20, width=18, angle_deg=5, is_starboard=False, target_intensity=235, shadow_length=28)

    # Target 5: Natural Rock Bedrock Outcrop (Low contrast, amorphous highlight, diffuse shadow)
    # Stamped on Starboard without sharp boundaries
    cv2.circle(seabed, (890, 680), 30, 160.0, -1)
    cv2.ellipse(seabed, (940, 680), (35, 20), 0, 0, 360, 50.0, -1)

    # Target 6: Out-of-Distribution Novel Anomaly (High novelty contact)
    stamp_target(280, 190, length=32, width=16, angle_deg=45, is_starboard=False, target_intensity=250, shadow_length=50)

    # Clip and convert to uint8
    final_img = np.clip(seabed, 0, 255).astype(np.uint8)
    img_bgr = cv2.cvtColor(final_img, cv2.COLOR_GRAY2BGR)
    cv2.imwrite(str(img_path), img_bgr)

    # Metadata sidecar (WGS-84 Coastal Bay survey in Chennai / Bay of Bengal off NIOT research station)
    metadata = {
        "survey_code": "DEMO-COASTAL-BAY-A",
        "survey_name": "DEMO COASTAL SURVEY — BAY A",
        "is_synthetic_demo": True,
        "demonstration_banner": "DEMO DATA — NOT A LIVE MARINE SURVEY",
        "vessel_name": "RV Sagarkanya (MoES/NIOT Benchmark)",
        "sensor_model": "Edgetech 4200 Dual-Frequency SSS",
        "frequency_khz": 410.0,
        "vessel_lat": 13.082715,
        "vessel_lon": 80.270725,
        "vessel_heading_deg": 35.0,
        "sensor_altitude_m": 14.5,
        "water_depth_m": 28.0,
        "max_slant_range_m": 75.0,
        "meters_per_pixel": 0.08,
        "scenarios_included": [
            "1. High-confidence derelict gear candidate",
            "2. Large shipwreck hull debris",
            "3. Subsea pipeline conduit",
            "4. Compact cylindrical container",
            "5. Natural bedrock formation",
            "6. Out-of-distribution novel acoustic anomaly"
        ]
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return img_path, meta_path

def setup_and_run_demo(db: Session = None) -> Dict[str, Any]:
    """
    Initializes demo records in DB, executes real sonar perception pipeline,
    and returns complete summary.
    """
    close_db_at_end = False
    if db is None:
        init_db()
        db = SessionLocal()
        close_db_at_end = True

    try:
        # Generate demo fixture if not present
        img_path, meta_path = generate_demo_sonar_waterfall()

        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)

        # Check if demo survey already exists in DB; if so, clear previous demo run
        existing = db.query(Survey).filter(Survey.survey_code == meta["survey_code"]).first()
        if existing:
            db.delete(existing)
            db.commit()

        # Create Survey
        survey = Survey(
            survey_code=meta["survey_code"],
            name=meta["survey_name"],
            vessel_name=meta["vessel_name"],
            sensor_model=meta["sensor_model"],
            frequency_khz=meta["frequency_khz"],
            is_demo=True,
            status="QUEUED"
        )
        db.add(survey)
        db.commit()
        db.refresh(survey)

        # Copy fixture to uploads dir
        UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
        dest_img = UPLOADS_DIR / f"demo_survey_{survey.id}_waterfall.png"
        import shutil
        shutil.copyfile(str(img_path), str(dest_img))

        # Create SurveyFile
        survey_file = SurveyFile(
            survey_id=survey.id,
            original_filename=img_path.name,
            file_path=str(dest_img),
            file_type="IMAGE",
            file_size_bytes=dest_img.stat().st_size,
            metadata_json=meta
        )
        db.add(survey_file)
        db.commit()

        # Run REAL perception pipeline
        pipeline = SonarPerceptionPipeline()
        result = pipeline.execute_survey_processing(db, survey.id, preset_name="STANDARD")
        
        result["survey_code"] = survey.survey_code
        result["demo_banner"] = "DEMO DATA — NOT A LIVE MARINE SURVEY"
        return result

    finally:
        if close_db_at_end:
            db.close()

if __name__ == "__main__":
    print("[AQUAFORGE] Executing Demo Survey Pipeline...")
    res = setup_and_run_demo()
    print("[AQUAFORGE] Demo Completed Successfully!")
    print(json.dumps(res, indent=2))
