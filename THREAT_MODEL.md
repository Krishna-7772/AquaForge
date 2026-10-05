# AQUAFORGE Threat & Safety Model

This document identifies operational threats, potential attack surfaces, and implemented security mitigations for the AQUAFORGE acoustic perception system.

---

## 1. Threat Identification & Mitigation Matrix

| Threat Category | Attack Vector | Potential Impact | Implemented Mitigation |
| :--- | :--- | :--- | :--- |
| **Malicious File Upload** | Attacker uploads executable, polyglot file, or oversized raster | Remote Code Execution (RCE) / Buffer Overflow | Strict MIME type validation; file extension whitelist (`.png`, `.jpg`, `.tif`, `.xtf`, `.jsf`); safe OpenCV decoding; file size limit (100 MB). **Uploaded binaries are NEVER executed.** |
| **Path Traversal** | Filename containing `../../` or Windows volume specifiers | Arbitrary file write / system file overwrite | Filenames sanitized using `os.path.basename()`; files written strictly into isolated `artifacts/uploads/` directory. |
| **Resource Exhaustion (DoS)** | Giant image dimension bomb (e.g. $65536 \times 65536$ decompression bomb) | System memory starvation / Crash | Pre-allocation dimension checks: images exceeding $8192 \times 8192$ px are rejected before full tensor processing. |
| **Corrupt / Malicious Sonar Log** | Crafting malformed XTF or JSF binary packet headers | Parser buffer overflow / Infinite loop | Binary parsers strictly enforce packet boundary checks, bounded loop iterations (max 50 pings scanned per probe), and graceful exception isolation. |
| **Malicious Metadata Injection** | Forged GPS coordinates (e.g. NaN, latitude $> 90^\circ$, script injection in strings) | XSS in reports / DB corruption / Geodetic errors | Geodesic coordinate bounds checking ($-90 \le \phi \le 90$, $-180 \le \lambda \le 180$); Pydantic type validation; HTML entity escaping in report generator. |
| **SSRF (Server-Side Request Forgery)** | Forcing server to fetch external URLs in report generation | Internal network scanning | Air-gapped design: AQUAFORGE backend makes zero external HTTP requests to external servers during processing. |
| **Model Tampering / Poisoning** | Unauthorized modification of ONNX weights file | Fabricated detections / False clearances | Weights stored with file integrity validation; models loaded read-only through deterministic OpenCV DNN runtime. |
| **Silent Provenance Overwrite** | Operator or model overwriting previous audit logs | Loss of hydrographic evidentiary integrity | Strict separation of `Detection` (immutable AI output) and `ReviewDecision` (immutable human review log). |

---

## 2. Air-Gapped Operation
AQUAFORGE is built to operate in restricted, air-gapped vessel environments:
- Zero external AI API calls.
- Zero telemetry transmission.
- Runs 100% locally on CPU without requiring internet connectivity.
