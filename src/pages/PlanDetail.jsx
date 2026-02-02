import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Play, RotateCcw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { readingPlans } from '@/components/bible/BibleData';
import { Link } from 'react-router-dom';
import DayNoteModal from '@/components/plans/DayNoteModal';

export default function PlanDetail() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get('id');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const plan = readingPlans.find(p => p.id === planId);
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['planProgress', planId],
    queryFn: async () => {
      const all = await base44.entities.ReadingPlanProgress.list();
      return all.find(p => p.plan_id === planId) || null;
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
    onSuccess: () => queryClient.invalidateQueries(['planProgress'])
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

  const handleToggleDay = (day) => {
    if (!progress) return;
    
    const completed = progress.completed_days || [];
    const newCompleted = completed.includes(day)
      ? completed.filter(d => d !== day)
      : [...completed, day];
    
    updateProgress.mutate({
      id: progress.id,
      data: {
        completed_days: newCompleted,
        current_day: Math.max(...newCompleted, 1)
      }
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
            
            <div className="flex gap-2 mt-4">
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
                    
                    {/* Note button */}
                    <button
                      onClick={() => handleDayClick(day)}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Note Modal */}
      <DayNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        day={selectedDay}
        note={selectedDay ? getNoteForDay(selectedDay) : null}
        onSave={handleSaveNote}
      />
    </div>
  );
}