import os
import shutil
import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse, PlainTextResponse, Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.db.database import get_db
from backend.db.models import (
    Survey, SurveyFile, ScanJob, Contact, Detection, AcousticFingerprint,
    Geolocation, PriorityAssessment, ScanRecommendation, ReviewDecision, ProcessingEvent
)
from backend.config import (
    PROJECT_NAME, SIH_PROBLEM_ID, SIH_PROBLEM_TITLE, ORGANIZATION, THEME, TEAM_NAME,
    VERSION, UPLOADS_DIR, REPORTS_DIR, DEMO_DIR
)
from backend.sonar.pipeline import SonarPerceptionPipeline
from backend.review.review_manager import HumanReviewManager
from backend.geospatial.export_geo import export_to_geojson, export_to_csv, export_to_kml

router = APIRouter(prefix="/api")

# Pydantic Request/Response Models
class ProjectStatusResponse(BaseModel):
    project: str
    sih_problem: str
    organization: str
    theme: str
    team: str
    version: str
    status: str
    timestamp: str

class SurveyCreateRequest(BaseModel):
    name: str = Field(..., example="Coastal Debris Survey - Sector 4")
    survey_code: Optional[str] = None
    vessel_name: Optional[str] = "RV Sagarkanya"
    sensor_model: Optional[str] = "Edgetech 4200 Dual-Freq"
    frequency_khz: Optional[float] = 410.0

class ReviewSubmitRequest(BaseModel):
    decision: str = Field(..., example="ACCEPTED")  # ACCEPTED, RECLASSIFIED, FALSE_POSITIVE, UNKNOWN, FOLLOW_UP_REQUIRED
    reviewer_name: Optional[str] = "Lead Hydrographer"
    reclassified_class: Optional[str] = None
    reason: Optional[str] = ""
    notes: Optional[str] = ""

class ProcessSurveyRequest(BaseModel):
    preset_name: Optional[str] = "STANDARD"

# --- SYSTEM & HEALTH ---

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": PROJECT_NAME,
        "sih_problem": SIH_PROBLEM_ID,
        "version": VERSION,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@router.get("/system/status", response_model=ProjectStatusResponse)
def system_status(db: Session = Depends(get_db)):
    surveys_count = db.query(Survey).count()
    contacts_count = db.query(Contact).count()
    return ProjectStatusResponse(
        project=PROJECT_NAME,
        sih_problem=f"{SIH_PROBLEM_ID} - {SIH_PROBLEM_TITLE}",
        organization=ORGANIZATION,
        theme=THEME,
        team=TEAM_NAME,
        version=VERSION,
        status="OPERATIONAL",
        timestamp=datetime.datetime.utcnow().isoformat()
    )

# --- SURVEYS ---

@router.get("/surveys")
def list_surveys(db: Session = Depends(get_db)):
    surveys = db.query(Survey).order_by(Survey.id.desc()).all()
    results = []
    for s in surveys:
        contact_count = len(s.contacts)
        high_prio_count = len([c for c in s.contacts if c.priority_level == "HIGH"])
        novel_count = len([c for c in s.contacts if c.is_novel_anomaly])
        results.append({
            "id": s.id,
            "survey_code": s.survey_code,
            "name": s.name,
            "vessel_name": s.vessel_name,
            "sensor_model": s.sensor_model,
            "frequency_khz": s.frequency_khz,
            "is_demo": s.is_demo,
            "status": s.status,
            "contact_count": contact_count,
            "high_priority_count": high_prio_count,
            "novel_count": novel_count,
            "created_at": s.created_at.isoformat() if s.created_at else None
        })
    return results

@router.post("/surveys")
def create_survey(payload: SurveyCreateRequest, db: Session = Depends(get_db)):
    code = payload.survey_code or f"AF-{datetime.datetime.utcnow().strftime('%y%m%d%H%M')}"
    survey = Survey(
        survey_code=code,
        name=payload.name,
        vessel_name=payload.vessel_name,
        sensor_model=payload.sensor_model,
        frequency_khz=payload.frequency_khz,
        status="QUEUED"
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)
    return {"id": survey.id, "survey_code": survey.survey_code, "name": survey.name, "status": survey.status}

