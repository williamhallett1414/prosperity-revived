import { base44 } from '@/api/base44Client';

const BADGES = [
  { id: 'first_plan', requirement: 'reading_plans_completed', value: 1, points: 50 },
  { id: 'plan_master', requirement: 'reading_plans_completed', value: 5, points: 200 },
  { id: 'community_starter', requirement: 'community_posts', value: 1, points: 25 },
  { id: 'influencer', requirement: 'community_posts', value: 50, points: 150 },
  { id: 'week_streak', requirement: 'current_streak', value: 7, points: 100 },
  { id: 'month_streak', requirement: 'current_streak', value: 30, points: 500 },
  { id: 'fitness_warrior', requirement: 'workouts_completed', value: 20, points: 150 },
  { id: 'zen_master', requirement: 'meditations_completed', value: 30, points: 200 }
];

export async function awardPoints(userEmail, points, updateData = {}) {
  try {
    const allProgress = await base44.entities.UserProgress.list();
    let userProgress = allProgress.find(p => p.created_by === userEmail);

    if (!userProgress) {
      userProgress = await base44.entities.UserProgress.create({
        total_points: points,
        level: 1,
        badges: [],
        current_streak: 0,
        longest_streak: 0,
        ...updateData
      });
    } else {
      const newPoints = (userProgress.total_points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      await base44.entities.UserProgress.update(userProgress.id, {
        total_points: newPoints,
        level: newLevel,
        ...updateData
      });
    }

    return userProgress;
  } catch (error) {
    console.error('Failed to award points', error);
  }
}

export async function checkAndAwardBadges(userEmail) {
  try {
    const allProgress = await base44.entities.UserProgress.list();
    const userProgress = allProgress.find(p => p.created_by === userEmail);
    
    if (!userProgress) return;

    const earnedBadges = userProgress.badges || [];
    let newPoints = 0;

    for (const badge of BADGES) {
      if (!earnedBadges.includes(badge.id)) {
        const currentValue = userProgress[badge.requirement] || 0;
        if (currentValue >= badge.value) {
          earnedBadges.push(badge.id);
          newPoints += badge.points;
        }
      }
    }

    if (newPoints > 0) {
      await base44.entities.UserProgress.update(userProgress.id, {
        badges: earnedBadges,
        total_points: (userProgress.total_points || 0) + newPoints
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