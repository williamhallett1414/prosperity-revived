import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Zap, BookOpen, Apple, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanPreviewModal({ plan, isOpen, onClose, onStart }) {
  if (!plan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="sticky top-4 right-4 absolute z-10 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Header gradient */}
            <div className={`bg-gradient-to-r ${plan.gradient} p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 backdrop-blur-sm">
                    {plan.cover_emoji}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-2xl mb-1">{plan.title}</h2>
                    <p className="text-white/75 text-sm">{plan.subtitle}</p>
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm">
                    <p className="text-white/65 text-xs font-medium">Duration</p>
                    <p className="text-white font-bold text-sm">{plan.weeks} Weeks</p>
                  </div>
                  <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm">
                    <p className="text-white/65 text-xs font-medium">Total Days</p>
                    <p className="text-white font-bold text-sm">{plan.days_total} Days</p>
                  </div>
                  <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm">
                    <p className="text-white/65 text-xs font-medium">Difficulty</p>
                    <p className="text-white font-bold text-sm">{plan.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About This Plan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
              </div>

              {/* Tags */}
              {plan.tags && plan.tags.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {plan.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-sm px-3 py-1.5 rounded-full bg-[#F5F8F0] text-[#0D4F3C] font-medium border border-[#0D4F3C]/12"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Week themes */}
              {plan.week_themes && plan.week_themes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Weekly Themes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {plan.week_themes.map(week => (
                      <div
                        key={week.week}
                        className={`rounded-lg p-3 bg-gradient-to-br ${week.color} text-white`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold">{week.title}</p>
                            <p className="text-xs opacity-75 mt-0.5">{week.theme}</p>
                          </div>
                          <span className="text-lg">{week.emoji}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample day preview */}
              {plan.days && plan.days.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Sample Day Preview (Day 1)</h3>
                  <div className="bg-[#F5F8F0] rounded-lg p-4 space-y-3">
                    {plan.days[0].bible && (
                      <div className="flex gap-2">
                        <BookOpen className="w-4 h-4 text-[#0D4F3C] flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#0D4F3C]">{plan.days[0].bible.book} {plan.days[0].bible.chapter}</p>
                          <p className="text-xs text-gray-600 mt-0.5 italic">{plan.days[0].bible.key_verse}</p>
                        </div>
                      </div>
                    )}
                    {plan.days[0].workout && (
                      <div className="flex gap-2">
                        <Zap className="w-4 h-4 text-[#0D4F3C] flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#0D4F3C]">Workout</p>
                          <p className="text-xs text-gray-600 mt-0.5">{plan.days[0].workout.motivational_tip}</p>
                        </div>
                      </div>
                    )}
                    {plan.days[0].nutrition && (
                      <div className="flex gap-2">
                        <Apple className="w-4 h-4 text-[#0D4F3C] flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#0D4F3C]">Nutrition Focus</p>
                          <p className="text-xs text-gray-600 mt-0.5">{plan.days[0].nutrition.focus}</p>
                        </div>
                      </div>
                    )}
                    {plan.days[0].journal && (
                      <div className="flex gap-2">
                        <Calendar className="w-4 h-4 text-[#0D4F3C] flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-[#0D4F3C]">Journal Prompt</p>
                          <p className="text-xs text-gray-600 mt-0.5 italic">{plan.days[0].journal.prompt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 py-2.5 rounded-xl font-semibold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onStart();
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-[#0D4F3C] to-[#22856A] hover:opacity-90 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  Begin Journey
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}