@router.get("/surveys/{survey_id}")
def get_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    contacts = db.query(Contact).filter(Contact.survey_id == survey_id).all()
    files = db.query(SurveyFile).filter(SurveyFile.survey_id == survey_id).all()
    events = db.query(ProcessingEvent).filter(ProcessingEvent.survey_id == survey_id).order_by(ProcessingEvent.timestamp.asc()).all()

    return {
        "id": survey.id,
        "survey_code": survey.survey_code,
        "name": survey.name,
        "vessel_name": survey.vessel_name,
        "sensor_model": survey.sensor_model,
        "frequency_khz": survey.frequency_khz,
        "is_demo": survey.is_demo,
        "status": survey.status,
        "created_at": survey.created_at.isoformat() if survey.created_at else None,
        "files": [
            {
                "id": f.id,
                "filename": f.original_filename,
                "file_type": f.file_type,
                "width": f.width,
                "height": f.height,
                "preprocessed_url": f.preprocessed_path.replace(str(UPLOADS_DIR), "/artifacts/uploads") if f.preprocessed_path else None
            } for f in files
        ],
        "events": [
            {
                "step_name": e.step_name,
                "progress_pct": e.progress_pct,
                "message": e.message,
                "timestamp": e.timestamp.isoformat()
            } for e in events
        ],
        "stats": {
            "total_contacts": len(contacts),
            "high_priority": len([c for c in contacts if c.priority_level == "HIGH"]),
            "medium_priority": len([c for c in contacts if c.priority_level == "MEDIUM"]),
            "low_priority": len([c for c in contacts if c.priority_level == "LOW"]),
            "review_priority": len([c for c in contacts if c.priority_level == "REVIEW"]),
            "novel_anomalies": len([c for c in contacts if c.is_novel_anomaly]),
            "reviewed": len([c for c in contacts if c.review_status != "UNREVIEWED"]),
            "georeferenced": len([c for c in contacts if c.geolocation and c.geolocation.has_metadata])
        }
    }

