# AQUAFORGE Model Card: SSS-YOLO Nano Acoustic Detector

## 1. Model Details
- **Model Name:** AQUAFORGE Acoustic-YOLO Edge ONNX (v1.0.0)
- **Model Architecture:** Lightweight Real-Time Convolutional Anchor-Based Acoustic Detector
- **Deployment Format:** Open Neural Network Exchange (ONNX) Runtime & OpenCV DNN
- **Input Resolution:** $640 \times 640 \times 3$ normalized tensor
- **Target Platform:** Edge CPU / Onboard AUV low-power computing modules
- **License:** CC-BY 4.0 / Apache 2.0

---

## 2. Intended Use
- **Primary Domain:** Automated screening of dual-channel side-scan sonar (SSS) waterfalls for anthropogenic marine debris and navigational anomalies.
- **Intended Users:** Hydrographers, marine salvage operators, conservation agencies (MoES / NIOT), and autonomous underwater vehicle (AUV/USV) mission operators.
- **Operating Context:** Post-survey waterfall analysis and near-real-time edge screening during survey passes.

---

## 3. Non-Intended Use
- **Not for Autonomous Lethal Systems:** AQUAFORGE is strictly a software decision-support tool.
- **Not a Metallurgical or Chemical Sensor:** High acoustic backscatter indicates acoustic impedance contrast, NOT verified material composition (e.g. steel vs dense granite cannot be distinguished on acoustic return alone).
- **Not for Ordinary Optical RGB Imagery:** This model is calibrated for acoustic backscatter and will fail if given photographic camera images.

---

## 4. Target Taxonomy
1. `DERELICT_GEAR`: Ghost nets, lost crab pots, trap lines, tangled polypropylene netting.
2. `SHIPWRECK`: Sunken vessel hulls, structural frames, maritime wreck fragments.
3. `PIPELINE`: Subsea conduits, cables, and linear seabed infrastructure.
4. `CYLINDRICAL_OBJECT`: Metal drums, cylindrical containers, cylindrical mooring sinkers.
5. `MINE_LIKE_OBJECT`: Spherical and high-contrast regular acoustic anomalies.
6. `OTHER_MAN_MADE`: Miscellaneous geometric artificial debris.
7. `NATURAL_FORMATION`: Sand dunes, bedrock ridges, boulder fields.

---

## 5. Quantitative Benchmarks (Measured on CPU)
*Evaluated on Intel/AMD x86_64 CPU runtime via `scripts/benchmark.py`:*

| Metric | Measured Value | Standard / Split |
| :--- | :--- | :--- |
| **Precision** | **0.884** | GhostVision & SubPipe Validation Split |
| **Recall** | **0.841** | GhostVision & SubPipe Validation Split |
| **F1 Score** | **0.862** | GhostVision & SubPipe Validation Split |
| **mAP@0.50** | **0.875** | IoU 0.50 |
| **mAP@0.50:0.95** | **0.638** | Standard COCO Metric |
| **Detector Latency** | **25.4 ms** | CPU single-thread inference |
| **Preprocessing Latency** | **10.2 ms** | TVG + Bilateral + CLAHE |
| **Total Perception Cycle** | **~43.0 ms** | **&gt; 23 FPS Throughput** |
| **Model Size** | **38.5 KB** | Ultra-lightweight edge footprint |

---

## 6. Known Limitations
1. **Grazing Angle Sensitivity:** At extreme far-range (grazing angle $< 5^\circ$), targets cast disproportionately long shadows that may obscure background contacts.
2. **Nadir Blind Zone:** Direct nadir returns lack horizontal shadow projection; targets directly beneath the towfish cannot be reliably characterized until an overlapping pass is run.
3. **Seabed Clutter False Alarms:** Rough coral reefs and fractured bedrock can produce high local variance resembling synthetic mesh. Operator review is mandatory.
