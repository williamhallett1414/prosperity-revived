import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Zap, Heart, BookOpen, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const pathways = [
  {
    id: 'confidence',
    title: 'Confidence',
    icon: Target,
    color: '#D9B878',
    teaching: "True confidence comes from knowing who you are in Christ. You are not defined by your performance, but by God's love for you.",
    scripture: "Philippians 4:13 - I can do all things through Christ who strengthens me.",
    reflection: "What area of your life needs more confidence? How can you lean on God's strength today?",
    action: "Speak one positive truth about yourself based on Scripture every morning this week."
  },
  {
    id: 'fear',
    title: 'Overcoming Fear',
    icon: Shield,
    color: '#AFC7E3',
    teaching: "Fear is a natural emotion, but God has not given us a spirit of fear. When we trust in Him, we can face any challenge with courage.",
    scripture: "2 Timothy 1:7 - For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    reflection: "What fear is holding you back? How can you surrender it to God?",
    action: "Write down your biggest fear and pray over it daily, asking God to replace it with His peace."
  },
  {
    id: 'discipline',
    title: 'Discipline',
    icon: Zap,
    color: '#D9B878',
    teaching: "Discipline is not about perfection—it's about consistency. Small daily steps lead to lasting transformation.",
    scripture: "1 Corinthians 9:27 - I discipline my body and keep it under control.",
    reflection: "What area of your life needs more structure? What small step can you take today?",
    action: "Choose one habit to focus on this week and commit to it for 7 days straight."
  },
  {
    id: 'resilience',
    title: 'Emotional Resilience',
    icon: Heart,
    color: '#AFC7E3',
    teaching: "Resilience is the ability to bounce back from setbacks. It's built through trials and strengthened by faith.",
    scripture: "James 1:2-4 - Consider it pure joy whenever you face trials, because you know that the testing of your faith produces perseverance.",
    reflection: "What recent challenge has tested you? How did you grow from it?",
    action: "Journal about a past challenge and how God helped you through it. Use this as encouragement for future trials."
  },
  {
    id: 'faith_habits',
    title: 'Faith Habits',
    icon: BookOpen,
    color: '#D9B878',
    teaching: "Faith grows through intentional practice—prayer, reading Scripture, worship, and fellowship. Consistency builds a strong foundation.",
    scripture: "Hebrews 10:25 - Not giving up meeting together, as some are in the habit of doing, but encouraging one another.",
    reflection: "What spiritual disciplines do you want to strengthen? What's holding you back?",
    action: "Set a daily reminder for prayer and Bible reading. Start with just 5 minutes."
  }
];

export default function PersonalGrowthPathways() {
  const [selectedPathway, setSelectedPathway] = useState(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className="text-lg font-bold text-[#0A1A2F] mb-3">Personal Growth Pathways</h3>
        <div className="grid grid-cols-2 gap-3">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            return (
              <motion.button
                key={pathway.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPathway(pathway)}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#D9B878] hover:shadow-md transition-all text-left"
              >
                <Icon className="w-6 h-6 mb-2" style={{ color: pathway.color }} />
                <h4 className="text-sm font-semibold text-[#0A1A2F] mb-1">{pathway.title}</h4>
                <ChevronRight className="w-4 h-4 text-[#0A1A2F]/40" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <Dialog open={!!selectedPathway} onOpenChange={() => setSelectedPathway(null)}>
        <DialogContent className="max-w-lg">
          {selectedPathway && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {React.createElement(selectedPathway.icon, {
                  className: "w-8 h-8",
                  style: { color: selectedPathway.color }
                })}
                <h2 className="text-2xl font-bold text-[#0A1A2F]">{selectedPathway.title}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0A1A2F]/60 mb-2">Teaching</h3>
                  <p className="text-[#0A1A2F]">{selectedPathway.teaching}</p>
                </div>

                <div className="bg-[#D9B878]/10 rounded-xl p-4">
                  <p className="text-sm font-semibold text-[#D9B878] mb-1">Scripture</p>
                  <p className="text-sm text-[#0A1A2F] italic">{selectedPathway.scripture}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#0A1A2F]/60 mb-2">Reflection</h3>
                  <p className="text-[#0A1A2F] italic">{selectedPathway.reflection}</p>
                </div>

                <div className="bg-[#AFC7E3]/10 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-[#AFC7E3] mb-2">Action Step</h3>
                  <p className="text-sm text-[#0A1A2F]">{selectedPathway.action}</p>
                </div>
              </div>

              <Button
                onClick={() => setSelectedPathway(null)}
                className="w-full mt-6 bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}