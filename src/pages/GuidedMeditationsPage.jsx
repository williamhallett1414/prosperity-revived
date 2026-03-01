import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GuidedMeditationPlayer from '@/components/mindspirit/GuidedMeditationPlayer';

export default function GuidedMeditationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/15 flex items-center justify-center hover:bg-[#AFC7E3]/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Guided Meditations</h1>
            <p className="text-xs text-[#0A1A2F]/60">AI voice narration + ambient music</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 max-w-2xl mx-auto">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#3C4E53]/10 rounded-2xl p-5 border border-[#AFC7E3]/25 mb-6"
        >
          <p className="text-sm text-[#0A1A2F]/80 leading-relaxed">
            Each meditation generates a <span className="font-semibold text-[#3C4E53]">fresh AI script</span> just for you, narrated with a calm voice and accompanied by soothing ambient tones. Find a quiet place, close your eyes, and breathe. 🙏
          </p>
        </motion.div>

        {/* All Meditation Cards */}
        <GuidedMeditationPlayer />
      </div>
    </div>
  );
}
