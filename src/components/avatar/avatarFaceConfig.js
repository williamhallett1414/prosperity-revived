/**
 * avatarFaceConfig v3 — Pure CSS percentage positioning.
 *
 * ALL positions are percentages of the image container (the div holding the <img>).
 * This works correctly regardless of scale() transforms because percentages
 * are relative to the element's own coordinate space, not the screen.
 *
 * Face positions measured by visual inspection of each avatar PNG.
 * The image uses objectFit:contain, objectPosition:center bottom,
 * so the character fills the container width and sits at the bottom.
 */

const FACE_CONFIG = {
  gideon: {
    // Eyes: Gideon's eyes are about 38% from top, ~44% and ~54% from left
    leftEyeLeft:  '42.5%',  leftEyeTop:  '37.5%',
    rightEyeLeft: '52.5%',  rightEyeTop: '37.5%',
    eyeWidth:  '5%',   eyeHeight: '2.5%',
    eyeColor: '#8B6040',

    // Mouth: centered, about 47% from top
    mouthLeft: '46%', mouthTop: '47%',
    mouthWidth: '8%', mouthMaxHeight: '3%',
    mouthColor: '#2A0800',
  },
  hannah: {
    // Hannah: face is higher in image, smaller features
    leftEyeLeft:  '41%',  leftEyeTop:  '27%',
    rightEyeLeft: '51%',  rightEyeTop: '27%',
    eyeWidth:  '5%',   eyeHeight: '2.5%',
    eyeColor: '#7A4830',

    mouthLeft: '45%', mouthTop: '35.5%',
    mouthWidth: '7%', mouthMaxHeight: '2.8%',
    mouthColor: '#200600',
  },
  coach: {
    // Coach David: tall figure, face in upper ~15-20% of image
    leftEyeLeft:  '43%',  leftEyeTop:  '14.5%',
    rightEyeLeft: '52%',  rightEyeTop: '14.5%',
    eyeWidth:  '4.5%', eyeHeight: '2.2%',
    eyeColor: '#7A4828',

    mouthLeft: '45.5%', mouthTop: '21%',
    mouthWidth: '7%', mouthMaxHeight: '2.5%',
    mouthColor: '#1A0400',
  },
  chef: {
    // Chef Daniel: similar proportions to Coach David, chef hat adds height
    leftEyeLeft:  '43%',  leftEyeTop:  '19%',
    rightEyeLeft: '52.5%',  rightEyeTop: '19%',
    eyeWidth:  '4.5%', eyeHeight: '2.2%',
    eyeColor: '#6A3218',

    mouthLeft: '45.5%', mouthTop: '26%',
    mouthWidth: '7%', mouthMaxHeight: '2.5%',
    mouthColor: '#200600',
  },
  paul: {
    // Coach Paul: similar to Hannah proportions (smaller image)
    leftEyeLeft:  '39%',  leftEyeTop:  '24%',
    rightEyeLeft: '51%',  rightEyeTop: '24%',
    eyeWidth:  '5.5%', eyeHeight: '2.5%',
    eyeColor: '#5A3014',

    mouthLeft: '43.5%', mouthTop: '32%',
    mouthWidth: '8%', mouthMaxHeight: '3%',
    mouthColor: '#1C0400',
  },
};

/**
 * Build inline style objects for face overlays using pure CSS percentages.
 * These work correctly inside scaled containers.
 *
 * blinkProgress: 0 (open) → 1 (closed)
 * mouthOpen: 0 (closed) → 1 (fully open)
 */
export function getFaceStyles(character, _imgBounds, blinkProgress, mouthOpen) {
  // imgBounds is ignored — we use pure percentages now
  const C = FACE_CONFIG[character] || FACE_CONFIG.gideon;

  const leftEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.leftEyeLeft,
    top: C.leftEyeTop,
    width: C.eyeWidth,
    height: `calc(${C.eyeHeight} * ${blinkProgress})`,
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: Math.min(0.93, blinkProgress),
    zIndex: 5,
  } : null;

  const rightEye = blinkProgress > 0.05 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.rightEyeLeft,
    top: C.rightEyeTop,
    width: C.eyeWidth,
    height: `calc(${C.eyeHeight} * ${blinkProgress})`,
    background: C.eyeColor,
    borderRadius: '50%',
    opacity: Math.min(0.93, blinkProgress),
    zIndex: 5,
  } : null;

  const mouth = mouthOpen > 0.06 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left: C.mouthLeft,
    top: C.mouthTop,
    width: C.mouthWidth,
    height: `calc(${C.mouthMaxHeight} * ${mouthOpen})`,
    background: C.mouthColor,
    borderRadius: '45%',
    opacity: Math.min(0.88, 0.5 + mouthOpen * 0.4),
    zIndex: 5,
  } : null;

  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;
