/**
 * Timezone-safe local date formatting with configurable daily reset time.
 * 
 * The "day" resets at the user's configured reset hour (default midnight/0).
 * For example, if reset is set to 4am, logs at 2am still count as "yesterday."
 * 
 * Reset hour is stored in localStorage as 'daily_reset_hour' (0-23).
 * Timezone is stored as 'user_timezone' (IANA string like 'America/New_York').
 */

/**
 * Get the user's configured daily reset hour (0-23, default 0 = midnight)
 */
export function getResetHour() {
  const stored = localStorage.getItem('daily_reset_hour');
  if (stored !== null) {
    const h = parseInt(stored, 10);
    if (!isNaN(h) && h >= 0 && h <= 23) return h;
  }
  return 0; // midnight
}

/**
 * Get current time adjusted for the user's timezone.
 * If user has set a timezone in settings, use that.
 * Otherwise use the device's local time.
 */
function getAdjustedNow() {
  const tz = localStorage.getItem('user_timezone');
  if (tz) {
    try {
      // Get current time in user's chosen timezone
      const str = new Date().toLocaleString('en-US', { timeZone: tz });
      return new Date(str);
    } catch {
      // Invalid timezone, fall back to device time
    }
  }
  return new Date();
}

/**
 * Returns YYYY-MM-DD string for the current "logical day."
 * If resetHour > 0 and current hour < resetHour, returns yesterday's date.
 */
export function localDateKey(d) {
  const now = d || getAdjustedNow();
  const resetHour = getResetHour();
  
  // If we're before the reset hour, it's still "yesterday"
  const adjusted = new Date(now);
  if (resetHour > 0 && adjusted.getHours() < resetHour) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  
  return `${adjusted.getFullYear()}-${String(adjusted.getMonth()+1).padStart(2,'0')}-${String(adjusted.getDate()).padStart(2,'0')}`;
}

export function todayKey() {
  return localDateKey();
}

/**
 * Get list of common timezones for settings picker
 */
export const TIMEZONES = [
  { value: '', label: 'Auto (device timezone)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)' },
  { value: 'America/Puerto_Rico', label: 'Atlantic Time (AT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central Europe (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'Asia/Shanghai', label: 'China (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland', label: 'New Zealand (NZST)' },
  { value: 'Africa/Lagos', label: 'West Africa (WAT)' },
  { value: 'Africa/Nairobi', label: 'East Africa (EAT)' },
  { value: 'America/Sao_Paulo', label: 'Brasilia (BRT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
];
