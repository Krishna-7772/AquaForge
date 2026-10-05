# AQUAFORGE Sonar Data Architecture

```
data/
├── raw/                  # Unprocessed incoming sonar logs & waterfall rasters
├── processed/            # TVG-corrected, despeckled, ground-range mapped tiles
├── sample/               # Curated sample tiles for quick validation
├── manifests/            # JSON manifests detailing sensor parameters and coordinates
├── SOURCES.md            # Complete academic and hydrographic citations
└── LICENSES.md           # Dataset licenses and copyright terms
```

## Dataset Preparation & Ingestion
To download and ingest public side-scan sonar datasets:

```bash
# Download sample fixtures from public sources
python scripts/download_public_data.py

# Preprocess and tile sonar waterfalls
python scripts/prepare_dataset.py
```
