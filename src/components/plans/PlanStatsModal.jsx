import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PlanStatsModal({ isOpen, onClose, progress }) {
  if (!progress) return null;

  const completionRate = Math.round((progress.completed_days?.length || 0) / progress.total_days * 100);
  const daysCompleted = progress.completed_days?.length || 0;
  const daysRemaining = progress.total_days - daysCompleted;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Plan Statistics</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overview */}
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] rounded-xl p-4 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{completionRate}%</div>
              <div className="text-sm opacity-90">Completion Rate</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{daysCompleted}</div>
              <div className="text-xs text-green-600">days</div>
            </div>

            <div className="bg-[#F2F6FA] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#3C4E53]" />
                <span className="text-xs text-[#3C4E53] font-medium">Remaining</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{daysRemaining}</div>
              <div className="text-xs text-[#3C4E53]">days</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{progress.current_streak || 0}</div>
              <div className="text-xs text-orange-600">days</div>
            </div>

            <div className="bg-[#FAD98D]/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-[#8a6e1a]" />
                <span className="text-xs text-[#8a6e1a] font-medium">Best Streak</span>
              </div>
              <div className="text-2xl font-bold text-[#0A1A2F]">{progress.longest_streak || 0}</div>
              <div className="text-xs text-[#8a6e1a]">days</div>
            </div>
          </div>

          {/* Dates */}
          {progress.started_date && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Started</div>
              <div className="font-medium text-gray-900">
                {format(new Date(progress.started_date), 'MMMM d, yyyy')}
              </div>
            </div>
          )}

          {progress.completed_date && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-600 mb-1">Completed</div>
              <div className="font-medium text-green-900">
                {format(new Date(progress.completed_date), 'MMMM d, yyyy')}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}