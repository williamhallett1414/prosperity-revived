import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PersonalBestsChart({ sessions }) {
  // Calculate PRs for each exercise
  const exercisePRs = {};

  sessions.forEach(session => {
    session.exercises_performed?.forEach(exercise => {
      const exerciseName = exercise.name;
      
      exercise.sets?.forEach(set => {
        if (set.weight && set.reps) {
          const volume = set.weight * set.reps;
          
          if (!exercisePRs[exerciseName] || volume > exercisePRs[exerciseName].volume) {
            exercisePRs[exerciseName] = {
              weight: set.weight,
              reps: set.reps,
              volume: volume,
              date: session.date
            };
          }
        }
      });
    });
  });

  const topPRs = Object.entries(exercisePRs)
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 10);

  if (topPRs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Personal Bests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Start tracking weights to see your personal bests!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Personal Bests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPRs.map(([exercise, pr], index) => (
            <div 
              key={exercise}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-[#1a1a2e] dark:text-white">
                    {exercise}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(pr.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-yellow-700 dark:text-yellow-400">
                  {pr.weight} lbs
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {pr.reps} reps
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}