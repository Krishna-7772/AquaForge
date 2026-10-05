import os
import json
import datetime
from pathlib import Path
from typing import Dict, Any, List
from backend.config import REPORTS_DIR, PROJECT_NAME, SIH_PROBLEM_ID, ORGANIZATION, THEME, TEAM_NAME, VERSION

class SurveyReportGenerator:
    """
    Generates hydrographic-grade inspection reports with full acoustic forensic profiles,
    calibrated confidences, geolocation uncertainty envelopes, and next-scan guidance.
    Strictly observes scientific honesty regarding automated screening limitations.
    """

    @classmethod
    def generate_html_report(
        cls,
        survey_data: Dict[str, Any],
        contacts: List[Dict[str, Any]],
        output_filename: str = None
    ) -> str:
        now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        survey_code = survey_data.get("survey_code", "AF-SURVEY")
        survey_name = survey_data.get("name", "Side-Scan Sonar Inspection")

        if not output_filename:
            output_filename = f"Report_{survey_code}_{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.html"

        out_path = REPORTS_DIR / output_filename

        # Metrics
        total_contacts = len(contacts)
        high_priority = [c for c in contacts if c.get("priority_level") == "HIGH"]
        novel_anomalies = [c for c in contacts if c.get("is_novel_anomaly")]
        reviewed_contacts = [c for c in contacts if c.get("review_status") != "UNREVIEWED"]
        georeferenced = [c for c in contacts if c.get("geolocation", {}).get("has_metadata")]

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{PROJECT_NAME} Survey Report - {survey_code}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700&display=swap');
  
  :root {{
    --navy-900: #0B192C;
    --navy-800: #1E3E62;
    --navy-700: #295F98;
    --sand-50: #F8F9FA;
    --sand-100: #E9ECEF;
    --border: #DEE2E6;
    --text-dark: #212529;
    --text-muted: #6C757D;
    --high-alert: #D90429;
    --med-alert: #F77F00;
    --low-alert: #2A9D8F;
    --review-alert: #7209B7;
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text-dark);
    background-color: var(--sand-50);
    line-height: 1.5;
    padding: 40px 20px;
  }}
  .container {{
    max-width: 1100px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border-radius: 4px;
    padding: 48px;
  }}
  .header {{
    border-bottom: 3px solid var(--navy-800);
    padding-bottom: 24px;
    margin-bottom: 32px;
  }}
  .header-top {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }}
  .brand-title {{
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: var(--navy-900);
  }}
  .brand-sub {{
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
    margin-top: 4px;
  }}
  .badge {{
    display: inline-block;
    padding: 4px 10px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .badge-high {{ background: #FFE5E5; color: var(--high-alert); border: 1px solid #FFA8A8; }}
  .badge-med {{ background: #FFF4E5; color: var(--med-alert); border: 1px solid #FFD8A8; }}
  .badge-low {{ background: #E6FCF5; color: var(--low-alert); border: 1px solid #96F2D7; }}
  .badge-review {{ background: #F3E8FF; color: var(--review-alert); border: 1px solid #D8B4FE; }}

  .meta-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    background: var(--sand-50);
    border: 1px solid var(--border);
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 32px;
  }}
  .meta-item {{
    font-size: 12px;
  }}
  .meta-label {{
    color: var(--text-muted);
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
  }}
  .meta-val {{
    font-weight: 600;
    color: var(--navy-900);
    margin-top: 2px;
    font-family: 'JetBrains Mono', monospace;
  }}

  h2 {{
    font-size: 18px;
    color: var(--navy-900);
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-top: 36px;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}

  .summary-cards {{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }}
  .card {{
    background: #FFFFFF;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 16px;
    text-align: center;
  }}
  .card-num {{
    font-size: 28px;
    font-weight: 700;
    color: var(--navy-800);
    font-family: 'JetBrains Mono', monospace;
  }}
  .card-lbl {{
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    margin-top: 4px;
    text-transform: uppercase;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    font-size: 13px;
  }}
  th {{
    background: var(--navy-900);
    color: #FFFFFF;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  td {{
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}
  tr:nth-child(even) {{
    background-color: var(--sand-50);
  }}
  .mono {{ font-family: 'JetBrains Mono', monospace; font-size: 12px; }}

  .contact-block {{
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 24px;
    padding: 20px;
    background: #FFFFFF;
  }}
  .contact-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
    margin-bottom: 16px;
  }}
  .contact-id {{
    font-size: 16px;
    font-weight: 700;
    color: var(--navy-900);
    font-family: 'JetBrains Mono', monospace;
  }}
  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }}
  .bullet-list {{
    list-style: none;
    padding: 0;
  }}
  .bullet-list li {{
    position: relative;
    padding-left: 18px;
    margin-bottom: 6px;
    font-size: 12px;
  }}
  .bullet-list li::before {{
    content: "•";
    position: absolute;
    left: 4px;
    color: var(--navy-700);
    font-weight: bold;
  }}

  .alert-box {{
    background: #EBF5FB;
    border-left: 4px solid var(--navy-700);
    padding: 14px 16px;
    font-size: 12px;
    color: #1A5276;
    margin: 24px 0;
  }}
  .footer {{
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
  }}
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <div class="header-top">
      <div>
        <div class="brand-title">{PROJECT_NAME}</div>
        <div class="brand-sub">National Institute of Ocean Technology (NIOT) &bull; Ministry of Earth Sciences (MoES) &bull; SIH26057</div>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-med">HYDROGRAPHIC SCREENING REPORT</span>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Generated: {now_str}</div>
      </div>
    </div>
  </div>

  <!-- Operational Context Notice -->
  <div class="alert-box">
    <strong>OPERATIONAL PRINCIPLE:</strong> Automated screening identified candidate contacts for human review.
    This report provides acoustic forensic evidence, calibrated confidence, multi-ping persistence, and diagnostic next-scan recommendations.
    Final clearance or physical intervention requires operator review and validation.
  </div>

  <!-- Survey Metadata Grid -->
  <div class="meta-grid">
    <div class="meta-item">
      <div class="meta-label">Survey Identifier</div>
      <div class="meta-val">{survey_code}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Survey Name</div>
      <div class="meta-val">{survey_name}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Vessel / Platform</div>
      <div class="meta-val">{survey_data.get('vessel_name', 'RV Sagarkanya / AUV')}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Acoustic Sensor</div>
      <div class="meta-val">{survey_data.get('sensor_model', 'Dual-Freq SSS')} ({survey_data.get('frequency_khz', 410.0)} kHz)</div>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-num">{total_contacts}</div>
      <div class="card-lbl">Total Contacts</div>
    </div>
    <div class="card">
      <div class="card-num" style="color: var(--high-alert);">{len(high_priority)}</div>
      <div class="card-lbl">High Priority</div>
    </div>
    <div class="card">
      <div class="card-num" style="color: var(--review-alert);">{len(novel_anomalies)}</div>
      <div class="card-lbl">Unknown / Novel</div>
    </div>
    <div class="card">
      <div class="card-num" style="color: var(--low-alert);">{len(georeferenced)}</div>
      <div class="card-lbl">Georeferenced</div>
    </div>
    <div class="card">
      <div class="card-num">{len(reviewed_contacts)}</div>
      <div class="card-lbl">Reviewed</div>
    </div>
  </div>

  <!-- Section: Contact Inventory Table -->
  <h2>1. Candidate Contact Summary Inventory</h2>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Detected Class</th>
        <th>Acoustic Hypothesis</th>
        <th>Model Score</th>
        <th>Calibrated</th>
        <th>Persistence</th>
        <th>Priority</th>
        <th>Coordinates</th>
        <th>Review Status</th>
      </tr>
    </thead>
    <tbody>"""

        for c in contacts:
            cid = c.get("contact_code", "")
            cls_name = c.get("detected_class", "UNKNOWN")
            hyp = c.get("acoustic_hypothesis", "")
            raw_s = c.get("model_score", 0.0)
            cal_s = c.get("calibrated_confidence", 0.0)
            cal_stat = c.get("calibration_status", "")
            p_status = c.get("persistence_status", "SINGLE-PING")
            p_count = c.get("persistence_count", 1)
            p_lvl = c.get("priority_level", "REVIEW")
            r_stat = c.get("review_status", "UNREVIEWED")

            geo = c.get("geolocation", {})
            if geo.get("has_metadata") and geo.get("latitude") is not None:
                coord_str = f"{geo['latitude']:.5f}N, {geo['longitude']:.5f}E (±{geo.get('position_uncertainty_m', '')}m)"
            else:
                coord_str = "<span style='color:#A0AEC0'>No Nav Metadata</span>"

            badge_cls = "badge-high" if p_lvl == "HIGH" else ("badge-med" if p_lvl == "MEDIUM" else ("badge-low" if p_lvl == "LOW" else "badge-review"))

            html += f"""
      <tr>
        <td class="mono"><strong>{cid}</strong></td>
        <td>{cls_name}</td>
        <td style="font-size: 11px;">{hyp}</td>
        <td class="mono">{raw_s:.2f}</td>
        <td class="mono">{cal_s:.2f} <span style="font-size: 9px; color: var(--text-muted);">({cal_stat})</span></td>
        <td style="font-size: 11px;">{p_count} pings</td>
        <td><span class="badge {badge_cls}">{p_lvl}</span></td>
        <td class="mono" style="font-size: 11px;">{coord_str}</td>
        <td style="font-weight: 600; font-size: 11px;">{r_stat}</td>
      </tr>"""

        html += f"""
    </tbody>
  </table>

  <!-- Section: Detailed Acoustic Forensic Profiles -->
  <h2>2. Detailed Acoustic Forensic Evidence & Recommendations</h2>"""

        for c in contacts:
            cid = c.get("contact_code", "")
            cls_name = c.get("detected_class", "UNKNOWN")
            hyp = c.get("acoustic_hypothesis", "")
            p_lvl = c.get("priority_level", "REVIEW")
            fp = c.get("fingerprint", {})
            geo = c.get("geolocation", {})
            rec = c.get("recommendation", {})
            rev = c.get("reviews", [])
            bullets = fp.get("evidence_bullets", [])

            html += f"""
  <div class="contact-block">
    <div class="contact-header">
      <div>
        <span class="contact-id">{cid} &bull; {cls_name}</span>
        <span style="margin-left: 12px; font-size: 12px; color: var(--text-muted);">Acoustic Pattern: <strong>{hyp}</strong></span>
      </div>
      <div>
        <span class="badge {'badge-high' if p_lvl == 'HIGH' else ('badge-med' if p_lvl == 'MEDIUM' else 'badge-review')}">{p_lvl} PRIORITY</span>
      </div>
    </div>

    <div class="grid-2">
      <!-- Evidence Bullets -->
      <div>
        <div style="font-weight: 600; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: var(--navy-800);">Acoustic Forensics ("Why Flagged")</div>
        <ul class="bullet-list">"""
            for b in bullets:
                html += f"<li>{b}</li>"

            if not bullets:
                html += "<li>Standard acoustic profile evaluation</li>"

            html += f"""
        </ul>
        <div style="margin-top: 12px; font-size: 11px; color: var(--text-muted);">
          Echo Contrast: <strong>{fp.get('intensity', {}).get('echo_contrast', 'N/A')}x</strong> | 
          Shadow Signature: <strong>{fp.get('shadow', {}).get('shadow_signature', 'N/A')}</strong> | 
          Relief Height: <strong>~{fp.get('shadow', {}).get('estimated_height_m', 0.0)}m</strong>
        </div>
      </div>

      <!-- Action Recommendation & Review -->
      <div style="background: var(--sand-50); padding: 14px; border: 1px solid var(--border); border-radius: 4px;">
        <div style="font-weight: 600; font-size: 11px; text-transform: uppercase; color: var(--navy-700); margin-bottom: 4px;">Recommended Next Hydrographic Action</div>
        <div style="font-weight: 700; font-size: 13px; color: var(--navy-900);">{rec.get('recommended_action', 'Continue standard pass')}</div>
        <p style="font-size: 11px; color: var(--text-dark); margin-top: 6px; line-height: 1.4;">{rec.get('detailed_instruction', '')}</p>
        
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px;">
          <strong>Operator Confirmation:</strong> {c.get('operator_confirmed_class') or 'Pending Analyst Review'} 
          <span style="color: var(--text-muted);">({c.get('review_status')})</span>
        </div>
      </div>
    </div>
  </div>"""

        html += f"""
  <!-- Section: Scientific Honesty & System Limitations -->
  <h2>3. System Limitations & Scientific Governance</h2>
  <div style="font-size: 12px; color: var(--text-dark); line-height: 1.6;">
    <p><strong>Sensor and Domain Generalization:</strong> Side-scan sonar acoustic backscatter varies significantly based on transducer carrier frequency (e.g. 100 kHz vs 900 kHz), grazing angle, thermal thermoclines, seabed sediment composition (sand ripples vs silt vs exposed bedrock), and vehicle motion (heave, pitch, roll). Automated inferences must be interpreted in domain context.</p>
    <p style="margin-top: 8px;"><strong>Acoustic vs Metallurgical Distinction:</strong> Highlight contrast and shadow length yield geometrical and structural hypotheses (e.g. 'man-made candidate', 'cylindrical body'). Acoustic data alone cannot verify chemical material composition (e.g. steel vs fiberglass vs dense rock).</p>
    <p style="margin-top: 8px;"><strong>Navigation Dependency:</strong> Geodetic positioning accuracy is directly constrained by the surface GNSS receiver, USBL acoustic beacon precision, and heading compass accuracy. Uncertainty error bounds (±&epsilon; meters) are strictly reported for all georeferenced contacts.</p>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>AQUAFORGE Hydrographic System v{VERSION} &bull; Team PRAYAS &bull; SIH26057</div>
    <div>Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)</div>
  </div>

</div>
</body>
</html>"""

        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)

        return str(out_path)
