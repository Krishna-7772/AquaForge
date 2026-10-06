// Pre-baked verified demo fixtures for static GitHub Pages deployment
export const DEMO_SURVEY = {
  "id": 3,
  "survey_code": "DEMO-COASTAL-BAY-A",
  "name": "DEMO COASTAL SURVEY \u2014 BAY A",
  "vessel_name": "RV Sagarkanya (MoES/NIOT Benchmark)",
  "sensor_model": "Edgetech 4200 Dual-Frequency SSS",
  "frequency_khz": 410.0,
  "is_demo": true,
  "status": "COMPLETED",
  "created_at": "2026-10-06T02:47:33.817334",
  "files": [
    {
      "id": 3,
      "filename": "demo_coastal_survey_waterfall.png",
      "file_type": "IMAGE",
      "width": 1024,
      "height": 800,
      "preprocessed_url": "/artifacts/uploads\\prep_survey_3.png"
    }
  ],
  "events": [
    {
      "step_name": "INGESTION",
      "progress_pct": 10,
      "message": "Validating sonar raster files and extracting ping headers",
      "timestamp": "2026-10-06T02:47:33.890611"
    },
    {
      "step_name": "PREPROCESSING",
      "progress_pct": 30,
      "message": "Applying STANDARD TVG gain normalization, speckle suppression & CLAHE",
      "timestamp": "2026-10-06T02:47:33.966048"
    },
    {
      "step_name": "DETECTION",
      "progress_pct": 50,
      "message": "Running real-time neural inference & acoustic highlight-shadow fusion",
      "timestamp": "2026-10-06T02:47:34.259595"
    },
    {
      "step_name": "TRACKING",
      "progress_pct": 70,
      "message": "Associating detections across sequential pings to evaluate persistence",
      "timestamp": "2026-10-06T02:47:34.304221"
    },
    {
      "step_name": "ACOUSTICS_&_GEO",
      "progress_pct": 85,
      "message": "Extracting GLCM texture, shadow relief geometry, WGS-84 coords & diagnostic actions",
      "timestamp": "2026-10-06T02:47:34.322536"
    },
    {
      "step_name": "REPORTING",
      "progress_pct": 95,
      "message": "Compiling hydrographic inspection report and GIS datasets",
      "timestamp": "2026-10-06T02:47:36.828207"
    },
    {
      "step_name": "COMPLETED",
      "progress_pct": 100,
      "message": "Perception pipeline finished: 30 contacts indexed",
      "timestamp": "2026-10-06T02:47:36.969590"
    }
  ],
  "stats": {
    "total_contacts": 30,
    "high_priority": 1,
    "medium_priority": 21,
    "low_priority": 1,
    "review_priority": 7,
    "novel_anomalies": 8,
    "reviewed": 0,
    "georeferenced": 30
  }
};

