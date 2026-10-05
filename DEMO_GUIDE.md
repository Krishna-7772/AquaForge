# AQUAFORGE Demonstration & Evaluator Guide

Welcome to **AQUAFORGE** — AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery (SIH26057 &bull; MoES / NIOT &bull; Team PRAYAS).

---

## 1. Quick Start Demonstration

### Method A: Single-Click UI Demo
1. Open the application in your browser (e.g., `http://localhost:8000`).
2. On the Dashboard, click the green button: **"RUN DEMO SURVEY"**.
3. Watch the real multi-step pipeline execute live with progress percentages:
   - Ingestion & Ping Headers ($10\%$)
   - Sonar Preprocessing with TVG & CLAHE ($30\%$)
   - Neural Detection & Acoustic Saliency ($50\%$)
   - Acoustic Forensic Profiling & GLCM ($70\%$)
   - Persistence Tracking & Geodesic Projection ($85\%$)
   - Hydrographic Report & GIS Exports ($100\%$)
4. The application will automatically open the **Survey Workspace** upon completion!

### Method B: Terminal Command Demo
```bash
python scripts/run_demo.py
```
This executes the exact same underlying pipeline services and outputs the completed summary JSON and report path.

---

## 2. Key Demo Scenarios to Inspect

### Scenario 1: High-Confidence Derelict Fishing Gear (Ghost Net)
- **Select Contact:** `AF-001` or `AF-002` (Starboard Channel)
- **Detected Class:** `DERELICT_GEAR`
- **Acoustic Pattern:** `ENTANGLED / DERELICT MESH`
- **Evidence Profile:**
  - High echo contrast ($> 2.0\text{x}$ ambient seabed)
  - Pronounced acoustic shadow ($40\text{m}$ length, $\sim 1.8\text{m}$ relief height)
  - 2D Spatial Frequency reveals periodic netting mesh structure
  - Multi-ping persistence verified across 3 pings
- **Priority:** `HIGH`
- **Recommended Action:** Nominate for optical confirmation via ROV or diver recovery.

### Scenario 2: Large Shipwreck Hull Section
- **Select Contact:** `AF-003` (Starboard Channel)
- **Detected Class:** `SHIPWRECK`
- **Acoustic Pattern:** `MAN-MADE CANDIDATE`
- **Evidence Profile:**
  - Enormous rectilinear body with strong trailing shadow ($65\text{m}$ length)
  - High geometric regularity (aspect ratio $2.0$, high convexity)
- **Priority:** `HIGH`

### Scenario 3: Subsea Pipeline Conduit
- **Select Contact:** `AF-004` (Port Channel)
- **Detected Class:** `PIPELINE`
- **Acoustic Pattern:** `CYLINDRICAL / LINEAR BODY`
- **Evidence Profile:**
  - Elongated continuous body (aspect ratio $> 3.5$)
- **Recommended Action:** Perform orthogonal crossing pass ($90^\circ$ to target axis) to evaluate burial depth.

### Scenario 4: Out-of-Distribution Novel Acoustic Anomaly
- **Select Contact:** High Novelty Contact (Port Channel)
- **Acoustic Hypothesis:** `UNKNOWN ANOMALY`
- **Novelty Meter:** $> 0.70$ (Standard deviations distance $> 2.4$)
- **Recommended Action:** Execute high-frequency ($800\text{ kHz}$) close-range inspection pass.

---

## 3. Human-in-the-Loop Analyst Review
1. In the Center Pane of the workspace, scroll to **"Human-in-the-Loop Analyst Verification"**.
2. Click **"Accept Detection"** or select **"Reclassify"** from the dropdown and click **"Reclassify"**.
3. Notice that the operator decision updates immediately, while the original neural detection is immutably preserved.

---

## 4. GIS Mapping & Exports
1. Click the **"GIS Map"** tab in the top navigation bar.
2. Inspect the plotted contacts on the OpenStreetMap basemap off the Chennai coastal waters.
3. Observe the dotted uncertainty error circles ($\pm \epsilon\text{ m}$) reflecting sensor uncertainty.
4. Click **"Official Report (HTML)"** in the top-right toolbar to open the hydrographic report in a new tab.
