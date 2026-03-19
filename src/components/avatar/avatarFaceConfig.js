/**
 * avatarFaceConfig v4 — Pure CSS percentage positioning.
 * NO calc() — all values computed in JavaScript.
 *
 * Face positions measured by visual inspection of each avatar PNG.
 * objectFit:contain, objectPosition:center bottom.
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeLeft: 42.5,  leftEyeTop: 37.5,
    rightEyeLeft: 52.5, rightEyeTop: 37.5,
    eyeW: 5, eyeH: 2.5,
    eyeColor: '#8B6040',
    mouthLeft: 46, mouthTop: 47,
    mouthW: 8, mouthMaxH: 3,
    mouthColor: '#2A0800',
  },
  hannah: {
    leftEyeLeft: 41, leftEyeTop: 27,
    rightEyeLeft: 51, rightEyeTop: 27,
    eyeW: 5, eyeH: 2.5,
    eyeColor: '#7A4830',
    mouthLeft: 45, mouthTop: 35.5,
    mouthW: 7, mouthMaxH: 2.8,
    mouthColor: '#200600',
  },
  coach: {
    leftEyeLeft: 43, leftEyeTop: 14.5,
    rightEyeLeft: 52, rightEyeTop: 14.5,
    eyeW: 4.5, eyeH: 2.2,
    eyeColor: '#7A4828',
    mouthLeft: 45.5, mouthTop: 21,
    mouthW: 7, mouthMaxH: 2.5,
    mouthColor: '#1A0400',
  },
  chef: {
    leftEyeLeft: 43, leftEyeTop: 19,
    rightEyeLeft: 52.5, rightEyeTop: 19,
    eyeW: 4.5, eyeH: 2.2,
    eyeColor: '#6A3218',
    mouthLeft: 45.5, mouthTop: 26,
    mouthW: 7, mouthMaxH: 2.5,
    mouthColor: '#200600',
  },
  paul: {
    leftEyeLeft: 39, leftEyeTop: 24,
    rightEyeLeft: 51, rightEyeTop: 24,
    eyeW: 5.5, eyeH: 2.5,
    eyeColor: '#5A3014',
    mouthLeft: 43.5, mouthTop: 32,
    mouthW: 8, mouthMaxH: 3,
    mouthColor: '#1C0400',
  },
};

/**
 * Build face overlay styles. All values in percentages, computed in JS.
 * No CSS calc() — browsers silently fail on calc(% * unitless).
 */
export function getFaceStyles(character, _imgBounds, blinkProgress, mouthOpen) {
  const C = FACE_CONFIG[character] || FACE_CONFIG.gideon;

  const leftEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.leftEyeLeft + '%',
    top: C.leftEyeTop + '%',
    width: C.eyeW + '%',
    height: (C.eyeH * blinkProgress) + '%',
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: Math.min(0.93, blinkProgress),
    zIndex: 5,
  } : null;

  const rightEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.rightEyeLeft + '%',
    top: C.rightEyeTop + '%',
    width: C.eyeW + '%',
    height: (C.eyeH * blinkProgress) + '%',
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: Math.min(0.93, blinkProgress),
    zIndex: 5,
  } : null;

  const mouth = mouthOpen > 0.06 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.mouthLeft + '%',
    top: C.mouthTop + '%',
    width: C.mouthW + '%',
    height: (C.mouthMaxH * mouthOpen) + '%',
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: Math.min(0.88, 0.5 + mouthOpen * 0.4),
    zIndex: 5,
  } : null;

  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;
