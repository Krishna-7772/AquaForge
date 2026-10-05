import pytest
import io
from starlette.testclient import TestClient
from backend.main import app
from backend.ingestion.image import load_and_validate_sonar_image
from backend.ingestion.xtf import XtfParser

client = TestClient(app)

def test_malformed_image_handling(tmp_path):
    # Create invalid corrupt image file
    corrupt_file = tmp_path / "corrupt_sonar.png"
    corrupt_file.write_bytes(b"NOT_A_VALID_PNG_CORRUPT_HEADER_BYTES")

    with pytest.raises(ValueError):
        load_and_validate_sonar_image(str(corrupt_file))

def test_path_traversal_protection():
    # Attempt upload with malicious directory traversal filename
    traversal_filename = "../../../etc/passwd.png"
    fake_png = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")

    # Creating a survey first
    survey_res = client.post("/api/surveys", json={"name": "Security Test Survey"})
    assert survey_res.status_code == 200
    survey_id = survey_res.json()["id"]

    res = client.post(
        f"/api/surveys/{survey_id}/upload",
        files={"file": (traversal_filename, fake_png, "image/png")}
    )
    assert res.status_code == 200
    # Destination filename must be sanitized (base name only)
    assert ".." not in res.json()["filename"]
    assert res.json()["filename"] == "passwd.png"

def test_nonexistent_contact_review_safety():
    res = client.post("/api/contacts/999999/review", json={
        "decision": "ACCEPTED",
        "reviewer_name": "Test Analyst"
    })
    assert res.status_code in [400, 404]

def test_corrupt_xtf_graceful_rejection(tmp_path):
    corrupt_xtf = tmp_path / "corrupt_survey.xtf"
    corrupt_xtf.write_bytes(b"\x00\x01\x02\x03\x04")
    result = XtfParser.probe_and_parse(str(corrupt_xtf))
    assert result["is_valid_xtf"] is False
    assert result["format_supported"] is False