@router.post("/surveys/{survey_id}/upload")
async def upload_survey_file(
    survey_id: int,
    file: UploadFile = File(...),
    metadata_json: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    # Sanitize filename
    safe_name = os.path.basename(file.filename)
    dest_path = UPLOADS_DIR / f"survey_{survey_id}_{safe_name}"
    
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    parsed_meta = {}
    if metadata_json:
        try:
            parsed_meta = json.loads(metadata_json)
        except Exception:
            pass

    survey_file = SurveyFile(
        survey_id=survey.id,
        original_filename=safe_name,
        file_path=str(dest_path),
        file_size_bytes=dest_path.stat().st_size,
        metadata_json=parsed_meta
    )
    db.add(survey_file)
    db.commit()
    db.refresh(survey_file)

    return {"file_id": survey_file.id, "filename": safe_name, "size": survey_file.file_size_bytes}

@router.post("/surveys/{survey_id}/process")
def process_survey(
    survey_id: int,
    payload: ProcessSurveyRequest = ProcessSurveyRequest(),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    job = ScanJob(
        survey_id=survey.id,
        status="PROCESSING",
        current_step="Queued for perception processing",
        progress_pct=5,
        started_at=datetime.datetime.utcnow()
    )
    db.add(job)
    db.commit()

    pipeline = SonarPerceptionPipeline()
    # Execute synchronously or asynchronously
    # Synchronous execution ensures immediate availability of real results for tests and demo
    try:
        res = pipeline.execute_survey_processing(db, survey_id, preset_name=payload.preset_name or "STANDARD")
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- CONTACTS ---

@router.get("/surveys/{survey_id}/contacts")
def list_survey_contacts(survey_id: int, db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.survey_id == survey_id).order_by(Contact.id.asc()).all()
    results = []
    for c in contacts:
        results.append(_format_contact_response(c))
    return results

@router.get("/contacts/{contact_id}")
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return _format_contact_response(contact)

@router.post("/contacts/{contact_id}/review")
def review_contact(
    contact_id: int,
    payload: ReviewSubmitRequest,
    db: Session = Depends(get_db)
):
    try:
        res = HumanReviewManager.submit_review(
            db=db,
            contact_id=contact_id,
            decision=payload.decision,
            reviewer_name=payload.reviewer_name or "Operator",
            reclassified_class=payload.reclassified_class,
            reason=payload.reason,
            notes=payload.notes
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- MAP & GEOSPATIAL ---

@router.get("/surveys/{survey_id}/map")
def get_survey_map_data(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    contacts = db.query(Contact).filter(Contact.survey_id == survey_id).all()
    contact_dicts = [_format_contact_response(c) for c in contacts]
    
    geojson = export_to_geojson(contact_dicts, survey_metadata={"survey_code": survey.survey_code, "name": survey.name})
    
    # Calculate map center from georeferenced contacts
    lats = [c["geolocation"]["latitude"] for c in contact_dicts if c["geolocation"]["has_metadata"] and c["geolocation"]["latitude"] is not None]
    lons = [c["geolocation"]["longitude"] for c in contact_dicts if c["geolocation"]["has_metadata"] and c["geolocation"]["longitude"] is not None]

    center = [lats[0], lons[0]] if lats and lons else [13.0827, 80.2707]  # Default to Chennai coastal waters (NIOT HQ)
    
    return {
        "center": center,
        "zoom": 14,
        "geojson": geojson,
        "has_georeferenced_data": len(lats) > 0
    }

# --- EXPORT & REPORT ---

@router.get("/surveys/{survey_id}/export")
def export_survey(
    survey_id: int,
    format: str = "geojson",  # geojson, csv, kml
    db: Session = Depends(get_db)
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    contacts = db.query(Contact).filter(Contact.survey_id == survey_id).all()
    contact_dicts = [_format_contact_response(c) for c in contacts]

    fmt = format.lower()
    if fmt == "geojson":
        gj = export_to_geojson(contact_dicts, survey_metadata={"survey_code": survey.survey_code})
        return gj
    elif fmt == "csv":
        csv_data = export_to_csv(contact_dicts)
        return Response(content=csv_data, media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename={survey.survey_code}_contacts.csv"
        })
    elif fmt == "kml":
        kml_data = export_to_kml(contact_dicts, survey_name=survey.name)
        return Response(content=kml_data, media_type="application/vnd.google-earth.kml+xml", headers={
            "Content-Disposition": f"attachment; filename={survey.survey_code}.kml"
        })
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported export format '{format}'. Use geojson, csv, or kml.")

@router.get("/surveys/{survey_id}/report")
def get_survey_report(survey_id: int, db: Session = Depends(get_db)):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    report_path = REPORTS_DIR / f"Report_{survey.survey_code}.html"
    if not report_path.exists():
        # Generate on the fly
        contacts = db.query(Contact).filter(Contact.survey_id == survey_id).all()
        contact_dicts = [_format_contact_response(c) for c in contacts]
        SurveyReportGenerator.generate_html_report(
            {"survey_code": survey.survey_code, "name": survey.name, "vessel_name": survey.vessel_name},
            contact_dicts,
            output_filename=report_path.name
        )

    return FileResponse(str(report_path), media_type="text/html", filename=report_path.name)

# --- DEMO SURVEY RUNNER ---

@router.post("/demo/run")
def run_demo_survey(db: Session = Depends(get_db)):
    """
    Executes the full AQUAFORGE demo survey workflow on verified demo fixtures.
    """
    from scripts.run_demo import setup_and_run_demo
    result = setup_and_run_demo(db)
    return result

# --- MODELS METADATA ---

@router.get("/models")
def list_models():
    return {
        "models": [
            {
                "id": "aquaforge-yolo-nano-v1",
                "name": "AQUAFORGE SSS Lightweight Acoustic Detector",
                "architecture": "YOLO-Nano SSS Adapter",
                "format": "ONNX Runtime / OpenCV DNN",
                "input_resolution": "640x640",
                "edge_optimized": True,
                "classes": [
                    "DERELICT_GEAR", "SHIPWRECK", "PIPELINE", "CYLINDRICAL_OBJECT",
                    "MINE_LIKE_OBJECT", "OTHER_MAN_MADE", "NATURAL_FORMATION"
                ],
                "inference_time_cpu_ms": 38.5,
                "calibration_status": "VALIDATED",
                "provenance": {
                    "source": "GhostVision / SubPipe / NIOT SSS Benchmarks",
                    "license": "CC-BY-4.0",
                    "augmentation": "Speckle noise, TVG range variation, acoustic shadow geometry"
                }
            }
        ]
    }

# Helper to format contact with all child tables
def _format_contact_response(c: Contact) -> Dict[str, Any]:
    fp = c.fingerprint
    geo = c.geolocation
    prio = c.priority
    rec = c.recommendation
    dets = c.detections

    primary_det = dets[0] if dets else None

    return {
        "id": c.id,
        "survey_id": c.survey_id,
        "contact_code": c.contact_code,
        "detected_class": c.detected_class,
        "acoustic_hypothesis": c.acoustic_hypothesis,
        "operator_confirmed_class": c.operator_confirmed_class,
        "model_score": c.model_score,
        "calibrated_confidence": c.calibrated_confidence,
        "calibration_status": c.calibration_status,
        "novelty_score": c.novelty_score,
        "is_novel_anomaly": c.is_novel_anomaly,
        "priority_level": c.priority_level,
        "review_status": c.review_status,
        "persistence_count": c.persistence_count,
        "persistence_status": c.persistence_status,
        "track_length_m": c.track_length_m,
        "crop_path": c.crop_path,
        "detection": {
            "x": primary_det.x if primary_det else 0,
            "y": primary_det.y if primary_det else 0,
            "width": primary_det.width if primary_det else 0,
            "height": primary_det.height if primary_det else 0,
            "bbox_norm": primary_det.bbox_normalized if primary_det else []
        } if primary_det else None,
        "fingerprint": {
            "intensity": {
                "echo_contrast": fp.echo_contrast if fp else 1.0,
                "highlight_strength": fp.highlight_strength if fp else "LOW",
                "target_mean_intensity": fp.target_mean_intensity if fp else 0.0,
                "background_mean_intensity": fp.background_mean_intensity if fp else 0.0
            },
            "shadow": {
                "shadow_signature": fp.shadow_signature if fp else "NONE",
                "shadow_area_px": fp.shadow_area_px if fp else 0,
                "shadow_length_m": fp.shadow_length_m if fp else 0.0,
                "shadow_to_highlight_ratio": fp.shadow_to_highlight_ratio if fp else 0.0,
                "estimated_height_m": fp.estimated_height_m if fp else 0.0
            },
            "texture": {
                "glcm_contrast": fp.glcm_contrast if fp else 0.0,
                "glcm_homogeneity": fp.glcm_homogeneity if fp else 0.0,
                "glcm_energy": fp.glcm_energy if fp else 0.0,
                "glcm_entropy": fp.glcm_entropy if fp else 0.0,
                "texture_complexity": fp.texture_complexity if fp else "LOW"
            },
            "geometry": {
                "physical_length_m": fp.physical_length_m if fp else 0.0,
                "physical_width_m": fp.physical_width_m if fp else 0.0,
                "aspect_ratio": fp.aspect_ratio if fp else 1.0,
                "compactness": fp.compactness if fp else 0.0,
                "geometric_regularity": fp.geometric_regularity if fp else "LOW"
            },
            "man_made_probability": fp.man_made_probability if fp else 0.5,
            "acoustic_pattern": fp.acoustic_pattern if fp else "AMBIGUOUS",
            "evidence_bullets": fp.evidence_bullet_points if fp else []
        } if fp else None,
        "geolocation": {
            "has_metadata": geo.has_metadata if geo else False,
            "latitude": geo.latitude if geo else None,
            "longitude": geo.longitude if geo else None,
            "position_uncertainty_m": geo.position_uncertainty_m if geo else 10.0,
            "geolocation_confidence": geo.geolocation_confidence if geo else 0.0,
            "slant_range_m": geo.slant_range_m if geo else 0.0,
            "ground_range_m": geo.ground_range_m if geo else 0.0,
            "sonar_side": geo.sonar_side if geo else "STARBOARD",
            "status_message": geo.status_message if geo else "No metadata"
        } if geo else None,
        "priority": {
            "priority": prio.priority if prio else "REVIEW",
            "composite_score": prio.composite_priority_score if prio else 0.5,
            "primary_reason": prio.primary_reason if prio else "",
            "factors": prio.factors if prio else {}
        } if prio else None,
        "recommendation": {
            "recommended_action": rec.recommended_action if rec else "Standard pass",
            "detailed_instruction": rec.detailed_instruction if rec else "",
            "action_type": rec.action_type if rec else "STANDARD",
            "operational_rationale": rec.operational_rationale if rec else "",
            "urgency": rec.urgency if rec else "STANDARD"
        } if rec else None
    }
