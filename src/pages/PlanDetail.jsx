import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Play, RotateCcw, FileText, BarChart3, Bell, BookOpen, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateGroupPlanModal from '@/components/plans/CreateGroupPlanModal';
import { Progress } from '@/components/ui/progress';
import { readingPlans } from '@/components/bible/BibleData';
import { Link } from 'react-router-dom';
import DayNoteModal from '@/components/plans/DayNoteModal';
import PlanStatsModal from '@/components/plans/PlanStatsModal';
import ReminderSettingsModal from '@/components/plans/ReminderSettingsModal';
import { Toaster } from '@/components/ui/sonner.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PlanDevotionalView from '@/components/bible/PlanDevotionalView';
import { getReadingForDay } from '@/components/bible/BibleData';

export default function PlanDetail() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('id');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [user, setUser] = useState(null);
  
  let plan = readingPlans.find(p => p.id === planId);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

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

  const deletePlan = useMutation({
    mutationFn: (id) => base44.entities.ReadingPlanProgress.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['planProgress']);
      window.location.href = createPageUrl('Plans');
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

  const createGroupPlan = useMutation({
    mutationFn: async (groupData) => {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const group = await base44.entities.GroupReadingPlan.create({
        plan_id: plan.id,
        plan_name: plan.name,
        group_name: groupData.group_name,
        description: groupData.description,
        creator_email: user.email,
        creator_name: user.full_name,
        total_days: plan.duration,
        is_custom: progress?.is_custom || false,
        custom_readings: progress?.custom_readings,
        start_date: groupData.start_date,
        is_private: groupData.is_private,
        invite_code: groupData.is_private ? inviteCode : null,
        member_count: 1
      });

      // Add creator as admin member
      await base44.entities.GroupReadingMember.create({
        group_id: group.id,
        user_email: user.email,
        user_name: user.full_name,
        progress_id: progress?.id,
        share_progress: true,
        role: 'admin',
        joined_date: new Date().toISOString().split('T')[0]
      });

      return group;
    },
    onSuccess: (group) => {
      setShowCreateGroup(false);
      window.location.href = createPageUrl(`GroupPlanDetail?id=${group.id}`);
    }
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
    } else {
      const reading = getReadingForDay(planId, day);
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
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Hero Image */}
      <div className="relative h-64">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
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

        {/* Tabs for Plan Content and Devotional */}
        <Tabs defaultValue="progress" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Plan Progress</TabsTrigger>
            <TabsTrigger value="devotional">Devotional</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
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
                onClick={() => setShowCreateGroup(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:border-green-300"
              >
                <Users className="w-4 h-4" />
                Create Group
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to abandon this plan? All progress will be lost.')) {
                    deletePlan.mutate(progress.id);
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Abandon
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
                <div className="grid grid-cols-1 gap-3">
                  {days.map(day => {
                    const isCompleted = progress.completed_days?.includes(day);
                    const hasNote = getNoteForDay(day);
                    const reading = progress.is_custom 
                      ? progress.custom_readings?.find(r => r.day === day)
                      : getReadingForDay(planId, day);
                    
                    return (
                      <motion.div 
                        key={day}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-white rounded-xl p-4 border-2 transition-all ${
                          isCompleted 
                            ? 'border-[#8fa68a] bg-[#8fa68a]/5' 
                            : 'border-gray-200 hover:border-[#c9a227]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleDay(day)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                                isCompleted
                                  ? 'bg-[#8fa68a] text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : day}
                            </button>
                            
                            <div>
                              <h3 className="font-semibold text-[#1a1a2e]">Day {day}</h3>
                              {reading && (
                                <p className="text-sm text-gray-600">
                                  {reading.book} {reading.chapter}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {hasNote && (
                              <div className="w-2 h-2 bg-[#c9a227] rounded-full" />
                            )}
                            {reading && (
                              <Button
                                onClick={() => handleOpenDayReading(day)}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <BookOpen className="w-4 h-4 mr-1" />
                                Read
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDayClick(day)}
                              variant="ghost"
                              size="sm"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="devotional">
            <PlanDevotionalView planId={planId} />
          </TabsContent>
        </Tabs>
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

      <CreateGroupPlanModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSubmit={(data) => createGroupPlan.mutate(data)}
        basePlan={plan}
      />
      </div>
    </>
  );
}