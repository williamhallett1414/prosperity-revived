import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronDown, ChevronUp } from 'lucide-react';
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

export default function IdentityInChrist() {
  const [todaysTruth, setTodaysTruth] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setTodaysTruth(identityTruths[dayOfYear % identityTruths.length]);
  }, []);

  if (!todaysTruth) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#D9B878]/20 to-[#AFC7E3]/20 rounded-2xl p-6 border border-[#D9B878]/30 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-6 h-6 text-[#D9B878]" />
        <h3 className="text-lg font-bold text-[#0A1A2F]">Identity in Christ</h3>
      </div>

      <div className="bg-white rounded-xl p-5">
        <p className="text-xl font-bold text-[#0A1A2F] mb-3 text-center">
          {todaysTruth.truth}
        </p>
        <p className="text-sm font-semibold text-[#D9B878] text-center mb-3">
          {todaysTruth.verse}
        </p>
        <p className="text-xs text-[#0A1A2F]/70 italic text-center mb-4">
          "{todaysTruth.fullVerse}"
        </p>

        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          className="w-full border-[#D9B878] hover:bg-[#D9B878]/10"
        >
          {expanded ? (
            <>
              Hide Explanation <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Learn More <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-[#0A1A2F] leading-relaxed">
                {todaysTruth.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}