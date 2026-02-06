import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

export default function WorkoutFrequencyChart({ sessions }) {
  // Group sessions by week
  const getWeekNumber = (date) => {
    const d = new Date(date);
    const onejan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  const last12Weeks = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    return {
      week: getWeekNumber(date),
      year: date.getFullYear(),
      label: `Week ${getWeekNumber(date)}`
    };
  }).reverse();

  const chartData = last12Weeks.map(week => {
    const count = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return getWeekNumber(sessionDate) === week.week && 
             sessionDate.getFullYear() === week.year;
    }).length;

    return {
      name: week.label,
      workouts: count
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Workout Frequency (Last 12 Weeks)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="workouts" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}