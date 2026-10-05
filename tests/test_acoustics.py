import numpy as np
import pytest
from backend.acoustics.intensity import extract_intensity_features
from backend.acoustics.shadow import extract_shadow_features
from backend.acoustics.texture import extract_texture_features
from backend.acoustics.geometry import extract_geometry_features
from backend.acoustics.frequency import extract_frequency_features
from backend.acoustics.fingerprint import AcousticFingerprintEngine

def test_intensity_features():
    # Patch with bright center highlight (240) and darker background (80)
    patch = np.full((64, 64, 3), 80, dtype=np.uint8)
    patch[20:44, 20:44] = 240
    feat = extract_intensity_features(patch)

    assert feat["echo_contrast"] > 1.5
    assert feat["highlight_strength"] in ["HIGH", "VERY HIGH"]
    assert feat["target_mean_intensity"] > feat["background_mean_intensity"]

def test_shadow_features_and_height():
    # Patch with dark shadow on right side
    patch = np.full((64, 64, 3), 120, dtype=np.uint8)
    patch[20:44, 15:25] = 230  # Highlight
    patch[20:44, 30:55] = 10   # Shadow void
    
    shadow = extract_shadow_features(patch, sensor_altitude_m=15.0, slant_range_m=45.0, meters_per_pixel=0.1)
    assert shadow["shadow_area_px"] > 0
    assert shadow["shadow_length_m"] > 0
    assert shadow["estimated_height_m"] > 0
    assert shadow["shadow_signature"] in ["MODERATE", "STRONG"]

def test_texture_glcm():
    patch = np.random.randint(50, 200, (64, 64, 3), dtype=np.uint8)
    tex = extract_texture_features(patch)
    assert "glcm_contrast" in tex
    assert "glcm_entropy" in tex
    assert tex["texture_complexity"] in ["LOW", "MEDIUM", "HIGH"]

def test_geometry_features():
    # Create elongated rectangle (high aspect ratio)
    patch = np.zeros((100, 100, 3), dtype=np.uint8)
    patch[40:60, 10:90] = 255  # 80x20 box
    geom = extract_geometry_features(patch, meters_per_pixel=0.08)
    assert geom["aspect_ratio"] >= 3.0
    assert geom["is_elongated"] is True
    assert geom["physical_length_m"] > geom["physical_width_m"]

def test_frequency_fft():
    patch = np.random.randint(50, 150, (64, 64, 3), dtype=np.uint8)
    freq = extract_frequency_features(patch)
    assert "high_spatial_freq_ratio" in freq
    assert "has_periodic_structure" in freq
    assert "Transducer RF carrier frequency not extracted" in freq["disclaimer"]

def test_acoustic_fingerprint_engine():
    patch = np.full((64, 64, 3), 100, dtype=np.uint8)
    patch[20:40, 15:30] = 235
    patch[20:40, 35:55] = 12
    profile = AcousticFingerprintEngine.compute_profile(patch, sensor_altitude_m=14.0, slant_range_m=50.0)

    assert "intensity" in profile
    assert "shadow" in profile
    assert "texture" in profile
    assert "geometry" in profile
    assert "man_made_probability" in profile
    assert len(profile["evidence_bullets"]) > 0
    assert "scientific_disclaimer" in profile
