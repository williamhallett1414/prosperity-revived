import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Smile, Battery } from 'lucide-react';

export default function MoodEnergyChart({ moodEnergyData }) {
  const moodValues = {
    'very_low': 1,
    'low': 2,
    'neutral': 3,
    'good': 4,
    'excellent': 5
  };

  const energyValues = {
    'exhausted': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'energized': 5
  };

  const chartData = moodEnergyData?.slice(-14).map(entry => ({
    date: format(parseISO(entry.date), 'MMM dd'),
    mood: moodValues[entry.mood] || 3,
    energy: energyValues[entry.energy_level] || 3,
    moodLabel: entry.mood,
    energyLabel: entry.energy_level,
    notes: entry.notes
  })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#3C4E53]" />
              <span className="text-sm">Mood: {payload[0].payload.moodLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-green-600" />
              <span className="text-sm">Energy: {payload[0].payload.energyLabel}</span>
            </div>
          </div>
          {payload[0].payload.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">"{payload[0].payload.notes}"</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No mood/energy data yet. Start tracking to see trends!</p>
      </div>
    );
  }

  const avgMood = chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length;
  const avgEnergy = chartData.reduce((sum, d) => sum + d.energy, 0) / chartData.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F2F6FA] rounded-xl p-3 text-center">
          <Smile className="w-5 h-5 text-[#3C4E53] mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{avgMood.toFixed(1)}/5</p>
          <p className="text-xs text-gray-600">Avg Mood</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <Battery className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{avgEnergy.toFixed(1)}/5</p>
          <p className="text-xs text-gray-600">Avg Energy</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
          />
          <YAxis 
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Mood"
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Energy"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}