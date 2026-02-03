import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function WorkoutProgressCharts({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('weight_used');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date'),
    enabled: !!user
  });

  // Get unique exercises
  const allExercises = [...new Set(
    sessions.flatMap(s => s.exercises_performed?.map(e => e.name) || [])
  )].sort();

  // Prepare chart data
  const chartData = sessions
    .filter(s => s.exercises_performed?.some(e => e.name === selectedExercise))
    .map(session => {
      const exercise = session.exercises_performed.find(e => e.name === selectedExercise);
      return {
        date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: exercise?.weight_used || 0,
        reps: exercise?.reps_completed || 0,
        sets: exercise?.sets_completed || 0,
        duration: exercise?.duration_seconds || 0
      };
    })
    .reverse()
    .slice(0, 20);

  const metricConfig = {
    weight_used: { key: 'weight', label: 'Weight (lbs)', color: '#10b981' },
    reps_completed: { key: 'reps', label: 'Reps', color: '#3b82f6' },
    sets_completed: { key: 'sets', label: 'Sets', color: '#8b5cf6' },
    duration_seconds: { key: 'duration', label: 'Duration (sec)', color: '#f59e0b' }
  };

  const currentMetric = metricConfig[selectedMetric];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Exercise Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Exercise</label>
              <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {allExercises.map(ex => (
                    <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_used">Weight Used</SelectItem>
                  <SelectItem value="reps_completed">Reps Completed</SelectItem>
                  <SelectItem value="sets_completed">Sets Completed</SelectItem>
                  <SelectItem value="duration_seconds">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedExercise && chartData.length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-4">{selectedExercise} - {currentMetric.label}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={currentMetric.key}
                      stroke={currentMetric.color}
                      strokeWidth={2}
                      dot={{ fill: currentMetric.color, r: 4 }}
                      name={currentMetric.label}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Best</p>
                  <p className="font-bold text-emerald-600">
                    {Math.max(...chartData.map(d => d[currentMetric.key]))}
                  </p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                  <p className="font-bold text-blue-600">
                    {(chartData.reduce((sum, d) => sum + d[currentMetric.key], 0) / chartData.length).toFixed(1)}
                  </p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
                  <p className="font-bold text-purple-600">{chartData.length}</p>
                </div>
              </div>
            </div>
          ) : selectedExercise ? (
            <div className="text-center py-12 text-gray-500">
              No data recorded for this exercise yet
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select an exercise to view progress
            </div>
          )}

          {/* Recent Sessions */}
          {selectedExercise && sessions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Recent Sessions</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sessions
                  .filter(s => s.exercises_performed?.some(e => e.name === selectedExercise))
                  .slice(0, 5)
                  .map(session => {
                    const exercise = session.exercises_performed.find(e => e.name === selectedExercise);
                    return (
                      <div key={session.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-3 text-xs">
                          {exercise.weight_used > 0 && <span>{exercise.weight_used} lbs</span>}
                          {exercise.sets_completed > 0 && <span>{exercise.sets_completed} sets</span>}
                          {exercise.reps_completed > 0 && <span>{exercise.reps_completed} reps</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}