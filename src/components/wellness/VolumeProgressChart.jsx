import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function VolumeProgressChart({ sessions }) {
  // Calculate total volume (weight x reps) per session
  const chartData = sessions
    .slice(0, 30)
    .reverse()
    .map(session => {
      let totalVolume = 0;
      let totalSets = 0;

      session.exercises_performed?.forEach(exercise => {
        exercise.sets?.forEach(set => {
          if (set.weight && set.reps) {
            totalVolume += set.weight * set.reps;
            totalSets++;
          }
        });
      });

      return {
        date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: totalVolume,
        sets: totalSets,
        duration: session.duration_minutes || 0
      };
    });

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#3C4E53]" />
            Volume Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Complete workouts with weights to see your volume trends!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#3C4E53]" />
          Volume Progress (Last 30 Workouts)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="volume" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
              name="Total Volume (lbs)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="sets" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
              name="Total Sets"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}