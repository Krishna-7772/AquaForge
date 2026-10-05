import pytest
from backend.priority.prioritizer import SurveyPrioritizationEngine
from backend.recommendation.engine import NextBestScanEngine

def test_high_priority_classification():
    fingerprint = {
        "man_made_probability": 0.85,
        "shadow": {"shadow_signature": "STRONG"},
        "intensity": {"highlight_strength": "HIGH"},
        "geometry": {"is_elongated": False}
    }
    persistence_info = {"observation_count": 4}
    geo_info = {"has_metadata": True}

    priority, score, reason, factors = SurveyPrioritizationEngine.evaluate(
        model_score=0.88,
        calibrated_confidence=0.85,
        fingerprint=fingerprint,
        persistence_info=persistence_info,
        geolocation_info=geo_info,
        is_novel_anomaly=False,
        target_class="DERELICT_GEAR"
    )

    assert priority == "HIGH"
    assert score >= 0.70
    assert "reasons" not in factors or len(factors) > 0

def test_next_best_scan_single_ping():
    rec = NextBestScanEngine.recommend(
        contact_class="CYLINDRICAL_OBJECT",
        confidence=0.65,
        fingerprint={"shadow": {"shadow_signature": "MODERATE"}},
        persistence_info={"observation_count": 1},
        geolocation_info={"has_metadata": True},
        is_novel_anomaly=False
    )

    assert rec["action_type"] == "OVERLAPPING_PASS"
    assert "overlapping" in rec["recommended_action"].lower()

def test_next_best_scan_novel_anomaly():
    rec = NextBestScanEngine.recommend(
        contact_class="UNKNOWN",
        confidence=0.50,
        fingerprint={"shadow": {"shadow_signature": "WEAK"}},
        persistence_info={"observation_count": 2},
        geolocation_info={"has_metadata": True},
        is_novel_anomaly=True
    )

    assert rec["action_type"] == "HIGH_FREQUENCY_INSPECTION"
    assert "high-frequency" in rec["recommended_action"].lower()
