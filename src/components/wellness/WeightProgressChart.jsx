import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Scale } from 'lucide-react';

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
        <CardContent className="pt-6 text-center text-gray-500">
          <Scale className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No weight data yet. Add progress photos with weight to track your journey.</p>
        </CardContent>
      </Card>
    );
  }

  const startWeight = weightData[0]?.weight;
  const currentWeight = weightData[weightData.length - 1]?.weight;
  const change = currentWeight - startWeight;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#3C4E53]" />
            Weight Progress
          </span>
          <div className="text-right text-sm">
            <div className="font-normal text-gray-600">Change</div>
            <div className={`font-bold ${change < 0 ? 'text-green-600' : change > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
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
  );
}