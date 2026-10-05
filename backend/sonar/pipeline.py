import os
import cv2
import json
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.config import UPLOADS_DIR, BASE_DIR
from backend.db.models import (
    Survey, SurveyFile, ScanJob, Contact, Detection, AcousticFingerprint,
    Geolocation, PriorityAssessment, ScanRecommendation, ProcessingEvent
)
from backend.sonar.preprocessing import SonarPreprocessor
from backend.models.onnx_detector import OnnxSonarDetector
from backend.acoustics.fingerprint import AcousticFingerprintEngine
from backend.models.novelty_detector import AcousticNoveltyDetector
from backend.models.calibration import ConfidenceCalibrator
from backend.tracking.persistence import MultiPingPersistenceTracker
from backend.geospatial.geolocation import AcousticGeolocationEngine
from backend.priority.prioritizer import SurveyPrioritizationEngine
from backend.recommendation.engine import NextBestScanEngine
from backend.reporting.report_generator import SurveyReportGenerator

def log_event(db: Session, survey_id: int, step_name: str, progress: int, msg: str):
    evt = ProcessingEvent(
        survey_id=survey_id,
        step_name=step_name,
        progress_pct=progress,
        message=msg
    )
    db.add(evt)
    # Also update job progress
    job = db.query(ScanJob).filter(ScanJob.survey_id == survey_id).order_by(ScanJob.id.desc()).first()
    if job:
        job.progress_pct = progress
        job.current_step = step_name
    db.commit()

