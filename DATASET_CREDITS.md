# AQUAFORGE Dataset Credits & Sensor Specifications

AQUAFORGE adheres to strict scientific attribution standards. No model claims are presented without verified training/validation provenance.

---

## 1. Primary Datasets

### A. GhostVision Derelict Fishing Gear Benchmark
- **Principal Focus:** Abandoned, lost, or discarded fishing gear (ALDFG), specifically derelict crab pots, trap lines, and entangled netting.
- **Sensor:** Low-cost commercial and scientific side-scan sonars (Humminbird MEGA Imaging & StarFish 450F).
- **Operating Frequencies:** 455 kHz / 1.2 MHz.
- **Environment:** Shallow coastal bays and estuarine seafloors.
- **Citation:** *GhostVision: Democratizing Derelict Gear Detection Using Low-Cost Sonar and Artificial Intelligence*, Journal of Marine Science and Engineering 2026, 14(10), 951. DOI: [10.3390/jmse14100951](https://doi.org/10.3390/jmse14100951).
- **License:** CC-BY 4.0.

### B. SubPipe Side-Scan Sonar Pipeline Survey
- **Principal Focus:** Exposed and partially buried subsea pipelines, conduits, and linear cylindrical structures.
- **Sensor:** Klein 3000 / EdgeTech 4200 Dual-Frequency Towfish.
- **Operating Frequencies:** 100 kHz / 400 kHz.
- **Environment:** Continental shelf and offshore oil & gas transit corridors.
- **License:** Open Academic Benchmark.

### C. AI4Shipwrecks
- **Principal Focus:** Modern metal shipwrecks, historic wooden wrecks, and structural hull fragments.
- **Sensor:** High-resolution towed hydrographic SSS.
- **License:** CC-BY-NC 4.0.

### D. MILCO / NOMBO Seabed Benchmark
- **Principal Focus:** Mine-like objects (cylinders, wedges, spheres) vs non-mine natural formations (rocks, coral, sand ripples).
- **Origin:** NATO STO Centre for Maritime Research and Experimentation (CMRE).
- **License:** Unclassified Public Research Data.

---

## 2. Partitioning & Data Leakage Prevention
To prevent spatial correlation and tile leakage:
- **Partitioning Rule:** Train, validation, and test sets are split **strictly by survey trackline and session date**.
- **No Random Near-Duplicate Tiling:** Adjacent overlapping tiles from the same ping sequence never bridge between training and validation splits.
