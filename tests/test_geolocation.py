import pytest
from backend.geospatial.geolocation import AcousticGeolocationEngine

def test_geolocation_with_valid_telemetry():
    # Vessel at Chennai coastal station heading 45 deg, target on Starboard (offset ~135 deg)
    res = AcousticGeolocationEngine.calculate_contact_position(
        vessel_lat=13.0827,
        vessel_lon=80.2707,
        vessel_heading_deg=45.0,
        sensor_altitude_m=15.0,
        slant_range_m=50.0,
        sonar_side="STARBOARD"
    )

    assert res["has_metadata"] is True
    assert res["latitude"] is not None
    assert res["longitude"] is not None
    assert res["position_uncertainty_m"] > 0.0
    assert res["geolocation_confidence"] > 0.5
    assert "WGS-84" in res["status_message"]

def test_geolocation_missing_metadata_honesty():
    # Vessel coordinates missing
    res = AcousticGeolocationEngine.calculate_contact_position(
        vessel_lat=None,
        vessel_lon=None,
        vessel_heading_deg=None,
        sensor_altitude_m=12.0,
        slant_range_m=40.0,
        sonar_side="PORT"
    )

    assert res["has_metadata"] is False
    assert res["latitude"] is None
    assert res["longitude"] is None
    assert "Geolocation unavailable" in res["status_message"]
