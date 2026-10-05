import numpy as np
from typing import List, Dict, Any, Tuple

class MultiPingPersistenceTracker:
    """
    Groups and tracks contact detections across sequential sonar pings / waterfall lines.
    Mitigates single-ping acoustic flash false positives by enforcing temporal persistence.
    """

    MAX_ASSOCIATION_DISTANCE_PX = 45.0  # Max spatial drift between adjacent pings
    PERSISTENCE_THRESHOLD_PINGS = 2     # Minimum pings to be classified as persistent

    def __init__(self, meters_per_pixel: float = 0.08):
        self.meters_per_pixel = meters_per_pixel

    def associate_detections(
        self,
        raw_detections: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Takes raw detections across pings/sub-frames, performs spatial proximity matching,
        and assigns persistent contact clusters.
        """
        if not raw_detections:
            return []

        # Sort detections by y-coordinate (ping sequence axis)
        sorted_dets = sorted(raw_detections, key=lambda d: (d.get("ping_index", 0), d["bbox"][1]))
        
        clusters: List[List[Dict[str, Any]]] = []

        for det in sorted_dets:
            bbox = det["bbox"]
            cx = (bbox[0] + bbox[2]) / 2.0
            cy = (bbox[1] + bbox[3]) / 2.0
            det_class = det.get("class_name", "UNKNOWN")

            matched_cluster = None
            best_dist = float("inf")

            for cluster in clusters:
                last_det = cluster[-1]
                last_bbox = last_det["bbox"]
                last_cx = (last_bbox[0] + last_bbox[2]) / 2.0
                last_cy = (last_bbox[1] + last_bbox[3]) / 2.0

                dist = np.sqrt((cx - last_cx)**2 + (cy - last_cy)**2)
                # Check spatial distance and ping continuity
                ping_diff = abs(det.get("ping_index", 0) - last_det.get("ping_index", 0))
                
                if dist < self.MAX_ASSOCIATION_DISTANCE_PX and ping_diff <= 3:
                    if dist < best_dist:
                        best_dist = dist
                        matched_cluster = cluster

            if matched_cluster is not None:
                matched_cluster.append(det)
            else:
                clusters.append([det])

        # Synthesize clustered tracks into unified Contact objects
        tracked_contacts = []
        for idx, cluster in enumerate(clusters):
            obs_count = len(cluster)
            scores = [d.get("confidence", 0.5) for d in cluster]
            classes = [d.get("class_name", "UNKNOWN") for d in cluster]
            
            mean_score = round(float(np.mean(scores)), 3)
            max_score = round(float(np.max(scores)), 3)
            
            # Most frequent class
            majority_class = max(set(classes), key=classes.count)
            class_stability = round(classes.count(majority_class) / float(obs_count), 2)

            # Spatial consistency and estimated track length
            xs = [(d["bbox"][0] + d["bbox"][2]) / 2.0 for d in cluster]
            ys = [(d["bbox"][1] + d["bbox"][3]) / 2.0 for d in cluster]
            
            dx = max(xs) - min(xs)
            dy = max(ys) - min(ys)
            track_length_px = float(np.sqrt(dx**2 + dy**2))
            track_length_m = round(track_length_px * self.meters_per_pixel, 2)

            # Persistence classification
            if obs_count >= 3 and class_stability >= 0.7:
                persistence_status = "PERSISTENT CONTACT"
                persistence_note = f"Observed across {obs_count} consecutive pings; {track_length_m}m track length; stable acoustic signature"
            elif obs_count >= 2:
                persistence_status = "PERSISTENT CONTACT"
                persistence_note = f"Observed across {obs_count} pings; consistent spatial return"
            else:
                persistence_status = "SINGLE-PING CONTACT"
                persistence_note = "Single observation; transient echo or isolated contact"

            # Primary representative detection is the one with highest score
            best_det = max(cluster, key=lambda d: d.get("confidence", 0.0))

            tracked_contacts.append({
                "cluster_id": idx + 1,
                "primary_detection": best_det,
                "all_observations": cluster,
                "observation_count": obs_count,
                "mean_score": mean_score,
                "max_score": max_score,
                "majority_class": majority_class,
                "class_stability": class_stability,
                "track_length_m": track_length_m,
                "persistence_status": persistence_status,
                "persistence_note": persistence_note
            })

        return tracked_contacts
