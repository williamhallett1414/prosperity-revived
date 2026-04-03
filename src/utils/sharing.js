/**
 * Social Sharing — uses Web Share API with clipboard fallback
 */

export async function shareContent({ title, text, url }) {
  const shareData = { title, text, url: url || window.location.href };

  // Try native share (works on mobile browsers + installed PWAs)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, method: 'cancelled' };
      // Fall through to clipboard
    }
  }

  // Fallback: copy to clipboard
  try {
    const shareText = `${title}\n\n${text}\n\n${shareData.url}`;
    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'none' };
  }
}

// Pre-built share helpers
export function shareStreak(days) {
  return shareContent({
    title: `${days}-Day Streak on Prosperity Revived!`,
    text: `I've been consistent for ${days} days straight — body, mind, and spirit. 💪🙏`,
  });
}

export function shareWorkoutMilestone(totalWorkouts) {
  return shareContent({
    title: `${totalWorkouts} Workouts Complete!`,
    text: `Just hit ${totalWorkouts} workouts on Prosperity Revived. My body is a temple! 🏋️`,
  });
}

export function shareScripture(verse, reference) {
  return shareContent({
    title: reference,
    text: `"${verse}" — ${reference}\n\nShared from Prosperity Revived`,
  });
}

export function shareAchievement(badge, description) {
  return shareContent({
    title: `Achievement Unlocked: ${badge}!`,
    text: `${description}\n\nEarned on Prosperity Revived 🏆`,
  });
}
