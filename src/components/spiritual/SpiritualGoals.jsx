import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Target, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const categoryIcons = {
  prayer: '🙏',
  bible_study: '📖',
  service: '🤝',
  worship: '🎵',
  fasting: '🕊️',
  fellowship: '👥',
  evangelism: '📢',
  other: '✨'
};

export default function SpiritualGoals() {
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'prayer',
    frequency: 'daily',
    target_date: '',
    status: 'active'
  });

  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['spiritualGoals'],
    queryFn: () => base44.entities.SpiritualGoal.list('-created_date')
  });

  const createGoal = useMutation({
    mutationFn: (data) => base44.entities.SpiritualGoal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['spiritualGoals']);
      setShowCreate(false);
      setNewGoal({
        title: '',
        description: '',
        category: 'prayer',
        frequency: 'daily',
        target_date: '',
        status: 'active'
      });
    }
  });

  const markComplete = useMutation({
    mutationFn: async (goal) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedDates = goal.completed_dates || [];
      
      if (!completedDates.includes(today)) {
        return base44.entities.SpiritualGoal.update(goal.id, {
          completed_dates: [...completedDates, today],
          progress: Math.min(100, (goal.progress || 0) + 10)
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['spiritualGoals'])
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SpiritualGoal.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(['spiritualGoals'])
  });

  const handleSubmit = () => {
    if (newGoal.title.trim()) {
      createGoal.mutate(newGoal);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const isCompletedToday = (goal) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return goal.completed_dates?.includes(today);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowCreate(true)}
        className="w-full bg-[#1a1a2e] hover:bg-[#2d2d4a]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Set New Goal
      </Button>

      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No spiritual goals set</p>
          <Button onClick={() => setShowCreate(true)}>
            Set Your First Goal
          </Button>
        </div>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-[#1a1a2e]">Active Goals</h3>
              {activeGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{categoryIcons[goal.category]}</span>
                        <h4 className="font-semibold text-[#1a1a2e]">{goal.title}</h4>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline">{goal.frequency}</Badge>
                        {goal.target_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(goal.target_date), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#c9a227]">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => markComplete.mutate(goal)}
                      disabled={isCompletedToday(goal)}
                      className={`flex-1 ${
                        isCompletedToday(goal)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-[#c9a227] hover:bg-[#b89320] text-white'
                      }`}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {isCompletedToday(goal) ? 'Done Today!' : 'Mark Complete Today'}
                    </Button>
                    {goal.progress >= 100 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus.mutate({ id: goal.id, status: 'completed' })}
                      >
                        Finish Goal
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-gray-600">Completed Goals</h3>
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 opacity-70"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">{goal.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Goal Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Spiritual Goal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Title *</label>
              <Input
                placeholder="e.g., Pray every morning"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="What do you want to achieve?"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prayer">🙏 Prayer</SelectItem>
                    <SelectItem value="bible_study">📖 Bible Study</SelectItem>
                    <SelectItem value="service">🤝 Service</SelectItem>
                    <SelectItem value="worship">🎵 Worship</SelectItem>
                    <SelectItem value="fasting">🕊️ Fasting</SelectItem>
                    <SelectItem value="fellowship">👥 Fellowship</SelectItem>
                    <SelectItem value="evangelism">📢 Evangelism</SelectItem>
                    <SelectItem value="other">✨ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Frequency</label>
                <Select
                  value={newGoal.frequency}
                  onValueChange={(value) => setNewGoal({ ...newGoal, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Target Date (Optional)</label>
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!newGoal.title.trim()}
                className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                Set Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}