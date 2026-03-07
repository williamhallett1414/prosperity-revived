import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, Globe } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ShareWorkoutModal({ isOpen, onClose, workout, user }) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const queryClient = useQueryClient();

  const generateShareCode = () => {
    return `WO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const shareWorkout = useMutation({
    mutationFn: async () => {
      const shareCode = workout.share_code || generateShareCode();
      await base44.entities.WorkoutPlan.update(workout.id, {
        is_shared: true,
        share_code: shareCode,
        creator_name: user?.full_name || user?.email || 'Anonymous'
      });
      return shareCode;
    },
    onSuccess: (shareCode) => {
      queryClient.invalidateQueries(['workouts']);
      const link = `${window.location.origin}${window.location.pathname}?shared=${shareCode}`;
      setShareLink(link);
      toast.success('Workout is now shared!');
    }
  });

  const unshareWorkout = useMutation({
    mutationFn: async () => {
      await base44.entities.WorkoutPlan.update(workout.id, {
        is_shared: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      setShareLink('');
      toast.success('Workout is now private');
    }
  });

  useEffect(() => {
    if (workout?.is_shared && workout?.share_code) {
      const link = `${window.location.origin}${window.location.pathname}?shared=${workout.share_code}`;
      setShareLink(link);
    } else {
      setShareLink('');
    }
  }, [workout]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#0EA5E9]" />
            Share Workout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#F2F6FA] border border-[#BAE6FD]/30 rounded-lg p-4">
            <h3 className="font-semibold text-[#0A1A2F] mb-1">{workout?.title}</h3>
            <p className="text-sm text-[#0A1A2F]/60">
              {workout?.exercises?.length || 0} exercises • {workout?.duration_minutes} min
            </p>
          </div>

          {!workout?.is_shared ? (
            <div className="space-y-3">
              <p className="text-sm text-[#0A1A2F]/55">
                Share this workout with others so they can add it to their routine!
              </p>
              <Button
                onClick={() => shareWorkout.mutate()}
                className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90"
                disabled={shareWorkout.isPending}
              >
                <Globe className="w-4 h-4 mr-2" />
                {shareWorkout.isPending ? 'Sharing...' : 'Make Public & Generate Link'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#0A1A2F]/60 mb-2">Share this link:</p>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-[#F2F6FA] border border-[#AFC7E3]/40 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Public:</span> Anyone with this link can view and copy your workout.
                </p>
              </div>

              <Button
                onClick={() => unshareWorkout.mutate()}
                variant="outline"
                className="w-full border-[#BAE6FD]/40 text-[#0A1A2F]/60 hover:bg-[#F2F6FA]"
                disabled={unshareWorkout.isPending}
              >
                {unshareWorkout.isPending ? 'Removing...' : 'Make Private'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}