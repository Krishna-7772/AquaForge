# AQUAFORGE Sonar Data Sources & Scientific Provenance

| Dataset Identifier | Domain | Sensor / Platform | License | Original Reference / DOI | Primary Classes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GhostVision** | Derelict Fishing Gear (Ghost Nets & Crab Pots) | Low-Cost Commercial SSS / USV | CC-BY 4.0 | *Democratizing Derelict Gear Detection Using Low-Cost Sonar and AI*, JMSE 2026, DOI: [10.3390/jmse14100951](https://doi.org/10.3390/jmse14100951) | `DERELICT_GEAR`, `CRAB_POT` |
| **SubPipe** | Subsea Pipelines & Conduits | Klein 3000 / Edgetech SSS | Academic Open Data | *Subsea Pipeline Inspection using Deep Learning*, IEEE OES | `PIPELINE`, `CYLINDRICAL_OBJECT` |
| **AI4Shipwrecks** | Historic & Modern Shipwrecks | High-Resolution Towfish SSS | CC-BY-NC 4.0 | *Automated Shipwreck Detection from Hydrographic Sonar Logs*, Hydrographic Journal | `SHIPWRECK`, `HULL_SECTION` |
| **MILCO / NOMBO** | Mine-Like & Non-Mine Seabed Contacts | High-Frequency Dual Sonar | Open Benchmark | NATO STO / NURC Seabed Object Benchmark | `MINE_LIKE_OBJECT`, `NATURAL_FORMATION` |
| **MoES / NIOT Benchmark** | Indian Coastal Waters (Chennai/Bay of Bengal) | Dual-Frequency 100/410 kHz Towfish | Official SIH26057 Reference | National Institute of Ocean Technology (NIOT) | `BENTHIC_DEBRIS`, `MAN_MADE` |

## Strict Data Ethics & Governance Rules
1. **No RGB Photo Conflation**: Ordinary underwater optical photographs are never conflated with acoustic side-scan sonar imagery.
2. **Metadata Integrity**: Slant range, sensor altitude, vehicle heading, and WGS-84 coordinates are preserved without fabrication.
3. **Survey Separation**: Train, validation, and test splits are strictly partitioned by survey mission / trackline, never by random sub-tile sampling, preventing spatial data leakage.
