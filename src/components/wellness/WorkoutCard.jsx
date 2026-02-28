import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, Clock, TrendingUp, Dumbbell, 
  Share2, ChevronDown, ChevronUp, Eye, Play, ThumbsUp, MessageCircle, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import WorkoutLogModal from './WorkoutLogModal';
import ShareWorkoutModal from './ShareWorkoutModal';
import WorkoutDetailModal from './WorkoutDetailModal';
import CommentSection from './CommentSection';
import StartWorkoutModal from './StartWorkoutModal';

export default function WorkoutCard({ 
  workout, 
  onComplete, 
  index = 0, 
  isPremade = false,
  user,
  showCommunityStats = false
}) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const queryClient = useQueryClient();

  const likeWorkout = useMutation({
    mutationFn: async () => {
      const newLikes = (workout.likes || 0) + (hasLiked ? -1 : 1);
      return base44.entities.WorkoutPlan.update(workout.id, {
        likes: newLikes
      });
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
      const workoutCopy = {
        title: `${workout.title} (Copy)`,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        completed_dates: []
      };
      
      await base44.entities.WorkoutPlan.create(workoutCopy);
      
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

  const difficultyColors = {
    beginner: 'bg-[#8fa68a]/20 text-[#4a6b50]',
    intermediate: 'bg-[#D9B878]/20 text-[#8a6e1a]',
    advanced: 'bg-[#8fa68a]/15 text-[#0A1A2F]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm"
    >
      {workout.image_url && (
        <img 
          src={workout.image_url} 
          alt={workout.title} 
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {workout.title}
          </h3>
          <Badge className={difficultyColors[workout.difficulty]}>
            {workout.difficulty}
          </Badge>
        </div>
        <div className="flex gap-2">
          {!isPremade && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareModal(true)}
              className="text-[#4a6b50] hover:text-[#6b8f72] hover:bg-[#8fa68a]/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetailModal(true)}
            className="text-gray-600 hover:text-gray-700"
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showCommunityStats && workout.creator_name && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          by {workout.creator_name}
        </p>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {workout.description}
      </p>

      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{workout.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="w-4 h-4" />
          <span>{workout.exercises?.length || 0} exercises</span>
        </div>
        {!isPremade && workout.completed_dates?.length > 0 && (
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-[#8fa68a]" />
            <span>{workout.completed_dates.length} completed</span>
          </div>
        )}
      </div>

      {workout.exercises && workout.exercises.length > 0 && (
        <div className="mb-3 text-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Exercises:</p>
          <div className="space-y-1">
            {workout.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} className="text-gray-700 dark:text-gray-300">
                • {ex.name} {ex.sets && ex.reps && `- ${ex.sets}x${ex.reps}`}
              </div>
            ))}
            {workout.exercises.length > 3 && (
              <p className="text-gray-500 dark:text-gray-400">
                +{workout.exercises.length - 3} more exercises
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {showCommunityStats && workout.created_by !== user?.email ? (
          <>
            <Button
              onClick={() => copyWorkout.mutate()}
              className="flex-1 bg-gradient-to-r from-[#8fa68a] to-[#6b8f72] hover:opacity-90"
              disabled={copyWorkout.isPending}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copyWorkout.isPending ? 'Adding...' : 'Add to My Workouts'}
            </Button>
            <Button
              variant="outline"
              onClick={() => likeWorkout.mutate()}
              className={`flex items-center gap-2 ${hasLiked ? 'bg-[#8fa68a]/10 text-[#4a6b50]' : ''}`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              {workout.likes || 0}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setShowStartModal(true)}
              className="flex-1 bg-gradient-to-r from-[#8fa68a] to-[#6b8f72] hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
            {showCommunityStats && (
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <ThumbsUp className="w-4 h-4" />
                  {workout.likes || 0}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Copy className="w-4 h-4" />
                  {workout.times_copied || 0}
                </div>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Comments
            </Button>
          </>
        )}
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 border-t pt-3"
          >
            <CommentSection 
              contentId={workout.id}
              contentType="workout"
              user={user}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WorkoutLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        workout={workout}
        user={user}
      />

      <ShareWorkoutModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        workout={workout}
        user={user}
      />

      <WorkoutDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        workout={workout}
        user={user}
      />

      <StartWorkoutModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        workout={workout}
        user={user}
        onComplete={onComplete}
      />
    </motion.div>
  );
}