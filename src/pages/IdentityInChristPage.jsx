import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

const identityTruths = [
  {
    truth: "I am a child of God",
    verse: "John 1:12",
    fullVerse: "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.",
    explanation: "You are not an orphan or an accident. You belong to the family of God, adopted as His beloved child with full rights and privileges."
  },
  {
    truth: "I am chosen and dearly loved",
    verse: "Colossians 3:12",
    fullVerse: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.",
    explanation: "God handpicked you before the foundation of the world. You are not random—you are purposefully chosen and deeply loved."
  },
  {
    truth: "I am a new creation",
    verse: "2 Corinthians 5:17",
    fullVerse: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    explanation: "Your past does not define you. In Christ, you have been made completely new. The old patterns, shame, and identity are gone—you are recreated."
  },
  {
    truth: "I am more than a conqueror",
    verse: "Romans 8:37",
    fullVerse: "No, in all these things we are more than conquerors through him who loved us.",
    explanation: "You don't just survive—you thrive. Through Christ, you have the power to overcome every challenge and obstacle in your life."
  },
  {
    truth: "I am the salt of the earth and light of the world",
    verse: "Matthew 5:13-14",
    fullVerse: "You are the salt of the earth... You are the light of the world.",
    explanation: "You have purpose and influence. God has placed you exactly where you are to make a difference and bring His light into the darkness."
  },
  {
    truth: "I am fearfully and wonderfully made",
    verse: "Psalm 139:14",
    fullVerse: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
    explanation: "You are not a mistake. God intentionally designed you with care, purpose, and love. Every part of you has meaning."
  },
  {
    truth: "I am seated with Christ in heavenly places",
    verse: "Ephesians 2:6",
    fullVerse: "And God raised us up with Christ and seated us with him in the heavenly realms in Christ Jesus.",
    explanation: "You have spiritual authority and access to God. You are not beneath your circumstances—you are above them, seated in victory with Christ."
  }
];

export default function IdentityInChristPage() {
  const [todaysTruth, setTodaysTruth] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setTodaysTruth(identityTruths[dayOfYear % identityTruths.length]);
  }, []);

  if (!todaysTruth) return null;

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Identity in Christ</h1>
            <p className="text-xs text-[#0A1A2F]/60">Know who you are in Him</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#D9B878]/20 to-[#AFC7E3]/20 rounded-2xl p-6 border border-[#D9B878]/30"
        >
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-10 h-10 text-[#D9B878]" />
            <div>
              <h3 className="text-xl font-bold text-[#0A1A2F]">Today's Truth</h3>
              <p className="text-xs text-[#0A1A2F]/60">Your identity in Christ</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <p className="text-2xl font-bold text-[#0A1A2F] mb-6 text-center leading-relaxed">
              {todaysTruth.truth}
            </p>
            <p className="text-base font-semibold text-[#D9B878] text-center mb-4">
              {todaysTruth.verse}
            </p>
            <p className="text-sm text-[#0A1A2F]/70 italic text-center mb-6 leading-relaxed">
              "{todaysTruth.fullVerse}"
            </p>

            <Button
              onClick={() => setExpanded(!expanded)}
              variant="outline"
              className="w-full border-[#D9B878] hover:bg-[#D9B878]/10 h-12 text-base font-semibold"
            >
              {expanded ? (
                <>
                  Hide Explanation <ChevronUp className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Learn More <ChevronDown className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <p className="text-base text-[#0A1A2F] leading-relaxed">
                    {todaysTruth.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}