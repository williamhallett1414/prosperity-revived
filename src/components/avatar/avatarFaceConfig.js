/**
 * avatarFaceConfig v2 — Conservative, realistic face overlay scaling.
 *
 * HARD RULES:
 *   - Eyelid NEVER wider than 4% of image width
 *   - Eyelid NEVER taller than 2.5% of image height at peak close
 *   - Mouth NEVER wider than 8% of image width
 *   - Mouth NEVER taller than 2% of image height at peak open
 *   - No horizontal stretching of mouth beyond 12% variation
 *   - Eyelid width:height ratio is always ~2:1 (landscape oval)
 *   - All overlays are centered on their position points
 *
 * Values are ratios of imgBounds.w / imgBounds.h.
 * Positions must be recalibrated per-image using debug overlays.
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeX:  0.435,   rightEyeX: 0.555,   eyeY: 0.235,
    eyelidW:   0.030,   eyelidH:   0.015,
    eyelidColor: '#8B6040',

    mouthCenterX: 0.498, mouthY: 0.300,
    mouthBaseW:   0.038, mouthMaxW: 0.048, mouthMaxH: 0.015,
    mouthColor: '#2A0800',
  },
  hannah: {
    leftEyeX:  0.430,   rightEyeX: 0.510,   eyeY: 0.233,
    eyelidW:   0.032,   eyelidH:   0.016,
    eyelidColor: '#8A5838',

    mouthCenterX: 0.480, mouthY: 0.288,
    mouthBaseW:   0.034, mouthMaxW: 0.044, mouthMaxH: 0.018,
    mouthColor: '#200600',
  },
  coach: {
    leftEyeX:  0.430,   rightEyeX: 0.520,   eyeY: 0.192,
    eyelidW:   0.028,   eyelidH:   0.014,
    eyelidColor: '#7A4828',

    mouthCenterX: 0.490, mouthY: 0.244,
    mouthBaseW:   0.032, mouthMaxW: 0.042, mouthMaxH: 0.016,
    mouthColor: '#1A0400',
  },
  chef: {
    leftEyeX:  0.442,   rightEyeX: 0.524,   eyeY: 0.264,
    eyelidW:   0.026,   eyelidH:   0.013,
    eyelidColor: '#6A3218',

    mouthCenterX: 0.486, mouthY: 0.332,
    mouthBaseW:   0.030, mouthMaxW: 0.040, mouthMaxH: 0.016,
    mouthColor: '#200600',
  },
  paul: {
    leftEyeX:  0.428,   rightEyeX: 0.548,   eyeY: 0.230,
    eyelidW:   0.030,   eyelidH:   0.015,
    eyelidColor: '#5A3014',

    mouthCenterX: 0.500, mouthY: 0.280,
    mouthBaseW:   0.036, mouthMaxW: 0.046, mouthMaxH: 0.014,
    mouthColor: '#1C0400',
  },
};

/**
 * Calculate face overlay styles from animation values.
 *
 * blinkProgress: 0 (open) → 1 (closed)
 * mouthOpen: 0 (closed) → 1 (max open, scaled by conservative config values)
 */
export function getFaceStyles(character, imgBounds, blinkProgress, mouthOpen) {
  if (!imgBounds || imgBounds.w < 10) return null;
  const C = FACE_CONFIG[character] || FACE_CONFIG.gideon;

  // ── EYELIDS ──
  // Width stays constant. Height scales linearly with blink progress.
  // No widening, no droop — just a simple oval that grows from 0 to full height.
  const ew = imgBounds.w * C.eyelidW;
  const eh = imgBounds.h * C.eyelidH * blinkProgress;

  const makeEye = (eyeX) => blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   imgBounds.left + imgBounds.w * eyeX - ew / 2,
    top:    imgBounds.top  + imgBounds.h * C.eyeY - eh / 2,
    width:  ew,
    height: Math.max(0, eh),
    background: C.eyelidColor,
    borderRadius: '50%',
    opacity: Math.min(0.92, blinkProgress * 0.95),
  } : null;

  // ── MOUTH ──
  // Width: base + small expansion (max ~12% wider than base)
  // Height: 0 → conservative max, purely vertical
  const mW = imgBounds.w * (C.mouthBaseW + mouthOpen * (C.mouthMaxW - C.mouthBaseW));
  const mH = imgBounds.h * C.mouthMaxH * mouthOpen;

  const mouth = mouthOpen > 0.06 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   imgBounds.left + imgBounds.w * C.mouthCenterX - mW / 2,
    top:    imgBounds.top  + imgBounds.h * C.mouthY - mH * 0.3,
    width:  mW,
    height: Math.max(0, mH),
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: Math.min(0.88, 0.60 + mouthOpen * 0.30),
  } : null;

  return { leftEye: makeEye(C.leftEyeX), rightEye: makeEye(C.rightEyeX), mouth };
}

export default FACE_CONFIG;
