import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wind, Heart, BookOpen, PenLine, Smile, Droplets } from 'lucide-react';
import { createPageUrl } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function QuickTools() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const tools = [
    {
       id: 'breathing',
       icon: Wind,
       label: '60-Second Breathing',
       gradient: 'from-[#AFC7E3] to-[#AFC7E3]',
       isModal: false,
       action: () => navigate(createPageUrl('SelfCare')),
       content: (
         <div className="text-center space-y-4">
           <div className="text-6xl mb-4">🌬️</div>
           <p className="text-gray-700">Inhale deeply for 4 seconds...</p>
           <p className="text-gray-700">Hold for 4 seconds...</p>
           <p className="text-gray-700">Exhale slowly for 4 seconds...</p>
           <p className="text-gray-500 text-sm mt-4">Repeat 4 times</p>
         </div>
       )
     },
    {
       id: 'prayer',
       icon: Heart,
       label: '2-Minute Prayer',
       gradient: 'from-[#D9B878] to-[#D9B878]',
       isModal: true,
       content: (
         <div className="text-center space-y-4">
           <div className="text-6xl mb-4">🙏</div>
           <p className="text-gray-700 font-serif italic">
             "Lord, thank You for this moment. Ground me in Your presence.
             Fill me with Your peace that surpasses understanding.
             Guide my thoughts, my words, and my actions today. Amen."
           </p>
         </div>
       )
     },
    {
       id: 'scripture',
       icon: BookOpen,
       label: 'Scripture of the Day',
       gradient: 'from-[#D9B878] to-[#AFC7E3]',
       isModal: false,
       action: () => navigate(createPageUrl('Bible')),
       content: (
         <div className="text-center space-y-4">
           <div className="text-6xl mb-4">📖</div>
           <p className="text-gray-700 font-serif italic text-lg">
             "The Lord is my strength and my shield; my heart trusts in him."
           </p>
           <p className="text-gray-500 text-sm">Psalm 28:7</p>
         </div>
       )
     },
    {
       id: 'gratitude',
       icon: PenLine,
       label: 'Gratitude Journal',
       gradient: 'from-[#0A1A2F] to-[#AFC7E3]',
       isModal: false,
       action: () => navigate(createPageUrl('MyJournalEntries')),
       content: null
     },
    {
       id: 'mood',
       icon: Smile,
       label: 'Mood Check-In',
       gradient: 'from-[#AFC7E3] to-[#D9B878]',
       isModal: false,
       action: () => navigate(createPageUrl('SelfCare')),
       content: (
         <div className="text-center space-y-4">
           <p className="text-gray-700 font-semibold">How are you feeling right now?</p>
           <div className="flex justify-center gap-4 text-4xl">
             <button className="hover:scale-125 transition">😔</button>
             <button className="hover:scale-125 transition">😐</button>
             <button className="hover:scale-125 transition">🙂</button>
             <button className="hover:scale-125 transition">😄</button>
           </div>
         </div>
       )
     },
    {
       id: 'hydration',
       icon: Droplets,
       label: 'Hydration Tracker',
       gradient: 'from-[#AFC7E3] to-[#AFC7E3]',
       isModal: false,
       action: () => navigate(`${createPageUrl('Wellness')}?tab=nutrition`),
       content: null
     }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Quick Tools</h2>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => tool.isModal ? setActiveModal(tool.id) : tool.action()}
                className={`bg-gradient-to-br ${tool.gradient} rounded-2xl p-4 text-[#0A1A2F] shadow-lg`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">{tool.label}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Modals */}
       {tools.filter(t => t.isModal).map(tool => (
         <Dialog key={tool.id} open={activeModal === tool.id} onOpenChange={() => setActiveModal(null)}>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>{tool.label}</DialogTitle>
             </DialogHeader>
             {tool.content}
           </DialogContent>
         </Dialog>
       ))}
    </>
  );
}