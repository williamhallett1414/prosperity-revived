/**
 * avatarFaceConfig v7 — Position-corrected after debug video testing.
 * 
 * Debug test showed: overlays render correctly but mouth was ~3-4% too low.
 * Eyes need to move up ~2%. Adjusted all positions accordingly.
 * Back to realistic colors (dark brown/black).
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeLeft: 43.2, leftEyeTop: 34.145,
    rightEyeLeft: 52.7, rightEyeTop: 34.145,
    eyeW: 4, eyeH: 5,
    eyeColor: '#532F1F',
    mouthLeft: 46.5, mouthTop: 40,
    mouthW: 7, mouthMaxH: 3.5,
    mouthColor: '#1A0500',
  },
  hannah: {
    leftEyeLeft: 46.8, leftEyeTop: 20.95,
    rightEyeLeft: 51.3, rightEyeTop: 20.95,
    eyeW: 2.2, eyeH: 1.3,
    eyeColor: '#513022',
    mouthLeft: 48.8, mouthTop: 24.25,
    mouthW: 3.5, mouthMaxH: 1.5,
    mouthColor: '#150400',
  },
  coach: {
    leftEyeLeft: 45.5, leftEyeTop: 21,
    rightEyeLeft: 51.5, rightEyeTop: 21,
    eyeW: 2.2, eyeH: 1.8,
    eyeColor: '#593827',
    mouthLeft: 46.5, mouthTop: 25,
    mouthW: 5, mouthMaxH: 2.5,
    mouthColor: '#0E0200',
  },
  chef: {
    leftEyeLeft: 44, leftEyeTop: 30.5,
    rightEyeLeft: 52.5, rightEyeTop: 30.5,
    eyeW: 3.5, eyeH: 1.8,
    eyeColor: '#5F4534',
    mouthLeft: 45, mouthTop: 35.5,
    mouthW: 8.5, mouthMaxH: 4,
    mouthColor: '#120300',
  },
  paul: {
    leftEyeLeft: 45.7, leftEyeTop: 23.8,
    rightEyeLeft: 53.3, rightEyeTop: 23.4,
    eyeW: 2.8, eyeH: 2.9,
    eyeColor: '#5B3825',
    mouthLeft: 49.0, mouthTop: 28.6,
    mouthW: 5.0, mouthMaxH: 2.0,
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
