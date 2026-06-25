/**
 * coachedWorkoutScript.js
 *
 * Builds a "Coach Led" audio script for a workout: a sequence of spoken
 * segments that weave exercise form cues with short scripture / prayer
 * reflections during rest intervals. Each segment is voiced by Coach David
 * (matching the chat voice) and followed by a timed "hold" where the user
 * actually performs the work / rests.
 *
 * A segment = { type, text, holdSeconds }
 *   - type: 'intro' | 'exercise' | 'rest' | 'reflection' | 'outro'
 *   - text: what the coach says (sent to TTS)
 *   - holdSeconds: how long to wait after speech before auto-advancing
 *
 * Improvements from v1 (commit b2ef6fd8):
 *   - Reflections tagged by workout category. Strength workouts get temple/
 *     strength verses; cardio gets "run the race" verses; recovery/yoga gets
 *     "be still" verses. No more identical rotation regardless of context.
 *   - Exercise cues drawn from a small template library, selected by a stable
 *     hash of the exercise name. Same exercise gets the SAME cue across plays
 *     (predictable) but different exercises in the same workout get DIFFERENT
 *     cues (variety). Major moves (squats, push-ups, planks, lunges, burpees)
 *     get exercise-specific form cues — e.g. squats get "drive through the
 *     heels," push-ups get "chest toward the floor."
 *   - Outro now includes a real closing prayer, ~25 seconds. The previous
 *     outro ended on "I'm proud of you" — fine, but a faith-anchored app
 *     ending without prayer is a missed identity moment.
 */

// The single coach for this feature.
export const COACH_VOICES = {
  'Coach David': { character: 'coach', fn: 'coachDavidTTS' },
};

// ── Scripture / prayer reflections tagged by workout category ──────────────
// Categories match the workout entity's `category` field
// (strength, cardio, yoga, full_body, hiit, mobility, etc.). Reflections are
// chosen to fit the work the user just did, so the verse lands with the body.

const REFLECTIONS_BY_CATEGORY = {
  strength: [
    'Breathe. "It is God who arms me with strength and keeps my way secure." Receive that as you recover.',
    'Catch your breath. Your body is a temple of the Holy Spirit. This work honors Him.',
    'Rest a moment. "The Lord is my strength and my shield; my heart trusts in Him."',
    'Slow your breathing. "I can do all things through Christ who strengthens me." Carry that into the next round.',
    'Take this rest. "Be strong and courageous. Do not be afraid; do not be discouraged." He is with you.',
    'Steady your breath. "Those who hope in the Lord will renew their strength." Renewal is promised.',
    'Recover here. "Whatever you do, work at it with all your heart, as working for the Lord."',
  ],
  cardio: [
    'Catch your breath. "Run in such a way as to get the prize." Stay in it.',
    'Steady your breath. "Let us throw off everything that hinders and run with perseverance the race marked out for us."',
    'Slow your breathing. "I have fought the good fight, I have finished the race, I have kept the faith."',
    'Recover. "Those who hope in the Lord will run and not grow weary, they will walk and not be faint."',
    'Breathe. The race isn\'t to the swift, but to the one who endures. Keep moving.',
    'Rest a moment. "Let us not grow weary in doing good, for at the proper time we will reap a harvest."',
    'Steady yourself. "Be strong and courageous. Do not be afraid." He runs with you.',
  ],
  hiit: [
    'Recover. "The Lord is my strength and my song; he has become my salvation."',
    'Breathe deep. "I can do all things through Christ who strengthens me."',
    'Catch your breath. "Be strong in the Lord and in the strength of his might."',
    'Slow down. "Those who hope in the Lord will renew their strength."',
    'Steady your breath. "He gives strength to the weary and increases the power of the weak."',
    'Rest a moment. "It is God who arms me with strength and keeps my way secure."',
    'Recover here. "We are more than conquerors through Him who loved us."',
  ],
  yoga: [
    'Breathe slowly. "Be still, and know that I am God."',
    'Settle in. "Come to me, all you who are weary and burdened, and I will give you rest."',
    'Soft breath. "He leads me beside quiet waters, he refreshes my soul."',
    'Stay here. "You will keep in perfect peace those whose minds are steadfast, because they trust in you."',
    'Long breath in. Long breath out. "My peace I give you. Not as the world gives do I give to you."',
    'Sink into this. "In quietness and trust is your strength."',
    'Breathe. "The Lord is near. Do not be anxious about anything."',
  ],
  mobility: [
    'Settle into the stretch. "Be still, and know that I am God."',
    'Soft breath. "He restores my soul."',
    'Stay with it. "Cast all your anxiety on him because he cares for you."',
    'Breathe slow. "My grace is sufficient for you, for my power is made perfect in weakness."',
    'Long breath. "Come to me, all you who are weary and burdened, and I will give you rest."',
    'Stay here. "The Lord is my shepherd, I lack nothing."',
    'Breathe. "Peace I leave with you; my peace I give you."',
  ],
  // Default / mixed — used for full_body and anything unrecognized.
  full_body: [
    'Breathe. "I can do all things through Christ who strengthens me." Let that settle in.',
    'Catch your breath. Your body is a temple of the Holy Spirit. Honor God with how you move.',
    'Rest a moment. "The Lord is my strength and my shield; my heart trusts in Him."',
    'Slow your breathing. "Run in such a way as to get the prize." Stay in it.',
    'Recover. "Be strong and courageous. Do not be afraid; do not be discouraged." He is with you.',
    'Steady your breath. "Let us not grow weary in doing good, for at the proper time we will reap a harvest."',
    'Take this rest. "Whatever you do, work at it with all your heart, as working for the Lord."',
  ],
};

