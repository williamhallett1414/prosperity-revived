import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, BookOpen, Dumbbell, Utensils, BookMarked } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function PreviewPlanModal({ plan, open, onOpenChange }) {
  const navigate = useNavigate();
  if (!plan || !plan.days || plan.days.length === 0) return null;

  const day1 = plan.days[0];

  const handleStartPlan = () => {
    onOpenChange(false);
    navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=1`));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div>
              <DialogTitle className="text-2xl">{plan.title}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">{plan.subtitle}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Day 1 Header */}
          <div className={`bg-gradient-to-r ${plan.gradient} rounded-xl p-4 text-white`}>
            <p className="text-sm font-semibold opacity-90">Day 1 of {plan.days_total}</p>
            <h3 className="text-2xl font-bold mt-2">{day1.title}</h3>
            <p className="text-sm opacity-75 mt-1">{plan.weeks} weeks • {plan.days_total} days</p>
          </div>

          {/* Preview Tabs */}
          <Tabs defaultValue="scripture" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scripture" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Scripture</span>
              </TabsTrigger>
              <TabsTrigger value="workout" className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                <span className="hidden sm:inline">Workout</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
            </TabsList>

            {/* Scripture */}
            {day1.bible && (
              <TabsContent value="scripture" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Reading</p>
                    <p className="text-lg font-bold text-gray-900">
                      {day1.bible.book} {day1.bible.chapter}:{day1.bible.verse_range}
                    </p>
                  </div>

                  {day1.bible.key_verse && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600 italic">"{day1.bible.key_verse}"</p>
                    </div>
                  )}

                  {day1.bible.devotion && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-2">Devotion</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{day1.bible.devotion}</p>
                    </div>
                  )}

                  {day1.bible.reflection_q && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-amber-900 mb-2">Reflection Question</p>
                      <p className="text-sm text-amber-800">{day1.bible.reflection_q}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Workout */}
            {day1.workout && (
              <TabsContent value="workout" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Type</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{day1.workout.premade_id}</p>
                  </div>

                  {day1.workout.motivational_tip && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Motivation</p>
                      <p className="text-sm text-blue-800">"{day1.workout.motivational_tip}"</p>
                    </div>
                  )}

                  {day1.workout.coach_note && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-900 mb-1">Coach's Note</p>
                      <p className="text-sm text-green-800">{day1.workout.coach_note}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Nutrition */}
            {day1.nutrition && (
              <TabsContent value="nutrition" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Focus</p>
                    <p className="text-lg font-bold text-gray-900">{day1.nutrition.focus}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600">Theme</p>
                    <p className="text-gray-900">{day1.nutrition.meal_theme}</p>
                  </div>

                  {day1.nutrition.plan && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-900 mb-2">Sample Meals</p>
                      <p className="text-sm text-green-800 whitespace-pre-wrap">{day1.nutrition.plan}</p>
                    </div>
                  )}

                  {day1.nutrition.tip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-amber-900 mb-1">Tip</p>
                      <p className="text-sm text-amber-800">{day1.nutrition.tip}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Journal */}
            {day1.journal && (
              <TabsContent value="journal" className="space-y-4">
                <div className="space-y-3">
                  {day1.journal.prompt && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-900 mb-2">Journal Prompt</p>
                      <p className="text-sm text-purple-800">{day1.journal.prompt}</p>
                    </div>
                  )}

                  {day1.affirmation && (
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-pink-900 mb-2">Daily Affirmation</p>
                      <p className="text-sm text-pink-800 italic">"{day1.affirmation}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* CTA */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleStartPlan}
              className={`flex-1 bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-bold py-2.5 rounded-lg`}
            >
              Start This Plan
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}