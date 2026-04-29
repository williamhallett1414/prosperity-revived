import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const MOOD_SCORES = {
  joyful: 9,
  grateful: 8,
  hopeful: 7,
  peaceful: 6,
  seeking: 4,
  struggling: 2,
};

const MOOD_COLORS = {
  joyful: '#f59e0b',
  grateful: '#22c55e',
  hopeful: '#3b82f6',
  peaceful: '#14b8a6',
  seeking: '#a855f7',
  struggling: '#f87171',
};

export default function GratitudeMoodChart({ entries }) {
  const chartData = [...entries]
    .reverse()
    .slice(-14)
    .map(entry => {
      const scoreTag = entry.tags?.find(t => t.startsWith('score:'));
      const score = scoreTag ? parseInt(scoreTag.split(':')[1]) : (MOOD_SCORES[entry.mood] || 5);
      return {
        date: format(new Date(entry.created_date), 'MMM d'),
        score,
        mood: entry.mood,
      };
    });

  const moodCount = {};
  entries.forEach(e => {
    if (e.mood) moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
  });
  const topMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const avgScore = chartData.length
    ? (chartData.reduce((s, d) => s + d.score, 0) / chartData.length).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-[#FD9C2D]" />
        <h3 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Mood Over Time</h3>
        {avgScore && (
          <span className="ml-auto text-xs text-gray-400">Avg: <span className="text-[#FD9C2D] font-semibold">{avgScore}/10</span></span>
        )}
      </div>

      {chartData.length < 2 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Write at least 2 entries to see your mood trend
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#9ca3af' }} width={20} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(val) => [`${val}/10`, 'Mood Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FD9C2D"
              strokeWidth={2.5}
              dot={{ fill: '#FD9C2D', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {topMoods.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
          <p className="text-xs text-gray-400 mb-2">Most frequent moods</p>
          <div className="flex flex-wrap gap-2">
            {topMoods.map(([mood, count]) => (
              <span key={mood}
                style={{ backgroundColor: `${MOOD_COLORS[mood]}18`, color: MOOD_COLORS[mood] }}
                className="text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                {mood} ({count})
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}