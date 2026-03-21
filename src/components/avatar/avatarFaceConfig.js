/**
 * avatarFaceConfig v7 — Position-corrected after debug video testing.
 * 
 * Debug test showed: overlays render correctly but mouth was ~3-4% too low.
 * Eyes need to move up ~2%. Adjusted all positions accordingly.
 * Back to realistic colors (dark brown/black).
 */

const FACE_CONFIG = {
  gideon: {
    leftEyeLeft: 43.5, leftEyeTop: 35.545,
    rightEyeLeft: 53.0, rightEyeTop: 35.545,
    eyeW: 4.5, eyeH: 3,
    eyeColor: '#5C3A20',
    mouthLeft: 46.5, mouthTop: 40,
    mouthW: 7, mouthMaxH: 3.5,
    mouthColor: '#1A0500',
  },
  hannah: {
    leftEyeLeft: 40.5, leftEyeTop: 30,
    rightEyeLeft: 50.5, rightEyeTop: 30,
    eyeW: 5.5, eyeH: 3,
    eyeColor: '#5A3520',
    mouthLeft: 44, mouthTop: 36,
    mouthW: 7.5, mouthMaxH: 3.5,
    mouthColor: '#150400',
  },
  coach: {
    leftEyeLeft: 42, leftEyeTop: 22.5,
    rightEyeLeft: 51, rightEyeTop: 22.5,
    eyeW: 5, eyeH: 2.8,
    eyeColor: '#4A2810',
    mouthLeft: 44.5, mouthTop: 27.5,
    mouthW: 7.5, mouthMaxH: 3.5,
    mouthColor: '#0E0200',
  },
  chef: {
    leftEyeLeft: 44, leftEyeTop: 30.5,
    rightEyeLeft: 52.5, rightEyeTop: 30.5,
    eyeW: 3.5, eyeH: 1.8,
    eyeColor: '#4A2810',
    mouthLeft: 45, mouthTop: 35.5,
    mouthW: 8.5, mouthMaxH: 4,
    mouthColor: '#120300',
  },
  paul: {
    leftEyeLeft: 38, leftEyeTop: 26.5,
    rightEyeLeft: 50, rightEyeTop: 26.5,
    eyeW: 6, eyeH: 3,
    eyeColor: '#3E2008',
    mouthLeft: 42.5, mouthTop: 33,
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
