from typing import Dict, Any, Tuple, List

class SurveyPrioritizationEngine:
    """
    Evaluates multi-factor acoustic, geometric, and operational hazard criteria
    to rank contacts transparently into HIGH, MEDIUM, LOW, or REVIEW.
    """

    @classmethod
    def evaluate(
        cls,
        model_score: float,
        calibrated_confidence: float,
        fingerprint: Dict[str, Any],
        persistence_info: Dict[str, Any],
        geolocation_info: Dict[str, Any],
        is_novel_anomaly: bool,
        target_class: str
    ) -> Tuple[str, float, str, Dict[str, Any]]:
        """
        Returns:
            priority: 'HIGH', 'MEDIUM', 'LOW', or 'REVIEW'
            composite_score: float (0.0 to 1.0)
            primary_reason: str (concise summary)
            factor_breakdown: Dict of constituent factors
        """
        reasons: List[str] = []
        factors: Dict[str, Any] = {}

        # 1. Acoustic Saliency Factor (0 - 0.25)
        man_made_prob = fingerprint.get("man_made_probability", 0.5)
        shadow_sig = fingerprint.get("shadow", {}).get("shadow_signature", "NONE")
        highlight_str = fingerprint.get("intensity", {}).get("highlight_strength", "LOW")
        
        acoustic_factor = 0.10
        if shadow_sig == "STRONG" and highlight_str in ["HIGH", "VERY HIGH"]:
            acoustic_factor = 0.25
            reasons.append("Strong coupled acoustic highlight and elongated shadow")
        elif shadow_sig in ["MODERATE", "STRONG"]:
            acoustic_factor = 0.18
            reasons.append("Clear acoustic shadow confirmation")
        factors["acoustic_evidence_weight"] = round(acoustic_factor, 2)

        # 2. Multi-Ping Persistence Factor (0 - 0.25)
        obs_count = persistence_info.get("observation_count", 1)
        if obs_count >= 3:
            persistence_factor = 0.25
            reasons.append(f"Persistent across {obs_count} consecutive pings (high spatial stability)")
        elif obs_count == 2:
            persistence_factor = 0.18
            reasons.append("Observed across 2 pings")
        else:
            persistence_factor = 0.08
            reasons.append("Single-ping observation (needs follow-up verification)")
        factors["persistence_weight"] = round(persistence_factor, 2)

        # 3. Operational Hazard & Class Criticality (0 - 0.25)
        # Shipwrecks, ghost nets, containers, and pipelines represent high navigational/environmental hazards
        hazard_classes = {"DERELICT_GEAR", "SHIPWRECK", "PIPELINE", "MINE_LIKE_OBJECT"}
        if target_class in hazard_classes:
            hazard_factor = 0.25
            reasons.append(f"High environmental/navigational impact class: {target_class}")
        elif target_class in {"CYLINDRICAL_OBJECT", "OTHER_MAN_MADE"}:
            hazard_factor = 0.18
            reasons.append(f"Artificial benthic debris class: {target_class}")
        else:
            hazard_factor = 0.08
        factors["hazard_criticality_weight"] = round(hazard_factor, 2)

        # 4. Unknown / Novel Anomaly Factor (0 - 0.25)
        if is_novel_anomaly:
            novelty_factor = 0.22
            reasons.append("Out-of-distribution acoustic anomaly requiring mandatory human inspection")
        else:
            novelty_factor = 0.12 * calibrated_confidence
        factors["novelty_verification_weight"] = round(novelty_factor, 2)

        # Composite score
        composite_score = round(acoustic_factor + persistence_factor + hazard_factor + novelty_factor, 2)
        composite_score = min(1.0, max(0.05, composite_score))

        # Assign Priority
        if is_novel_anomaly and composite_score >= 0.55:
            priority = "REVIEW"
            primary_reason = "Uncataloged acoustic anomaly — Flagged for mandatory analyst verification"
        elif composite_score >= 0.72:
            priority = "HIGH"
            primary_reason = " | ".join(reasons[:2]) if reasons else "High-confidence persistent man-made debris"
        elif composite_score >= 0.45:
            priority = "MEDIUM"
            primary_reason = " | ".join(reasons[:2]) if reasons else "Moderate-confidence contact"
        else:
            priority = "LOW"
            primary_reason = "Low acoustic saliency or transient single-ping return"

        return priority, composite_score, primary_reason, factors
