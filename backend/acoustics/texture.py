import numpy as np
import cv2
from typing import Dict, Any

def extract_texture_features(crop_bgr: np.ndarray) -> Dict[str, Any]:
    """
    Computes statistical texture features and Gray-Level Co-occurrence Matrix (GLCM)
    descriptors for distinguishing natural seafloor sediment from artificial debris/mesh.
    """
    if len(crop_bgr.shape) == 3:
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop_bgr.copy()

    h, w = gray.shape
    if h < 4 or w < 4:
        return {
            "glcm_contrast": 0.0,
            "glcm_homogeneity": 1.0,
            "glcm_energy": 1.0,
            "glcm_entropy": 0.0,
            "local_variance": 0.0,
            "texture_complexity": "LOW"
        }

    # 1. Local Variance & Standard Deviation
    local_mean = np.mean(gray)
    local_variance = float(np.var(gray))
    local_std = float(np.std(gray))

    # 2. Shannon Entropy of Grayscale Histogram
    hist, _ = np.histogram(gray, bins=32, range=(0, 256), density=True)
    hist = hist[hist > 0]
    entropy = -float(np.sum(hist * np.log2(hist)))

    # 3. Fast GLCM (Gray-Level Co-occurrence Matrix) calculation
    # Quantize to 16 gray levels for fast, robust co-occurrence statistics
    quantized = (gray // 16).astype(np.uint8)
    levels = 16
    glcm = np.zeros((levels, levels), dtype=np.float32)

    # Accumulate horizontal and vertical adjacent pairs
    # Horizontal pairs (distance 1, angle 0)
    for r in range(h):
        for c in range(w - 1):
            i = quantized[r, c]
            j = quantized[r, c + 1]
            glcm[i, j] += 1.0
            glcm[j, i] += 1.0

    # Vertical pairs (distance 1, angle 90)
    for r in range(h - 1):
        for c in range(w):
            i = quantized[r, c]
            j = quantized[r + 1, c]
            glcm[i, j] += 1.0
            glcm[j, i] += 1.0

    total_pairs = np.sum(glcm)
    if total_pairs > 0:
        glcm /= total_pairs

    # GLCM Descriptors
    # Contrast: sum(P_ij * (i - j)^2)
    # Homogeneity: sum(P_ij / (1 + (i - j)^2))
    # Energy: sum(P_ij^2)
    i_indices, j_indices = np.indices((levels, levels))
    diff_sq = (i_indices - j_indices) ** 2
    glcm_contrast = float(np.sum(glcm * diff_sq))
    glcm_homogeneity = float(np.sum(glcm / (1.0 + diff_sq)))
    glcm_energy = float(np.sum(glcm ** 2))

    # Texture complexity classification
    # High entropy and high contrast indicate rough bedrock, complex coral, or entangled nets
    # Low contrast and high homogeneity indicate smooth sediment or flat metallic hull plate
    if entropy > 4.2 or glcm_contrast > 12.0:
        complexity = "HIGH"
    elif entropy > 3.0 or glcm_contrast > 5.0:
        complexity = "MEDIUM"
    else:
        complexity = "LOW"

    return {
        "glcm_contrast": round(glcm_contrast, 2),
        "glcm_homogeneity": round(glcm_homogeneity, 3),
        "glcm_energy": round(glcm_energy, 4),
        "glcm_entropy": round(entropy, 2),
        "local_variance": round(local_variance, 1),
        "local_std": round(local_std, 1),
        "texture_complexity": complexity
    }
