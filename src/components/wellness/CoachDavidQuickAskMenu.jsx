import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function CoachDavidQuickAskMenu({ onSelectPrompt, isLoading }) {
  const quickAsks = [
    {
      label: "📋 Build Workout Plan",
      prompt: "Build me a workout plan. Here are my goals:"
    },
    {
      label: "⚡ Quick Workout Now",
      prompt: "Give me a quick workout I can do right now. I have this much time:"
    },
    {
      label: "🔄 Stay Consistent",
      prompt: "Help me stay consistent. Here's where I'm struggling:"
    },
    {
      label: "💪 Fix My Form",
      prompt: "Fix my form. Here's the exercise I need help with:"
    },
    {
      label: "🔥 Motivate Me Today",
      prompt: "Motivate me today. Here's how I'm feeling:"
    },
    {
      label: "📅 Weekly Schedule",
      prompt: "Create a weekly workout schedule for me. Here are my constraints:"
    },
    {
      label: "⛰️ Break a Plateau",
      prompt: "Help me break a plateau. Here's what's been happening:"
    },
    {
      label: "🔥 Fat-Loss Strategy",
      prompt: "Give me a fat-loss strategy. Here's my current routine:"
    },
    {
      label: "💪 Muscle-Building",
      prompt: "Give me a muscle-building strategy. Here's my current routine:"
    },
    {
      label: "📍 Hold Me Accountable",
      prompt: "Hold me accountable. Here's the commitment I want to make today:"
    }
  ];

  return (
    <div className="px-4 py-3 border-b border-[#E6EBEF] bg-gradient-to-b from-white to-[#F2F6FA]">
      <p className="text-xs font-semibold text-[#0A1A2F]/70 mb-3">Quick Fitness Needs:</p>
      <div className="grid grid-cols-2 gap-2">
        {quickAsks.map((item, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={isLoading}
            className="text-xs px-3 py-2 rounded-lg bg-white hover:bg-[#E6EBEF] text-[#0A1A2F] border border-[#E6EBEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left font-medium"
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}