export const DEMO_CONTACTS = [
  {
    "id": 1,
    "survey_id": 3,
    "contact_code": "AF-001",
    "detected_class": "OTHER_MAN_MADE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.49,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.726,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-001_crop.png",
    "detection": {
      "x": 354,
      "y": 163,
      "width": 71,
      "height": 104,
      "bbox_norm": [
        0.3457,
        0.2037,
        0.415,
        0.3337
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 6.31,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 244.1,
        "background_mean_intensity": 38.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 1050,
        "shadow_length_m": 7.62,
        "shadow_to_highlight_ratio": 0.25,
        "estimated_height_m": 4.32
      },
      "texture": {
        "glcm_contrast": 18.76,
        "glcm_homogeneity": 0.445,
        "glcm_energy": 0.021,
        "glcm_entropy": 0.97,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 7.36,
        "physical_width_m": 5.21,
        "aspect_ratio": 1.41,
        "compactness": 0.533,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.53,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (6.31x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827695,
      "longitude": 80.2706451,
      "position_uncertainty_m": 3.3,
      "geolocation_confidence": 0.92,
      "slant_range_m": 17.9443359375,
      "ground_range_m": 10.6,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.3m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.58,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 2,
    "survey_id": 3,
    "contact_code": "AF-002",
    "detected_class": "NATURAL_FORMATION",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.486,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.854,
    "is_novel_anomaly": true,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-002_crop.png",
    "detection": {
      "x": 530,
      "y": 169,
      "width": 161,
      "height": 89,
      "bbox_norm": [
        0.5176,
        0.2112,
        0.6748,
        0.3225
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 8.23,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 230.4,
        "background_mean_intensity": 28.0
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 2212,
        "shadow_length_m": 7.62,
        "shadow_to_highlight_ratio": 0.31,
        "estimated_height_m": 5.0
      },
      "texture": {
        "glcm_contrast": 17.72,
        "glcm_homogeneity": 0.472,
        "glcm_energy": 0.0181,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 6.97,
        "physical_width_m": 5.17,
        "aspect_ratio": 1.35,
        "compactness": 0.537,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.53,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (8.23x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826478,
      "longitude": 80.2708235,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 14.4287109375,
      "ground_range_m": 13.0,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Out-of-distribution acoustic anomaly requiring mandatory human inspection",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.08,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 3,
    "survey_id": 3,
    "contact_code": "AF-003",
    "detected_class": "CYLINDRICAL_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.511,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.376,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-003_crop.png",
    "detection": {
      "x": 379,
      "y": 180,
      "width": 171,
      "height": 93,
      "bbox_norm": [
        0.3701,
        0.225,
        0.5371,
        0.3412
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.08,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 216.8,
        "background_mean_intensity": 104.3
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 589,
        "shadow_length_m": 4.25,
        "shadow_to_highlight_ratio": 0.08,
        "estimated_height_m": 3.29
      },
      "texture": {
        "glcm_contrast": 17.88,
        "glcm_homogeneity": 0.453,
        "glcm_energy": 0.0106,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 5.27,
        "physical_width_m": 4.25,
        "aspect_ratio": 1.24,
        "compactness": 0.622,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.55,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.08x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.24, convexity: 0.933) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 6.9580078125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Artificial benthic debris class: CYLINDRICAL_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 4,
    "survey_id": 3,
    "contact_code": "AF-004",
    "detected_class": "SHIPWRECK",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.541,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 1.0,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-004_crop.png",
    "detection": {
      "x": 244,
      "y": 181,
      "width": 64,
      "height": 82,
      "bbox_norm": [
        0.2383,
        0.2263,
        0.3008,
        0.3287
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 26.41,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 187.6,
        "background_mean_intensity": 7.1
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 432,
        "shadow_length_m": 5.71,
        "shadow_to_highlight_ratio": 0.13,
        "estimated_height_m": 2.06
      },
      "texture": {
        "glcm_contrast": 20.36,
        "glcm_homogeneity": 0.315,
        "glcm_energy": 0.0079,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.73,
        "physical_width_m": 0.73,
        "aspect_ratio": 1.0,
        "compactness": 0.39,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.53,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (26.41x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0828767,
      "longitude": 80.2704879,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 34.5703125,
      "ground_range_m": 31.4,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.65,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 5,
    "survey_id": 3,
    "contact_code": "AF-005",
    "detected_class": "MINE_LIKE_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.522,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.999,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-005_crop.png",
    "detection": {
      "x": 645,
      "y": 194,
      "width": 158,
      "height": 81,
      "bbox_norm": [
        0.6299,
        0.2425,
        0.7842,
        0.3438
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 20.99,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 211.7,
        "background_mean_intensity": 10.1
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 1143,
        "shadow_length_m": 8.2,
        "shadow_to_highlight_ratio": 0.18,
        "estimated_height_m": 3.03
      },
      "texture": {
        "glcm_contrast": 20.89,
        "glcm_homogeneity": 0.341,
        "glcm_energy": 0.0086,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 4.98,
        "physical_width_m": 3.22,
        "aspect_ratio": 1.55,
        "compactness": 0.545,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.53,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (20.99x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825735,
      "longitude": 80.2709325,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 31.0546875,
      "ground_range_m": 27.5,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.65,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 6,
    "survey_id": 3,
    "contact_code": "AF-006",
    "detected_class": "MINE_LIKE_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.527,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.364,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-006_crop.png",
    "detection": {
      "x": 543,
      "y": 223,
      "width": 76,
      "height": 69,
      "bbox_norm": [
        0.5303,
        0.2787,
        0.6045,
        0.365
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.22,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 213.9,
        "background_mean_intensity": 96.2
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 132,
        "shadow_length_m": 0.59,
        "shadow_to_highlight_ratio": 0.04,
        "estimated_height_m": 0.57
      },
      "texture": {
        "glcm_contrast": 20.86,
        "glcm_homogeneity": 0.396,
        "glcm_energy": 0.0081,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.73,
        "physical_width_m": 0.73,
        "aspect_ratio": 1.0,
        "compactness": 0.496,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.53,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.22x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826478,
      "longitude": 80.2708235,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 10.107421875,
      "ground_range_m": 13.0,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: MINE_LIKE_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 7,
    "survey_id": 3,
    "contact_code": "AF-007",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.501,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.471,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-007_crop.png",
    "detection": {
      "x": 646,
      "y": 231,
      "width": 130,
      "height": 81,
      "bbox_norm": [
        0.6309,
        0.2888,
        0.7578,
        0.39
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.92,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 210.3,
        "background_mean_intensity": 71.9
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 42,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.18,
        "glcm_homogeneity": 0.293,
        "glcm_energy": 0.0061,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 2.78,
        "physical_width_m": 0.73,
        "aspect_ratio": 3.8,
        "compactness": 0.331,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.92x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 3.8, convexity: 0.863) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825847,
      "longitude": 80.270916,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 29.150390625,
      "ground_range_m": 25.3,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: PIPELINE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 8,
    "survey_id": 3,
    "contact_code": "AF-008",
    "detected_class": "NATURAL_FORMATION",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.5,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.397,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 2.54,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-008_crop.png",
    "detection": {
      "x": 330,
      "y": 242,
      "width": 188,
      "height": 42,
      "bbox_norm": [
        0.3223,
        0.3025,
        0.5059,
        0.355
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.06,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 208.0,
        "background_mean_intensity": 100.9
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 262,
        "shadow_length_m": 4.25,
        "shadow_to_highlight_ratio": 0.06,
        "estimated_height_m": 3.29
      },
      "texture": {
        "glcm_contrast": 20.4,
        "glcm_homogeneity": 0.393,
        "glcm_energy": 0.0082,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.73,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.67,
        "compactness": 0.736,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.55,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.06x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.67, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 12.890625,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Observed across 2 pings",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.08,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Perform a reciprocal pass from the opposite heading (180\u00b0 offset)",
      "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
      "action_type": "RECIPROCAL_PASS",
      "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 9,
    "survey_id": 3,
    "contact_code": "AF-009",
    "detected_class": "MINE_LIKE_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.492,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.498,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-009_crop.png",
    "detection": {
      "x": 235,
      "y": 236,
      "width": 130,
      "height": 55,
      "bbox_norm": [
        0.2295,
        0.295,
        0.3564,
        0.3638
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.84,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 206.6,
        "background_mean_intensity": 72.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 78,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.02,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.2,
        "glcm_homogeneity": 0.287,
        "glcm_energy": 0.006,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.29,
        "aspect_ratio": 1.5,
        "compactness": 0.754,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.84x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.5, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0828565,
      "longitude": 80.2705175,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 31.0546875,
      "ground_range_m": 27.5,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: MINE_LIKE_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 10,
    "survey_id": 3,
    "contact_code": "AF-010",
    "detected_class": "CYLINDRICAL_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.493,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.353,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 2.6,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-010_crop.png",
    "detection": {
      "x": 489,
      "y": 252,
      "width": 188,
      "height": 47,
      "bbox_norm": [
        0.4775,
        0.315,
        0.6611,
        0.3738
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 1.91,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 209.2,
        "background_mean_intensity": 109.4
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 312,
        "shadow_length_m": 4.25,
        "shadow_to_highlight_ratio": 0.06,
        "estimated_height_m": 3.29
      },
      "texture": {
        "glcm_contrast": 20.59,
        "glcm_homogeneity": 0.409,
        "glcm_energy": 0.0086,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.88,
        "physical_width_m": 0.29,
        "aspect_ratio": 3.0,
        "compactness": 0.589,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.45,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (1.91x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826478,
      "longitude": 80.2708235,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 10.400390625,
      "ground_range_m": 13.0,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.58,
      "primary_reason": "Observed across 2 pings | Artificial benthic debris class: CYLINDRICAL_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Perform a reciprocal pass from the opposite heading (180\u00b0 offset)",
      "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
      "action_type": "RECIPROCAL_PASS",
      "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 11,
    "survey_id": 3,
    "contact_code": "AF-011",
    "detected_class": "MINE_LIKE_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.481,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.33,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-011_crop.png",
    "detection": {
      "x": 457,
      "y": 253,
      "width": 103,
      "height": 102,
      "bbox_norm": [
        0.4463,
        0.3162,
        0.5469,
        0.4437
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 1.84,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 206.1,
        "background_mean_intensity": 112.0
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 492,
        "shadow_length_m": 4.25,
        "shadow_to_highlight_ratio": 0.09,
        "estimated_height_m": 3.29
      },
      "texture": {
        "glcm_contrast": 18.73,
        "glcm_homogeneity": 0.479,
        "glcm_energy": 0.0112,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 1.32,
        "physical_width_m": 0.44,
        "aspect_ratio": 3.0,
        "compactness": 0.516,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.45,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (1.84x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 0.5126953125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: MINE_LIKE_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 12,
    "survey_id": 3,
    "contact_code": "AF-012",
    "detected_class": "OTHER_MAN_MADE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.504,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.315,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-012_crop.png",
    "detection": {
      "x": 440,
      "y": 283,
      "width": 69,
      "height": 58,
      "bbox_norm": [
        0.4297,
        0.3538,
        0.4971,
        0.4263
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 1.89,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 210.5,
        "background_mean_intensity": 111.2
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 331,
        "shadow_length_m": 3.81,
        "shadow_to_highlight_ratio": 0.12,
        "estimated_height_m": 3.02
      },
      "texture": {
        "glcm_contrast": 20.34,
        "glcm_homogeneity": 0.465,
        "glcm_energy": 0.0107,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 1.32,
        "physical_width_m": 0.73,
        "aspect_ratio": 1.8,
        "compactness": 0.502,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.45,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (1.89x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 5.4931640625,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Artificial benthic debris class: OTHER_MAN_MADE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 13,
    "survey_id": 3,
    "contact_code": "AF-013",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.502,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.517,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-013_crop.png",
    "detection": {
      "x": 334,
      "y": 295,
      "width": 71,
      "height": 80,
      "bbox_norm": [
        0.3262,
        0.3688,
        0.3955,
        0.4688
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 1.72,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 201.9,
        "background_mean_intensity": 117.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 18,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.2,
        "glcm_homogeneity": 0.31,
        "glcm_energy": 0.0063,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.82,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.55,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (1.72x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827924,
      "longitude": 80.2706116,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 20.8740234375,
      "ground_range_m": 15.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: PIPELINE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 14,
    "survey_id": 3,
    "contact_code": "AF-014",
    "detected_class": "DERELICT_GEAR",
    "acoustic_hypothesis": "MAN-MADE CANDIDATE",
    "operator_confirmed_class": null,
    "model_score": 2.519,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.318,
    "is_novel_anomaly": false,
    "priority_level": "HIGH",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 2.39,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-014_crop.png",
    "detection": {
      "x": 217,
      "y": 298,
      "width": 134,
      "height": 103,
      "bbox_norm": [
        0.2119,
        0.3725,
        0.3428,
        0.5012
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.61,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 255.0,
        "background_mean_intensity": 97.8
      },
      "shadow": {
        "shadow_signature": "MODERATE",
        "shadow_area_px": 2991,
        "shadow_length_m": 11.79,
        "shadow_to_highlight_ratio": 0.41,
        "estimated_height_m": 3.78
      },
      "texture": {
        "glcm_contrast": 17.62,
        "glcm_homogeneity": 0.461,
        "glcm_energy": 0.0351,
        "glcm_entropy": 0.96,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 10.54,
        "physical_width_m": 5.69,
        "aspect_ratio": 1.85,
        "compactness": 0.594,
        "geometric_regularity": "MEDIUM"
      },
      "man_made_probability": 0.65,
      "acoustic_pattern": "MAN-MADE CANDIDATE",
      "evidence_bullets": [
        "Strong echo contrast (2.61x ambient seabed) indicates highly reflective acoustic boundary",
        "Moderate acoustic shadow present (11.79m relief shadow)",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.08287,
      "longitude": 80.2704977,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 33.3984375,
      "ground_range_m": 30.1,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "HIGH",
      "composite_score": 0.73,
      "primary_reason": "Clear acoustic shadow confirmation | Observed across 2 pings",
      "factors": {
        "acoustic_evidence_weight": 0.18,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Nominate for visual confirmation via ROV or diver inspection",
      "detailed_instruction": "High acoustic confidence (97%) with verified multi-ping persistence. Transfer geodetic coordinates to vessel dynamic positioning (DP) system for optical camera confirmation and recovery planning.",
      "action_type": "VISUAL_ROV_CONFIRMATION",
      "operational_rationale": "Acoustic forensic fingerprint meets clearance criteria for target physical intervention.",
      "urgency": "PRIORITY"
    }
  },
  {
    "id": 15,
    "survey_id": 3,
    "contact_code": "AF-015",
    "detected_class": "NATURAL_FORMATION",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.493,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.519,
    "is_novel_anomaly": false,
    "priority_level": "LOW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-015_crop.png",
    "detection": {
      "x": 681,
      "y": 337,
      "width": 84,
      "height": 106,
      "bbox_norm": [
        0.665,
        0.4213,
        0.7471,
        0.5537
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 3.81,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 235.5,
        "background_mean_intensity": 61.8
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 203,
        "shadow_length_m": 2.05,
        "shadow_to_highlight_ratio": 0.04,
        "estimated_height_m": 0.9
      },
      "texture": {
        "glcm_contrast": 19.18,
        "glcm_homogeneity": 0.395,
        "glcm_energy": 0.026,
        "glcm_entropy": 0.96,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 10.52,
        "physical_width_m": 5.54,
        "aspect_ratio": 1.9,
        "compactness": 0.607,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (3.81x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.9, convexity: 0.957) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825744,
      "longitude": 80.2709312,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 30.908203125,
      "ground_range_m": 27.3,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "LOW",
      "composite_score": 0.38,
      "primary_reason": "Low acoustic saliency or transient single-ping return",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.08,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 16,
    "survey_id": 3,
    "contact_code": "AF-016",
    "detected_class": "SHIPWRECK",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.522,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.553,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 3.28,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-016_crop.png",
    "detection": {
      "x": 347,
      "y": 366,
      "width": 155,
      "height": 104,
      "bbox_norm": [
        0.3389,
        0.4575,
        0.4902,
        0.5875
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.24,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 203.6,
        "background_mean_intensity": 90.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 171,
        "shadow_length_m": 2.41,
        "shadow_to_highlight_ratio": 0.02,
        "estimated_height_m": 2.07
      },
      "texture": {
        "glcm_contrast": 19.53,
        "glcm_homogeneity": 0.39,
        "glcm_energy": 0.0081,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 2.78,
        "physical_width_m": 0.44,
        "aspect_ratio": 6.33,
        "compactness": 0.331,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.24x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 6.33, convexity: 0.93) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 12.8173828125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.65,
      "primary_reason": "Observed across 2 pings | High environmental/navigational impact class: SHIPWRECK",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Perform a reciprocal pass from the opposite heading (180\u00b0 offset)",
      "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
      "action_type": "RECIPROCAL_PASS",
      "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 17,
    "survey_id": 3,
    "contact_code": "AF-017",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.517,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.328,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 3.24,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-017_crop.png",
    "detection": {
      "x": 495,
      "y": 385,
      "width": 67,
      "height": 85,
      "bbox_norm": [
        0.4834,
        0.4813,
        0.5488,
        0.5875
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.07,
        "highlight_strength": "HIGH",
        "target_mean_intensity": 212.5,
        "background_mean_intensity": 102.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 263,
        "shadow_length_m": 2.41,
        "shadow_to_highlight_ratio": 0.08,
        "estimated_height_m": 2.07
      },
      "texture": {
        "glcm_contrast": 18.47,
        "glcm_homogeneity": 0.496,
        "glcm_energy": 0.0122,
        "glcm_entropy": 0.99,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 1.61,
        "physical_width_m": 0.59,
        "aspect_ratio": 2.75,
        "compactness": 0.614,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.55,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.07x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 2.75, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826478,
      "longitude": 80.2708235,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 2.4169921875,
      "ground_range_m": 13.0,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.65,
      "primary_reason": "Observed across 2 pings | High environmental/navigational impact class: PIPELINE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Perform a reciprocal pass from the opposite heading (180\u00b0 offset)",
      "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
      "action_type": "RECIPROCAL_PASS",
      "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 18,
    "survey_id": 3,
    "contact_code": "AF-018",
    "detected_class": "CYLINDRICAL_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.511,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.572,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-018_crop.png",
    "detection": {
      "x": 249,
      "y": 389,
      "width": 71,
      "height": 101,
      "bbox_norm": [
        0.2432,
        0.4863,
        0.3125,
        0.6125
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 3.89,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 205.0,
        "background_mean_intensity": 52.8
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 63,
        "shadow_length_m": 0.88,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.37
      },
      "texture": {
        "glcm_contrast": 20.73,
        "glcm_homogeneity": 0.33,
        "glcm_energy": 0.009,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 5.57,
        "physical_width_m": 3.52,
        "aspect_ratio": 1.58,
        "compactness": 0.661,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (3.89x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.58, convexity: 0.943) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0828696,
      "longitude": 80.2704983,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 33.3251953125,
      "ground_range_m": 30.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Artificial benthic debris class: CYLINDRICAL_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 19,
    "survey_id": 3,
    "contact_code": "AF-019",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.497,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.512,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 2,
    "persistence_status": "PERSISTENT CONTACT",
    "track_length_m": 2.69,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-019_crop.png",
    "detection": {
      "x": 524,
      "y": 405,
      "width": 185,
      "height": 58,
      "bbox_norm": [
        0.5117,
        0.5062,
        0.6924,
        0.5787
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.39,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 204.1,
        "background_mean_intensity": 85.3
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 87,
        "shadow_length_m": 0.73,
        "shadow_to_highlight_ratio": 0.02,
        "estimated_height_m": 0.66
      },
      "texture": {
        "glcm_contrast": 19.87,
        "glcm_homogeneity": 0.374,
        "glcm_energy": 0.0078,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 2.49,
        "physical_width_m": 0.44,
        "aspect_ratio": 5.67,
        "compactness": 0.376,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.39x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 5.67, convexity: 0.959) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826897,
      "longitude": 80.2707621,
      "position_uncertainty_m": 4.2,
      "geolocation_confidence": 0.9,
      "slant_range_m": 15.3076171875,
      "ground_range_m": 4.9,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b14.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.65,
      "primary_reason": "Observed across 2 pings | High environmental/navigational impact class: PIPELINE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.18,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Perform a reciprocal pass from the opposite heading (180\u00b0 offset)",
      "detailed_instruction": "Contact exhibits strong highlight reflection but occluded shadow. Run an inverted survey line from the opposite heading to illuminate the opposing face and cast a projected acoustic shadow down-slope.",
      "action_type": "RECIPROCAL_PASS",
      "operational_rationale": "Opposite acoustic illumination angle resolves topographic masking on sloping bathymetry and validates 3D object height.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 20,
    "survey_id": 3,
    "contact_code": "AF-020",
    "detected_class": "SHIPWRECK",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.52,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.549,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-020_crop.png",
    "detection": {
      "x": 286,
      "y": 410,
      "width": 96,
      "height": 105,
      "bbox_norm": [
        0.2793,
        0.5125,
        0.373,
        0.6438
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.63,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 212.0,
        "background_mean_intensity": 80.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 24,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.0,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.16,
        "glcm_homogeneity": 0.297,
        "glcm_energy": 0.0063,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.857,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.63x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0828267,
      "longitude": 80.2705613,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 26.07421875,
      "ground_range_m": 21.7,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: SHIPWRECK",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 21,
    "survey_id": 3,
    "contact_code": "AF-021",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.501,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.999,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-021_crop.png",
    "detection": {
      "x": 698,
      "y": 413,
      "width": 94,
      "height": 81,
      "bbox_norm": [
        0.6816,
        0.5162,
        0.7734,
        0.6175
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 19.82,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 195.1,
        "background_mean_intensity": 9.8
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 144,
        "shadow_length_m": 1.61,
        "shadow_to_highlight_ratio": 0.03,
        "estimated_height_m": 0.65
      },
      "texture": {
        "glcm_contrast": 21.87,
        "glcm_homogeneity": 0.292,
        "glcm_energy": 0.0061,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 1.03,
        "physical_width_m": 0.29,
        "aspect_ratio": 3.5,
        "compactness": 0.394,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (19.82x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 3.5, convexity: 0.826) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825558,
      "longitude": 80.2709584,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 34.130859375,
      "ground_range_m": 30.9,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.65,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 22,
    "survey_id": 3,
    "contact_code": "AF-022",
    "detected_class": "PIPELINE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.498,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.691,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-022_crop.png",
    "detection": {
      "x": 324,
      "y": 430,
      "width": 111,
      "height": 86,
      "bbox_norm": [
        0.3164,
        0.5375,
        0.4248,
        0.645
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 4.32,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 203.6,
        "background_mean_intensity": 47.1
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 42,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.02,
        "glcm_homogeneity": 0.321,
        "glcm_energy": 0.0065,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.785,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (4.32x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827815,
      "longitude": 80.2706275,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 19.4091796875,
      "ground_range_m": 12.9,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: PIPELINE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 23,
    "survey_id": 3,
    "contact_code": "AF-023",
    "detected_class": "DERELICT_GEAR",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.527,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.614,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-023_crop.png",
    "detection": {
      "x": 643,
      "y": 440,
      "width": 166,
      "height": 83,
      "bbox_norm": [
        0.6279,
        0.55,
        0.79,
        0.6538
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 3.27,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 204.5,
        "background_mean_intensity": 62.5
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 45,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.28,
        "glcm_homogeneity": 0.29,
        "glcm_energy": 0.006,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.857,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (3.27x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825718,
      "longitude": 80.270935,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 31.34765625,
      "ground_range_m": 27.8,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: DERELICT_GEAR",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 24,
    "survey_id": 3,
    "contact_code": "AF-024",
    "detected_class": "DERELICT_GEAR",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.498,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.76,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-024_crop.png",
    "detection": {
      "x": 395,
      "y": 461,
      "width": 179,
      "height": 40,
      "bbox_norm": [
        0.3857,
        0.5763,
        0.5605,
        0.6262
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.27,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 212.3,
        "background_mean_intensity": 93.7
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 278,
        "shadow_length_m": 0.73,
        "shadow_to_highlight_ratio": 0.06,
        "estimated_height_m": 0.7
      },
      "texture": {
        "glcm_contrast": 18.13,
        "glcm_homogeneity": 0.443,
        "glcm_energy": 0.0103,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 4.25,
        "physical_width_m": 0.44,
        "aspect_ratio": 9.67,
        "compactness": 0.248,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.27x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 9.67, convexity: 0.954) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 4.0283203125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.65,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 25,
    "survey_id": 3,
    "contact_code": "AF-025",
    "detected_class": "OTHER_MAN_MADE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.513,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.476,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-025_crop.png",
    "detection": {
      "x": 362,
      "y": 470,
      "width": 125,
      "height": 74,
      "bbox_norm": [
        0.3535,
        0.5875,
        0.4756,
        0.68
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.45,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 208.4,
        "background_mean_intensity": 85.1
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 171,
        "shadow_length_m": 0.73,
        "shadow_to_highlight_ratio": 0.04,
        "estimated_height_m": 0.7
      },
      "texture": {
        "glcm_contrast": 19.91,
        "glcm_homogeneity": 0.387,
        "glcm_energy": 0.0083,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.73,
        "physical_width_m": 0.59,
        "aspect_ratio": 1.25,
        "compactness": 0.776,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.45x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.25, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 12.8173828125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Artificial benthic debris class: OTHER_MAN_MADE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 26,
    "survey_id": 3,
    "contact_code": "AF-026",
    "detected_class": "MINE_LIKE_OBJECT",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.522,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.51,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-026_crop.png",
    "detection": {
      "x": 311,
      "y": 501,
      "width": 144,
      "height": 70,
      "bbox_norm": [
        0.3037,
        0.6262,
        0.4443,
        0.7137
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.53,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 207.2,
        "background_mean_intensity": 81.8
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 66,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.01,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 22.23,
        "glcm_homogeneity": 0.331,
        "glcm_energy": 0.0068,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.785,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.53x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827774,
      "longitude": 80.2706335,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 18.896484375,
      "ground_range_m": 12.1,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: MINE_LIKE_OBJECT",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 27,
    "survey_id": 3,
    "contact_code": "AF-027",
    "detected_class": "CYLINDRICAL_OBJECT",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.495,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.769,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-027_crop.png",
    "detection": {
      "x": 379,
      "y": 504,
      "width": 154,
      "height": 68,
      "bbox_norm": [
        0.3701,
        0.63,
        0.5205,
        0.715
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.41,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 210.0,
        "background_mean_intensity": 87.2
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 402,
        "shadow_length_m": 1.76,
        "shadow_to_highlight_ratio": 0.07,
        "estimated_height_m": 1.57
      },
      "texture": {
        "glcm_contrast": 18.93,
        "glcm_homogeneity": 0.44,
        "glcm_energy": 0.0102,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 4.25,
        "physical_width_m": 0.44,
        "aspect_ratio": 9.67,
        "compactness": 0.248,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.41x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 9.67, convexity: 0.941) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0827822,
      "longitude": 80.2706265,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 8.203125,
      "ground_range_m": 13.0,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.58,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 28,
    "survey_id": 3,
    "contact_code": "AF-028",
    "detected_class": "SHIPWRECK",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.521,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.501,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-028_crop.png",
    "detection": {
      "x": 636,
      "y": 518,
      "width": 175,
      "height": 53,
      "bbox_norm": [
        0.6211,
        0.6475,
        0.792,
        0.7137
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.87,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 204.0,
        "background_mean_intensity": 71.2
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 84,
        "shadow_length_m": 0.0,
        "shadow_to_highlight_ratio": 0.02,
        "estimated_height_m": 0.0
      },
      "texture": {
        "glcm_contrast": 21.91,
        "glcm_homogeneity": 0.294,
        "glcm_energy": 0.0061,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.29,
        "aspect_ratio": 1.5,
        "compactness": 0.754,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (2.87x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.5, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0825739,
      "longitude": 80.2709318,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 30.9814453125,
      "ground_range_m": 27.4,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.55,
      "primary_reason": "Single-ping observation (needs follow-up verification) | High environmental/navigational impact class: SHIPWRECK",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.25,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  },
  {
    "id": 29,
    "survey_id": 3,
    "contact_code": "AF-029",
    "detected_class": "CYLINDRICAL_OBJECT",
    "acoustic_hypothesis": "CYLINDRICAL / LINEAR BODY",
    "operator_confirmed_class": null,
    "model_score": 2.527,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.789,
    "is_novel_anomaly": true,
    "priority_level": "REVIEW",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-029_crop.png",
    "detection": {
      "x": 510,
      "y": 538,
      "width": 121,
      "height": 62,
      "bbox_norm": [
        0.498,
        0.6725,
        0.6162,
        0.75
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 2.49,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 209.0,
        "background_mean_intensity": 84.0
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 264,
        "shadow_length_m": 4.25,
        "shadow_to_highlight_ratio": 0.06,
        "estimated_height_m": 3.29
      },
      "texture": {
        "glcm_contrast": 19.46,
        "glcm_homogeneity": 0.435,
        "glcm_energy": 0.0098,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 4.25,
        "physical_width_m": 0.44,
        "aspect_ratio": 9.67,
        "compactness": 0.198,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "CYLINDRICAL / LINEAR BODY",
      "evidence_bullets": [
        "Strong echo contrast (2.49x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 9.67, convexity: 0.831) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0826478,
      "longitude": 80.2708235,
      "position_uncertainty_m": 3.2,
      "geolocation_confidence": 0.92,
      "slant_range_m": 8.5693359375,
      "ground_range_m": 13.0,
      "sonar_side": "STARBOARD",
      "status_message": "Georeferenced to WGS-84 (\u00b13.2m estimated error)"
    },
    "priority": {
      "priority": "REVIEW",
      "composite_score": 0.58,
      "primary_reason": "Uncataloged acoustic anomaly \u2014 Flagged for mandatory analyst verification",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.22
      }
    },
    "recommendation": {
      "recommended_action": "Execute high-frequency (800-900 kHz) close-range inspection pass",
      "detailed_instruction": "Target displays an uncataloged acoustic signature. Switch side-scan sonar to high-frequency identification mode and run an offset line at 25m lateral distance to resolve micro-structural features.",
      "action_type": "HIGH_FREQUENCY_INSPECTION",
      "operational_rationale": "High-frequency acoustic imaging provides sub-centimeter range resolution necessary to resolve synthetic netting fibers, weld seams, or natural mineral stratification.",
      "urgency": "HIGH"
    }
  },
  {
    "id": 30,
    "survey_id": 3,
    "contact_code": "AF-030",
    "detected_class": "OTHER_MAN_MADE",
    "acoustic_hypothesis": "AMBIGUOUS ANOMALY",
    "operator_confirmed_class": null,
    "model_score": 2.494,
    "calibrated_confidence": 0.968,
    "calibration_status": "VALIDATED",
    "novelty_score": 0.565,
    "is_novel_anomaly": false,
    "priority_level": "MEDIUM",
    "review_status": "UNREVIEWED",
    "persistence_count": 1,
    "persistence_status": "SINGLE-PING CONTACT",
    "track_length_m": 0.0,
    "crop_path": "/artifacts/uploads/crops/survey_3/AF-030_crop.png",
    "detection": {
      "x": 221,
      "y": 546,
      "width": 142,
      "height": 80,
      "bbox_norm": [
        0.2158,
        0.6825,
        0.3545,
        0.7825
      ]
    },
    "fingerprint": {
      "intensity": {
        "echo_contrast": 3.07,
        "highlight_strength": "VERY HIGH",
        "target_mean_intensity": 203.9,
        "background_mean_intensity": 66.4
      },
      "shadow": {
        "shadow_signature": "WEAK",
        "shadow_area_px": 129,
        "shadow_length_m": 1.04,
        "shadow_to_highlight_ratio": 0.02,
        "estimated_height_m": 0.45
      },
      "texture": {
        "glcm_contrast": 22.59,
        "glcm_homogeneity": 0.289,
        "glcm_energy": 0.006,
        "glcm_entropy": 0.98,
        "texture_complexity": "HIGH"
      },
      "geometry": {
        "physical_length_m": 0.44,
        "physical_width_m": 0.44,
        "aspect_ratio": 1.0,
        "compactness": 0.785,
        "geometric_regularity": "HIGH"
      },
      "man_made_probability": 0.63,
      "acoustic_pattern": "AMBIGUOUS ANOMALY",
      "evidence_bullets": [
        "Strong echo contrast (3.07x ambient seabed) indicates highly reflective acoustic boundary",
        "Weak or partially occluded shadow signature",
        "High geometric regularity (aspect ratio: 1.0, convexity: 1.0) atypical of natural geology",
        "High texture variance indicates irregular, complex surface roughness"
      ]
    },
    "geolocation": {
      "has_metadata": true,
      "latitude": 13.0828633,
      "longitude": 80.2705076,
      "position_uncertainty_m": 3.1,
      "geolocation_confidence": 0.92,
      "slant_range_m": 32.2265625,
      "ground_range_m": 28.8,
      "sonar_side": "PORT",
      "status_message": "Georeferenced to WGS-84 (\u00b13.1m estimated error)"
    },
    "priority": {
      "priority": "MEDIUM",
      "composite_score": 0.48,
      "primary_reason": "Single-ping observation (needs follow-up verification) | Artificial benthic debris class: OTHER_MAN_MADE",
      "factors": {
        "acoustic_evidence_weight": 0.1,
        "persistence_weight": 0.08,
        "hazard_criticality_weight": 0.18,
        "novelty_verification_weight": 0.12
      }
    },
    "recommendation": {
      "recommended_action": "Collect an overlapping survey pass (30% swath overlap)",
      "detailed_instruction": "Contact was only observed on a single sonar ping. Execute an adjacent parallel trackline with 30-40% lateral overlap to confirm target persistence against transient fish schools or acoustic interference.",
      "action_type": "OVERLAPPING_PASS",
      "operational_rationale": "Validating multi-ping persistence eliminates transient false alarms and confirms benthic stationary contact.",
      "urgency": "MEDIUM"
    }
  }
];
