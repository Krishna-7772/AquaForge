import pytest
from backend.tracking.persistence import MultiPingPersistenceTracker

def test_multi_ping_persistence_clustering():
    tracker = MultiPingPersistenceTracker(meters_per_pixel=0.08)

    # 3 detections close in space across consecutive pings (ping 10, 11, 12)
    detections = [
        {"bbox": [100, 100, 140, 130], "confidence": 0.82, "class_name": "DERELICT_GEAR", "ping_index": 10},
        {"bbox": [102, 105, 142, 135], "confidence": 0.86, "class_name": "DERELICT_GEAR", "ping_index": 11},
        {"bbox": [101, 110, 143, 138], "confidence": 0.84, "class_name": "DERELICT_GEAR", "ping_index": 12},
        # An isolated transient detection far away
        {"bbox": [500, 400, 520, 420], "confidence": 0.45, "class_name": "OTHER_MAN_MADE", "ping_index": 45}
    ]

    clusters = tracker.associate_detections(detections)
    assert len(clusters) == 2

    # First cluster should be persistent
    cluster1 = next(c for c in clusters if c["observation_count"] == 3)
    assert cluster1["persistence_status"] == "PERSISTENT CONTACT"
    assert cluster1["majority_class"] == "DERELICT_GEAR"
    assert cluster1["mean_score"] > 0.8

    # Second cluster should be single-ping
    cluster2 = next(c for c in clusters if c["observation_count"] == 1)
    assert cluster2["persistence_status"] == "SINGLE-PING CONTACT"
