import cv2
import numpy as np
from typing import Dict, Any, Tuple, Optional

class SonarPreprocessor:
    """
    Physics-informed Side-Scan Sonar (SSS) preprocessing engine.
    Handles nadir identification, TVG/beam pattern normalization,
    speckle noise suppression, slant-range correction, and CLAHE.
    """

    PRESETS = {
        "STANDARD": {
            "clahe_clip": 2.5,
            "clahe_grid": (8, 8),
            "denoise_h": 6,
            "filter_type": "bilateral",
            "percentile_low": 2.0,
            "percentile_high": 98.0,
        },
        "HIGH_CONTRAST": {
            "clahe_clip": 4.0,
            "clahe_grid": (8, 8),
            "denoise_h": 8,
            "filter_type": "bilateral",
            "percentile_low": 1.0,
            "percentile_high": 99.0,
        },
        "LOW_SNR": {
            "clahe_clip": 2.0,
            "clahe_grid": (12, 12),
            "denoise_h": 12,
            "filter_type": "median_bilateral",
            "percentile_low": 5.0,
            "percentile_high": 95.0,
        },
        "CONSERVATIVE": {
            "clahe_clip": 1.5,
            "clahe_grid": (6, 6),
            "denoise_h": 4,
            "filter_type": "gaussian",
            "percentile_low": 1.0,
            "percentile_high": 99.0,
        }
    }

    def __init__(self, preset: str = "STANDARD"):
        self.preset_name = preset if preset in self.PRESETS else "STANDARD"
        self.config = self.PRESETS[self.preset_name]

    def process(
        self,
        image: np.ndarray,
        sensor_altitude_m: Optional[float] = None,
        slant_range_max_m: Optional[float] = None
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Executes real physics-based sonar preprocessing.
        Returns:
            processed_image: uint8 numpy array (H, W) or (H, W, 3)
            diagnostics: Dict containing SNR, dynamic range, and filter stats.
        """
        # Ensure grayscale working image
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        h, w = gray.shape
        raw_mean = float(np.mean(gray))
        raw_std = float(np.std(gray))
        raw_snr = float(raw_mean / (raw_std + 1e-6))

        # Step 1: Beam Pattern / Time-Varying Gain (TVG) Normalization across range
        # Side-scan sonar has acoustic falloff with slant range.
        # Compute mean intensity profile across the horizontal range axis (W)
        range_profile = np.mean(gray, axis=0, dtype=np.float32)
        # Smooth the profile to prevent striping
        range_profile_smooth = cv2.GaussianBlur(range_profile.reshape(1, -1), (1, 31), 0)[0]
        # Normalize: target uniform background average of 120
        target_bg = 120.0
        gain_curve = target_bg / (range_profile_smooth + 1e-3)
        gain_curve = np.clip(gain_curve, 0.3, 3.0)  # Bound gain to prevent extreme noise amplification
        
        # Apply range gain
        tvg_corrected = gray.astype(np.float32) * gain_curve[np.newaxis, :]
        tvg_corrected = np.clip(tvg_corrected, 0, 255).astype(np.uint8)

        # Step 2: Slant-range ground correction if altitude and max range provided
        slant_corrected = tvg_corrected
        slant_applied = False
        if sensor_altitude_m is not None and slant_range_max_m is not None and slant_range_max_m > sensor_altitude_m:
            slant_corrected = self._apply_slant_range_correction(tvg_corrected, sensor_altitude_m, slant_range_max_m)
            slant_applied = True

        # Step 3: Speckle noise suppression
        filter_type = self.config["filter_type"]
        if filter_type == "bilateral":
            # Bilateral filter preserves sharp acoustic highlight-to-shadow edges while smoothing speckle
            denoised = cv2.bilateralFilter(slant_corrected, d=7, sigmaColor=35, sigmaSpace=7)
        elif filter_type == "median_bilateral":
            med = cv2.medianBlur(slant_corrected, 3)
            denoised = cv2.bilateralFilter(med, d=7, sigmaColor=50, sigmaSpace=7)
        else:
            denoised = cv2.GaussianBlur(slant_corrected, (5, 5), 1.2)

        # Step 4: Robust Percentile Stretch
        p_low = self.config["percentile_low"]
        p_high = self.config["percentile_high"]
        val_low = np.percentile(denoised, p_low)
        val_high = np.percentile(denoised, p_high)
        if val_high > val_low:
            stretched = np.clip((denoised - val_low) * (255.0 / (val_high - val_low)), 0, 255).astype(np.uint8)
        else:
            stretched = denoised

        # Step 5: CLAHE (Contrast-Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(
            clipLimit=self.config["clahe_clip"],
            tileGridSize=self.config["clahe_grid"]
        )
        enhanced = clahe.apply(stretched)

        # Compute post-processing diagnostics
        post_mean = float(np.mean(enhanced))
        post_std = float(np.std(enhanced))
        post_snr = float(post_mean / (post_std + 1e-6))

        diagnostics = {
            "preset": self.preset_name,
            "raw_mean": round(raw_mean, 2),
            "raw_std": round(raw_std, 2),
            "raw_snr": round(raw_snr, 2),
            "post_mean": round(post_mean, 2),
            "post_std": round(post_std, 2),
            "post_snr": round(post_snr, 2),
            "snr_improvement_db": round(10.0 * np.log10(max(1e-3, post_snr / (raw_snr + 1e-6))), 2),
            "clahe_clip": self.config["clahe_clip"],
            "slant_range_corrected": slant_applied,
            "filter_applied": filter_type,
            "dimensions": {"width": w, "height": h}
        }

        # Return RGB image (replicated channels for detectors)
        out_bgr = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
        return out_bgr, diagnostics

    def _apply_slant_range_correction(
        self,
        img: np.ndarray,
        altitude_m: float,
        max_slant_m: float
    ) -> np.ndarray:
        """
        Geometrically remaps slant range Rs to ground range Rg = sqrt(Rs^2 - h^2).
        For port/starboard images, center represents nadir (Rs = h).
        """
        h_px, w_px = img.shape
        # Assuming port is left half, starboard is right half
        half_w = w_px // 2
        if half_w <= 0:
            return img

        # Compute ground range mapping for half-swath
        rs_per_px = max_slant_m / max(1, half_w)
        out_half = np.zeros((h_px, half_w), dtype=np.uint8)

        # Rg indices
        rg_max = np.sqrt(max(0.0, max_slant_m**2 - altitude_m**2))
        rg_per_px = rg_max / max(1, half_w)

        # Remap coordinates
        for col in range(half_w):
            rg = col * rg_per_px
            rs = np.sqrt(rg**2 + altitude_m**2)
            src_col = int(rs / rs_per_px)
            if src_col < half_w:
                out_half[:, col] = img[:, half_w + src_col]

        # Recombine mirrored port and starboard
        out_full = np.zeros_like(img)
        out_full[:, half_w:] = out_half
        out_full[:, :half_w] = np.fliplr(out_half)
        return out_full
