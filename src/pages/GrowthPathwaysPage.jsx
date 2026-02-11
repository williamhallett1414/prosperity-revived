import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Zap, Heart, BookOpen, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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

export default function GrowthPathwaysPage() {
  const [selectedPathway, setSelectedPathway] = useState(null);

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] pb-24">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Link
              to={createPageUrl('Wellness') + '?tab=mind'}
              className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#0A1A2F]">Personal Growth Pathways</h1>
              <p className="text-xs text-[#0A1A2F]/60">Choose your path to growth</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pathways.map((pathway, index) => {
                const Icon = pathway.icon;
                return (
                  <motion.button
                    key={pathway.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPathway(pathway)}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#D9B878] hover:shadow-lg transition-all text-left"
                  >
                    <Icon className="w-8 h-8 mb-4" style={{ color: pathway.color }} />
                    <h4 className="text-lg font-semibold text-[#0A1A2F] mb-2">{pathway.title}</h4>
                    <div className="flex items-center text-sm text-[#0A1A2F]/60">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={!!selectedPathway} onOpenChange={() => setSelectedPathway(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedPathway && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {React.createElement(selectedPathway.icon, {
                  className: "w-10 h-10",
                  style: { color: selectedPathway.color }
                })}
                <h2 className="text-2xl font-bold text-[#0A1A2F]">{selectedPathway.title}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0A1A2F]/60 mb-2">Teaching</h3>
                  <p className="text-[#0A1A2F] leading-relaxed">{selectedPathway.teaching}</p>
                </div>

                <div className="bg-[#D9B878]/10 rounded-xl p-5">
                  <p className="text-sm font-semibold text-[#D9B878] mb-2">Scripture</p>
                  <p className="text-sm text-[#0A1A2F] italic leading-relaxed">{selectedPathway.scripture}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#0A1A2F]/60 mb-2">Reflection</h3>
                  <p className="text-[#0A1A2F] italic leading-relaxed">{selectedPathway.reflection}</p>
                </div>

                <div className="bg-[#AFC7E3]/10 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[#AFC7E3] mb-2">Action Step</h3>
                  <p className="text-sm text-[#0A1A2F] leading-relaxed">{selectedPathway.action}</p>
                </div>
              </div>

              <Button
                onClick={() => setSelectedPathway(null)}
                className="w-full mt-6 bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] h-12 text-base font-semibold"
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