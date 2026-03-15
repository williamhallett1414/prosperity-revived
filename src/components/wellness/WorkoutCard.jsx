import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle, Clock, Dumbbell,
  Share2, Eye, Play, ThumbsUp, MessageCircle, Copy,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareWorkoutModal from './ShareWorkoutModal';
import WorkoutDetailModal from './WorkoutDetailModal';
import CommentSection from './CommentSection';
import StartWorkoutModal from './StartWorkoutModal';

const DIFFICULTY_STYLES = {
  beginner:     'bg-[#38BDF8]/12 text-[#0EA5E9]',
  intermediate: 'bg-[#FD9C2D]/12 text-[#E89020]',
  advanced:     'bg-[#0A1A2F]/8 text-[#0A1A2F]',
};

export default function WorkoutCard({
  workout,
  onComplete,
  index = 0,
  isPremade = false,
  user,
  showCommunityStats = false
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const queryClient = useQueryClient();

  const likeWorkout = useMutation({
    mutationFn: async () => {
      const newLikes = (workout.likes || 0) + (hasLiked ? -1 : 1);
      return base44.entities.WorkoutPlan.update(workout.id, { likes: newLikes });
    },
    onSuccess: () => {
      setHasLiked(!hasLiked);
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['communityWorkouts']);
      queryClient.invalidateQueries(['sharedWorkouts']);
    }
  });

  const copyWorkout = useMutation({
    mutationFn: async () => {
      await base44.entities.WorkoutPlan.create({
        title: `${workout.title} (Copy)`,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        completed_dates: []
      });
      if (workout.id) {
        await base44.entities.WorkoutPlan.update(workout.id, {
          times_copied: (workout.times_copied || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      toast.success('Workout added to your library!');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#BAE6FD]/30 shadow-sm"
    >
      {workout.image_url && (
        <div className="relative h-36 overflow-hidden">
          <img src={workout.image_url} alt={workout.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/50 to-transparent" />
          {workout.difficulty && (
            <span className={`absolute bottom-2.5 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[workout.difficulty] || 'bg-white/20 text-white'} backdrop-blur-sm`}>
              {workout.difficulty}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-[#0A1A2F] text-base truncate">{workout.title}</h3>
              {!workout.image_url && workout.difficulty && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${DIFFICULTY_STYLES[workout.difficulty] || 'bg-[#BAE6FD]/15 text-[#0A1A2F]/60'}`}>
                  {workout.difficulty}
                </span>
              )}
            </div>
            {showCommunityStats && workout.creator_name && (
              <p className="text-xs text-[#0A1A2F]/40 mb-1">by {workout.creator_name}</p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            {!isPremade && (
              <button onClick={() => setShowShareModal(true)}
                className="w-8 h-8 rounded-full hover:bg-[#38BDF8]/10 flex items-center justify-center text-[#0EA5E9] transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setShowDetailModal(true)}
              className="w-8 h-8 rounded-full hover:bg-[#BAE6FD]/20 flex items-center justify-center text-[#0A1A2F]/40 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-[#0A1A2F]/50 mb-3 line-clamp-2 leading-relaxed">{workout.description}</p>

        <div className="flex items-center gap-4 mb-3 text-xs text-[#0A1A2F]/45">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{workout.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{workout.exercises?.length || 0} exercises</span>
          </div>
          {!isPremade && workout.completed_dates?.length > 0 && (
            <div className="flex items-center gap-1 text-[#38BDF8]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{workout.completed_dates.length}×</span>
            </div>
          )}
        </div>

        {workout.exercises?.length > 0 && (
          <div className="mb-3">
            <div className="space-y-0.5">
              {workout.exercises.slice(0, 3).map((ex, i) => (
                <p key={i} className="text-xs text-[#0A1A2F]/45">
                  · {ex.name}{ex.sets && ex.reps ? ` — ${ex.sets}×${ex.reps}` : ex.duration_seconds ? ` — ${ex.sets}×${ex.duration_seconds}s` : ''}
                </p>
              ))}
              {workout.exercises.length > 3 && (
                <p className="text-xs text-[#0A1A2F]/30">+{workout.exercises.length - 3} more</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {showCommunityStats && workout.created_by !== user?.email ? (
            <>
              <Button onClick={() => copyWorkout.mutate()}
                className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white text-sm"
                disabled={copyWorkout.isPending}>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                {copyWorkout.isPending ? 'Adding…' : 'Add to My Workouts'}
              </Button>
              <button onClick={() => likeWorkout.mutate()}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all border ${
                  hasLiked
                    ? 'bg-[#38BDF8]/10 text-[#0EA5E9] border-[#38BDF8]/25'
                    : 'border-[#BAE6FD]/30 text-[#0A1A2F]/40 hover:bg-[#F2F6FA]'
                }`}>
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                {workout.likes || 0}
              </button>
              <button onClick={() => setShowComments(!showComments)}
                className="px-3 py-2 rounded-lg border border-[#BAE6FD]/30 text-[#0A1A2F]/40 hover:bg-[#F2F6FA] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowStartModal(true)}
                className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white font-semibold">
                <Play className="w-4 h-4 mr-1.5" /> Start Workout
              </Button>
              {showCommunityStats && (
                <div className="flex gap-1.5">
                  <div className="flex items-center gap-1 text-xs text-[#0A1A2F]/40 px-2.5 py-2 bg-[#F2F6FA] rounded-lg border border-[#BAE6FD]/20">
                    <ThumbsUp className="w-3.5 h-3.5" />{workout.likes || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#0A1A2F]/40 px-2.5 py-2 bg-[#F2F6FA] rounded-lg border border-[#BAE6FD]/20">
                    <Copy className="w-3.5 h-3.5" />{workout.times_copied || 0}
                  </div>
                </div>
              )}
              <button onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#BAE6FD]/30 text-[#0A1A2F]/40 hover:bg-[#F2F6FA] text-xs transition-colors">
                {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 border-t border-[#BAE6FD]/20 pt-3"
            >
              <CommentSection contentId={workout.id} contentType="workout" user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShareWorkoutModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} workout={workout} user={user} />
      <WorkoutDetailModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} workout={workout} user={user}
        onStartWorkout={(w) => setShowStartModal(true)} />
      <StartWorkoutModal isOpen={showStartModal} onClose={() => setShowStartModal(false)} workout={workout} user={user} onComplete={onComplete} />
    </motion.div>
  );
}
