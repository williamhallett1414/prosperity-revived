import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

export default function StreakTracker({ type, count, lastDate }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!lastDate) return;
    const last = new Date(lastDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    setIsActive(
      last.toDateString() === today.toDateString() ||
      last.toDateString() === yesterday.toDateString()
    );
  }, [lastDate]);

  const streakLabels = {
    meditation: 'Meditation Streak',
    workout: 'Workout Streak',
    journaling: 'Journaling Streak',
    scripture: 'Scripture Streak',
    challenge: 'Challenge Streak',
    mood: 'Mood Check-in Streak'
  };

  return null;




















}