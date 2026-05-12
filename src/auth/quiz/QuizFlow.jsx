import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getQuizAnswers,
  saveQuizAnswers,
  markQuizCompleted,
} from './quizStorage';
import LifeSeason from './screens/LifeSeason';
import HardestArea from './screens/HardestArea';
import RelationshipWithGod from './screens/RelationshipWithGod';
import Priorities from './screens/Priorities';
import CoachingStyle from './screens/CoachingStyle';
import OpenPrayer from './screens/OpenPrayer';
import MomentOfArrival from './screens/MomentOfArrival';

const TOTAL_QUESTIONS = 6;

export default function QuizFlow() {
  const navigate = useNavigate();
  // Step index: 0–5 = the six questions, 6 = moment of arrival.
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => getQuizAnswers());

  // Persist every change to localStorage so the user can close the app
  // mid-quiz and resume.
  useEffect(() => {
    saveQuizAnswers(answers);
  }, [answers]);

  // Resume support: if the user has already completed the quiz once but
  // hasn't signed up yet (e.g., they bounced from the signup screen),
  // jump them to the moment-of-arrival on re-entry.
  useEffect(() => {
    if (answers.completed_at && step === 0) {
      setStep(TOTAL_QUESTIONS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const back = () => {
    if (step === 0) {
      navigate('/welcome');
    } else {
      setStep(s => s - 1);
    }
  };

  const next = () => {
    if (step < TOTAL_QUESTIONS - 1) {
      setStep(s => s + 1);
    } else if (step === TOTAL_QUESTIONS - 1) {
      // Last question complete — mark and advance to moment of arrival
      markQuizCompleted();
      setAnswers(prev => ({ ...prev, completed_at: new Date().toISOString() }));
      setStep(TOTAL_QUESTIONS);
    }
  };

  // From moment of arrival, route to signup. Signup will read quiz answers
  // from localStorage and persist them on register.
  const goToSignup = () => {
    navigate('/signup');
  };

  // ── Render ────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <LifeSeason
        stepIndex={0}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.life_season}
        onChange={(v) => updateField('life_season', v)}
        onBack={back}
        onContinue={next}
      />
    );
  }
  if (step === 1) {
    return (
      <HardestArea
        stepIndex={1}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.hardest_areas}
        onChange={(v) => updateField('hardest_areas', v)}
        onBack={back}
        onContinue={next}
      />
    );
  }
  if (step === 2) {
    return (
      <RelationshipWithGod
        stepIndex={2}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.god_relationship}
        onChange={(v) => updateField('god_relationship', v)}
        onBack={back}
        onContinue={next}
      />
    );
  }
  if (step === 3) {
    return (
      <Priorities
        stepIndex={3}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.priorities}
        onChange={(v) => updateField('priorities', v)}
        onBack={back}
        onContinue={next}
      />
    );
  }
  if (step === 4) {
    return (
      <CoachingStyle
        stepIndex={4}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.coaching_style}
        onChange={(v) => updateField('coaching_style', v)}
        onBack={back}
        onContinue={next}
      />
    );
  }
  if (step === 5) {
    return (
      <OpenPrayer
        stepIndex={5}
        totalSteps={TOTAL_QUESTIONS}
        value={answers.open_prayer}
        onChange={(v) => updateField('open_prayer', v)}
        onBack={back}
        onContinue={next}
        onSkip={() => {
          updateField('open_prayer', '');
          next();
        }}
      />
    );
  }
  // step === 6: moment of arrival
  return (
    <MomentOfArrival
      answers={answers}
      onContinue={goToSignup}
    />
  );
}
