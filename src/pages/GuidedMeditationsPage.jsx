import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, Music, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GuidedMeditationPlayer from '@/components/mindspirit/GuidedMeditationPlayer';

const HOW_IT_WORKS = [
{ icon: Mic, label: 'AI Script', desc: 'Fresh script generated just for you' },
{ icon: Music, label: 'Ambient Music', desc: 'Soothing tones throughout' },
{ icon: Smile, label: 'Feel Peace', desc: 'Guided breath + scripture' }];


export default function GuidedMeditationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors">

            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Guided Meditations</h1>
            <p className="text-xs text-[#0A1A2F]/60">26 sessions · AI voice + ambient music</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 max-w-2xl mx-auto">
        {/* How it works */}
        





















        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xs text-[#0A1A2F]/50 text-center mb-5">

          🎧 Headphones recommended · Find a quiet space · Close your eyes
        </motion.p>

        {/* All Meditation Cards — header suppressed since page already has one */}
        <GuidedMeditationPlayer hideHeader />
      </div>
    </div>);

}