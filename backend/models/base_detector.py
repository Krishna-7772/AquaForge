from abc import ABC, abstractmethod
from typing import List, Dict, Any
import numpy as np

class BaseSonarDetector(ABC):
    """
    Abstract base class for Side-Scan Sonar object detectors.
    Ensures interchangeable model backends (YOLO, RT-DETR, ONNX, etc.).
    """

    @abstractmethod
    def load_model(self, model_path: str, config: Dict[str, Any] = None) -> bool:
        """Loads weights and initializes inference engine."""
        pass

    @abstractmethod
    def detect(
        self,
        image_bgr: np.ndarray,
        confidence_threshold: float = 0.35,
        nms_threshold: float = 0.45
    ) -> List[Dict[str, Any]]:
        """
        Executes inference on a sonar image or tile.
        Returns list of detection dictionaries:
        [
            {
                "bbox": [x1, y1, x2, y2],  # absolute pixel coords
                "bbox_norm": [x1_n, y1_n, x2_n, y2_n],
                "confidence": float,
                "class_id": int,
                "class_name": str,
            },
            ...
        ]
        """
        pass

    @abstractmethod
    def get_metadata(self) -> Dict[str, Any]:
        """Returns model architecture name, parameter count, input resolution, classes."""
        pass
