import pytest
from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AQUAFORGE"
    assert data["sih_problem"] == "SIH26057"

def test_api_system_status():
    res = client.get("/api/system/status")
    assert res.status_code == 200
    data = res.json()
    assert "SIH26057" in data["sih_problem"]
    assert "National Institute of Ocean Technology" in data["organization"]

def test_api_surveys_list():
    res = client.get("/api/surveys")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_api_models():
    res = client.get("/api/models")
    assert res.status_code == 200
    data = res.json()
    assert "models" in data
    assert len(data["models"]) > 0
