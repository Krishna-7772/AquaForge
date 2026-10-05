import os
import sys
import cv2
import json
import numpy as np
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from backend.config import DATA_DIR
from backend.sonar.preprocessing import SonarPreprocessor

def tile_sonar_waterfall(
    image_path: str,
    output_dir: str,
    tile_size: int = 640,
    stride: int = 480
):
    """
    Slices large continuous sonar waterfalls into overlapping 640x640 detection tiles.
    Applies sonar TVG and CLAHE preprocessing.
    """
    img = cv2.imread(image_path)
    if img is None:
        print(f"[Warning] Could not load image at {image_path}")
        return []

    h, w = img.shape[:2]
    preprocessor = SonarPreprocessor(preset="STANDARD")
    prep_bgr, _ = preprocessor.process(img)

    out_p = Path(output_dir)
    out_p.mkdir(parents=True, exist_ok=True)

    tiles_generated = []
    tile_idx = 0

    for y in range(0, max(1, h - tile_size + 1), stride):
        for x in range(0, max(1, w - tile_size + 1), stride):
            crop = prep_bgr[y:y+tile_size, x:x+tile_size]
            if crop.shape[0] == tile_size and crop.shape[1] == tile_size:
                tile_filename = f"tile_{tile_idx:04d}_y{y}_x{x}.png"
                tile_path = out_p / tile_filename
                cv2.imwrite(str(tile_path), crop)
                tiles_generated.append(str(tile_path))
                tile_idx += 1

    print(f"[AQUAFORGE] Generated {len(tiles_generated)} preprocessed tiles ({tile_size}x{tile_size}) in {output_dir}")
    return tiles_generated

if __name__ == "__main__":
    demo_file = REPO_ROOT / "demo" / "survey" / "demo_coastal_survey_waterfall.png"
    if demo_file.exists():
        tile_sonar_waterfall(str(demo_file), str(DATA_DIR / "processed" / "tiles"))
    else:
        print("[AQUAFORGE] Demo waterfall not found. Run scripts/run_demo.py first.")
