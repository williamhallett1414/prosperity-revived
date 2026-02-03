import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Play, RotateCcw, FileText, BarChart3, Bell, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { readingPlans } from '@/components/bible/BibleData';
import { Link } from 'react-router-dom';
import DayNoteModal from '@/components/plans/DayNoteModal';
import PlanStatsModal from '@/components/plans/PlanStatsModal';
import ReminderSettingsModal from '@/components/plans/ReminderSettingsModal';

export default function PlanDetail() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('id');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  let plan = readingPlans.find(p => p.id === planId);
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['planProgress', planId],
    queryFn: async () => {
      const all = await base44.entities.ReadingPlanProgress.list();
      const found = all.find(p => p.plan_id === planId);
      
      // If this is a custom plan, use its data
      if (found?.is_custom) {
        plan = {
          id: found.plan_id,
          name: found.plan_name,
          description: `${found.total_days} days of custom readings`,
          duration: found.total_days,
          category: 'Custom',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
        };
      }
      
      return found || null;
    }
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['planNotes', planId],
    queryFn: async () => {
      const all = await base44.entities.PlanNote.list();
      return all.filter(n => n.plan_id === planId);
    },
    enabled: !!planId
  });

  const createProgress = useMutation({
    mutationFn: (data) => base44.entities.ReadingPlanProgress.create(data),
    onSuccess: () => queryClient.invalidateQueries(['planProgress'])
  });

  const updateProgress = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ReadingPlanProgress.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['planProgress']);
      queryClient.invalidateQueries(['planProgress', planId]);
    }
  });

  const saveNote = useMutation({
    mutationFn: async ({ day, noteText }) => {
      const existingNote = notes.find(n => n.day_number === day);
      if (existingNote) {
        return base44.entities.PlanNote.update(existingNote.id, { note: noteText });
      } else {
        return base44.entities.PlanNote.create({
          plan_id: planId,
          day_number: day,
          note: noteText
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['planNotes'])
  });

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p>Plan not found</p>
      </div>
    );
  }

  const handleStartPlan = () => {
    createProgress.mutate({
      plan_id: plan.id,
      plan_name: plan.name,
      current_day: 1,
      total_days: plan.duration,
      completed_days: [],
      started_date: new Date().toISOString().split('T')[0]
    });
  };

  const calculateStreak = (completedDays, completionDates) => {
    if (!completedDays || completedDays.length === 0) return { current: 0, longest: 0 };
    
    const sorted = [...completedDays].sort((a, b) => a - b);
    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    currentStreak = tempStreak;
    return { current: currentStreak, longest: longestStreak };
  };

  const handleToggleDay = (day) => {
    if (!progress) return;
    
    const completedDays = progress.completed_days || [];
    const completionDates = progress.completion_dates || [];
    const isCompleted = completedDays.includes(day);
    
    const newCompletedDays = isCompleted
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day].sort((a, b) => a - b);

    const newCompletionDates = isCompleted
      ? completionDates.slice(0, -1)
      : [...completionDates, new Date().toISOString()];

    const streaks = calculateStreak(newCompletedDays, newCompletionDates);
    
    const updateData = {
      completed_days: newCompletedDays,
      completion_dates: newCompletionDates,
      current_streak: streaks.current,
      longest_streak: Math.max(streaks.longest, progress.longest_streak || 0),
      current_day: Math.max(...newCompletedDays, 1)
    };

    if (newCompletedDays.length === progress.total_days && !progress.completed_date) {
      updateData.completed_date = new Date().toISOString().split('T')[0];
    }

    updateProgress.mutate({
      id: progress.id,
      data: updateData
    });
  };

  const handleRestart = () => {
    if (!progress) return;
    updateProgress.mutate({
      id: progress.id,
      data: {
        completed_days: [],
        current_day: 1,
        started_date: new Date().toISOString().split('T')[0]
      }
    });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowNoteModal(true);
  };

  const handleSaveNote = (day, noteText) => {
    saveNote.mutate({ day, noteText });
  };

  const getNoteForDay = (day) => {
    return notes.find(n => n.day_number === day);
  };

  const handleOpenDayReading = (day) => {
    if (progress?.is_custom && progress.custom_readings) {
      const reading = progress.custom_readings.find(r => r.day === day);
      if (reading) {
        window.location.href = createPageUrl(`Bible?book=${reading.book}&chapter=${reading.chapter}&planDay=${day}&planId=${planId}`);
      }
    }
  };

  const handleSaveReminder = (reminderData) => {
    if (!progress) return;
    updateProgress.mutate({
      id: progress.id,
      data: reminderData
    });
  };

  const completedCount = progress?.completed_days?.length || 0;
  const progressPercent = Math.round((completedCount / plan.duration) * 100);
  const days = Array.from({ length: plan.duration }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Hero Image */}
      <div className="relative h-64">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <Link
          to={createPageUrl('Plans')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="absolute bottom-4 left-4 right-4">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs mb-2 inline-block">
            {plan.category}
          </span>
          <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Description */}
        <p className="text-gray-600 mb-6">{plan.description}</p>

        {/* Progress Card */}
        {progress ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Your Progress</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">
                  {completedCount} / {plan.duration} days
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#c9a227]">{progressPercent}%</p>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={() => setShowStatsModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </Button>
              <Button
                onClick={() => setShowReminderModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Bell className="w-4 h-4" />
                Reminder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-[#c9a227]" />
              <span className="text-gray-600">{plan.duration} days</span>
            </div>
            <Button
              onClick={handleStartPlan}
              className="w-full bg-[#1a1a2e] hover:bg-[#2d2d4a] h-12 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Plan
            </Button>
          </motion.div>
        )}

        {/* Days Grid */}
        {progress && (
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Daily Readings</h2>
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => {
                const isCompleted = progress.completed_days?.includes(day);
                const hasNote = getNoteForDay(day);
                return (
                  <div key={day} className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleDay(day)}
                      className={`w-full aspect-square rounded-xl flex items-center justify-center font-medium transition-all ${
                        isCompleted
                          ? 'bg-[#8fa68a] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        day
                      )}
                    </motion.button>
                    
                    {/* Note indicator */}
                    {hasNote && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c9a227] rounded-full border-2 border-white" />
                    )}
                    
                    {/* Action buttons */}
                    <div className="absolute -bottom-1 -right-1 flex gap-1">
                      {progress.is_custom && (
                        <button
                          onClick={() => handleOpenDayReading(day)}
                          className="w-5 h-5 bg-[#1a1a2e] text-white rounded-full flex items-center justify-center hover:bg-[#2d2d4a] transition-colors"
                          title="Open reading"
                        >
                          <BookOpen className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDayClick(day)}
                        className="w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                        title="Add note"
                      >
                        <FileText className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <DayNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        day={selectedDay}
        note={selectedDay ? getNoteForDay(selectedDay) : null}
        onSave={handleSaveNote}
      />

      <PlanStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        progress={progress}
      />

      <ReminderSettingsModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        progress={progress}
        onSave={handleSaveReminder}
      />
    </div>
  );
}