import os
import cv2
import json
import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple, Optional

def load_and_validate_sonar_image(
    file_path: str,
    max_dimension: int = 8192
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Safely loads and validates a standard sonar image (PNG, JPG, TIFF).
    Checks dimensions, color depth, and extracts sidecar metadata if available.
    """
    p = Path(file_path)
    if not p.exists():
        raise FileNotFoundError(f"Sonar file not found: {file_path}")

    # Read image using OpenCV (supports 8-bit and 16-bit TIFF/PNG)
    img = cv2.imread(str(p), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Failed to decode sonar image or unsupported image codec: {file_path}")

    h, w = img.shape[:2]
    if h == 0 or w == 0 or h > max_dimension or w > max_dimension:
        raise ValueError(f"Image dimensions {w}x{h} exceed supported limits (max {max_dimension}px)")

    # Standardize to 8-bit BGR
    if img.dtype == np.uint16:
        # Scale 16-bit to 8-bit
        img = (img / 256).astype(np.uint8)

    if len(img.shape) == 2:
        img_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    elif len(img.shape) == 3 and img.shape[2] == 4:
        img_bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    else:
        img_bgr = img

    # Check for sidecar JSON metadata (e.g. filename.json)
    sidecar_json = p.with_suffix(".json")
    metadata: Dict[str, Any] = {
        "file_name": p.name,
        "file_size_bytes": p.stat().st_size,
        "width": w,
        "height": h,
        "channels": 3,
        "color_depth": "8-bit",
        "has_sidecar_metadata": False
    }

    if sidecar_json.exists():
        try:
            with open(sidecar_json, "r", encoding="utf-8") as f:
                sidecar_data = json.load(f)
                metadata.update(sidecar_data)
                metadata["has_sidecar_metadata"] = True
        except Exception as e:
            print(f"Warning: Failed to parse sidecar JSON {sidecar_json}: {e}")

    return img_bgr, metadata
