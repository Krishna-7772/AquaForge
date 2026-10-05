import os
import cv2
import numpy as np
from typing import List, Dict, Any, Optional
from backend.models.base_detector import BaseSonarDetector

# Target taxonomy supported by AQUAFORGE
SSS_CLASSES = [
    "DERELICT_GEAR",         # Ghost nets, lost crab pots, trap lines
    "SHIPWRECK",             # Wrecks, sunken hulls, vessel debris
    "PIPELINE",              # Subsea pipelines, linear conduits, cables
    "CYLINDRICAL_OBJECT",    # Drums, oil containers, cylindrical debris
    "MINE_LIKE_OBJECT",      # Spherical/conical high-target anomalies
    "OTHER_MAN_MADE",        # Miscellaneous artificial debris
    "NATURAL_FORMATION"      # Bedrock, boulder clusters, sand dunes
]

class OnnxSonarDetector(BaseSonarDetector):
    """
    Side-Scan Sonar detector using OpenCV DNN / ONNX Runtime.
    Provides fast, deterministic CPU edge deployment.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.net = None
        self.model_path = model_path
        self.input_size = (640, 640)
        self.classes = SSS_CLASSES
        self.backend_type = "OPENCV_DNN"
        self.is_loaded = False
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)

    def load_model(self, model_path: str, config: Dict[str, Any] = None) -> bool:
        """Loads ONNX model via OpenCV DNN."""
        try:
            self.model_path = model_path
            self.net = cv2.dnn.readNetFromONNX(model_path)
            self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
            self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"[OnnxSonarDetector] Warning: Could not load ONNX file at {model_path}: {e}")
            self.is_loaded = False
            return False

    def detect(
        self,
        image_bgr: np.ndarray,
        confidence_threshold: float = 0.30,
        nms_threshold: float = 0.40
    ) -> List[Dict[str, Any]]:
        """
        Runs object detection on sonar image.
        Uses sliding window / full-frame inference with NMS.
        """
        img_h, img_w = image_bgr.shape[:2]
        
        if self.is_loaded and self.net is not None:
            return self._infer_dnn(image_bgr, confidence_threshold, nms_threshold)
        else:
            # Physics-based acoustic saliency detection fallback
            return self._detect_acoustic_salient_contacts(image_bgr, confidence_threshold)

    def _infer_dnn(
        self,
        image_bgr: np.ndarray,
        conf_thresh: float,
        nms_thresh: float
    ) -> List[Dict[str, Any]]:
        """Inference via loaded ONNX network."""
        orig_h, orig_w = image_bgr.shape[:2]
        
        # Prepare 640x640 blob
        blob = cv2.dnn.blobFromImage(
            image_bgr,
            scalefactor=1.0 / 255.0,
            size=self.input_size,
            mean=[0, 0, 0],
            swapRB=True,
            crop=False
        )
        self.net.setInput(blob)
        outputs = self.net.forward()

        # Handle typical YOLO output shape: [1, num_anchors, 4 + num_classes] or [1, 4 + num_classes, num_anchors]
        if len(outputs.shape) == 3:
            if outputs.shape[1] < outputs.shape[2]:
                # Transpose to [1, num_anchors, 4 + num_classes]
                outputs = np.transpose(outputs, (0, 2, 1))
            predictions = outputs[0]
        else:
            predictions = outputs

        boxes = []
        confidences = []
        class_ids = []

        x_factor = orig_w / float(self.input_size[0])
        y_factor = orig_h / float(self.input_size[1])

        for row in predictions:
            # Box coords: cx, cy, w, h
            cx, cy, w, h = row[:4]
            scores = row[4:]
            class_id = int(np.argmax(scores))
            score = float(scores[class_id])

            if score >= conf_thresh:
                left = int((cx - 0.5 * w) * x_factor)
                top = int((cy - 0.5 * h) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)

                # Clamp to image boundaries
                left = max(0, min(orig_w - 1, left))
                top = max(0, min(orig_h - 1, top))
                width = max(8, min(orig_w - left, width))
                height = max(8, min(orig_h - top, height))

                boxes.append([left, top, width, height])
                confidences.append(float(score))
                class_ids.append(class_id)

        indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_thresh, nms_thresh)
        results = []
        if len(indices) > 0:
            for i in indices.flatten():
                box = boxes[i]
                x1, y1 = box[0], box[1]
                x2, y2 = box[0] + box[2], box[1] + box[3]
                cid = class_ids[i] % len(self.classes)
                results.append({
                    "bbox": [x1, y1, x2, y2],
                    "bbox_norm": [
                        round(x1 / orig_w, 4),
                        round(y1 / orig_h, 4),
                        round(x2 / orig_w, 4),
                        round(y2 / orig_h, 4)
                    ],
                    "confidence": round(float(confidences[i]), 3),
                    "class_id": cid,
                    "class_name": self.classes[cid],
                    "method": "ONNX_RUNTIME"
                })
        return results

    def _detect_acoustic_salient_contacts(
        self,
        image_bgr: np.ndarray,
        conf_thresh: float
    ) -> List[Dict[str, Any]]:
        """
        Physics-based acoustic saliency detection:
        Identifies coupled Highlight-Shadow pairs that characterize elevated seabed debris.
        """
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY) if len(image_bgr.shape) == 3 else image_bgr
        orig_h, orig_w = gray.shape

        # SSS highlight threshold: top 2.5% intensity
        p_high = np.percentile(gray, 97.5)
        # SSS shadow threshold: bottom 10% intensity
        p_low = np.percentile(gray, 10.0)

        highlight_mask = (gray >= p_high).astype(np.uint8)
        shadow_mask = (gray <= p_low).astype(np.uint8)

        # Morphological filtering to group coherent highlights
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        connected_highlights = cv2.morphologyEx(highlight_mask, cv2.MORPH_CLOSE, kernel)

        contours, _ = cv2.findContours(connected_highlights, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        candidates = []

        for cnt in contours:
            area = cv2.contourArea(cnt)
            # Filter noise and enormous areas
            if area < 30 or area > (orig_h * orig_w * 0.25):
                continue

            x, y, w, h = cv2.boundingRect(cnt)
            
            # Pad bounding box to capture the accompanying acoustic shadow
            pad_x = int(w * 0.8)
            pad_y = int(h * 0.6)
            
            x1 = max(0, x - int(w * 0.2))
            # In side-scan sonar, acoustic shadow falls down-range (away from nadir center)
            # Nadir is typically the vertical center line
            center_line = orig_w // 2
            if x + w // 2 > center_line:
                # Starboard channel: shadow extends to the right (+x)
                x2 = min(orig_w, x + w + pad_x * 2)
            else:
                # Port channel: shadow extends to the left (-x)
                x1 = max(0, x - pad_x * 2)
                x2 = min(orig_w, x + w + int(w * 0.2))
                
            y1 = max(0, y - pad_y)
            y2 = min(orig_h, y + h + pad_y)

            # Check for adjacent shadow within the candidate bounding box
            roi_shadow = shadow_mask[y1:y2, x1:x2]
            shadow_px = int(np.sum(roi_shadow))
            
            # Coupling metric: Highlight with valid shadow is strong candidate
            shadow_ratio = shadow_px / max(1, area)
            aspect_ratio = max(w, h) / max(1, min(w, h))

            # Classification heuristics based on acoustic geometry
            if aspect_ratio > 3.5 and area > 100:
                predicted_class = "PIPELINE"
                base_score = 0.82
            elif shadow_ratio > 0.6 and area > 150:
                predicted_class = "DERELICT_GEAR"
                base_score = 0.78
            elif shadow_ratio > 1.2 and area > 300:
                predicted_class = "SHIPWRECK"
                base_score = 0.85
            elif aspect_ratio < 1.4 and shadow_ratio > 0.4:
                predicted_class = "CYLINDRICAL_OBJECT"
                base_score = 0.74
            elif shadow_ratio > 0.3:
                predicted_class = "OTHER_MAN_MADE"
                base_score = 0.65
            else:
                predicted_class = "NATURAL_FORMATION"
                base_score = 0.45

            if base_score >= conf_thresh:
                candidates.append({
                    "bbox": [x1, y1, x2, y2],
                    "bbox_norm": [
                        round(x1 / orig_w, 4),
                        round(y1 / orig_h, 4),
                        round(x2 / orig_w, 4),
                        round(y2 / orig_h, 4)
                    ],
                    "confidence": round(base_score, 3),
                    "class_id": self.classes.index(predicted_class) if predicted_class in self.classes else 0,
                    "class_name": predicted_class,
                    "method": "ACOUSTIC_SALIENCY_FUSION"
                })

        # Apply NMS to remove overlapping candidate boxes
        if not candidates:
            return []

        boxes = [[c["bbox"][0], c["bbox"][1], c["bbox"][2] - c["bbox"][0], c["bbox"][3] - c["bbox"][1]] for c in candidates]
        confs = [c["confidence"] for c in candidates]
        keep = cv2.dnn.NMSBoxes(boxes, confs, conf_thresh, 0.35)
        
        filtered = []
        if len(keep) > 0:
            for k in keep.flatten():
                filtered.append(candidates[k])
        return filtered

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "model_name": "AQUAFORGE Acoustic-YOLO Edge ONNX",
            "backend": self.backend_type,
            "is_loaded": self.is_loaded,
            "model_path": self.model_path,
            "classes": self.classes,
            "input_resolution": f"{self.input_size[0]}x{self.input_size[1]}",
            "edge_ready": True
        }
