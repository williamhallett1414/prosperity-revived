import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DailyGuidedPrayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const prayers = [
    {
      text: "Heavenly Father, as I come before You today, I surrender my heart, my plans, and my worries into Your loving hands. Fill me with Your peace that surpasses all understanding. Guide my thoughts, words, and actions so they may honor You. Help me to walk in Your truth and love throughout this day. In Jesus' name, Amen.",
      scripture: "Philippians 4:6-7",
      scriptureText: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
    },
    {
      text: "Lord Jesus, I thank You for this new day and the breath in my lungs. Help me to see Your goodness in every moment. Strengthen me when I feel weak, comfort me when I'm troubled, and guide me when I'm uncertain. Let Your light shine through me to touch the lives of others. May everything I do today bring glory to Your name. Amen.",
      scripture: "Psalm 118:24",
      scriptureText: "This is the day that the Lord has made; let us rejoice and be glad in it."
    },
    {
      text: "Gracious God, I come to You seeking Your presence. Clear my mind of distractions and fill my heart with Your love. Help me to trust You completely, even when I cannot see the way forward. Give me wisdom in my decisions, patience in my struggles, and compassion for those around me. I place this day in Your hands. Amen.",
      scripture: "Proverbs 3:5-6",
      scriptureText: "Trust in the Lord with all your heart and lean not on your own understanding."
    },
    {
      text: "Father, as I begin this day, I ask for Your protection over my family, my loved ones, and myself. Shield us from harm and surround us with Your angels. Grant me a heart of gratitude and eyes to see the blessings You provide. Help me to be a vessel of Your grace and mercy to everyone I encounter today. Amen.",
      scripture: "Psalm 91:11",
      scriptureText: "For he will command his angels concerning you to guard you in all your ways."
    },
    {
      text: "Lord, I surrender my fears and anxieties to You. Replace them with Your perfect peace and unwavering faith. Help me to remember that You are in control and that Your plans for me are good. Give me strength to face challenges, courage to step out in faith, and hope that anchors my soul. Thank You for Your faithfulness. Amen.",
      scripture: "Jeremiah 29:11",
      scriptureText: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
    },
    {
      text: "Heavenly Father, I praise You for who You are—my Creator, my Redeemer, my Sustainer. I confess my shortcomings and ask for Your forgiveness. Renew my spirit and restore my soul. Help me to live according to Your will and to love others as You have loved me. May Your kingdom come and Your will be done in my life today. Amen.",
      scripture: "Psalm 51:10",
      scriptureText: "Create in me a pure heart, O God, and renew a steadfast spirit within me."
    },
    {
      text: "Lord Jesus, thank You for walking with me every step of the way. As I face this day, I ask for Your wisdom, Your strength, and Your joy. Help me to be a light in the darkness and a source of encouragement to those who are hurting. Let my life be a testimony of Your goodness and grace. I trust You with everything. Amen.",
      scripture: "Matthew 5:16",
      scriptureText: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."
    }
  ];

  const dayOfWeek = new Date().getDay();
  const todaysPrayer = prayers[dayOfWeek];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 45000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-gradient-to-br from-[#D9B878]/20 to-[#AFC7E3]/20 rounded-2xl p-6 border border-[#D9B878]/30 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#D9B878]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Daily Guided Prayer</h3>
        </div>
        <p className="text-sm text-[#0A1A2F]/70 mb-4">A fresh prayer to center your heart today</p>

        <div className="bg-white rounded-xl p-5 mb-4">
          <p className="text-[#0A1A2F] font-serif leading-relaxed mb-4">
            {todaysPrayer.text}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-[#0A1A2F]/60 mb-1">Today's Scripture</p>
              <p className="text-sm font-semibold text-[#D9B878]">{todaysPrayer.scripture}</p>
              <p className="text-xs text-[#0A1A2F]/70 italic mt-1">"{todaysPrayer.scriptureText}"</p>
            </div>

            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] rounded-full w-14 h-14"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-center"
          >
            <p className="text-sm text-[#0A1A2F]/60">🎧 Now playing guided prayer...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}