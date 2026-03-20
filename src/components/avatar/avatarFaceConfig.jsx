/**
 * avatarFaceConfig v8 — imgBounds-based pixel positioning.
 *
 * All face positions are expressed as fractions of the IMAGE (not container).
 * getFaceStyles uses the measured imgBounds to convert to absolute px so
 * overlays stay locked to the face regardless of container size or zoom state.
 *
 * imgBounds = { left, top, w, h } in px relative to the container div.
 */

// Positions as fraction of image width/height (0–1)
const FACE_CONFIG = {
  gideon: {
    leftEyeX: 0.38,  leftEyeY: 0.39,
    rightEyeX: 0.52, rightEyeY: 0.39,
    eyeW: 0.085, eyeH: 0.030,
    eyeColor: '#5C3A20',
    mouthX: 0.40, mouthY: 0.47,
    mouthW: 0.18, mouthMaxH: 0.040,
    mouthColor: '#1A0500',
  },
  hannah: {
    leftEyeX: 0.37,  leftEyeY: 0.30,
    rightEyeX: 0.51, rightEyeY: 0.30,
    eyeW: 0.085, eyeH: 0.028,
    eyeColor: '#5A3520',
    mouthX: 0.40, mouthY: 0.37,
    mouthW: 0.17, mouthMaxH: 0.036,
    mouthColor: '#150400',
  },
  coach: {
    leftEyeX: 0.38,  leftEyeY: 0.22,
    rightEyeX: 0.51, rightEyeY: 0.22,
    eyeW: 0.080, eyeH: 0.026,
    eyeColor: '#4A2810',
    mouthX: 0.40, mouthY: 0.28,
    mouthW: 0.16, mouthMaxH: 0.034,
    mouthColor: '#0E0200',
  },
  chef: {
    leftEyeX: 0.37,  leftEyeY: 0.50,
    rightEyeX: 0.51, rightEyeY: 0.50,
    eyeW: 0.090, eyeH: 0.030,
    eyeColor: '#4A2810',
    mouthX: 0.39, mouthY: 0.59,
    mouthW: 0.19, mouthMaxH: 0.040,
    mouthColor: '#120300',
  },
  paul: {
    leftEyeX: 0.35,  leftEyeY: 0.26,
    rightEyeX: 0.49, rightEyeY: 0.26,
    eyeW: 0.095, eyeH: 0.030,
    eyeColor: '#3E2008',
    mouthX: 0.38, mouthY: 0.33,
    mouthW: 0.19, mouthMaxH: 0.042,
    mouthColor: '#100300',
  },
};

export function getFaceStyles(character, imgBounds, blinkProgress, mouthOpen) {
  const C = FACE_CONFIG[character] || FACE_CONFIG.gideon;

  // Without imgBounds we can't position accurately — return nothing
  if (!imgBounds) return { leftEye: null, rightEye: null, mouth: null };

  const { left: iL, top: iT, w: iW, h: iH } = imgBounds;

  const leftEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   (iL + C.leftEyeX * iW) + 'px',
    top:    (iT + C.leftEyeY * iH) + 'px',
    width:  (C.eyeW * iW) + 'px',
    height: (C.eyeH * iH * blinkProgress) + 'px',
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: 0.95,
    zIndex: 5,
  } : null;

  const rightEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   (iL + C.rightEyeX * iW) + 'px',
    top:    (iT + C.rightEyeY * iH) + 'px',
    width:  (C.eyeW * iW) + 'px',
    height: (C.eyeH * iH * blinkProgress) + 'px',
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: 0.95,
    zIndex: 5,
  } : null;

  const mouth = mouthOpen > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   (iL + C.mouthX * iW) + 'px',
    top:    (iT + C.mouthY * iH) + 'px',
    width:  (C.mouthW * iW) + 'px',
    height: (C.mouthMaxH * iH * mouthOpen) + 'px',
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: 0.9,
    zIndex: 5,
  } : null;

  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;