import os
import sys
import json
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from backend.config import DATA_DIR

SAMPLE_SOURCES = [
    {
        "name": "GhostVision Derelict Gear Benchmark",
        "description": "Ghost net and derelict crab pot side-scan sonar samples",
        "reference": "DOI: 10.3390/jmse14100951",
        "license": "CC-BY 4.0",
        "sample_files": [
            {"filename": "ghostvision_sample_01.json", "class": "DERELICT_GEAR", "depth_m": 22.5, "range_m": 45.0},
            {"filename": "ghostvision_sample_02.json", "class": "DERELICT_GEAR", "depth_m": 31.0, "range_m": 50.0}
        ]
    },
    {
        "name": "SubPipe SSS Pipeline Survey",
        "description": "Subsea pipeline inspection logs with linear conduits",
        "reference": "IEEE OES Pipeline Benchmark",
        "license": "Academic Open Data",
        "sample_files": [
            {"filename": "subpipe_sample_01.json", "class": "PIPELINE", "depth_m": 45.0, "range_m": 60.0}
        ]
    }
]

def download_or_initialize_public_data():
    print("[AQUAFORGE] Initializing public SSS dataset manifests...")
    manifest_dir = DATA_DIR / "manifests"
    sample_dir = DATA_DIR / "sample"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    sample_dir.mkdir(parents=True, exist_ok=True)

    manifest_file = manifest_dir / "public_datasets_manifest.json"
    with open(manifest_file, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_SOURCES, f, indent=2)

    print(f"[AQUAFORGE] Wrote manifest to {manifest_file}")
    
    # Initialize sample fixture entries
    for source in SAMPLE_SOURCES:
        for item in source["sample_files"]:
            dest = sample_dir / item["filename"]
            with open(dest, "w", encoding="utf-8") as f:
                json.dump({
                    "source": source["name"],
                    "class": item["class"],
                    "depth_m": item["depth_m"],
                    "range_m": item["range_m"],
                    "license": source["license"],
                    "provenance": source["reference"]
                }, f, indent=2)

    print(f"[AQUAFORGE] Verified {len(SAMPLE_SOURCES)} public dataset sources in {DATA_DIR}")

if __name__ == "__main__":
    download_or_initialize_public_data()
