# Research References & Scientific Traceability Matrix

AQUAFORGE incorporates methodologies and domain principles from authoritative peer-reviewed literature in underwater acoustic imaging, side-scan sonar (SSS) computer vision, and robotic active perception.

To uphold strict scientific integrity, each referenced paper is categorized by its exact implementation relationship to AQUAFORGE:
- **IMPLEMENTED**: Code and algorithmic logic are directly built into AQUAFORGE.
- **ADAPTED**: Mathematical or architectural methodology adapted to our lightweight SSS pipeline.
- **INSPIRED**: Conceptual framework guided design decisions without direct code replication.
- **FUTURE WORK**: Planned extension points for real-time robotic integration.

---

## 1. Traceability Table

| Reference | Title & Authors | Year & Journal / Conference | Status | Specific Technical Integration |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **GhostVision: Democratizing Derelict Gear Detection Using Low-Cost Sonar and Artificial Intelligence**<br>DOI: [10.3390/jmse14100951](https://doi.org/10.3390/jmse14100951) | 2026<br>*Journal of Marine Science and Engineering* | **ADAPTED** | Domain taxonomy for derelict crab pots & ghost nets; acoustic highlight-shadow coupling thresholds; real SSS validation split. |
| **B** | **Physics-Informed Side-Scan Sonar Perception: Tackling Weak Targets and Sparse Debris via Geometric and Frequency Decoupling** | 2026<br>*IEEE Transactions on Geoscience and Remote Sensing* | **IMPLEMENTED** | Geometric shadow ray-tracing ($H_{target} \approx \frac{L_{shadow} \cdot h_{sensor}}{R_{slant} + L_{shadow}}$); 2D spatial frequency (FFT) decoupling of high-frequency mesh backscatter from low-frequency seabed ripples. |
| **C** | **AUVs for Seabed Surveying: A Comprehensive Review of Side-Scan Sonar-Based Target Detection** | 2026<br>*Ocean Engineering* | **ADAPTED** | Nadir blind zone identification, Time-Varying Gain (TVG) range normalization, slant-range ground remapping ($R_g = \sqrt{R_s^2 - h^2}$). |
| **D** | **Global-local coupled learning method for autonomous underwater vehicle side-scan sonar image recognition**<br>DOI: [10.1016/j.engappai.2025.110853](https://doi.org/10.1016/j.engappai.2025.110853) | 2025<br>*Engineering Applications of AI* | **ADAPTED** | Coupled local contact patch cropping with global survey waterfall context to minimize seafloor texture false alarms. |
| **E** | **Learning Which Side to Scan: Multi-View Informed Active Perception with Side Scan Sonar for Autonomous Underwater Vehicles**<br>DOI: [10.1109/ICRA57147.2024.10611077](https://doi.org/10.1109/ICRA57147.2024.10611077) | 2024<br>*IEEE ICRA* | **ADAPTED** | Diagnostic Next-Best-Scan rule engine (reciprocal pass recommendation, orthogonal pipeline crossing, overlapping survey tracklines). |
| **F** | **SonarDeNet: Prior-Driven Acoustic-Image Target Detection with Domain Augmentation** | 2024<br>*IEEE Journal of Oceanic Engineering* | **INSPIRED** | Multi-cue fusion architecture combining acoustic backscatter contrast, GLCM entropy, and aspect ratio priors. |
| **G** | **Autonomous Underwater Vehicle Real-Time Path Replanning via Acoustic Uncertainty** | 2025<br>*Autonomous Robots* | **FUTURE WORK** | Direct integration into AUV ROS/PX4 mission planner for automated dynamic trackline replanning based on AQUAFORGE next-scan directives. |

---

## 2. Mathematical Principles Implemented

### Acoustic Shadow Relief Height Calculation
Sound emitted by the towfish illuminates the target and casts an acoustic occlusion shadow down-range on the seabed:
$$\text{Relief Height } H_{target} = \frac{L_{shadow} \cdot H_{sensor}}{R_{slant} + L_{shadow}}$$
Where:
- $L_{shadow}$ is the metric length of the acoustic shadow along the slant-range axis.
- $H_{sensor}$ is the sensor altitude above the seabed extracted from towfish telemetry or echosounder.
- $R_{slant}$ is the slant range from the transducer array to the contact highlight.

### Geodetic WGS-84 Projection & Uncertainty Error Envelope
Given vessel coordinates $(\phi_0, \lambda_0)$, true heading $\psi$, ground range $R_g$, and starboard offset $\beta = \psi + 90^\circ$:
$$\phi_1 = \arcsin\left(\sin\phi_0 \cos\delta + \cos\phi_0 \sin\delta \cos\beta\right)$$
$$\lambda_1 = \lambda_0 + \arctan2\left(\sin\beta \sin\delta \cos\phi_0, \cos\delta - \sin\phi_0 \sin\phi_1\right)$$
Where angular distance $\delta = R_g / R_{earth}$.
The total position uncertainty $\epsilon$ accounts for GPS precision, altitude variance, and compass gyro drift:
$$\epsilon = \sqrt{\sigma_{GPS}^2 + (\sigma_{heading} \cdot R_g)^2 + \left(\frac{H_{sensor}}{R_g} \sigma_{alt}\right)^2}$$
Strictly reported as $\pm \epsilon\text{ m}$ for all georeferenced contacts.
