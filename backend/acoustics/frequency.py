import numpy as np
import cv2
from typing import Dict, Any

def extract_frequency_features(crop_bgr: np.ndarray) -> Dict[str, Any]:
    """
    Computes 2D Spatial Frequency features via 2D Fast Fourier Transform (FFT).
    Note: This measures spatial image frequency (cycles/meter on the seafloor)
    to detect periodic acoustic backscatter (e.g. net mesh or corrugated containers)
    versus diffuse sediment.
    Does NOT fabricate transducer acoustic frequencies from standard images.
    """
    if len(crop_bgr.shape) == 3:
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop_bgr.copy()

    h, w = gray.shape
    if h < 8 or w < 8:
        return {
            "high_spatial_freq_ratio": 0.0,
            "spectral_energy_concentration": 0.0,
            "dominant_spatial_direction_deg": 0.0,
            "has_periodic_structure": False,
            "disclaimer": "2D Spatial Image Frequency (FFT) analysis. Transducer RF carrier frequency not extracted."
        }

    # Apply Hanning window to reduce edge discontinuity leakage
    win_y = np.hanning(h)
    win_x = np.hanning(w)
    window_2d = np.outer(win_y, win_x)
    windowed = gray.astype(np.float32) * window_2d

    # 2D FFT and magnitude spectrum
    f_transform = np.fft.fft2(windowed)
    f_shift = np.fft.fftshift(f_transform)
    magnitude_spectrum = np.abs(f_shift) ** 2

    total_energy = float(np.sum(magnitude_spectrum))
    if total_energy == 0:
        total_energy = 1e-6

    # Radial frequency partitioning
    center_y, center_x = h // 2, w // 2
    y_coords, x_coords = np.ogrid[:h, :w]
    radii = np.sqrt((y_coords - center_y)**2 + (x_coords - center_x)**2)

    # Low frequency core (central 25% radius) vs High frequency periphery
    max_radius = np.sqrt(center_y**2 + center_x**2)
    cutoff_radius = 0.3 * max_radius

    high_freq_mask = radii > cutoff_radius
    high_freq_energy = float(np.sum(magnitude_spectrum[high_freq_mask]))
    high_spatial_freq_ratio = round(high_freq_energy / total_energy, 3)

    # Directional concentration: check for sharp spectral spikes typical of periodic net mesh or parallel beams
    # Exclude DC component
    mag_no_dc = magnitude_spectrum.copy()
    mag_no_dc[int(center_y)-2:int(center_y)+3, int(center_x)-2:int(center_x)+3] = 0
    top_percentile = np.percentile(mag_no_dc, 99.5)
    spectral_energy_concentration = round(float(np.sum(mag_no_dc[mag_no_dc >= top_percentile])) / total_energy, 3)

    has_periodic_structure = high_spatial_freq_ratio > 0.45 or spectral_energy_concentration > 0.15

    return {
        "high_spatial_freq_ratio": high_spatial_freq_ratio,
        "spectral_energy_concentration": spectral_energy_concentration,
        "has_periodic_structure": has_periodic_structure,
        "disclaimer": "2D Spatial Image Frequency (FFT) analysis. Transducer RF carrier frequency not extracted."
    }
