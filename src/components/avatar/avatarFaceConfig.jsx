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
    leftEyeX: 0.38,  leftEyeY: 0.93,
    rightEyeX: 0.52, rightEyeY: 0.93,
    eyeW: 0.085, eyeH: 0.030,
    eyeColor: '#5C3A20',
    mouthX: 0.40, mouthY: 1.04,
    mouthW: 0.18, mouthMaxH: 0.040,
    mouthColor: '#1A0500',
  },
  hannah: {
    leftEyeX: 0.37,  leftEyeY: 0.86,
    rightEyeX: 0.51, rightEyeY: 0.86,
    eyeW: 0.085, eyeH: 0.028,
    eyeColor: '#5A3520',
    mouthX: 0.40, mouthY: 0.96,
    mouthW: 0.17, mouthMaxH: 0.036,
    mouthColor: '#150400',
  },
  coach: {
    leftEyeX: 0.38,  leftEyeY: 0.76,
    rightEyeX: 0.51, rightEyeY: 0.76,
    eyeW: 0.080, eyeH: 0.026,
    eyeColor: '#4A2810',
    mouthX: 0.40, mouthY: 0.86,
    mouthW: 0.16, mouthMaxH: 0.034,
    mouthColor: '#0E0200',
  },
  chef: {
    leftEyeX: 0.37,  leftEyeY: 0.95,
    rightEyeX: 0.51, rightEyeY: 0.95,
    eyeW: 0.090, eyeH: 0.030,
    eyeColor: '#4A2810',
    mouthX: 0.39, mouthY: 1.05,
    mouthW: 0.19, mouthMaxH: 0.040,
    mouthColor: '#120300',
  },
  paul: {
    leftEyeX: 0.35,  leftEyeY: 0.82,
    rightEyeX: 0.49, rightEyeY: 0.82,
    eyeW: 0.095, eyeH: 0.030,
    eyeColor: '#3E2008',
    mouthX: 0.38, mouthY: 0.92,
    mouthW: 0.19, mouthMaxH: 0.042,
    mouthColor: '#100300',
  },
};

/**
 * getFaceStyles — returns %-based styles for face overlays.
 *
 * Overlays are placed inside the scaled wrapper div. CSS `%` on
 * `position:absolute` elements is always relative to the containing block's
 * layout size (pre-transform), so % values work correctly regardless of scale.
 *
 * We use imgBounds to convert image-fraction coords → % of container.
 * imgBounds = { left, top, w, h } in px relative to the container.
 * containerW / containerH must also be provided (or derived from imgBounds context).
 *
 * Since imgBounds.left + imgBounds.w = container right edge (for contain),
 * we compute: containerW = passed via imgBounds.containerW, containerH similarly.
 */
export function getFaceStyles(character, imgBounds, blinkProgress, mouthOpen) {
  const C = FACE_CONFIG[character] || FACE_CONFIG.gideon;

  if (!imgBounds) return { leftEye: null, rightEye: null, mouth: null };

  const { left: iL, top: iT, w: iW, h: iH, containerW, containerH } = imgBounds;

  // Convert image-fraction coords to % of container
  const toLeftPct  = (xFrac) => ((iL + xFrac * iW) / containerW * 100).toFixed(3) + '%';
  const toTopPct   = (yFrac) => ((iT + yFrac * iH) / containerH * 100).toFixed(3) + '%';
  const toWidthPct = (wFrac) => (wFrac * iW / containerW * 100).toFixed(3) + '%';
  const toHeightPct = (hFrac) => (hFrac * iH / containerH * 100).toFixed(3) + '%';

  const leftEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   toLeftPct(C.leftEyeX),
    top:    toTopPct(C.leftEyeY),
    width:  toWidthPct(C.eyeW),
    height: toHeightPct(C.eyeH * blinkProgress),
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: 0.95,
    zIndex: 5,
  } : null;

  const rightEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   toLeftPct(C.rightEyeX),
    top:    toTopPct(C.rightEyeY),
    width:  toWidthPct(C.eyeW),
    height: toHeightPct(C.eyeH * blinkProgress),
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: 0.95,
    zIndex: 5,
  } : null;

  const mouth = mouthOpen > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   toLeftPct(C.mouthX),
    top:    toTopPct(C.mouthY),
    width:  toWidthPct(C.mouthW),
    height: toHeightPct(C.mouthMaxH * mouthOpen),
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: 0.9,
    zIndex: 5,
  } : null;

  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;