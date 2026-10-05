export interface Survey {
  id: number;
  survey_code: string;
  name: string;
  vessel_name: string;
  sensor_model: string;
  frequency_khz: number;
  is_demo: boolean;
  status: string;
  contact_count: number;
  high_priority_count: number;
  novel_count: number;
  created_at: string;
}

export interface ProcessingEvent {
  step_name: string;
  progress_pct: number;
  message: string;
  timestamp: string;
}

export interface IntensityFeatures {
  echo_contrast: number;
  highlight_strength: string;
  target_mean_intensity: number;
  background_mean_intensity: number;
}

export interface ShadowFeatures {
  shadow_signature: string;
  shadow_area_px: number;
  shadow_length_m: number;
  shadow_to_highlight_ratio: number;
  estimated_height_m: number;
}

export interface TextureFeatures {
  glcm_contrast: number;
  glcm_homogeneity: number;
  glcm_energy: number;
  glcm_entropy: number;
  texture_complexity: string;
}

export interface GeometryFeatures {
  physical_length_m: number;
  physical_width_m: number;
  aspect_ratio: number;
  compactness: number;
  geometric_regularity: string;
}

export interface AcousticFingerprint {
  intensity: IntensityFeatures;
  shadow: ShadowFeatures;
  texture: TextureFeatures;
  geometry: GeometryFeatures;
  man_made_probability: number;
  acoustic_pattern: string;
  evidence_bullets: string[];
}

export interface Geolocation {
  has_metadata: boolean;
  latitude: number | null;
  longitude: number | null;
  position_uncertainty_m: number;
  geolocation_confidence: number;
  slant_range_m: number;
  ground_range_m: number;
  sonar_side: string;
  status_message: string;
}

export interface PriorityAssessment {
  priority: string; // HIGH, MEDIUM, LOW, REVIEW
  composite_score: number;
  primary_reason: string;
  factors: Record<string, number>;
}

export interface ScanRecommendation {
  recommended_action: string;
  detailed_instruction: string;
  action_type: string;
  operational_rationale: string;
  urgency: string;
}

export interface Contact {
  id: number;
  survey_id: number;
  contact_code: string;
  detected_class: string;
  acoustic_hypothesis: string;
  operator_confirmed_class: string | null;
  model_score: number;
  calibrated_confidence: number;
  calibration_status: string;
  novelty_score: number;
  is_novel_anomaly: boolean;
  priority_level: string;
  review_status: string;
  persistence_count: number;
  persistence_status: string;
  track_length_m: number;
  crop_path: string | null;
  detection: {
    x: number;
    y: number;
    width: number;
    height: number;
    bbox_norm: number[];
  } | null;
  fingerprint: AcousticFingerprint | null;
  geolocation: Geolocation | null;
  priority: PriorityAssessment | null;
  recommendation: ScanRecommendation | null;
}
