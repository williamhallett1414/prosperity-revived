import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';




export default function Wellness() {
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me();
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <h1 className="text-lg font-bold text-[#0A1A2F]">Wellness</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Nutrition Card */}
          <Link to={createPageUrl('Nutrition')}>
            <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Nutrition</h3>
              </div>
              <p className="text-[#0A1A2F]/70 text-sm">Track meals and discover recipes</p>
            </div>
          </Link>

          {/* Personal Growth Card */}
          <Link to={createPageUrl('PersonalGrowth')}>
            <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Personal Growth</h3>
              </div>
              <p className="text-[#0A1A2F]/70 text-sm">Strengthen your mind and spirit</p>
            </div>
          </Link>

          {/* Workouts Card */}
          <Link to={createPageUrl('Workouts')}>
            <div className="bg-gradient-to-br from-[#FD9C2D] to-[#D9B878] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Workouts</h3>
              </div>
              <p className="text-[#0A1A2F]/70 text-sm">Track exercises and build strength</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}