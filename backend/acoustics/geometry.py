import numpy as np
import cv2
from typing import Dict, Any, Optional

def extract_geometry_features(
    crop_bgr: np.ndarray,
    meters_per_pixel: Optional[float] = 0.08
) -> Dict[str, Any]:
    """
    Extracts geometric morphology, aspect ratios, compactness, and regularity
    to differentiate man-made manufactured objects from natural geological contours.
    """
    if len(crop_bgr.shape) == 3:
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop_bgr.copy()

    h, w = gray.shape
    if h < 3 or w < 3:
        return {
            "physical_length_m": 0.0,
            "physical_width_m": 0.0,
            "aspect_ratio": 1.0,
            "compactness": 0.0,
            "convexity": 0.0,
            "geometric_regularity": "LOW",
            "is_elongated": False
        }

    # Binarize highlight region
    thresh = int(np.percentile(gray, 75))
    _, binary = cv2.threshold(gray, thresh, 255, cv2.THRESH_BINARY)

    # Clean morphology
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return {
            "physical_length_m": round(w * meters_per_pixel, 2),
            "physical_width_m": round(h * meters_per_pixel, 2),
            "aspect_ratio": round(max(w, h) / max(1, min(w, h)), 2),
            "compactness": 0.5,
            "convexity": 0.5,
            "geometric_regularity": "MEDIUM",
            "is_elongated": False
        }

    # Main highlight contour
    main_cnt = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(main_cnt)
    perimeter = cv2.arcLength(main_cnt, True)

    # Minimum bounding box
    rect = cv2.minAreaRect(main_cnt)
    (cx, cy), (rw, rh), angle = rect
    dim_major = max(rw, rh)
    dim_minor = max(1.0, min(rw, rh))
    aspect_ratio = round(dim_major / dim_minor, 2)

    # Physical dimensions
    m_per_px = meters_per_pixel if meters_per_pixel and meters_per_pixel > 0 else 0.08
    physical_length_m = round(dim_major * m_per_px, 2)
    physical_width_m = round(dim_minor * m_per_px, 2)

    # Compactness (Isoperimetric Quotient: 4 * pi * Area / Perimeter^2, circle = 1.0)
    compactness = 0.0
    if perimeter > 0:
        compactness = round(float((4.0 * np.pi * area) / (perimeter ** 2)), 3)

    # Convexity: Area / Convex Hull Area
    hull = cv2.convexHull(main_cnt)
    hull_area = cv2.contourArea(hull)
    convexity = round(float(area / max(1.0, hull_area)), 3)

    # Regularity classification
    # High regularity: either high compactness (cylindrical drum / mine-like sphere)
    # OR very high aspect ratio with high convexity (pipeline / hull beam / cable)
    is_elongated = aspect_ratio > 3.0
    if (convexity > 0.82 and compactness > 0.6) or (is_elongated and convexity > 0.78):
        regularity = "HIGH"
    elif convexity > 0.65 or compactness > 0.35:
        regularity = "MEDIUM"
    else:
        regularity = "LOW"

    return {
        "physical_length_m": physical_length_m,
        "physical_width_m": physical_width_m,
        "aspect_ratio": aspect_ratio,
        "compactness": compactness,
        "convexity": convexity,
        "geometric_regularity": regularity,
        "is_elongated": is_elongated,
        "orientation_deg": round(float(angle), 1)
    }