// Pick the right reflection bucket for a workout. Falls back to full_body
// for anything unrecognized so we never end up with an empty array.
function getReflectionsFor(category) {
  const key = String(category || '').toLowerCase();
  return REFLECTIONS_BY_CATEGORY[key] || REFLECTIONS_BY_CATEGORY.full_body;
}

// ── Exercise cue templates ─────────────────────────────────────────────────
// Generic templates used when an exercise doesn't have a specific cue.
// Variety prevents the "same line 20 times" feeling without sacrificing the
// instructional core. Selection is deterministic by exercise name (see
// pickByHash below) so the SAME exercise gets the SAME cue across plays —
// users build a small Pavlovian rhythm with each move.
const GENERIC_CUE_TEMPLATES = [
  'Next up: {name}{detail}. Keep your form tight, control the movement, and breathe through it. Go when you\'re ready.',
  'Up next: {name}{detail}. Stay tight, stay controlled, stay in your form. When you\'re ready, begin.',
  '{name}{detail}. Take a breath, lock in, and go. Quality over speed.',
  'Here we go: {name}{detail}. Form first. Tempo second. Breath always. Begin when ready.',
  '{name}{detail}. Settle in, find your rhythm, and move with intention. Start when you\'re ready.',
  'Next: {name}{detail}. Eyes forward, breath steady, body honest. Go.',
];

