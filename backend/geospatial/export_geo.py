import json
import csv
import io
from typing import List, Dict, Any

def export_to_geojson(contacts: List[Dict[str, Any]], survey_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Exports georeferenced contacts into standard RFC 7946 GeoJSON FeatureCollection.
    """
    features = []
    for c in contacts:
        geo = c.get("geolocation", {})
        lat = geo.get("latitude")
        lon = geo.get("longitude")

        if lat is None or lon is None:
            continue

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]  # GeoJSON is [longitude, latitude]
            },
            "properties": {
                "contact_id": c.get("contact_code"),
                "detected_class": c.get("detected_class"),
                "acoustic_hypothesis": c.get("acoustic_hypothesis"),
                "operator_confirmed_class": c.get("operator_confirmed_class"),
                "model_score": c.get("model_score"),
                "calibrated_confidence": c.get("calibrated_confidence"),
                "calibration_status": c.get("calibration_status"),
                "priority_level": c.get("priority_level"),
                "review_status": c.get("review_status"),
                "position_uncertainty_m": geo.get("position_uncertainty_m"),
                "slant_range_m": geo.get("slant_range_m"),
                "sonar_side": geo.get("sonar_side"),
                "persistence_count": c.get("persistence_count"),
                "novelty_score": c.get("novelty_score"),
                "recommended_action": c.get("recommendation", {}).get("recommended_action")
            }
        }
        features.append(feature)

    return {
        "type": "FeatureCollection",
        "metadata": survey_metadata or {},
        "features": features
    }

def export_to_csv(contacts: List[Dict[str, Any]]) -> str:
    """
    Exports contacts into CSV format for hydrographic and spreadsheet analysis.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "contact_id",
        "detected_class",
        "acoustic_hypothesis",
        "operator_confirmed_class",
        "model_score",
        "calibrated_confidence",
        "calibration_status",
        "priority_level",
        "review_status",
        "persistence_count",
        "novelty_score",
        "latitude",
        "longitude",
        "position_uncertainty_m",
        "slant_range_m",
        "sonar_side",
        "estimated_height_m",
        "recommended_action"
    ])

    for c in contacts:
        geo = c.get("geolocation", {})
        fp = c.get("fingerprint", {})
        rec = c.get("recommendation", {})

        writer.writerow([
            c.get("contact_code", ""),
            c.get("detected_class", ""),
            c.get("acoustic_hypothesis", ""),
            c.get("operator_confirmed_class", ""),
            c.get("model_score", 0.0),
            c.get("calibrated_confidence", 0.0),
            c.get("calibration_status", ""),
            c.get("priority_level", ""),
            c.get("review_status", ""),
            c.get("persistence_count", 1),
            c.get("novelty_score", 0.0),
            geo.get("latitude", ""),
            geo.get("longitude", ""),
            geo.get("position_uncertainty_m", ""),
            geo.get("slant_range_m", ""),
            geo.get("sonar_side", ""),
            fp.get("shadow", {}).get("estimated_height_m", 0.0),
            rec.get("recommended_action", "")
        ])

    return output.getvalue()

def export_to_kml(contacts: List[Dict[str, Any]], survey_name: str = "AQUAFORGE Survey") -> str:
    """
    Exports georeferenced contacts into Google Earth / GIS KML document.
    """
    kml = ['<?xml version="1.0" encoding="UTF-8"?>']
    kml.append('<kml xmlns="http://www.opengis.net/kml/2.2">')
    kml.append('  <Document>')
    kml.append(f'    <name>{survey_name}</name>')
    kml.append('    <description>AQUAFORGE Acoustic Contacts Export</description>')

    for c in contacts:
        geo = c.get("geolocation", {})
        lat = geo.get("latitude")
        lon = geo.get("longitude")
        if lat is None or lon is None:
            continue

        cid = c.get("contact_code", "AF-CONTACT")
        cls_name = c.get("detected_class", "UNKNOWN")
        priority = c.get("priority_level", "REVIEW")
        score = c.get("calibrated_confidence", 0.0)

        kml.append('    <Placemark>')
        kml.append(f'      <name>{cid}: {cls_name} ({priority})</name>')
        kml.append('      <description><![CDATA[')
        kml.append(f'        <b>Class:</b> {cls_name}<br/>')
        kml.append(f'        <b>Confidence:</b> {score}<br/>')
        kml.append(f'        <b>Priority:</b> {priority}<br/>')
        kml.append(f'        <b>Acoustic Hypothesis:</b> {c.get("acoustic_hypothesis", "")}<br/>')
        kml.append(f'        <b>Uncertainty:</b> ±{geo.get("position_uncertainty_m", "")}m<br/>')
        kml.append('      ]]></description>')
        kml.append('      <Point>')
        kml.append(f'        <coordinates>{lon},{lat},0</coordinates>')
        kml.append('      </Point>')
        kml.append('    </Placemark>')

    kml.append('  </Document>')
    kml.append('</kml>')
    return '\n'.join(kml)
