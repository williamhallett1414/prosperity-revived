import { base44 } from '@/api/base44Client';
import { notifyAchievement } from '@/components/notifications/NotificationHelper';
import { showPointsNotification, showBadgeNotification, showLevelUpNotification } from './PointsNotification';

export const BADGES = [
  // Reading Badges
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first reading plan day', icon: '🌱', points: 50, requirement: { field: 'reading_plans_completed', value: 1 } },
  { id: 'consistent_reader', name: 'Consistent Reader', description: 'Complete 3 reading plans', icon: '📖', points: 150, requirement: { field: 'reading_plans_completed', value: 3 } },
  { id: 'devoted_scholar', name: 'Devoted Scholar', description: 'Complete 10 reading plans', icon: '🎓', points: 300, requirement: { field: 'reading_plans_completed', value: 10 } },
  { id: 'bookworm', name: 'Bookworm', description: 'Complete 25 reading plans', icon: '📚', points: 500, requirement: { field: 'reading_plans_completed', value: 25 } },

  // Social Badges
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Make 5 friends', icon: '🦋', points: 75, requirement: { field: 'friends_count', value: 5 } },
  { id: 'social_maven', name: 'Social Maven', description: 'Make 15 friends', icon: '👥', points: 200, requirement: { field: 'friends_count', value: 15 } },
  { id: 'community_leader', name: 'Community Leader', description: 'Create 10 posts', icon: '📢', points: 100, requirement: { field: 'community_posts', value: 10 } },
  { id: 'influencer', name: 'Influencer', description: 'Create 50 posts', icon: '🌟', points: 300, requirement: { field: 'community_posts', value: 50 } },
  { id: 'helpful_soul', name: 'Helpful Soul', description: 'Leave 20 comments', icon: '💬', points: 100, requirement: { external: 'comments_count', value: 20 } },
  { id: 'super_helper', name: 'Super Helper', description: 'Leave 100 comments', icon: '💝', points: 250, requirement: { external: 'comments_count', value: 100 } },
  { id: 'messenger', name: 'Messenger', description: 'Send 50 messages', icon: '✉️', points: 100, requirement: { external: 'messages_sent', value: 50 } },
  { id: 'photographer', name: 'Photographer', description: 'Upload 10 photos', icon: '📸', points: 100, requirement: { external: 'photos_uploaded', value: 10 } },

  // Meditation & Spiritual Badges
  { id: 'prayer_warrior', name: 'Prayer Warrior', description: 'Complete 10 prayer sessions', icon: '🙏', points: 100, requirement: { field: 'meditations_completed', value: 10 } },
  { id: 'meditation_master', name: 'Meditation Master', description: 'Complete 30 meditation sessions', icon: '🧘', points: 200, requirement: { field: 'meditations_completed', value: 30 } },
  { id: 'zen_seeker', name: 'Zen Seeker', description: 'Complete 75 meditation sessions', icon: '☮️', points: 400, requirement: { field: 'meditations_completed', value: 75 } },

  // Fitness Badges
  { id: 'fitness_starter', name: 'Fitness Starter', description: 'Complete 5 workouts', icon: '💪', points: 75, requirement: { field: 'workouts_completed', value: 5 } },
  { id: 'fitness_enthusiast', name: 'Fitness Enthusiast', description: 'Complete 15 workouts', icon: '🏃', points: 125, requirement: { field: 'workouts_completed', value: 15 } },
  { id: 'fitness_champion', name: 'Fitness Champion', description: 'Complete 50 workouts', icon: '🏆', points: 300, requirement: { field: 'workouts_completed', value: 50 } },
  { id: 'iron_will', name: 'Iron Will', description: 'Complete 100 workouts', icon: '⚙️', points: 500, requirement: { field: 'workouts_completed', value: 100 } },

  // Nutrition Badges
  { id: 'chef_beginner', name: 'Home Chef', description: 'Cook 5 recipes', icon: '👨‍🍳', points: 75, requirement: { field: 'recipes_cooked', value: 5 } },
  { id: 'master_chef', name: 'Master Chef', description: 'Cook 25 recipes', icon: '⭐', points: 200, requirement: { field: 'recipes_cooked', value: 25 } },
  { id: 'culinary_artist', name: 'Culinary Artist', description: 'Cook 75 recipes', icon: '🍽️', points: 400, requirement: { field: 'recipes_cooked', value: 75 } },

  // Streak Badges
  { id: 'streak_starter', name: 'Getting Started', description: 'Maintain a 3-day streak', icon: '✨', points: 50, requirement: { field: 'current_streak', value: 3 } },
  { id: 'streak_master', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', points: 150, requirement: { field: 'current_streak', value: 7 } },
  { id: 'streak_legend', name: 'Streak Legend', description: 'Maintain a 30-day streak', icon: '⚡', points: 500, requirement: { field: 'current_streak', value: 30 } },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Maintain a 100-day streak', icon: '🚀', points: 1000, requirement: { field: 'current_streak', value: 100 } },

  // Self-Care Badges
  { id: 'self_care_starter', name: 'Self-Care Starter', description: 'Complete 5 self-care activities', icon: '🌸', points: 75, requirement: { field: 'self_care_activities_completed', value: 5 } },
  { id: 'mindful_soul', name: 'Mindful Soul', description: 'Complete 20 self-care activities', icon: '🧖', points: 200, requirement: { field: 'self_care_activities_completed', value: 20 } },
  { id: 'wellness_advocate', name: 'Wellness Advocate', description: 'Complete 50 self-care activities', icon: '💆', points: 400, requirement: { field: 'self_care_activities_completed', value: 50 } },

  // Level Badges
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', points: 250, requirement: { field: 'level', value: 5 } },
  { id: 'level_10', name: 'Community Leader', description: 'Reach level 10', icon: '👑', points: 500, requirement: { field: 'level', value: 10 } },
  { id: 'level_20', name: 'Legendary', description: 'Reach level 20', icon: '✨', points: 1000, requirement: { field: 'level', value: 20 } }
];

export async function awardPoints(userEmail, points, additionalFields = {}, queryClient = null) {
  if (!userEmail) return;
  
  try {
    // Optimistic update
    if (queryClient && typeof window !== 'undefined') {
      queryClient.setQueryData(['userProgress', userEmail], (old) => {
        if (!old) return old;
        const currentPoints = old.total_points || 0;
        const newTotalPoints = currentPoints + points;
        const newLevel = Math.floor(newTotalPoints / 500) + 1;
        return {
          ...old,
          total_points: newTotalPoints,
          level: newLevel,
          ...additionalFields
        };
      });
    }

    const allProgress = await base44.entities.UserProgress.list();
    let progress = allProgress.find(p => p.created_by === userEmail);

    if (!progress) {
      progress = await base44.entities.UserProgress.create({
        total_points: points,
        level: 1,
        badges: [],
        current_streak: 0,
        longest_streak: 0,
        ...additionalFields
      });
      return { newPoints: points, newLevel: 1, leveledUp: false };
    }

    const currentPoints = progress.total_points || 0;
    const newTotalPoints = currentPoints + points;
    const newLevel = Math.floor(newTotalPoints / 500) + 1;
    const leveledUp = newLevel > progress.level;

    await base44.entities.UserProgress.update(progress.id, {
      total_points: newTotalPoints,
      level: newLevel,
      ...additionalFields
    });
    
    // Show notifications
    if (typeof window !== 'undefined') {
      const actionLabels = {
        reading_plans_completed: 'Completed reading plan',
        workouts_completed: 'Completed workout',
        recipes_cooked: 'Cooked a recipe',
        community_posts: 'Created a post',
        comments_count: 'Left a comment',
        meditations_completed: 'Completed meditation',
        messages_sent: 'Sent a message',
        photos_uploaded: 'Uploaded photo',
        self_care_activities_completed: 'Completed self-care activity'
      };
      
      const actionKey = Object.keys(additionalFields)[0];
      const actionLabel = actionLabels[actionKey] || 'Activity completed';
      
      showPointsNotification(points, actionLabel);
      
      if (leveledUp) {
        showLevelUpNotification(newLevel);
      }
    }
    
    return { newPoints: newTotalPoints, newLevel, leveledUp };
  } catch (error) {
    console.error('Failed to award points:', error);
    // Revert optimistic update on error
    if (queryClient) {
      queryClient.invalidateQueries(['userProgress', userEmail]);
    }
  }
}

export async function checkAndAwardBadges(userEmail) {
  if (!userEmail) return [];
  
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let progress = allProgress.find(p => p.created_by === userEmail);
    
    if (!progress) return [];

    const [friends, comments, messages, photos] = await Promise.all([
      base44.entities.Friend.list(),
      base44.entities.Comment.list(),
      base44.entities.Message.list(),
      base44.entities.Photo.list()
    ]);

    const friendsCount = friends.filter(f => 
      (f.user_email === userEmail || f.friend_email === userEmail) && f.status === 'accepted'
    ).length;

    const commentsCount = comments.filter(c => c.created_by === userEmail).length;
    const messagesSent = messages.filter(m => m.sender_email === userEmail).length;
    const photosUploaded = photos.filter(p => p.created_by === userEmail).length;

    await base44.entities.UserProgress.update(progress.id, {
      friends_count: friendsCount,
      comments_count: commentsCount,
      messages_sent: messagesSent,
      photos_uploaded: photosUploaded
    });

    const updated = await base44.entities.UserProgress.list();
    progress = updated.find(p => p.created_by === userEmail);

    const currentBadges = progress.badges || [];
    const newBadges = [];

    for (const badge of BADGES) {
      if (!currentBadges.includes(badge.id)) {
        const reqField = badge.requirement.field || badge.requirement.external;
        const userValue = progress[reqField] || 0;
        
        if (userValue >= badge.requirement.value) {
          // Award badge
          await awardPoints(userEmail, badge.points);
          
          await base44.entities.UserProgress.update(progress.id, {
            badges: [...currentBadges, badge.id]
          });
          
          // Show badge notification
          if (typeof window !== 'undefined') {
            showBadgeNotification(badge);
          }
          
          // Send notification
          await notifyAchievement(userEmail, badge.name);
          
          newBadges.push(badge);
        }
      }
    }
    
    return newBadges;
  } catch (error) {
    console.error('Failed to check badges:', error);
    return [];
  }
}

export async function updateStreak(userEmail) {
  if (!userEmail) return;
  
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let progress = allProgress.find(p => p.created_by === userEmail);
    
    const today = new Date().toISOString().split('T')[0];
    
    if (!progress) {
      await base44.entities.UserProgress.create({
        total_points: 5,
        level: 1,
        badges: [],
        current_streak: 1,
        longest_streak: 1,
        last_active_date: today
      });
      return;
    }

    const lastActive = progress.last_active_date;
    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastActive === yesterdayStr) {
      newStreak = (progress.current_streak || 0) + 1;
    }

    const longestStreak = Math.max(newStreak, progress.longest_streak || 0);

    await base44.entities.UserProgress.update(progress.id, {
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      total_points: (progress.total_points || 0) + 5
    });

    await checkAndAwardBadges(userEmail);
  } catch (error) {
    console.error('Failed to update streak:', error);
  }
}