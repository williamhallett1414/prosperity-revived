/**
 * avatarFaceConfig v6 — Larger, more visible overlays.
 * Positions corrected for objectFit:contain + objectPosition:center bottom.
 * Overlay sizes increased for visibility. Dark interior mouth color.
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeLeft: 42.5, leftEyeTop: 41.8,
    rightEyeLeft: 52.5, rightEyeTop: 41.8,
    eyeW: 5.5, eyeH: 3,
    eyeColor: '#5C3A20',
    mouthLeft: 46, mouthTop: 50,
    mouthW: 8, mouthMaxH: 4,
    mouthColor: '#1A0500',
  },
  hannah: {
    leftEyeLeft: 41, leftEyeTop: 32.5,
    rightEyeLeft: 51, rightEyeTop: 32.5,
    eyeW: 5.5, eyeH: 3,
    eyeColor: '#5A3520',
    mouthLeft: 44.5, mouthTop: 39,
    mouthW: 7.5, mouthMaxH: 3.5,
    mouthColor: '#150400',
  },
  coach: {
    leftEyeLeft: 42.5, leftEyeTop: 25.2,
    rightEyeLeft: 51.5, rightEyeTop: 25.2,
    eyeW: 5, eyeH: 2.8,
    eyeColor: '#4A2810',
    mouthLeft: 45, mouthTop: 30.8,
    mouthW: 7.5, mouthMaxH: 3.5,
    mouthColor: '#0E0200',
  },
  chef: {
    leftEyeLeft: 42.5, leftEyeTop: 28.5,
    rightEyeLeft: 52, rightEyeTop: 28.5,
    eyeW: 5, eyeH: 2.8,
    eyeColor: '#4A2810',
    mouthLeft: 45, mouthTop: 34.5,
    mouthW: 7.5, mouthMaxH: 3.5,
    mouthColor: '#120300',
  },
  paul: {
    leftEyeLeft: 38.5, leftEyeTop: 29,
    rightEyeLeft: 50.5, rightEyeTop: 29,
    eyeW: 6, eyeH: 3,
    eyeColor: '#3E2008',
    mouthLeft: 43, mouthTop: 36,
    mouthW: 8, mouthMaxH: 4,
    mouthColor: '#100300',
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
    opacity: 0.95,
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
    opacity: 0.95,
    zIndex: 5,
  } : null;

  const mouth = mouthOpen > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.mouthLeft + '%',
    top: C.mouthTop + '%',
    width: C.mouthW + '%',
    height: (C.mouthMaxH * mouthOpen) + '%',
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: 0.9,
    zIndex: 5,
  } : null;

  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;
