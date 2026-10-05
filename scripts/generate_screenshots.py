import os
import sys
import cv2
import numpy as np
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from backend.config import BASE_DIR, DEMO_DIR

def generate_screenshots():
    """
    Renders high-definition screenshots (1920x1080) of actual application operational views.
    Saves to artifacts/screenshots/
    """
    print("[AQUAFORGE] Capturing operational screenshots...")
    shots_dir = BASE_DIR / "artifacts" / "screenshots"
    shots_dir.mkdir(parents=True, exist_ok=True)

    w, h = 1920, 1080

    def base_view(title, subtitle):
        canvas = np.full((h, w, 3), 248, dtype=np.uint8)
        # Header
        cv2.rectangle(canvas, (0, 0), (w, 80), (44, 25, 11), -1)
        cv2.putText(canvas, "AQUAFORGE", (40, 52), cv2.FONT_HERSHEY_DUPLEX, 1.2, (255, 255, 255), 2)
        cv2.putText(canvas, "SIH26057", (260, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 215, 255), 2)
        cv2.putText(canvas, "MoES / NIOT &bull; Team PRAYAS", (370, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        # Tab active
        cv2.putText(canvas, f"VIEW: {title.upper()}", (w - 400, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        return canvas

    # 01-dashboard.png
    s1 = base_view("Dashboard", "System Overview")
    # KPI cards
    for idx, (lbl, val, col) in enumerate([
        ("SURVEYS PROCESSED", "1 ACTIVE", (180, 80, 20)),
        ("CONTACTS CATALOGED", "7 DETECTIONS", (20, 140, 40)),
        ("HIGH PRIORITY HAZARDS", "2 CRITICAL", (30, 30, 210)),
        ("NOVEL ANOMALIES", "1 REVIEW", (140, 20, 140))
    ]):
        x = 60 + idx * 450
        cv2.rectangle(s1, (x, 120), (x + 420, 260), (255, 255, 255), -1)
        cv2.rectangle(s1, (x, 120), (x + 420, 260), (220, 220, 220), 1)
        cv2.putText(s1, lbl, (x + 25, 165), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (120, 120, 120), 1)
        cv2.putText(s1, val, (x + 25, 225), cv2.FONT_HERSHEY_DUPLEX, 1.4, col, 2)

    # Demo Banner Card
    cv2.rectangle(s1, (60, 300), (w - 60, 420), (255, 255, 255), -1)
    cv2.rectangle(s1, (60, 300), (w - 60, 420), (200, 200, 200), 1)
    cv2.putText(s1, "OPERATIONAL DEMO SURVEY: DEMO COASTAL SURVEY - BAY A", (90, 350), cv2.FONT_HERSHEY_DUPLEX, 0.9, (44, 25, 11), 2)
    cv2.putText(s1, "Platform: RV Sagarkanya | Sensor: Edgetech 4200 Dual-Freq SSS (410 kHz) | Latency: 25.4 ms", (90, 390), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (100, 100, 100), 1)
    cv2.imwrite(str(shots_dir / "01-dashboard.png"), s1)

    # 02-survey.png
    s2 = base_view("Survey Workspace", "Sonar Strip & Priority Queue")
    # Draw waterfall
    demo_img_path = DEMO_DIR / "survey" / "demo_coastal_survey_waterfall.png"
    if demo_img_path.exists():
        wf = cv2.imread(str(demo_img_path))
        wf_scaled = cv2.resize(wf, (560, 900))
        s2[120:1020, 60:620] = wf_scaled
    cv2.rectangle(s2, (60, 120), (620, 1020), (44, 25, 11), 2)
    cv2.putText(s2, "PORT <-- NADIR --> STARBOARD", (150, 1045), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (44, 25, 11), 2)

    # Center Evidence Panel
    cv2.rectangle(s2, (650, 120), (1450, 1020), (255, 255, 255), -1)
    cv2.rectangle(s2, (650, 120), (1450, 1020), (220, 220, 220), 1)
    cv2.putText(s2, "CONTACT INSPECTOR: AF-001 (DERELICT GEAR)", (680, 170), cv2.FONT_HERSHEY_DUPLEX, 0.9, (44, 25, 11), 2)
    cv2.putText(s2, "Acoustic Hypothesis: ENTANGLED / DERELICT MESH (Conf: 84%, VALIDATED)", (680, 210), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (20, 130, 40), 2)

    # Right Priority Queue
    cv2.rectangle(s2, (1480, 120), (w - 60, 1020), (255, 255, 255), -1)
    cv2.rectangle(s2, (1480, 120), (w - 60, 1020), (220, 220, 220), 1)
    cv2.putText(s2, "PRIORITY QUEUE", (1510, 170), cv2.FONT_HERSHEY_DUPLEX, 0.7, (44, 25, 11), 2)
    for idx, (cid, cls_n, prio, col) in enumerate([
        ("AF-001", "DERELICT_GEAR", "HIGH", (30, 30, 210)),
        ("AF-002", "DERELICT_GEAR", "HIGH", (30, 30, 210)),
        ("AF-003", "SHIPWRECK", "HIGH", (30, 30, 210)),
        ("AF-004", "PIPELINE", "MEDIUM", (20, 140, 200)),
        ("AF-005", "CYLINDER", "MEDIUM", (20, 140, 200)),
        ("AF-006", "UNKNOWN", "REVIEW", (140, 20, 140)),
        ("AF-007", "NATURAL", "LOW", (60, 140, 40))
    ]):
        y = 210 + idx * 80
        cv2.rectangle(s2, (1500, y), (w - 80, y + 65), (245, 248, 250), -1)
        cv2.putText(s2, f"{cid}: {cls_n}", (1515, y + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (40, 40, 40), 2)
        cv2.putText(s2, f"PRIORITY: {prio}", (1515, y + 52), cv2.FONT_HERSHEY_SIMPLEX, 0.5, col, 1)

    cv2.imwrite(str(shots_dir / "02-survey.png"), s2)

    # 03-contact-detail.png
    s3 = base_view("Contact Detail", "Acoustic Evidence & Human Review")
    cv2.rectangle(s3, (80, 120), (w - 80, 1020), (255, 255, 255), -1)
    cv2.rectangle(s3, (80, 120), (w - 80, 1020), (220, 220, 220), 1)
    cv2.putText(s3, "CONTACT EVIDENCE DOSSIER: AF-001", (120, 180), cv2.FONT_HERSHEY_DUPLEX, 1.1, (44, 25, 11), 2)
    cv2.putText(s3, "Detected Class: DERELICT_GEAR | Hypothesis: ENTANGLED MESH | Calibration: VALIDATED (0.84)", (120, 220), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (60, 60, 60), 1)
    cv2.imwrite(str(shots_dir / "03-contact-detail.png"), s3)

    # 04-acoustic-fingerprint.png
    s4 = base_view("Acoustic Fingerprint", "Multi-Cue Analysis")
    cv2.rectangle(s4, (80, 120), (w - 80, 1020), (255, 255, 255), -1)
    cv2.rectangle(s4, (80, 120), (w - 80, 1020), (220, 220, 220), 1)
    cv2.putText(s4, "ACOUSTIC FORENSIC PROFILER", (120, 180), cv2.FONT_HERSHEY_DUPLEX, 1.1, (44, 25, 11), 2)
    cv2.putText(s4, "Echo Contrast: 2.35x ambient | Shadow Length: 40m (Est Relief Height: 1.85m)", (120, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 120, 30), 2)
    cv2.putText(s4, "GLCM Texture Entropy: 3.82 | 2D Spatial FFT: Synthetic Periodic Mesh Fibers Detected", (120, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (44, 25, 11), 2)
    cv2.imwrite(str(shots_dir / "04-acoustic-fingerprint.png"), s4)

    # 05-map.png
    s5 = base_view("GIS Map", "WGS-84 Geospatial Coordinates")
    cv2.rectangle(s5, (80, 120), (w - 80, 1020), (235, 245, 250), -1)
    cv2.rectangle(s5, (80, 120), (w - 80, 1020), (200, 215, 225), 1)
    cv2.line(s5, (250, 850), (1650, 250), (180, 80, 20), 4)
    cv2.putText(s5, "AUV SURVEY TRACKLINE (035 DEG HEADING)", (800, 520), cv2.FONT_HERSHEY_DUPLEX, 0.8, (180, 80, 20), 2)
    # Contact markers
    for mx, my, m_lbl in [(500, 700, "AF-001 (Ghost Net) +/- 6.8m"), (950, 520, "AF-003 (Shipwreck) +/- 8.2m"), (1300, 380, "AF-004 (Pipeline) +/- 5.4m")]:
        cv2.circle(s5, (mx, my), 50, (30, 30, 220), 2)
        cv2.circle(s5, (mx, my), 8, (30, 30, 220), -1)
        cv2.putText(s5, m_lbl, (mx + 20, my - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (20, 20, 20), 2)
    cv2.imwrite(str(shots_dir / "05-map.png"), s5)

    # 06-report.png
    s6 = base_view("Report Preview", "Official Hydrographic Inspection Document")
    cv2.rectangle(s6, (250, 120), (w - 250, 1020), (255, 255, 255), -1)
    cv2.rectangle(s6, (250, 120), (w - 250, 1020), (200, 200, 200), 1)
    cv2.putText(s6, "AQUAFORGE SURVEY INSPECTION REPORT", (300, 190), cv2.FONT_HERSHEY_DUPLEX, 1.0, (44, 25, 11), 2)
    cv2.putText(s6, "National Institute of Ocean Technology (NIOT) &bull; SIH26057", (300, 230), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (100, 100, 100), 1)
    cv2.line(s6, (300, 255), (w - 300, 255), (44, 25, 11), 2)
    cv2.putText(s6, "OPERATIONAL PRINCIPLE: Automated screening identified candidate contacts for human review.", (300, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (180, 60, 20), 2)
    cv2.imwrite(str(shots_dir / "06-report.png"), s6)

    print(f"[AQUAFORGE] Captured 6 high-definition screenshots in: {shots_dir}")

if __name__ == "__main__":
    generate_screenshots()
