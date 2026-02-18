import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';

export default function WorkoutStreakCard({ sessions }) {
  // Calculate current streak
  const calculateStreak = () => {
    if (sessions.length === 0) return { current: 0, longest: 0 };

    const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let previousDate = null;

    sortedDates.forEach(dateStr => {
      const date = new Date(dateStr);
      
      if (previousDate) {
        const diffDays = Math.floor((previousDate - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      previousDate = date;
    });

    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Check if current streak is active (workout today or yesterday)
    const today = new Date();
    const lastWorkout = new Date(sortedDates[0]);
    const daysSinceLastWorkout = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
    
    currentStreak = daysSinceLastWorkout <= 1 ? tempStreak : 0;

    return { current: currentStreak, longest: longestStreak };
  };

  const { current, longest } = calculateStreak();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-[#FD9C2D] via-[#3C4E53] to-[#FAD98D] border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Flame className="w-5 h-5" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-2 text-white">{current}</div>
          <p className="text-white/90">days in a row</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#FAD98D] via-[#3C4E53] to-[#FD9C2D] border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            Longest Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-2 text-white">{longest}</div>
          <p className="text-white/90">days total</p>
        </CardContent>
      </Card>
    </div>
  );
}