import React, { useState } from 'react';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getReadingForDay } from '@/components/bible/BibleData';
import { toast } from 'sonner';

/**
 * Generates and downloads an .ics file for the reading plan schedule.
 * Each day gets a 30-minute all-day event with the reading passage.
 */
function buildICS(plan, progress) {
  const startDate = progress?.started_date
    ? new Date(progress.started_date + 'T00:00:00')
    : new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prosperity Revived//Reading Plan//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const totalDays = progress?.total_days || plan.duration;

  for (let day = 1; day <= totalDays; day++) {
    const reading = progress?.is_custom
      ? progress.custom_readings?.find(r => r.day === day)
      : getReadingForDay(plan.id, day);

    const eventDate = new Date(startDate);
    eventDate.setDate(startDate.getDate() + (day - 1));

    const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '');

    const title = reading
      ? `📖 ${plan.name} – Day ${day}: ${reading.book} ${reading.chapter}`
      : `📖 ${plan.name} – Day ${day}`;

    const description = reading
      ? `Day ${day} of ${totalDays}: Read ${reading.book} chapter ${reading.chapter}`
      : `Day ${day} of ${totalDays} in your reading plan`;

    // Unique stamp
    const uid = `${plan.id}-day${day}-prosperityrevived`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`DTEND;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:${title}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT30M');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Time for your daily reading: ${title}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export default function ExportToCalendarButton({ plan, progress }) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    if (!plan) return;
    setLoading(true);

    try {
      const icsContent = buildICS(plan, progress);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name.replace(/\s+/g, '-')}-reading-plan.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Reading plan exported! Open the .ics file to add it to your calendar.');
    } catch (e) {
      toast.error('Failed to export. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-[#c9a227] hover:text-[#c9a227] hover:border-[#c9a227]"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4" />}
      Add to Calendar
    </Button>
  );
}