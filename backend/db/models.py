import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    surveys = relationship("Survey", back_populates="project", cascade="all, delete-orphan")


class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    survey_code = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    vessel_name = Column(String(128), default="RV Sagarkanya / Coastal Surveyor")
    sensor_model = Column(String(128), default="Edgetech 4200 / Klein 3000")
    frequency_khz = Column(Float, default=410.0)
    is_demo = Column(Boolean, default=False)
    status = Column(String(64), default="QUEUED")  # QUEUED, PROCESSING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="surveys")
    files = relationship("SurveyFile", back_populates="survey", cascade="all, delete-orphan")
    jobs = relationship("ScanJob", back_populates="survey", cascade="all, delete-orphan")
    contacts = relationship("Contact", back_populates="survey", cascade="all, delete-orphan")
    events = relationship("ProcessingEvent", back_populates="survey", cascade="all, delete-orphan")


class SurveyFile(Base):
    __tablename__ = "survey_files"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    preprocessed_path = Column(String(512), nullable=True)
    file_type = Column(String(32), default="IMAGE")  # IMAGE, XTF, JSF
    file_size_bytes = Column(Integer, default=0)
    width = Column(Integer, default=0)
    height = Column(Integer, default=0)
    ping_count = Column(Integer, default=0)
    channel_type = Column(String(64), default="PORT_STARBOARD")
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    survey = relationship("Survey", back_populates="files")
    detections = relationship("Detection", back_populates="file", cascade="all, delete-orphan")


class ScanJob(Base):
    __tablename__ = "scan_jobs"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    status = Column(String(32), default="QUEUED")  # QUEUED, PROCESSING, PARTIAL, COMPLETED, FAILED, CANCELLED
    progress_pct = Column(Integer, default=0)
    current_step = Column(String(128), default="Pending")
    error_message = Column(Text, nullable=True)
    config_json = Column(JSON, default=dict)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    survey = relationship("Survey", back_populates="jobs")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    contact_code = Column(String(64), index=True, nullable=False)
    
    # Classification stages
    detected_class = Column(String(64), default="UNKNOWN")  # From detector: DERELICT_GEAR, SHIPWRECK, PIPELINE, MINE_LIKE, etc.
    acoustic_hypothesis = Column(String(64), default="UNKNOWN ANOMALY")  # From multi-cue analysis: MAN-MADE CANDIDATE, HIGH-CONTRAST SHADOW, NATURAL-LIKE
    operator_confirmed_class = Column(String(64), nullable=True)  # From human review
    
    # Scores & Calibration
    model_score = Column(Float, default=0.0)
    calibrated_confidence = Column(Float, default=0.0)
    calibration_status = Column(String(32), default="NOT CALIBRATED")  # VALIDATED, NOT CALIBRATED
    novelty_score = Column(Float, default=0.0)  # 0.0 to 1.0 (distance in feature space)
    is_novel_anomaly = Column(Boolean, default=False)
    
    # Priority & Status
    priority_level = Column(String(32), default="REVIEW")  # HIGH, MEDIUM, LOW, REVIEW
    review_status = Column(String(32), default="UNREVIEWED")  # UNREVIEWED, ACCEPTED, RECLASSIFIED, FALSE_POSITIVE, FOLLOW_UP
    
    # Persistence
    persistence_count = Column(Integer, default=1)
    persistence_status = Column(String(32), default="SINGLE-PING CONTACT")  # SINGLE-PING CONTACT, PERSISTENT CONTACT, INCONSISTENT CONTACT
    track_length_m = Column(Float, default=0.0)

    # Crop image asset
    crop_path = Column(String(512), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    survey = relationship("Survey", back_populates="contacts")
    detections = relationship("Detection", back_populates="contact", cascade="all, delete-orphan")
    fingerprint = relationship("AcousticFingerprint", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    geolocation = relationship("Geolocation", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    priority = relationship("PriorityAssessment", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    recommendation = relationship("ScanRecommendation", back_populates="contact", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("ReviewDecision", back_populates="contact", cascade="all, delete-orphan")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("survey_files.id"), nullable=False)
    
    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    
    bbox_normalized = Column(JSON, default=list)  # [x1, y1, x2, y2]
    confidence = Column(Float, default=0.0)
    raw_class = Column(String(64), default="unknown")
    ping_index = Column(Integer, default=0)

    contact = relationship("Contact", back_populates="detections")
    file = relationship("SurveyFile", back_populates="detections")


class AcousticFingerprint(Base):
    __tablename__ = "acoustic_fingerprints"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), unique=True, nullable=False)

    # Echo / Intensity Cues
    target_mean_intensity = Column(Float, default=0.0)
    background_mean_intensity = Column(Float, default=0.0)
    echo_contrast = Column(Float, default=0.0)  # Ratio / contrast
    highlight_strength = Column(String(32), default="MODERATE")  # LOW, MODERATE, HIGH, VERY HIGH

    # Shadow Cues
    shadow_area_px = Column(Integer, default=0)
    shadow_length_m = Column(Float, default=0.0)
    shadow_to_highlight_ratio = Column(Float, default=0.0)
    shadow_orientation_deg = Column(Float, default=0.0)
    shadow_signature = Column(String(32), default="MODERATE")  # NONE, WEAK, MODERATE, STRONG

    # Texture (GLCM & Local Variance)
    glcm_contrast = Column(Float, default=0.0)
    glcm_homogeneity = Column(Float, default=0.0)
    glcm_energy = Column(Float, default=0.0)
    glcm_entropy = Column(Float, default=0.0)
    texture_complexity = Column(String(32), default="MEDIUM")  # LOW, MEDIUM, HIGH

    # Geometry
    physical_length_m = Column(Float, default=0.0)
    physical_width_m = Column(Float, default=0.0)
    aspect_ratio = Column(Float, default=1.0)
    compactness = Column(Float, default=0.0)  # Iso-perimetric quotient 4*pi*area/perimeter^2
    geometric_regularity = Column(String(32), default="MEDIUM")  # LOW, MEDIUM, HIGH

    # Synthesis
    estimated_height_m = Column(Float, default=0.0)
    acoustic_pattern = Column(String(64), default="MAN-MADE-LIKE")
    man_made_probability = Column(Float, default=0.5)
    evidence_bullet_points = Column(JSON, default=list)

    contact = relationship("Contact", back_populates="fingerprint")


class Geolocation(Base):
    __tablename__ = "geolocations"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), unique=True, nullable=False)

    has_metadata = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    position_uncertainty_m = Column(Float, default=10.0)
    geolocation_confidence = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # Hydrographic context
    vessel_lat = Column(Float, nullable=True)
    vessel_lon = Column(Float, nullable=True)
    vessel_heading_deg = Column(Float, default=0.0)
    sensor_altitude_m = Column(Float, default=15.0)
    water_depth_m = Column(Float, default=30.0)
    slant_range_m = Column(Float, default=0.0)
    ground_range_m = Column(Float, default=0.0)
    sonar_side = Column(String(16), default="STARBOARD")  # PORT, STARBOARD

    status_message = Column(String(255), default="Geolocation unavailable — navigation metadata not provided.")

    contact = relationship("Contact", back_populates="geolocation")


