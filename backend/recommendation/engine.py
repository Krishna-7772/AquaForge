from typing import Dict, Any

class NextBestScanEngine:
    """
    Diagnostic Next-Best-Scan Recommendation Engine.
    Translates acoustic ambiguities into actionable hydrographic survey recommendations.
    Formulates operational guidance to maximize evidential gain on subsequent survey lines.
    """

    @classmethod
    def recommend(
        cls,
        contact_class: str,
        confidence: float,
        fingerprint: Dict[str, Any],
        persistence_info: Dict[str, Any],
        geolocation_info: Dict[str, Any],
        is_novel_anomaly: bool
    ) -> Dict[str, Any]:
        """
        Determines the optimal next hydrographic observation.
        """
        shadow = fingerprint.get("shadow", {})
        shadow_sig = shadow.get("shadow_signature", "NONE")
        intensity = fingerprint.get("intensity", {})
        geometry = fingerprint.get("geometry", {})
        obs_count = persistence_info.get("observation_count", 1)
        has_nav = geolocation_info.get("has_metadata", False)

        # 1. Missing Navigation Telemetry
        if not has_nav:
            return {
                "action_type": "METADATA_AUDIT",
                "recommended_action": "Verify and synchronize vehicle navigation telemetry",
                "detailed_instruction": "Acoustic contact lacks georeferencing coordinates. Correlate survey timestamp with surface USBL/DVL navigation logs or re-ingest raw XTF with GPS ping headers.",
                "operational_rationale": "Without WGS-84 positioning, maritime recovery or ROV deployment cannot be targeted.",
                "urgency": "HIGH"
            }

        # 2. Out-of-Distribution Novel Anomaly
        if is_novel_anomaly:
            return {
                "action_type": "HIGH_FREQUENCY_INSPECTION",
                "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
                "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
                "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
                "urgency": "HIGH"
            }

        # 3. Single-Ping Isolation (Lack of persistence)
        if obs_count < 2:
            return {
                "action_type": "OVERLAPPING_PASS",
                "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
                "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
                "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
                "urgency": "MEDIUM"
            }

        # 4. Weak or Occluded Acoustic Shadow (Altitude or Angle Issue)
        if shadow_sig in ["NONE", "WEAK"] and intensity.get("echo_contrast", 1.0) > 1.4:
            return {
                "action_type": "RECIPROCAL_PASS",
                "recommended_action": "Perform a reciprocal pass from the opposite heading (180° offset)",
                "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
                "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
                "urgency": "MEDIUM"
            }

        # 5. Long Elongated Target (Pipeline, Cable, or Long Net)
        if geometry.get("is_elongated", False) and geometry.get("physical_length_m", 0) > 8.0:
            return {
                "action_type": "ORTHOGONAL_CROSSING",
                "recommended_action": "Perform an orthogonal crossing pass (90° to target axis)",
                "detailed_instruction": f"Contact appears elongated ({geometry.get('physical_length_m')}m). Navigate a survey line perpendicular to target orientation ({geometry.get('orientation_deg', 0)}°) to verify continuity and burial state.",
                "operational_rationale": "Acoustic backscatter is maximized when the sonar beam strikes cylindrical conduits or linear debris at right angles.",
                "urgency": "STANDARD"
            }

        # 6. High-Confidence Debris (Ghost Gear or Shipwreck)
        if confidence >= 0.75 and contact_class in ["DERELICT_GEAR", "SHIPWRECK"]:
            return {
                "action_type": "VISUAL_ROV_CONFIRMATION",
                "recommended_action": "Nominate for visual confirmation via ROV or diver inspection",
                "detailed_instruction": f"High acoustic confidence ({round(confidence*100)}%) with verified multi-ping persistence. Transfer geodetic coordinates to vessel dynamic positioning (DP) system for optical camera confirmation and recovery planning.",
                "operational_rationale": "Acoustic forensic fingerprint meets clearance criteria for target physical intervention.",
                "urgency": "PRIORITY"
            }

        # Default fallback
        return {
            "action_type": "STANDARD_CONTINUATION",
            "recommended_action": "Maintain planned survey line spacing and verify in post-survey mosaic",
            "detailed_instruction": "Acoustic return is consistent with nominal survey targets. Proceed with standard lawnmower survey pattern.",
            "operational_rationale": "Contact has sufficient resolution for standard post-mission analysis.",
            "urgency": "LOW"
        }
