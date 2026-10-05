import numpy as np
from typing import Dict, Any, Tuple

class AcousticNoveltyDetector:
    """
    Detects unknown acoustic anomalies and out-of-distribution seabed contacts.
    Computes normalized distance in acoustic feature space from reference debris clusters.
    """

    # Reference nominal feature centroids and standard deviations for known debris
    # Features: [echo_contrast, shadow_ratio, aspect_ratio, compactness, glcm_entropy]
    REFERENCE_DISTRIBUTION = {
        "mean": np.array([2.1, 0.85, 2.4, 0.45, 3.6], dtype=np.float32),
        "std": np.array([0.7, 0.35, 1.2, 0.20, 0.8], dtype=np.float32)
    }

    NOVELTY_THRESHOLD = 2.4  # Standard deviations distance

    @classmethod
    def evaluate(
        cls,
        fingerprint: Dict[str, Any],
        model_score: float
    ) -> Tuple[float, bool, str]:
        """
        Calculates novelty score (0.0 to 1.0), is_novel flag, and diagnostic status.
        """
        intensity = fingerprint.get("intensity", {})
        shadow = fingerprint.get("shadow", {})
        geometry = fingerprint.get("geometry", {})
        texture = fingerprint.get("texture", {})

        c_val = float(intensity.get("echo_contrast", 1.0))
        s_val = float(shadow.get("shadow_to_highlight_ratio", 0.0))
        a_val = float(geometry.get("aspect_ratio", 1.0))
        comp_val = float(geometry.get("compactness", 0.1))
        e_val = float(texture.get("glcm_entropy", 2.0))

        feat = np.array([c_val, s_val, a_val, comp_val, e_val], dtype=np.float32)
        
        # Standardized z-score distance
        z_scores = np.abs(feat - cls.REFERENCE_DISTRIBUTION["mean"]) / (cls.REFERENCE_DISTRIBUTION["std"] + 1e-4)
        dist = float(np.mean(z_scores))

        # Novelty score mapped to 0.0 - 1.0 sigmoid
        novelty_score = round(1.0 / (1.0 + np.exp(-1.5 * (dist - 1.8))), 3)

        # Flag as novel anomaly if distance exceeds threshold or if model score is borderline with weird acoustic signature
        is_novel = False
        if novelty_score >= 0.70:
            is_novel = True
            status_desc = "HIGH NOVELTY — Significant deviation from cataloged acoustic signatures"
        elif model_score < 0.55 and dist > 2.0:
            is_novel = True
            status_desc = "MODERATE NOVELTY — Unclassified acoustic contact requires human review"
        elif novelty_score >= 0.45:
            status_desc = "MODERATE NOVELTY — Partial match to known debris taxonomy"
        else:
            status_desc = "LOW NOVELTY — Well-represented in standard debris acoustic database"

        return novelty_score, is_novel, status_desc