class PriorityAssessment(Base):
    __tablename__ = "priority_assessments"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), unique=True, nullable=False)

    priority = Column(String(32), default="REVIEW")  # HIGH, MEDIUM, LOW, REVIEW
    composite_priority_score = Column(Float, default=0.5)
    primary_reason = Column(String(255), default="")
    factors = Column(JSON, default=dict)

    contact = relationship("Contact", back_populates="priority")


class ScanRecommendation(Base):
    __tablename__ = "scan_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), unique=True, nullable=False)

    recommended_action = Column(String(255), default="Perform standard survey pass")
    detailed_instruction = Column(Text, default="")
    action_type = Column(String(64), default="RECIPROCAL_PASS")  # RECIPROCAL_PASS, LOWER_ALTITUDE, OVERLAPPING_PASS, HIGH_FREQUENCY, VISUAL_ROV
    operational_rationale = Column(Text, default="")
    urgency = Column(String(32), default="STANDARD")

    contact = relationship("Contact", back_populates="recommendation")


class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False)

    reviewer = Column(String(128), default="Operator")
    decision = Column(String(64), nullable=False)  # ACCEPTED, RECLASSIFIED, FALSE_POSITIVE, UNKNOWN, FOLLOW_UP_REQUIRED
    reclassified_class = Column(String(64), nullable=True)
    reason = Column(String(255), default="")
    notes = Column(Text, default="")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    contact = relationship("Contact", back_populates="reviews")


class ProcessingEvent(Base):
    __tablename__ = "processing_events"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)

    step_name = Column(String(64), nullable=False)
    progress_pct = Column(Integer, default=0)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    survey = relationship("Survey", back_populates="events")
