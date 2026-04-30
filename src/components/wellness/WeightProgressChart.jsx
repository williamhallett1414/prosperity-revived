import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function WeightProgressChart({ progressPhotos }) {
  const weightData = progressPhotos
    .filter(p => p.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(p => ({
      date: format(new Date(p.date), 'MMM d'),
      weight: p.weight,
      fullDate: p.date
    }));

  if (weightData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500 dark:text-gray-300">
          <Scale className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-400 dark:text-gray-300" />
          <p>No weight data yet. Add progress photos with weight to track your journey.</p>
        </CardContent>
      </Card>
    );
  }

  const startWeight = weightData[0]?.weight;
  const currentWeight = weightData[weightData.length - 1]?.weight;
  const change = currentWeight - startWeight;

  // History sorted newest first
  const historyData = [...weightData].reverse();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#3C4E53]" />
              Weight Progress
            </span>
            <div className="text-right text-sm">
              <div className="font-normal text-gray-600 dark:text-gray-300">Change</div>
              <div className={`font-bold ${change < 0 ? 'text-green-600' : change > 0 ? 'text-orange-600' : 'text-gray-600 dark:text-gray-300'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)} lbs
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} lbs`, 'Weight']}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weight History Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-[#0A1A2F] dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#38BDF8]" />
            Weight History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {historyData.map((entry, i) => {
              const prev = historyData[i + 1];
              const diff = prev ? entry.weight - prev.weight : null;
              return (
                <div key={entry.fullDate} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white">{entry.weight} lbs</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300">{format(new Date(entry.fullDate), 'MMM d, yyyy')}</p>
                  </div>
                  {diff !== null && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${diff < 0 ? 'text-green-500' : diff > 0 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-300'}`}>
                      {diff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)} lbs
                    </div>
                  )}
                  {diff === null && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-300 font-medium uppercase tracking-wide">Start</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}