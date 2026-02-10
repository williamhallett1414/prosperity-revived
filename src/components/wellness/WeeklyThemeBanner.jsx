import React from 'react';
import { motion } from 'framer-motion';

const themes = [
  { name: 'Peace', emoji: '☮️', color: 'from-[#AFC7E3] to-[#D9B878]', message: 'This week, cultivate inner peace' },
  { name: 'Strength', emoji: '💪', color: 'from-[#D9B878] to-[#FD9C2D]', message: 'This week, build your strength' },
  { name: 'Discipline', emoji: '⛓️', color: 'from-[#0A1A2F] to-[#AFC7E3]', message: 'This week, embrace discipline' },
  { name: 'Renewal', emoji: '🌱', color: 'from-[#FD9C2D] to-[#D9B878]', message: 'This week, renew yourself' }
];

export default function WeeklyThemeBanner() {
  const weekNumber = Math.floor(new Date().getDate() / 7);
  const theme = themes[weekNumber % themes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${theme.color} rounded-2xl p-6 mb-8 mx-4 text-center text-[#0A1A2F] shadow-md`}
    >
      <div className="text-4xl mb-2">{theme.emoji}</div>
      <h2 className="text-2xl font-bold mb-1">{theme.name}</h2>
      <p className="text-sm text-[#0A1A2F]/70">{theme.message}</p>
    </motion.div>
  );
}