import numpy as np
from typing import Dict, Any, List, Optional
from backend.acoustics.intensity import extract_intensity_features
from backend.acoustics.shadow import extract_shadow_features
from backend.acoustics.texture import extract_texture_features
from backend.acoustics.geometry import extract_geometry_features
from backend.acoustics.frequency import extract_frequency_features

class AcousticFingerprintEngine:
    """
    Computes a multi-cue acoustic forensic profile for side-scan sonar candidate contacts.
    Integrates Echo/Intensity, Acoustic Shadow, GLCM Texture, Geometry, and Spatial Frequency.
    """

    @classmethod
    def compute_profile(
        cls,
        crop_bgr: np.ndarray,
        sensor_altitude_m: Optional[float] = 15.0,
        slant_range_m: Optional[float] = 45.0,
        meters_per_pixel: Optional[float] = 0.08
    ) -> Dict[str, Any]:
        """
        Synthesizes all acoustic cues into a structured Forensic Profile.
        """
        # 1. Extract cues
        intensity = extract_intensity_features(crop_bgr)
        shadow = extract_shadow_features(crop_bgr, sensor_altitude_m, slant_range_m, meters_per_pixel)
        texture = extract_texture_features(crop_bgr)
        geometry = extract_geometry_features(crop_bgr, meters_per_pixel)
        freq = extract_frequency_features(crop_bgr)

        # 2. Compute deterministic Acoustic Man-Made Likelihood (0.0 to 1.0)
        # Man-made objects typically display:
        # - Strong highlight contrast (> 1.5)
        # - Definite acoustic shadow with coherent length (> 0.5m)
        # - Regular geometric silhouette (high compactness or high elongation with convexity)
        # - Moderate to low local texture entropy (unless synthetic entangled netting)
        man_made_score = 0.0

        # Contrast contribution (0 to 0.30)
        if intensity["echo_contrast"] >= 2.2:
            man_made_score += 0.30
        elif intensity["echo_contrast"] >= 1.6:
            man_made_score += 0.22
        elif intensity["echo_contrast"] >= 1.2:
            man_made_score += 0.12
        else:
            man_made_score += 0.04

        # Shadow contribution (0 to 0.30)
        if shadow["shadow_signature"] == "STRONG":
            man_made_score += 0.30
        elif shadow["shadow_signature"] == "MODERATE":
            man_made_score += 0.20
        elif shadow["shadow_signature"] == "WEAK":
            man_made_score += 0.08
        else:
            man_made_score += 0.02

        # Geometry contribution (0 to 0.25)
        if geometry["geometric_regularity"] == "HIGH":
            man_made_score += 0.25
        elif geometry["geometric_regularity"] == "MEDIUM":
            man_made_score += 0.15
        else:
            man_made_score += 0.05

        # Texture / Periodic Mesh contribution (0 to 0.15)
        if freq["has_periodic_structure"]:
            # Periodic mesh or regular linear features
            man_made_score += 0.15
        elif texture["texture_complexity"] == "LOW":
            # Solid planar surface (metallic hull or container)
            man_made_score += 0.10
        elif texture["texture_complexity"] == "MEDIUM":
            man_made_score += 0.05

        man_made_score = round(min(1.0, max(0.05, man_made_score)), 2)

        # 3. Classify Acoustic Pattern Hypothesis
        if geometry["is_elongated"] and (geometry["convexity"] > 0.75 or intensity["echo_contrast"] > 1.8):
            acoustic_pattern = "CYLINDRICAL / LINEAR BODY"
        elif freq["has_periodic_structure"] and shadow["shadow_signature"] in ["MODERATE", "STRONG"]:
            acoustic_pattern = "ENTANGLED / DERELICT MESH"
        elif man_made_score >= 0.65:
            acoustic_pattern = "MAN-MADE CANDIDATE"
        elif man_made_score >= 0.40:
            acoustic_pattern = "AMBIGUOUS ANOMALY"
        else:
            acoustic_pattern = "NATURAL-LIKE FORMATION"

        # 4. Generate Explainable Evidence Bullets ("Why Flagged?")
        evidence: List[str] = []

        if intensity["highlight_strength"] in ["VERY HIGH", "HIGH"]:
            evidence.append(f"Strong echo contrast ({intensity['echo_contrast']}x ambient seabed) indicates highly reflective acoustic boundary")
        elif intensity["highlight_strength"] == "MODERATE":
            evidence.append(f"Noticeable acoustic backscatter contrast ({intensity['echo_contrast']}x ambient)")

        if shadow["shadow_signature"] == "STRONG":
            evidence.append(f"Pronounced acoustic shadow ({shadow['shadow_length_m']}m estimated length) confirms 3D vertical relief ~{shadow['estimated_height_m']}m above seabed")
        elif shadow["shadow_signature"] == "MODERATE":
            evidence.append(f"Moderate acoustic shadow present ({shadow['shadow_length_m']}m relief shadow)")
        elif shadow["shadow_signature"] == "WEAK":
            evidence.append("Weak or partially occluded shadow signature")
        else:
            evidence.append("Absence of pronounced acoustic shadow indicates low relief or flat contact")

        if geometry["geometric_regularity"] == "HIGH":
            evidence.append(f"High geometric regularity (aspect ratio: {geometry['aspect_ratio']}, convexity: {geometry['convexity']}) atypical of natural geology")
        elif geometry["is_elongated"]:
            evidence.append(f"Distinct elongation ({geometry['physical_length_m']}m x {geometry['physical_width_m']}m) suggests linear structure, cable, or pipeline")

        if freq["has_periodic_structure"]:
            evidence.append("Spatial frequency spectrum reveals periodic backscatter consistent with synthetic mesh, netting, or repetitive structural ribs")
        elif texture["texture_complexity"] == "LOW":
            evidence.append("Low local texture entropy indicates smooth planar acoustic facet")
        elif texture["texture_complexity"] == "HIGH":
            evidence.append("High texture variance indicates irregular, complex surface roughness")

        return {
            "intensity": intensity,
            "shadow": shadow,
            "texture": texture,
            "geometry": geometry,
            "frequency": freq,
            "man_made_probability": man_made_score,
            "acoustic_pattern": acoustic_pattern,
            "evidence_bullets": evidence,
            "scientific_disclaimer": "This represents an acoustic/structural hypothesis derived from acoustic backscatter and geometric ray-tracing, NOT a chemical or metallurgical identification."
        }
