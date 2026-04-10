/**
 * Notifications utility — handles both web Notification API and 
 * Capacitor Local Notifications (when running in native shell).
 * 
 * Web: Uses browser Notification API for reminders
 * Native: Will use @capacitor/local-notifications when installed
 * 
 * iOS Safari: Notification API is NOT supported outside PWA context.
 * All functions check for support before accessing the API.
 */

// Detect if Notification API is available and safe to use
function isNotificationSupported() {
  try {
    return 'Notification' in window && typeof Notification !== 'undefined' && typeof Notification.permission === 'string';
  } catch {
    return false;
  }
}

// Request permission (call once on app load or settings)
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'unsupported';
  }
}

// Schedule a daily reminder (web)
export function scheduleDailyReminder({ hour = 8, minute = 0, title, body, tag }) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return null;

  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target - now;
  const timerId = setTimeout(() => {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        badge: '/favicon.ico',
      });
    } catch {}
    scheduleDailyReminder({ hour, minute, title, body, tag });
  }, delay);

  return timerId;
}

// Pre-configured reminders
export function initDefaultReminders() {
  if (!isNotificationSupported()) return;
  
  const reminders = JSON.parse(localStorage.getItem('pr_reminders') || '{}');

  if (reminders.morning !== false) {
    scheduleDailyReminder({
      hour: 7, minute: 30,
      title: 'Good Morning! ☀️',
      body: 'Start your day with Scripture and prayer.',
      tag: 'pr-morning',
    });
  }

  if (reminders.workout !== false) {
    scheduleDailyReminder({
      hour: 17, minute: 0,
      title: 'Time to Move! 💪',
      body: 'Coach David has a workout ready for you.',
      tag: 'pr-workout',
    });
  }

  if (reminders.evening !== false) {
    scheduleDailyReminder({
      hour: 21, minute: 0,
      title: 'End Your Day 🌙',
      body: 'Reflect on your day with gratitude and grace.',
      tag: 'pr-evening',
    });
  }
}

// Toggle a specific reminder
export function setReminderEnabled(key, enabled) {
  const reminders = JSON.parse(localStorage.getItem('pr_reminders') || '{}');
  reminders[key] = enabled;
  localStorage.setItem('pr_reminders', JSON.stringify(reminders));
}
