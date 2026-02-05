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
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Devotional content coming soon for this plan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{devotional.title}</h1>
        </div>
      </motion.div>

      {/* Introduction */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c9a227]" />
          Introduction
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {devotional.introduction}
        </p>
      </Card>

      {/* Key Bible Verses */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Key Bible Verses</h2>
        <div className="space-y-4">
          {devotional.keyVerses.map((verse, index) => (
            <div key={index}>
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">{verse.reference}</h3>
              <p className="italic text-gray-700 dark:text-gray-300 mb-2">"{verse.text}"</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{verse.insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reflection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4">Reflection</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {devotional.reflection}
        </p>
      </Card>

      {/* Reflection Questions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Reflection Questions
        </h2>
        <ul className="space-y-3">
          {devotional.reflectionQuestions.map((question, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-300">
              {question}
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Plan */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          {devotional.actionPlan.title}
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-gray-700 dark:text-gray-300">
          {devotional.actionPlan.steps.map((step, index) => (
            <li key={index} className="leading-relaxed">{step}</li>
          ))}
        </ol>
      </Card>

      {/* Prayer */}
      <Card className="p-6 bg-gradient-to-br from-[#c9a227]/10 to-[#8fa68a]/10 border-l-4 border-[#c9a227]">
        <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#c9a227]" />
          Prayer
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          {devotional.prayer}
        </p>
      </Card>
    </div>
  );
}