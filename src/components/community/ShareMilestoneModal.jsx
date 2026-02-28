import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { X, Share2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ShareMilestoneModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    share_type: 'general_win',
    title: '',
    content: '',
    chatbot_source: 'general',
    is_anonymous: false,
    visibility: 'public'
  });

  const createShareMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.CommunityShare.create({
        ...data,
        user_display_name: data.is_anonymous ? null : user.full_name,
        encouragement_count: 0
      });
    },
    onSuccess: () => {
      toast.success('Milestone shared with the community!');
      onSuccess();
    },
    onError: (error) => {
      toast.error('Failed to share milestone');
      console.error(error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    createShareMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c9a227] to-[#D9B878] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Share Your Milestone</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label>Milestone Type</Label>
            <Select
              value={formData.share_type}
              onValueChange={(value) => setFormData({ ...formData, share_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness_goal">🏋️ Fitness Goal</SelectItem>
                <SelectItem value="emotional_breakthrough">💜 Emotional Breakthrough</SelectItem>
                <SelectItem value="spiritual_insight">📖 Spiritual Insight</SelectItem>
                <SelectItem value="nutrition_milestone">🥗 Nutrition Milestone</SelectItem>
                <SelectItem value="general_win">✨ General Win</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Associated Guide (Optional)</Label>
            <Select
              value={formData.chatbot_source}
              onValueChange={(value) => setFormData({ ...formData, chatbot_source: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="Hannah">💜 Hannah - Personal Growth</SelectItem>
                <SelectItem value="CoachDavid">💪 Coach David - Fitness</SelectItem>
                <SelectItem value="ChefDaniel">👨‍🍳 Chef Daniel - Nutrition</SelectItem>
                <SelectItem value="Gideon">📖 Gideon - Spiritual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Hit my fitness goal!"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share what you achieved and how it felt..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                Share anonymously (your name won't be shown)
              </Label>
            </div>

            <div>
              <Label>Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">🌍 Public - Everyone can see</SelectItem>
                  <SelectItem value="friends">👥 Friends Only</SelectItem>
                  <SelectItem value="private">🔒 Private - Just for me</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createShareMutation.isPending}
              className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:opacity-90 text-white"
            >
              {createShareMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Milestone
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}