// Exercise-specific cues for the most common bodyweight moves. These ARE the
// hand-coached differentiator from generic fitness apps — specificity that
// only comes from understanding the move. Add freely as the library grows.
const EXERCISE_SPECIFIC_CUES = {
  // Lower body
  'squat': '{name}{detail}. Feet shoulder-width, toes slightly out. Sit back like there\'s a chair behind you. Drive through the heels. Chest stays up. Go when you\'re ready.',
  'squats': '{name}{detail}. Feet shoulder-width, toes slightly out. Sit back like there\'s a chair behind you. Drive through the heels. Chest stays up. Go when you\'re ready.',
  'bodyweight squats': '{name}{detail}. Feet shoulder-width, toes slightly out. Sit back like there\'s a chair behind you. Drive through the heels. Chest stays up. Go when you\'re ready.',
  'lunge': '{name}{detail}. Step back, not forward — easier on the knees. Drop the back knee toward the ground. Stand up. Switch sides. Begin.',
  'lunges': '{name}{detail}. Step back, not forward — easier on the knees. Drop the back knee toward the ground. Stand up. Switch sides. Begin.',
  'reverse lunges': '{name}{detail}. Step back, not forward — easier on the knees. Drop the back knee toward the ground. Stand up. Switch sides. Begin.',
  'glute bridge': '{name}{detail}. On your back, knees bent, heels close to your hips. Drive through the heels. Lift the hips. Squeeze the glutes at the top. Lower with control.',
  'glute bridges': '{name}{detail}. On your back, knees bent, heels close to your hips. Drive through the heels. Lift the hips. Squeeze the glutes at the top. Lower with control.',

  // Upper body
  'push-up': '{name}{detail}. Hands under your shoulders. Body in one line. Chest toward the floor — no ego. If your knees need to go down, drop them. Begin.',
  'push-ups': '{name}{detail}. Hands under your shoulders. Body in one line. Chest toward the floor — no ego. If your knees need to go down, drop them. Begin.',
  'pushup': '{name}{detail}. Hands under your shoulders. Body in one line. Chest toward the floor — no ego. If your knees need to go down, drop them. Begin.',
  'pushups': '{name}{detail}. Hands under your shoulders. Body in one line. Chest toward the floor — no ego. If your knees need to go down, drop them. Begin.',

  // Core
  'plank': '{name}{detail}. Hands or forearms — your call. Body in one line. Don\'t let the hips sag. Don\'t let them spike. Hold it.',
  'side plank': '{name}{detail}. Stack the feet, prop on one elbow, lift the hips. Body in one line, head to feet. Hold tight.',
  'mountain climbers': '{name}{detail}. Plank position. Drive the knees toward your chest. Alternating, fast. Hips stay low. Go.',

  // Conditioning
  'burpee': '{name}{detail}. Squat down, hands on the floor. Kick the feet back. Plank. Bring the feet in. Stand up. Jump if you want. Step if you need. Begin.',
  'burpees': '{name}{detail}. Squat down, hands on the floor. Kick the feet back. Plank. Bring the feet in. Stand up. Jump if you want. Step if you need. Begin.',
  'jumping jacks': '{name}{detail}. Feet together, hands at your sides. Jump wide, arms overhead. Jump back together. Find a rhythm. Go.',
};

// Stable string hash → integer (FNV-1a inspired, plenty good for picking
// among 6 templates deterministically).
function stableHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

