import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, Lock, Calendar } from 'lucide-react';

export default function CreateGroupPlanModal({ isOpen, onClose, onSubmit, basePlan }) {
  const [formData, setFormData] = useState({
    group_name: '',
    description: '',
    is_private: false,
    start_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      group_name: '',
      description: '',
      is_private: false,
      start_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8fa68a]" />
            Create Group Reading Plan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Based on: {basePlan?.name}</Label>
            <p className="text-xs text-gray-500 mt-1">{basePlan?.duration} days</p>
          </div>

          <div>
            <Label htmlFor="group_name">Group Name *</Label>
            <Input
              id="group_name"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              placeholder="e.g., Morning Bible Buddies"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this group about?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="start_date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-600" />
              <div>
                <Label htmlFor="is_private" className="text-sm font-medium">Private Group</Label>
                <p className="text-xs text-gray-500">Requires invite code to join</p>
              </div>
            </div>
            <Switch
              id="is_private"
              checked={formData.is_private}
              onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#8fa68a] hover:bg-[#7a9179] text-white"
              disabled={!formData.group_name.trim()}
            >
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}