import { base44 } from '@/api/base44Client';

const BADGES = [
  { id: 'first_plan', name: 'First Steps', description: 'Complete your first reading plan', icon: '📖', points: 100, requirement: 'reading_plans_completed', value: 1 },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Make 10 community posts', icon: '🦋', points: 150, requirement: 'community_posts', value: 10 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', points: 200, requirement: 'current_streak', value: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '⭐', points: 500, requirement: 'current_streak', value: 30 },
  { id: 'fitness_fan', name: 'Fitness Fan', description: 'Complete 20 workouts', icon: '💪', points: 250, requirement: 'workouts_completed', value: 20 },
  { id: 'meditation_master', name: 'Meditation Master', description: 'Complete 15 meditation sessions', icon: '🧘', points: 200, requirement: 'meditations_completed', value: 15 },
  { id: 'friend_maker', name: 'Friend Maker', description: 'Connect with 5 friends', icon: '👥', points: 100, requirement: 'friends_count', value: 5 },
  { id: 'commentator', name: 'Commentator', description: 'Leave 25 comments', icon: '💬', points: 150, requirement: 'comments_count', value: 25 },
  { id: 'messenger', name: 'Messenger', description: 'Send 50 messages', icon: '✉️', points: 100, requirement: 'messages_sent', value: 50 },
  { id: 'photographer', name: 'Photographer', description: 'Upload 10 photos', icon: '📸', points: 100, requirement: 'photos_uploaded', value: 10 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '🌟', points: 250, requirement: 'level', value: 5 },
  { id: 'level_10', name: 'Community Leader', description: 'Reach level 10', icon: '👑', points: 500, requirement: 'level', value: 10 }
];

export async function awardPoints(userEmail, points, activity, incrementField = null) {
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let userProgress = allProgress.find(p => p.created_by === userEmail);

    const updateData = {};

    if (!userProgress) {
      updateData.total_points = points;
      updateData.level = 1;
      updateData.badges = [];
      updateData.current_streak = 0;
      updateData.longest_streak = 0;
      
      if (incrementField) {
        updateData[incrementField] = 1;
      }
      
      userProgress = await base44.entities.UserProgress.create(updateData);
    } else {
      const newPoints = (userProgress.total_points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      updateData.total_points = newPoints;
      updateData.level = newLevel;
      
      if (incrementField) {
        updateData[incrementField] = (userProgress[incrementField] || 0) + 1;
      }
      
      await base44.entities.UserProgress.update(userProgress.id, updateData);
    }

    // Check for new badges
    await checkAndAwardBadges(userEmail);

    return userProgress;
  } catch (error) {
    console.error('Failed to award points', error);
  }
}

export async function checkAndAwardBadges(userEmail) {
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let userProgress = allProgress.find(p => p.created_by === userEmail);
    
    if (!userProgress) return;

    // Fetch external counts for badge requirements
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

    // Update progress with external counts
    await base44.entities.UserProgress.update(userProgress.id, {
      friends_count: friendsCount,
      comments_count: commentsCount,
      messages_sent: messagesSent,
      photos_uploaded: photosUploaded
    });

    // Refresh progress
    const updated = await base44.entities.UserProgress.list();
    userProgress = updated.find(p => p.created_by === userEmail);

    const currentBadges = userProgress.badges || [];
    let newBadges = [...currentBadges];
    let pointsAwarded = 0;

    for (const badge of BADGES) {
      if (!currentBadges.includes(badge.id)) {
        const userValue = userProgress[badge.requirement] || 0;
        if (userValue >= badge.value) {
          newBadges.push(badge.id);
          pointsAwarded += badge.points;
        }
      }
    }

    if (newBadges.length > currentBadges.length) {
      await base44.entities.UserProgress.update(userProgress.id, {
        badges: newBadges,
        total_points: (userProgress.total_points || 0) + pointsAwarded,
        level: Math.floor(((userProgress.total_points || 0) + pointsAwarded) / 100) + 1
      });
    }
  } catch (error) {
    console.error('Failed to check badges', error);
  }
}

export async function updateStreak(userEmail) {
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let userProgress = allProgress.find(p => p.created_by === userEmail);
    
    const today = new Date().toISOString().split('T')[0];
    
    if (!userProgress) {
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

    const lastActive = userProgress.last_active_date;
    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastActive === yesterdayStr) {
      newStreak = (userProgress.current_streak || 0) + 1;
    }

    const longestStreak = Math.max(newStreak, userProgress.longest_streak || 0);

    await base44.entities.UserProgress.update(userProgress.id, {
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      total_points: (userProgress.total_points || 0) + 5
    });

    await checkAndAwardBadges(userEmail);
  } catch (error) {
    console.error('Failed to update streak', error);
  }
}

export { BADGES };