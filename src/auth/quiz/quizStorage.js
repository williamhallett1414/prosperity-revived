/**
 * Pre-signup quiz answer storage.
 *
 * Quiz answers are collected before the user creates an account, so there's
 * no User entity to save to yet. We persist them in localStorage under a
 * single key so the user can close the app mid-quiz and resume, and so
 * Signup.jsx can pick them up and write them to the User on register.
 *
 * After successful signup + save, the storage is cleared.
 */

const KEY = 'pr_pre_quiz_answers';

const EMPTY = {
  life_season: '',           // Q1 — single select
  hardest_areas: [],         // Q2 — multi select
  god_relationship: '',      // Q3 — single select
  priorities: [],            // Q4 — multi select, max 3
  coaching_style: '',        // Q5 — single select
  open_prayer: '',           // Q6 — optional open text
  completed_at: null,        // ISO timestamp on quiz completion
};

const isBrowser = () => typeof window !== 'undefined' && !!window.localStorage;

export function getQuizAnswers() {
  if (!isBrowser()) return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    // Defensive: shape match — drop anything we don't recognize, fill in missing.
    return {
      life_season: typeof parsed.life_season === 'string' ? parsed.life_season : '',
      hardest_areas: Array.isArray(parsed.hardest_areas) ? parsed.hardest_areas : [],
      god_relationship: typeof parsed.god_relationship === 'string' ? parsed.god_relationship : '',
      priorities: Array.isArray(parsed.priorities) ? parsed.priorities : [],
      coaching_style: typeof parsed.coaching_style === 'string' ? parsed.coaching_style : '',
      open_prayer: typeof parsed.open_prayer === 'string' ? parsed.open_prayer : '',
      completed_at: typeof parsed.completed_at === 'string' ? parsed.completed_at : null,
    };
  } catch (_e) {
    return { ...EMPTY };
  }
}

export function saveQuizAnswers(answers) {
  if (!isBrowser()) return;
  try {
    const current = getQuizAnswers();
    const next = { ...current, ...answers };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch (_e) {}
}

export function markQuizCompleted() {
  saveQuizAnswers({ completed_at: new Date().toISOString() });
}

export function clearQuizAnswers() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch (_e) {}
}

export function hasQuizAnswers() {
  if (!isBrowser()) return false;
  try {
    return !!window.localStorage.getItem(KEY);
  } catch (_e) {
    return false;
  }
}

// Map quiz priority IDs to the existing post-onboarding `motivations` IDs so
// that step can be pre-filled and skipped. Anything without a clean mapping
// is dropped silently.
const PRIORITY_TO_MOTIVATION = {
  deeper_spiritual_life: 'grow_spiritually',
  stronger_body: 'build_muscle',
  calmer_mind: 'manage_stress',
  better_relationships: 'relationships',
  clearer_purpose: 'find_purpose',
  more_discipline: 'better_habits',
  better_nutrition: 'eat_healthier',
  // more_rest has no clean mapping — preserved in `priorities` field only
};

/**
 * Translate the full quiz answers into fields ready to be merged into the
 * User entity via base44.auth.updateMe(). The quiz-native fields are kept
 * verbatim (life_season, hardest_areas, god_relationship, priorities,
 * open_prayer); coaching_style maps directly to the existing field;
 * priorities also populate `motivations` for the why-step prefill.
 */
export function quizAnswersToUserFields(answers) {
  if (!answers) return {};
  const fields = {
    life_season: answers.life_season || '',
    hardest_areas: Array.isArray(answers.hardest_areas) ? answers.hardest_areas : [],
    god_relationship: answers.god_relationship || '',
    priorities: Array.isArray(answers.priorities) ? answers.priorities : [],
    open_prayer: answers.open_prayer || '',
    coaching_style: answers.coaching_style || '',
    quiz_completed_at: answers.completed_at || null,
  };
  // Populate motivations from priorities so the post-onboarding why step
  // can pre-fill and skip. Filter out anything that doesn't map cleanly.
  const motivations = (fields.priorities || [])
    .map(p => PRIORITY_TO_MOTIVATION[p])
    .filter(Boolean);
  if (motivations.length) fields.motivations = motivations;
  return fields;
}
