# AQUAFORGE System Limitations & Scientific Constraints

AQUAFORGE is designed with scientific honesty as its cornerstone. This document outlines the explicit technical, physical, and environmental constraints of automated side-scan sonar perception.

---

## 1. Domain Shift & Acoustic Frequency Dependence
Side-scan sonar imagery differs fundamentally by sensor frequency, beamwidth, and acoustic pulse duration:
- **High-Frequency (400–900 kHz):** Yields crisp, photographic-like shadow resolution suitable for resolving individual netting mesh strands or pipe flanges, but has limited operational swath range (typically 50–75m per channel).
- **Low-Frequency (100–300 kHz):** Maximizes survey area coverage (150–300m per channel) but produces coarse pixels where a small crab pot or tangled net cannot cast a distinct shadow.
- **Limitation:** Models trained on high-frequency imagery will experience performance degradation when deployed on low-frequency survey lines without domain adaptation.

---

## 2. Scientific Material Classification Constraints
**Acoustic returns do NOT provide chemical or metallurgical verification.**
- High echo backscatter indicates high acoustic impedance contrast relative to seawater and sediment.
- A smooth, dense granite boulder and a flat steel plate can produce nearly identical acoustic highlight intensities.
- **AQUAFORGE Guarantee:** The system categorizes contacts as `Acoustic Hypothesis: MAN-MADE CANDIDATE` or `DIFFUSE-NATURAL`, strictly rejecting misleading claims such as *"Material is 98% steel."*

---

## 3. Geolocation Telemetry Dependency
Acoustic contact georeferencing is fundamentally an indirect calculation dependent on navigation telemetry:
- Towfish coordinates are calculated from surface GPS, tow cable layback, USBL acoustic positioning beacons, and towfish attitude sensors (heading, roll, pitch).
- **Limitation:** If navigation telemetry is missing or desynchronized, contact coordinates cannot be determined. In these cases, AQUAFORGE displays:
  > *"Geolocation unavailable — navigation metadata not provided in sonar file."*
- When coordinates are available, AQUAFORGE strictly accompanies every position with a computed uncertainty envelope (e.g. $\pm 7.5\text{ m}$).

---

## 4. Nadir Zone Acoustic Physics
Directly beneath the sonar towfish is the nadir water column blind zone:
- Acoustic waves hit the seafloor at near-normal incidence ($90^\circ$).
- Protruding objects directly under the vehicle do not project horizontal acoustic shadows across the seafloor.
- Without an acoustic shadow, 3D target relief height cannot be estimated from nadir pings alone.
- **Recommendation:** An overlapping survey pass (at least 30–40% swath overlap) is operationally required to illuminate the nadir trackline from the side.

---

## 5. Uncataloged Debris & Novel Contacts
No supervised dataset can capture the infinite morphological variety of ocean debris (lost shipping containers, dumped machinery, aircraft debris, unexploded ordnance):
- To prevent forcing novel objects into incorrect known classes, AQUAFORGE uses an acoustic novelty detector.
- Contacts that deviate significantly in feature space from nominal classes are labeled `UNKNOWN / NOVEL CONTACT` with priority `REVIEW`.

---

## 6. Synthetic Demo Fixture Transparency
Demo surveys provided in the repository and application are synthetic acoustic backscatter simulations engineered from hydrographic ray-tracing equations.
- They are clearly watermarked as `DEMO DATA — NOT A LIVE MARINE SURVEY`.
- They demonstrate pipeline execution under controlled test conditions and must not be cited as real marine survey field results from NIOT.