function pickByHash(name, arr) {
  return arr[stableHash(String(name || '')) % arr.length];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatExerciseDetail(ex) {
  // duration_seconds is the schema used in PREMADE_WORKOUTS; render as
  // "for 30 seconds" or "for 1 minute" depending on length.
  if (typeof ex.duration_seconds === 'number' && ex.duration_seconds > 0) {
    const s = ex.duration_seconds;
    if (s >= 60 && s % 60 === 0) {
      const m = s / 60;
      return ` for ${m} ${m === 1 ? 'minute' : 'minutes'}`;
    }
    return ` for ${s} seconds`;
  }
  if (ex.duration) return ` for ${ex.duration}`;
  if (ex.reps && ex.sets) return `, ${ex.sets} sets of ${ex.reps}`;
  if (ex.reps) return `, ${ex.reps} reps`;
  if (ex.sets) return `, ${ex.sets} sets`;
  return '';
}

// Estimate how long to hold for an exercise so the audio paces the work.
// Slightly more generous than the v1 — taxing moves (burpees, plank, mountain
// climbers) need more breathing room than the old 3-sec-per-rep math.
//
// Accepts both `duration_seconds` (the convention in PREMADE_WORKOUTS — what
// the existing 33-workout library uses) and `duration` (a string with units,
// older convention some scripts emit). Honors duration_seconds first since
// that's the schema in use everywhere we control.
function exerciseHoldSeconds(ex) {
  if (typeof ex.duration_seconds === 'number' && ex.duration_seconds > 0) {
    return Math.min(180, Math.max(15, Math.round(ex.duration_seconds)));
  }
  if (ex.duration) {
    const m = String(ex.duration).match(/(\d+)\s*(min|sec|s|m)/i);
    if (m) {
      const n = parseInt(m[1], 10);
      const unit = m[2].toLowerCase();
      return unit.startsWith('m') && unit !== 'ms' ? n * 60 : n;
    }
  }

  // Rep-based estimate. Some moves are inherently slower per rep than others.
  const name = String(ex.name || ex.exercise || '').toLowerCase();
  let secsPerRep = 3;
  if (name.includes('burpee')) secsPerRep = 4;
  else if (name.includes('push-up') || name.includes('pushup')) secsPerRep = 2.5;
  else if (name.includes('jumping jack') || name.includes('mountain climber')) secsPerRep = 1.5;

  const reps = parseInt(ex.reps, 10) || 12;
  const sets = parseInt(ex.sets, 10) || 1;
  return Math.min(180, Math.max(35, Math.round(reps * sets * secsPerRep)));
}

function buildCue(ex, idx) {
  const detail = formatExerciseDetail(ex);
  const name = ex.name || ex.exercise || `Exercise ${idx + 1}`;
  const key = String(name).toLowerCase().trim();
  const template = EXERCISE_SPECIFIC_CUES[key] || pickByHash(name + idx, GENERIC_CUE_TEMPLATES);
  return template.replace('{name}', name).replace('{detail}', detail);
}

/**
 * Build the full coached script for a workout.
 * @param {object} workout - { title, category, exercises: [{ name, reps, sets, duration }] }
 * @param {string} coachName - key into COACH_VOICES (default 'Coach David')
 * @returns {{ coachName, character, fn, segments: Array }}
 */
export function buildCoachedScript(workout, coachName = 'Coach David') {
  const voice = COACH_VOICES[coachName] || COACH_VOICES['Coach David'];
  const exercises = Array.isArray(workout?.exercises) ? workout.exercises : [];
  const reflections = getReflectionsFor(workout?.category);
  const segments = [];

  // Intro
  segments.push({
    type: 'intro',
    text: `Let's get to work. Today we're doing ${workout?.title || 'your workout'}. I'm Coach David, and I'll be in your ear the whole way. We move together, we rest together, and we keep our eyes on the One who gives us strength. Let's warm up and lock in.`,
    holdSeconds: 3,
  });

  exercises.forEach((ex, idx) => {
    segments.push({
      type: 'exercise',
      text: buildCue(ex, idx),
      holdSeconds: exerciseHoldSeconds(ex),
    });

    // Reflection during rest (skip after the very last exercise — outro covers it).
    // Reflections cycle through the workout-category-specific bucket, not the
    // global 7. Deterministic per (workout id, idx) so the same workout always
    // gets the same verses in the same order — predictable, builds familiarity.
    if (idx < exercises.length - 1) {
      const reflection = reflections[idx % reflections.length];
      segments.push({
        type: 'rest',
        text: reflection,
        holdSeconds: 20,
      });
    }
  });

  // Outro — now includes a real closing prayer (~25 seconds) to match the
  // app's faith identity. The previous outro ended on "I'm proud of you,"
  // which was fine but missed the prayer beat that differentiates this app
  // from secular fitness apps.
  segments.push({
    type: 'outro',
    text: `That's the work. Well done. You showed up, you pushed, and you honored your body and your God in the process.

Let's pray before we close. Father, thank You. Thank You for this body. Thank You for the breath that filled these lungs. You armed us with strength when we ran low. You called this body a temple, and we honored You with it today. Carry that with us, Lord. Into the rest of this day. In Jesus' name. Amen.

Cool down, hydrate, and carry this strength into your day. I'm proud of you.`,
    holdSeconds: 0,
  });

  return {
    coachName,
    character: voice.character,
    fn: voice.fn,
    segments,
  };
}
