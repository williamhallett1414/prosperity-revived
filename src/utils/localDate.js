/**
 * Timezone-safe local date formatting.
 * Returns YYYY-MM-DD string using local timezone (not UTC).
 * Prevents the midnight timezone bug where toISOString().slice(0,10)
 * returns yesterday's date for users west of UTC.
 */
export function localDateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function todayKey() {
  return localDateKey(new Date());
}
