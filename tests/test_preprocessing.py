import numpy as np
import pytest
from backend.sonar.preprocessing import SonarPreprocessor

def test_sonar_preprocessor_standard():
    img = np.random.randint(40, 200, (400, 600, 3), dtype=np.uint8)
    preprocessor = SonarPreprocessor(preset="STANDARD")
    processed, diag = preprocessor.process(img, sensor_altitude_m=12.0, slant_range_max_m=60.0)

    assert processed is not None
    assert processed.shape == img.shape
    assert diag["preset"] == "STANDARD"
    assert diag["slant_range_corrected"] is True
    assert "raw_snr" in diag
    assert "post_snr" in diag

def test_sonar_preprocessor_presets():
    img = np.random.randint(50, 180, (200, 300), dtype=np.uint8)
    for preset in ["STANDARD", "HIGH_CONTRAST", "LOW_SNR", "CONSERVATIVE"]:
        preprocessor = SonarPreprocessor(preset=preset)
        out, diag = preprocessor.process(img)
        assert out.shape[:2] == img.shape
        assert diag["preset"] == preset

def test_sonar_preprocessor_handles_flat_image():
    # Uniform image
    flat = np.full((100, 100, 3), 128, dtype=np.uint8)
    preprocessor = SonarPreprocessor()
    out, diag = preprocessor.process(flat)
    assert out is not None
    assert diag["raw_std"] == 0.0
