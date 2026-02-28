import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function ChallengeProgressChart({ progressLogs, goalValue, goalUnit, showArea = false }) {
  const chartData = progressLogs?.map((log, index) => {
    const cumulativeProgress = progressLogs
      .slice(0, index + 1)
      .reduce((sum, l) => sum + l.value, 0);
    
    return {
      date: format(parseISO(log.date), 'MMM dd'),
      progress: cumulativeProgress,
      daily: log.value,
      goal: goalValue
    };
  }) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{payload[0].payload.date}</p>
          <p className="text-[#8a6e1a]">Total: {payload[0].value} {goalUnit}</p>
          <p className="text-gray-600">Daily: +{payload[0].payload.daily} {goalUnit}</p>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No progress data yet. Start logging your progress!</p>
      </div>
    );
  }

  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartComponent data={chartData}>
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9ca3af"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        
        <Line
          type="monotone"
          dataKey="goal"
          stroke="#d1d5db"
          strokeDasharray="5 5"
          dot={false}
        />
        
        {showArea ? (
          <Area
            type="monotone"
            dataKey="progress"
            stroke="#9333ea"
            strokeWidth={3}
            fill="url(#progressGradient)"
          />
        ) : (
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#9333ea"
            strokeWidth={3}
            dot={{ fill: '#9333ea', r: 5 }}
            activeDot={{ r: 7 }}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}