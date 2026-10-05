import numpy as np
import cv2
from typing import Dict, Any

def extract_intensity_features(crop_bgr: np.ndarray, mask: np.ndarray = None) -> Dict[str, Any]:
    """
    Extracts echo intensity and radiometric contrast features from a contact patch.
    """
    if len(crop_bgr.shape) == 3:
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop_bgr.copy()

    h, w = gray.shape
    total_pixels = h * w
    if total_pixels == 0:
        return {
            "target_mean_intensity": 0.0,
            "background_mean_intensity": 0.0,
            "echo_contrast": 1.0,
            "highlight_strength": "LOW",
            "peak_to_average_ratio": 1.0,
            "highlight_snr_db": 0.0
        }

    # If mask is not provided, estimate highlight as top 15% brightest pixels in center region
    if mask is None:
        center_y, center_x = h // 2, w // 2
        # Center box covering 60% of crop
        y1, y2 = max(0, int(center_y - 0.3 * h)), min(h, int(center_y + 0.3 * h))
        x1, x2 = max(0, int(center_x - 0.3 * w)), min(w, int(center_x + 0.3 * w))
        center_crop = gray[y1:y2, x1:x2]
        thresh_val = np.percentile(center_crop, 80) if center_crop.size > 0 else np.percentile(gray, 80)
        target_mask = (gray >= thresh_val).astype(np.uint8)
    else:
        target_mask = (mask > 0).astype(np.uint8)

    # Background mask: peripheral pixels
    bg_mask = np.ones_like(gray, dtype=np.uint8)
    # Exclude target mask from background
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilated_target = cv2.dilate(target_mask, kernel, iterations=2)
    bg_mask[dilated_target > 0] = 0

    target_pixels = gray[target_mask > 0]
    bg_pixels = gray[bg_mask > 0]

    target_mean = float(np.mean(target_pixels)) if target_pixels.size > 0 else float(np.mean(gray))
    bg_mean = float(np.mean(bg_pixels)) if bg_pixels.size > 0 else max(1.0, float(np.mean(gray)))
    target_max = float(np.max(target_pixels)) if target_pixels.size > 0 else float(np.max(gray))
    bg_std = float(np.std(bg_pixels)) if bg_pixels.size > 0 else 1.0

    # Contrast ratio (linear)
    echo_contrast = round(target_mean / max(1.0, bg_mean), 2)
    peak_to_avg = round(target_max / max(1.0, target_mean), 2)
    snr_db = round(20.0 * np.log10(max(1.0, (target_mean - bg_mean) / max(1.0, bg_std))), 2) if target_mean > bg_mean else 0.0

    if echo_contrast > 2.2:
        highlight_strength = "VERY HIGH"
    elif echo_contrast > 1.6:
        highlight_strength = "HIGH"
    elif echo_contrast > 1.2:
        highlight_strength = "MODERATE"
    else:
        highlight_strength = "LOW"

    return {
        "target_mean_intensity": round(target_mean, 1),
        "background_mean_intensity": round(bg_mean, 1),
        "echo_contrast": echo_contrast,
        "highlight_strength": highlight_strength,
        "peak_to_average_ratio": peak_to_avg,
        "highlight_snr_db": snr_db,
        "target_pixel_count": int(np.sum(target_mask))
    }
