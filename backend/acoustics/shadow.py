import numpy as np
import cv2
from typing import Dict, Any, Optional

def extract_shadow_features(
    crop_bgr: np.ndarray,
    sensor_altitude_m: Optional[float] = 15.0,
    slant_range_m: Optional[float] = 45.0,
    meters_per_pixel: Optional[float] = 0.1
) -> Dict[str, Any]:
    """
    Extracts acoustic shadow signature and calculates target relief height
    based on geometric acoustic ray-tracing.
    Formula: H_target = (L_shadow * H_sensor) / (R_slant + L_shadow)
    """
    if len(crop_bgr.shape) == 3:
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop_bgr.copy()

    h, w = gray.shape
    if h == 0 or w == 0:
        return {
            "shadow_area_px": 0,
            "shadow_length_m": 0.0,
            "shadow_to_highlight_ratio": 0.0,
            "shadow_orientation_deg": 0.0,
            "shadow_signature": "NONE",
            "estimated_height_m": 0.0,
            "shadow_mask": None
        }

    # Shadow identification: acoustic shadows appear as deep nulls (pixel values significantly below ambient seabed)
    ambient_seabed = np.median(gray)
    shadow_thresh = max(15, int(ambient_seabed * 0.45))
    shadow_mask = (gray <= shadow_thresh).astype(np.uint8)

    # Clean small speckle voids using morphological opening
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    clean_shadow = cv2.morphologyEx(shadow_mask, cv2.MORPH_OPEN, kernel)

    shadow_area_px = int(np.sum(clean_shadow))
    
    # Highlight area for ratio calculation
    highlight_thresh = int(ambient_seabed * 1.4)
    highlight_mask = (gray >= highlight_thresh).astype(np.uint8)
    highlight_area_px = max(1, int(np.sum(highlight_mask)))

    shadow_ratio = round(float(shadow_area_px) / float(highlight_area_px), 2)

    # Calculate shadow length and orientation via connected components
    contours, _ = cv2.findContours(clean_shadow, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    max_len_px = 0.0
    shadow_orientation_deg = 0.0

    if contours:
        # Find the largest coherent shadow block
        largest_cnt = max(contours, key=cv2.contourArea)
        if cv2.contourArea(largest_cnt) > 9:
            rect = cv2.minAreaRect(largest_cnt)
            (cx, cy), (rw, rh), angle = rect
            max_len_px = float(max(rw, rh))
            shadow_orientation_deg = round(float(angle), 1)

    m_per_px = meters_per_pixel if meters_per_pixel and meters_per_pixel > 0 else 0.08
    shadow_length_m = round(max_len_px * m_per_px, 2)

    # Physics-based height estimation
    # H_obj = (L_shadow * H_sensor) / (R_slant + L_shadow)
    estimated_height_m = 0.0
    if sensor_altitude_m and slant_range_m and shadow_length_m > 0:
        h_sensor = max(1.0, sensor_altitude_m)
        r_slant = max(h_sensor, slant_range_m)
        estimated_height_m = round((shadow_length_m * h_sensor) / (r_slant + shadow_length_m), 2)

    # Categorize shadow signature
    if shadow_area_px > 120 and shadow_ratio >= 0.8:
        shadow_signature = "STRONG"
    elif shadow_area_px > 40 and shadow_ratio >= 0.4:
        shadow_signature = "MODERATE"
    elif shadow_area_px > 10:
        shadow_signature = "WEAK"
    else:
        shadow_signature = "NONE"

    return {
        "shadow_area_px": shadow_area_px,
        "shadow_length_m": shadow_length_m,
        "shadow_to_highlight_ratio": shadow_ratio,
        "shadow_orientation_deg": shadow_orientation_deg,
        "shadow_signature": shadow_signature,
        "estimated_height_m": estimated_height_m,
        "ambient_seabed_intensity": round(float(ambient_seabed), 1)
    }
