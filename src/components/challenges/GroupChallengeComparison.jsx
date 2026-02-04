import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, TrendingUp, Award } from 'lucide-react';

export default function GroupChallengeComparison({ participants, challenge, currentUserEmail }) {
  const topParticipants = [...participants]
    .sort((a, b) => b.current_progress - a.current_progress)
    .slice(0, 10);

  const chartData = topParticipants.map((p, index) => ({
    name: p.user_name?.split(' ')[0] || 'User',
    progress: p.current_progress,
    isCurrentUser: p.user_email === currentUserEmail,
    rank: index + 1
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-purple-600">
            {data.progress} {challenge.goal_unit}
          </p>
          <p className="text-sm text-gray-500">Rank #{data.rank}</p>
        </div>
      );
    }
    return null;
  };

  const averageProgress = participants.length > 0
    ? participants.reduce((sum, p) => sum + p.current_progress, 0) / participants.length
    : 0;

  const completionRate = participants.length > 0
    ? (participants.filter(p => p.completed).length / participants.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{averageProgress.toFixed(1)}</p>
          <p className="text-xs text-gray-600">Avg Progress</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
          <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{completionRate.toFixed(0)}%</p>
          <p className="text-xs text-gray-600">Completion</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center">
          <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{participants.length}</p>
          <p className="text-xs text-gray-600">Participants</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white rounded-xl p-4">
        <h3 className="font-semibold mb-4 text-gray-900">Top 10 Participants</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="progress" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.isCurrentUser ? '#9333ea' : index < 3 ? '#f59e0b' : '#d1d5db'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}