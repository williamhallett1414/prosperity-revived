import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Sparkles, Target, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { devotionalContent } from './DevotionalData';

export default function PlanDevotionalView({ planId }) {
  const devotional = devotionalContent[planId];

  if (!devotional) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-[#0A1A2F]/35 dark:text-white/35 mx-auto mb-3" />
        <p className="text-[#0A1A2F]/50 dark:text-white/50">Devotional content coming soon for this plan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#C9A227] to-[#0A1A2F] rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{devotional.title}</h1>
        </div>
      </motion.div>

      {/* Introduction */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c9a227]" />
          Introduction
        </h2>
        <p className="text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed">
          {devotional.introduction}
        </p>
      </Card>

      {/* Key Bible Verses */}
      <Card className="p-6 bg-gradient-to-br from-[#FAD98D]/15 to-[#FAD98D]/10 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4">Key Bible Verses</h2>
        <div className="space-y-4">
          {devotional.keyVerses.map((verse, index) => (
            <div key={index}>
              <h3 className="font-semibold text-[#0A1A2F] dark:text-white mb-2">{verse.reference}</h3>
              <p className="italic text-[#0A1A2F]/75 dark:text-white/75 mb-2">"{verse.text}"</p>
              <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60">{verse.insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reflection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4">Reflection</h2>
        <p className="text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed">
          {devotional.reflection}
        </p>
      </Card>

      {/* Reflection Questions */}
      <Card className="p-6 bg-gradient-to-br from-[#FAD98D]/10 to-[#FAD98D]/8">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#0A1A2F] dark:text-white dark:text-white" />
          Reflection Questions
        </h2>
        <ul className="space-y-3">
          {devotional.reflectionQuestions.map((question, index) => (
            <li key={index} className="text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed pl-4 border-l-2 border-[#AFC7E3]/60">
              {question}
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Plan */}
      <Card className="p-6 bg-gradient-to-br from-[#FAD98D]/10 to-[#FFF9EC] dark:to-[#FAD98D]/5">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#C9A227]" />
          {devotional.actionPlan.title}
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-[#0A1A2F]/75 dark:text-white/75">
          {devotional.actionPlan.steps.map((step, index) => (
            <li key={index} className="leading-relaxed">{step}</li>
          ))}
        </ol>
      </Card>

      {/* Prayer */}
      <Card className="p-6 bg-gradient-to-br from-[#c9a227]/10 to-[#FAD98D]/10 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#c9a227]" />
          Prayer
        </h2>
        <p className="text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed italic">
          {devotional.prayer}
        </p>
      </Card>
    </div>
  );
}