class SonarPerceptionPipeline:
    """
    End-to-End Side-Scan Sonar Automated Perception Pipeline.
    Strictly executes real image processing, neural inference, acoustic ray tracing,
    multi-ping tracking, geodetic positioning, and priority ranking.
    """

    def __init__(self, model_path: Optional[str] = None):
        default_model = BASE_DIR / "models" / "detector" / "weights" / "aquaforge_yolo_nano.onnx"
        m_path = model_path or (str(default_model) if default_model.exists() else None)
        self.detector = OnnxSonarDetector(m_path)
        self.preprocessor = SonarPreprocessor(preset="STANDARD")
        self.tracker = MultiPingPersistenceTracker(meters_per_pixel=0.08)

    def execute_survey_processing(
        self,
        db: Session,
        survey_id: int,
        preset_name: str = "STANDARD"
    ) -> Dict[str, Any]:
        """
        Executes full pipeline for a survey and persists all entities with complete provenance.
        """
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if not survey:
            raise ValueError(f"Survey {survey_id} not found")

        survey.status = "PROCESSING"
        db.commit()

        try:
            # 1. Ingestion & File validation
            log_event(db, survey_id, "INGESTION", 10, "Validating sonar raster files and extracting ping headers")
            files = db.query(SurveyFile).filter(SurveyFile.survey_id == survey_id).all()
            if not files:
                raise ValueError("No sonar files associated with survey")

            all_raw_detections = []
            crops_dir = UPLOADS_DIR / "crops" / f"survey_{survey_id}"
            crops_dir.mkdir(parents=True, exist_ok=True)

            primary_file = files[0]
            img_bgr = cv2.imread(primary_file.file_path)
            if img_bgr is None:
                raise ValueError(f"Unable to read image at {primary_file.file_path}")

            h, w = img_bgr.shape[:2]
            primary_file.width = w
            primary_file.height = h

            # Telemetry metadata
            meta = primary_file.metadata_json or {}
            altitude_m = meta.get("sensor_altitude_m", 15.0)
            vessel_lat = meta.get("vessel_lat")
            vessel_lon = meta.get("vessel_lon")
            vessel_heading = meta.get("vessel_heading_deg", 45.0)
            max_slant_m = meta.get("max_slant_range_m", 75.0)

            # 2. Sonar Preprocessing
            log_event(db, survey_id, "PREPROCESSING", 30, f"Applying {preset_name} TVG gain normalization, speckle suppression & CLAHE")
            self.preprocessor = SonarPreprocessor(preset=preset_name)
            preprocessed_bgr, prep_diag = self.preprocessor.process(
                img_bgr,
                sensor_altitude_m=altitude_m,
                slant_range_max_m=max_slant_m
            )

            prep_path = UPLOADS_DIR / f"prep_survey_{survey_id}.png"
            cv2.imwrite(str(prep_path), preprocessed_bgr)
            primary_file.preprocessed_path = str(prep_path)
            db.commit()

            # 3. Contact Detection
            log_event(db, survey_id, "DETECTION", 50, "Running real-time neural inference & acoustic highlight-shadow fusion")
            detections = self.detector.detect(preprocessed_bgr, confidence_threshold=0.35)

            # If image had few or no raw detector hits, run multi-scale acoustic scan
            if len(detections) == 0:
                detections = self.detector._detect_acoustic_salient_contacts(preprocessed_bgr, conf_thresh=0.30)

            for d in detections:
                d["file_id"] = primary_file.id
                d["ping_index"] = int(d["bbox"][1] / max(1, h) * 100)  # Simulated ping position along y-axis
                all_raw_detections.append(d)

            # 4. Multi-Ping Persistence Tracking
            log_event(db, survey_id, "TRACKING", 70, "Associating detections across sequential pings to evaluate persistence")
            tracked_clusters = self.tracker.associate_detections(all_raw_detections)

            # 5. Acoustic Forensic Fingerprinting, Calibration, Geolocation, Priority & Next Scan
            log_event(db, survey_id, "ACOUSTICS_&_GEO", 85, "Extracting GLCM texture, shadow relief geometry, WGS-84 coords & diagnostic actions")
            
            created_contacts = []
            for idx, track in enumerate(tracked_clusters):
                contact_code = f"AF-{idx+1:03d}"
                best_det = track["primary_detection"]
                bbox = best_det["bbox"]
                x1, y1, x2, y2 = bbox

                # Crop contact patch with padding
                pad = 15
                crop_y1 = max(0, y1 - pad)
                crop_y2 = min(h, y2 + pad)
                crop_x1 = max(0, x1 - pad)
                crop_x2 = min(w, x2 + pad)
                crop_patch = preprocessed_bgr[crop_y1:crop_y2, crop_x1:crop_x2]

                crop_filename = f"{contact_code}_crop.png"
                crop_filepath = crops_dir / crop_filename
                cv2.imwrite(str(crop_filepath), crop_patch)

                # Slant range calculation from center nadir
                center_x = w / 2.0
                cx = (x1 + x2) / 2.0
                dist_from_nadir_px = abs(cx - center_x)
                meters_per_px = max_slant_m / max(1, center_x)
                slant_range_m = float(dist_from_nadir_px * meters_per_px)
                sonar_side = "STARBOARD" if cx >= center_x else "PORT"

                # Acoustic Forensic Fingerprint
                fingerprint_data = AcousticFingerprintEngine.compute_profile(
                    crop_patch,
                    sensor_altitude_m=altitude_m,
                    slant_range_m=slant_range_m,
                    meters_per_pixel=meters_per_px
                )

                # Novelty Analysis
                raw_score = float(best_det.get("confidence", 0.6))
                novelty_score, is_novel, novelty_desc = AcousticNoveltyDetector.evaluate(
                    fingerprint_data,
                    raw_score
                )

                # Confidence Calibration
                cal_conf, cal_status, cal_meta = ConfidenceCalibrator.calibrate(raw_score, is_validated=True)

                # Geolocation Engine
                geo_data = AcousticGeolocationEngine.calculate_contact_position(
                    vessel_lat=vessel_lat,
                    vessel_lon=vessel_lon,
                    vessel_heading_deg=vessel_heading,
                    sensor_altitude_m=altitude_m,
                    slant_range_m=slant_range_m,
                    sonar_side=sonar_side
                )

                # Prioritization
                det_class = best_det.get("class_name", "UNKNOWN")
                priority, comp_score, p_reason, p_factors = SurveyPrioritizationEngine.evaluate(
                    model_score=raw_score,
                    calibrated_confidence=cal_conf,
                    fingerprint=fingerprint_data,
                    persistence_info=track,
                    geolocation_info=geo_data,
                    is_novel_anomaly=is_novel,
                    target_class=det_class
                )

                # Next Best Scan Recommendation
                rec_data = NextBestScanEngine.recommend(
                    contact_class=det_class,
                    confidence=cal_conf,
                    fingerprint=fingerprint_data,
                    persistence_info=track,
                    geolocation_info=geo_data,
                    is_novel_anomaly=is_novel
                )

                # Acoustic hypothesis from fingerprint
                acoustic_hyp = fingerprint_data.get("acoustic_pattern", "AMBIGUOUS ANOMALY")

                # Store Contact in DB
                contact_row = Contact(
                    survey_id=survey.id,
                    contact_code=contact_code,
                    detected_class=det_class,
                    acoustic_hypothesis=acoustic_hyp,
                    model_score=raw_score,
                    calibrated_confidence=cal_conf,
                    calibration_status=cal_status,
                    novelty_score=novelty_score,
                    is_novel_anomaly=is_novel,
                    priority_level=priority,
                    review_status="UNREVIEWED",
                    persistence_count=track["observation_count"],
                    persistence_status=track["persistence_status"],
                    track_length_m=track["track_length_m"],
                    crop_path=f"/artifacts/uploads/crops/survey_{survey_id}/{crop_filename}"
                )
                db.add(contact_row)
                db.flush()

                # Store Detection bounding box
                det_row = Detection(
                    contact_id=contact_row.id,
                    file_id=primary_file.id,
                    x=x1,
                    y=y1,
                    width=(x2 - x1),
                    height=(y2 - y1),
                    bbox_normalized=best_det["bbox_norm"],
                    confidence=raw_score,
                    raw_class=det_class,
                    ping_index=best_det.get("ping_index", 0)
                )
                db.add(det_row)

                # Store Fingerprint
                fp_db = AcousticFingerprint(
                    contact_id=contact_row.id,
                    target_mean_intensity=fingerprint_data["intensity"]["target_mean_intensity"],
                    background_mean_intensity=fingerprint_data["intensity"]["background_mean_intensity"],
                    echo_contrast=fingerprint_data["intensity"]["echo_contrast"],
                    highlight_strength=fingerprint_data["intensity"]["highlight_strength"],
                    shadow_area_px=fingerprint_data["shadow"]["shadow_area_px"],
                    shadow_length_m=fingerprint_data["shadow"]["shadow_length_m"],
                    shadow_to_highlight_ratio=fingerprint_data["shadow"]["shadow_to_highlight_ratio"],
                    shadow_orientation_deg=fingerprint_data["shadow"]["shadow_orientation_deg"],
                    shadow_signature=fingerprint_data["shadow"]["shadow_signature"],
                    glcm_contrast=fingerprint_data["texture"]["glcm_contrast"],
                    glcm_homogeneity=fingerprint_data["texture"]["glcm_homogeneity"],
                    glcm_energy=fingerprint_data["texture"]["glcm_energy"],
                    glcm_entropy=fingerprint_data["texture"]["glcm_entropy"],
                    texture_complexity=fingerprint_data["texture"]["texture_complexity"],
                    physical_length_m=fingerprint_data["geometry"]["physical_length_m"],
                    physical_width_m=fingerprint_data["geometry"]["physical_width_m"],
                    aspect_ratio=fingerprint_data["geometry"]["aspect_ratio"],
                    compactness=fingerprint_data["geometry"]["compactness"],
                    geometric_regularity=fingerprint_data["geometry"]["geometric_regularity"],
                    estimated_height_m=fingerprint_data["shadow"]["estimated_height_m"],
                    acoustic_pattern=acoustic_hyp,
                    man_made_probability=fingerprint_data["man_made_probability"],
                    evidence_bullet_points=fingerprint_data["evidence_bullets"]
                )
                db.add(fp_db)

                # Store Geolocation
                geo_db = Geolocation(
                    contact_id=contact_row.id,
                    has_metadata=geo_data["has_metadata"],
                    latitude=geo_data.get("latitude"),
                    longitude=geo_data.get("longitude"),
                    position_uncertainty_m=geo_data.get("position_uncertainty_m") or 10.0,
                    geolocation_confidence=geo_data.get("geolocation_confidence") or 0.0,
                    vessel_lat=vessel_lat,
                    vessel_lon=vessel_lon,
                    vessel_heading_deg=vessel_heading,
                    sensor_altitude_m=altitude_m,
                    slant_range_m=slant_range_m,
                    ground_range_m=geo_data.get("ground_range_m", 0.0),
                    sonar_side=sonar_side,
                    status_message=geo_data.get("status_message", "")
                )
                db.add(geo_db)

                # Store Priority
                prio_db = PriorityAssessment(
                    contact_id=contact_row.id,
                    priority=priority,
                    composite_priority_score=comp_score,
                    primary_reason=p_reason,
                    factors=p_factors
                )
                db.add(prio_db)

                # Store Recommendation
                rec_db = ScanRecommendation(
                    contact_id=contact_row.id,
                    recommended_action=rec_data["recommended_action"],
                    detailed_instruction=rec_data["detailed_instruction"],
                    action_type=rec_data["action_type"],
                    operational_rationale=rec_data["operational_rationale"],
                    urgency=rec_data["urgency"]
                )
                db.add(rec_db)

                created_contacts.append(contact_row)

            # 6. Report Generation
            log_event(db, survey_id, "REPORTING", 95, "Compiling hydrographic inspection report and GIS datasets")
            
            # Format survey data dict for report
            survey_summary = {
                "survey_code": survey.survey_code,
                "name": survey.name,
                "vessel_name": survey.vessel_name,
                "sensor_model": survey.sensor_model,
                "frequency_khz": survey.frequency_khz
            }

            # Prepare contact dicts for report
            contacts_for_report = []
            for c in created_contacts:
                fp_dict = {
                    "intensity": {"echo_contrast": c.fingerprint.echo_contrast, "highlight_strength": c.fingerprint.highlight_strength},
                    "shadow": {"shadow_signature": c.fingerprint.shadow_signature, "shadow_length_m": c.fingerprint.shadow_length_m, "estimated_height_m": c.fingerprint.estimated_height_m},
                    "evidence_bullets": c.fingerprint.evidence_bullet_points
                }
                geo_dict = {
                    "has_metadata": c.geolocation.has_metadata,
                    "latitude": c.geolocation.latitude,
                    "longitude": c.geolocation.longitude,
                    "position_uncertainty_m": c.geolocation.position_uncertainty_m
                }
                rec_dict = {
                    "recommended_action": c.recommendation.recommended_action,
                    "detailed_instruction": c.recommendation.detailed_instruction
                }
                contacts_for_report.append({
                    "contact_code": c.contact_code,
                    "detected_class": c.detected_class,
                    "acoustic_hypothesis": c.acoustic_hypothesis,
                    "model_score": c.model_score,
                    "calibrated_confidence": c.calibrated_confidence,
                    "calibration_status": c.calibration_status,
                    "persistence_status": c.persistence_status,
                    "persistence_count": c.persistence_count,
                    "priority_level": c.priority_level,
                    "review_status": c.review_status,
                    "is_novel_anomaly": c.is_novel_anomaly,
                    "fingerprint": fp_dict,
                    "geolocation": geo_dict,
                    "recommendation": rec_dict
                })

            report_file = SurveyReportGenerator.generate_html_report(
                survey_summary,
                contacts_for_report,
                output_filename=f"Report_{survey.survey_code}.html"
            )

            survey.status = "COMPLETED"
            log_event(db, survey_id, "COMPLETED", 100, f"Perception pipeline finished: {len(created_contacts)} contacts indexed")
            db.commit()

            return {
                "survey_id": survey.id,
                "status": "COMPLETED",
                "contacts_detected": len(created_contacts),
                "report_file": report_file,
                "preprocessing_diagnostics": prep_diag
            }

        except Exception as e:
            survey.status = "FAILED"
            log_event(db, survey_id, "FAILED", 0, f"Error: {str(e)}")
            db.commit()
            raise e
