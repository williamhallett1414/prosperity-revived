/**
 * avatarFaceConfig v5 — Corrected positions accounting for objectFit:contain + objectPosition:center bottom.
 *
 * The image sits at the BOTTOM of the container with whitespace above (~14%).
 * All Y positions account for this offset.
 * All values computed in JavaScript (no CSS calc).
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeLeft: 42.5, leftEyeTop: 41.8,
    rightEyeLeft: 52.5, rightEyeTop: 41.8,
    eyeW: 4.5, eyeH: 2.2,
    eyeColor: '#8B6040',
    mouthLeft: 47, mouthTop: 50.4,
    mouthW: 7, mouthMaxH: 2.5,
    mouthColor: '#2A0800',
  },
  hannah: {
    leftEyeLeft: 41, leftEyeTop: 32.5,
    rightEyeLeft: 51, rightEyeTop: 32.5,
    eyeW: 4.5, eyeH: 2.2,
    eyeColor: '#7A4830',
    mouthLeft: 45.5, mouthTop: 39.4,
    mouthW: 6, mouthMaxH: 2.5,
    mouthColor: '#200600',
  },
  coach: {
    leftEyeLeft: 43, leftEyeTop: 25.4,
    rightEyeLeft: 52, rightEyeTop: 25.4,
    eyeW: 4, eyeH: 2,
    eyeColor: '#7A4828',
    mouthLeft: 46, mouthTop: 31,
    mouthW: 6, mouthMaxH: 2,
    mouthColor: '#1A0400',
  },
  chef: {
    leftEyeLeft: 43, leftEyeTop: 28.7,
    rightEyeLeft: 52.5, rightEyeTop: 28.7,
    eyeW: 4, eyeH: 2,
    eyeColor: '#6A3218',
    mouthLeft: 46, mouthTop: 34.7,
    mouthW: 6, mouthMaxH: 2,
    mouthColor: '#200600',
  },
  paul: {
    leftEyeLeft: 39, leftEyeTop: 29.3,
    rightEyeLeft: 51, rightEyeTop: 29.3,
    eyeW: 5, eyeH: 2.2,
    eyeColor: '#5A3014',
    mouthLeft: 44, mouthTop: 36.4,
    mouthW: 7, mouthMaxH: 2.5,
    mouthColor: '#1C0400',
  },
};

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
