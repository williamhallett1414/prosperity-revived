import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MobileSelect } from '@/components/ui/MobileSelect';
import { Loader2 } from 'lucide-react';

export default function CreateChallengeModal({ isOpen, onClose, onSubmit, groupId = null }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'water_intake',
    goal_value: '',
    goal_unit: 'glasses',
    duration_days: 30,
    is_group_only: !!groupId,
    reward_points: 100
  });

  const challengeTypes = [
    { value: 'water_intake', label: 'Water Intake', defaultUnit: 'glasses' },
    { value: 'steps', label: 'Daily Steps', defaultUnit: 'steps' },
    { value: 'workouts', label: 'Workouts', defaultUnit: 'sessions' },
    { value: 'meditation', label: 'Meditation', defaultUnit: 'minutes' },
    { value: 'reading', label: 'Bible Reading', defaultUnit: 'days' },
    { value: 'prayer', label: 'Prayer Time', defaultUnit: 'minutes' },
    { value: 'custom', label: 'Custom Challenge', defaultUnit: '' }
  ];

  const handleTypeChange = (type) => {
    const typeData = challengeTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type,
      goal_unit: typeData?.defaultUnit || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(formData.duration_days));

    const challengeData = {
      ...formData,
      goal_value: parseFloat(formData.goal_value),
      duration_days: parseInt(formData.duration_days),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      group_id: groupId,
      status: 'active',
      participant_count: 0,
      is_public: !groupId
    };

    try {
      await onSubmit(challengeData);
      onClose();
      setFormData({
        title: '',
        description: '',
        type: 'water_intake',
        goal_value: '',
        goal_unit: 'glasses',
        duration_days: 30,
        is_group_only: !!groupId,
        reward_points: 100
      });
    } catch (error) {
      console.error('Failed to create challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Community Challenge</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 30-Day Water Challenge"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the challenge and motivate participants..."
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="type">Challenge Type</Label>
            <div className="mt-2">
              <MobileSelect
                value={formData.type}
                onValueChange={handleTypeChange}
                options={challengeTypes.map(t => ({ value: t.value, label: t.label }))}
                placeholder="Select Type"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="goal_value">Goal</Label>
              <Input
                id="goal_value"
                type="number"
                value={formData.goal_value}
                onChange={(e) => setFormData({ ...formData, goal_value: e.target.value })}
                placeholder="e.g., 8"
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="goal_unit">Unit</Label>
              <Input
                id="goal_unit"
                value={formData.goal_unit}
                onChange={(e) => setFormData({ ...formData, goal_unit: e.target.value })}
                placeholder="e.g., glasses"
                required
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <div className="mt-2">
              <MobileSelect
                value={formData.duration_days.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration_days: parseInt(value) })}
                options={[
                  { value: '7', label: '7 days' },
                  { value: '14', label: '14 days' },
                  { value: '21', label: '21 days' },
                  { value: '30', label: '30 days' },
                  { value: '60', label: '60 days' }
                ]}
                placeholder="Select Duration"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reward_points">Reward Points</Label>
            <Input
              id="reward_points"
              type="number"
              value={formData.reward_points}
              onChange={(e) => setFormData({ ...formData, reward_points: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Challenge'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}