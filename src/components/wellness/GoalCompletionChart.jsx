import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Target } from 'lucide-react';

export default function GoalCompletionChart({ workouts }) {
  const completedGoals = workouts.filter(w => 
    w.completed_dates && w.completed_dates.length > 0
  ).length;
  
  const totalGoals = workouts.length;
  const inProgress = totalGoals - completedGoals;

  const data = [
    { name: 'Completed', value: completedGoals, color: '#10b981' },
    { name: 'In Progress', value: inProgress, color: '#f59e0b' }
  ];

  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Goal Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1" />
                <span className="text-gray-600">{completedGoals} Completed</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1" />
                <span className="text-gray-600">{inProgress} In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}