/**
 * avatarFaceConfig.js — Corrected scaling values for eye/mouth overlays.
 * 
 * All positions are expressed as ratios of imgBounds.w and imgBounds.h
 * (the rendered image dimensions within the container).
 * 
 * Coordinate system: imgBounds-relative (matches Gideon's measureImage() system).
 *   overlay.left = imgBounds.left + imgBounds.w * config.leftEyeX
 *   overlay.top  = imgBounds.top  + imgBounds.h * config.eyeY
 * 
 * Eyelid proportions target a ~2:1 width:height landscape oval (natural human blink).
 */

const FACE_CONFIG = {
  gideon: {
    // Eye positions — calibrated via Python/Pillow debug overlay
    leftEyeX:  0.422,
    rightEyeX: 0.542,
    eyeY:      0.233,
    eyelidW:   0.036,   // ~2:1 ratio with eyelidH
    eyelidH:   0.020,
    eyelidColor: 'linear-gradient(to bottom, #8B4513 0%, #A0522D 60%, #8B4513 100%)',
    
    // Mouth — center-aligned, measured opening
    mouthCenterX: 0.500,
    mouthY:       0.300,
    mouthBaseW:   0.060,  // resting width
    mouthMaxW:    0.085,  // max width when fully open
    mouthMaxH:    0.022,  // max height when fully open
    mouthColor:   'radial-gradient(ellipse at 50% 40%, #1A0600 0%, #2E0C06 70%, #5A2010 100%)',
    
    // Image scaling
    imgScale: 1.55,
    imgOrigin: 'center top',
    imgPosition: 'center bottom',
  },
  
  hannah: {
    leftEyeX:  0.413,
    rightEyeX: 0.490,
    eyeY:      0.231,
    eyelidW:   0.038,
    eyelidH:   0.020,
    eyelidColor: 'linear-gradient(to bottom, #7A4830 0%, #9A6048 60%, #7A4830 100%)',
    
    mouthCenterX: 0.500,
    mouthY:       0.285,
    mouthBaseW:   0.050,
    mouthMaxW:    0.076,
    mouthMaxH:    0.028,
    mouthColor:   'radial-gradient(ellipse at 50% 30%, #120500 0%, #280A04 60%, #441606 100%)',
    
    imgScale: 1.6,
    imgOrigin: 'center top',
    imgPosition: 'center bottom',
  },
  
  coach: { // Coach David
    leftEyeX:  0.415,
    rightEyeX: 0.505,
    eyeY:      0.188,
    eyelidW:   0.034,
    eyelidH:   0.018,
    eyelidColor: 'linear-gradient(to bottom, #7A4828 0%, #9A6040 60%, #7A4828 100%)',
    
    mouthCenterX: 0.488,
    mouthY:       0.240,
    mouthBaseW:   0.048,
    mouthMaxW:    0.072,
    mouthMaxH:    0.035,
    mouthColor:   'radial-gradient(ellipse at 50% 35%, #0E0300 0%, #2A0806 65%, #4C1A0C 100%)',
    
    imgScale: 1.55,
    imgOrigin: 'center top',
    imgPosition: 'center bottom',
  },
  
  chef: { // Chef Daniel
    leftEyeX:  0.430,
    rightEyeX: 0.518,
    eyeY:      0.262,
    eyelidW:   0.032,
    eyelidH:   0.016,  // Fixed: was taller than wide (portrait), now landscape
    eyelidColor: 'linear-gradient(to bottom, #6A3218 0%, #8A5030 60%, #6A3218 100%)',
    
    mouthCenterX: 0.484,
    mouthY:       0.330,
    mouthBaseW:   0.044,
    mouthMaxW:    0.068,
    mouthMaxH:    0.032,
    mouthColor:   'radial-gradient(ellipse at 50% 35%, #140400 0%, #300C08 65%, #521E0E 100%)',
    
    imgScale: 1.5,
    imgOrigin: 'center top',
    imgPosition: 'center bottom',
  },
  
  paul: { // Coach Paul
    leftEyeX:  0.410,
    rightEyeX: 0.540,
    eyeY:      0.228,
    eyelidW:   0.036,  // Fixed: was 0.136 (4x too wide!)
    eyelidH:   0.020,
    eyelidColor: 'linear-gradient(to bottom, #5A2E10 0%, #7A4A28 60%, #5A2E10 100%)',
    
    mouthCenterX: 0.517,
    mouthY:       0.278,
    mouthBaseW:   0.055,
    mouthMaxW:    0.080,
    mouthMaxH:    0.022,
    mouthColor:   'radial-gradient(ellipse at 50% 35%, #100400 0%, #240806 65%, #441608 100%)',
    
    imgScale: 1.55,
    imgOrigin: 'center top',
    imgPosition: 'center bottom',
  },
};

/**
 * Calculate face overlay positions in pixels from imgBounds.
 * Returns ready-to-use style objects for eyelid and mouth overlays.
 */
export function getFaceStyles(character, imgBounds, blinkProgress, mouthOpen) {
  if (!imgBounds) return null;
  const cfg = FACE_CONFIG[character] || FACE_CONFIG.gideon;
  
  // Eyelid dimensions scaled by blink progress
  const eyelidW = imgBounds.w * cfg.eyelidW * (1 + blinkProgress * 0.08); // slight widen at peak
  const eyelidH = imgBounds.h * cfg.eyelidH * blinkProgress;
  const eyelidDroop = blinkProgress * 1.5; // natural lid droop in px
  
  const leftEye = blinkProgress > 0.02 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   imgBounds.left + imgBounds.w * cfg.leftEyeX - eyelidW / 2,
    top:    imgBounds.top + imgBounds.h * cfg.eyeY - eyelidH / 2 + eyelidDroop,
    width:  eyelidW,
    height: eyelidH,
    background: cfg.eyelidColor,
    borderRadius: '50%',
    opacity: 0.92 * blinkProgress,
    transition: 'none', // driven by RAF, not CSS
  } : null;
  
  const rightEye = blinkProgress > 0.02 ? {
    position: 'absolute',
    pointerEvents: 'none',
    left:   imgBounds.left + imgBounds.w * cfg.rightEyeX - eyelidW / 2,
    top:    imgBounds.top + imgBounds.h * cfg.eyeY - eyelidH / 2 + eyelidDroop,
    width:  eyelidW,
    height: eyelidH,
    background: cfg.eyelidColor,
    borderRadius: '50%',
    opacity: 0.92 * blinkProgress,
    transition: 'none',
  } : null;
  
  // Mouth: width and height scale with mouthOpen
  const mW = imgBounds.w * (cfg.mouthBaseW + mouthOpen * (cfg.mouthMaxW - cfg.mouthBaseW));
  const mH = imgBounds.h * mouthOpen * cfg.mouthMaxH;
  
  const mouth = mouthOpen > 0.04 ? {
    position: 'absolute',
    pointerEvents: 'none',
    overflow: 'hidden',
    left:   imgBounds.left + imgBounds.w * cfg.mouthCenterX - mW / 2,
    top:    imgBounds.top + imgBounds.h * cfg.mouthY,
    width:  mW,
    height: mH,
    background: cfg.mouthColor,
    borderRadius: '40%',
    opacity: 0.80 + mouthOpen * 0.15,
    transition: 'none',
  } : null;
  
  return { leftEye, rightEye, mouth };
}

export default FACE_CONFIG;
