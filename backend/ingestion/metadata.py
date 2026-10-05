from typing import Dict, Any, Optional
from pathlib import Path
from backend.ingestion.image import load_and_validate_sonar_image
from backend.ingestion.xtf import XtfParser
from backend.ingestion.jsf import JsfParser

class SonarIngestionManager:
    """
    Unified ingestion pipeline supporting PNG, JPG, TIFF, and binary XTF/JSF logs.
    Preserves original navigation metadata and validates format limits.
    """

    @classmethod
    def ingest_file(cls, file_path: str) -> Dict[str, Any]:
        p = Path(file_path)
        ext = p.suffix.lower()

        if ext in [".png", ".jpg", ".jpeg", ".tif", ".tiff"]:
            img_bgr, meta = load_and_validate_sonar_image(str(p))
            return {
                "format": "IMAGE",
                "extension": ext,
                "is_supported": True,
                "metadata": meta,
                "image_data": img_bgr
            }
        elif ext == ".xtf":
            meta = XtfParser.probe_and_parse(str(p))
            return {
                "format": "XTF",
                "extension": ext,
                "is_supported": meta.get("format_supported", False),
                "metadata": meta,
                "image_data": None
            }
        elif ext == ".jsf":
            meta = JsfParser.probe_and_parse(str(p))
            return {
                "format": "JSF",
                "extension": ext,
                "is_supported": meta.get("format_supported", False),
                "metadata": meta,
                "image_data": None
            }
        else:
            return {
                "format": "UNSUPPORTED",
                "extension": ext,
                "is_supported": False,
                "metadata": {"error": f"Format {ext} not supported. Use PNG, TIFF, JPG, or standard XTF."}
            }
