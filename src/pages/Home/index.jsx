import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { todayKey } from '@/utils/localDate';
import { createPageUrl } from '@/utils';
import { Flame, ChevronRight } from 'lucide-react';
import { RitualButton, QuickNav, ResumeCard, ActiveChallengesWidget, StartHereCard } from '@/components/home/HomeComponents';
import HelpChatbot from '@/components/home/HelpChatbot';
import { GRACE_MOMENTS } from '@/components/home/graceMoments';
import gideonImg from '@/assets/gideon-avatar.png';
import hannahImg from '@/assets/hannah-avatar.png';
import coachDavidImg from '@/assets/coach-david-avatar.png';
import chefDanielImg from '@/assets/chef-daniel-avatar.png';
import coachPaulImg from '@/assets/coach-paul-avatar.png';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Good Night',    emoji: '🌙', isMorning: false };
  if (h < 12) return { text: 'Good Morning',  emoji: '🌅', isMorning: true  };
  if (h < 17) return { text: 'Good Afternoon',emoji: '☀️', isMorning: false };
  if (h < 21) return { text: 'Good Evening',  emoji: '🌇', isMorning: false };
  return       { text: 'Good Night',    emoji: '🌙', isMorning: false };
}

function getFirstName(user) {
  return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend';
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const greeting = getGreeting();
  const today = todayKey();
  const ritualKey = greeting.isMorning ? `ritual_morning_${today}` : `ritual_evening_${today}`;
  const [ritualDone, setRitualDone] = useState(() => !!localStorage.getItem(ritualKey));

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user?.email });
        return list[0] || null;
      } catch { return null; }
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F]">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white">
              {greeting.text}, {getFirstName(user)} {greeting.emoji}
            </h1>
            {userProgress && (
              <Link to={createPageUrl('Achievements')}>
                <div className="flex items-center gap-1.5 bg-white dark:bg-white/10 rounded-full px-3 py-1.5 shadow-sm dark:shadow-none border border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 dark:border-white/10">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold text-[#0A1A2F] dark:text-white text-xs">{userProgress.current_streak || 0}</span>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {!ritualDone && (
          <RitualButton
            isMorning={greeting.isMorning}
            onStartDay={async () => {
              // Mark ritual as done
              localStorage.setItem(ritualKey, '1');
              setRitualDone(true);
              // Award XP
              try {
                if (userProgress?.id) {
                  const pts = (userProgress.total_points || 0) + 15;
                  const streak = (userProgress.current_streak || 0) + 1;
                  await base44.entities.UserProgress.update(userProgress.id, {
                    total_points: pts,
                    current_streak: streak,
                    last_activity_date: today,
                  });
                }
              } catch {}
              // Navigate to a morning flow: Scripture → Affirmation → Intention
              navigate(createPageUrl('Bible'));
            }}
            onEndDay={async () => {
              localStorage.setItem(ritualKey, '1');
              setRitualDone(true);
              try {
                if (userProgress?.id) {
                  const pts = (userProgress.total_points || 0) + 15;
                  await base44.entities.UserProgress.update(userProgress.id, {
                    total_points: pts,
                    last_activity_date: today,
                  });
                }
              } catch {}
              // Navigate to evening flow: Gratitude → Reflection
              navigate(createPageUrl('GratitudeJournalPage'));
            }}
          />
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          {(() => {
            const DAILY_VERSES = [
              // — FAITH & TRUST (1-15) —
              { text: "Trust in the Lord with all your heart, and lean not on your own understanding.", ref: "Proverbs 3:5", book: "Proverbs", chapter: 3 },
              { text: "For we walk by faith, not by sight.", ref: "2 Corinthians 5:7", book: "2 Corinthians", chapter: 5 },
              { text: "Now faith is the substance of things hoped for, the evidence of things not seen.", ref: "Hebrews 11:1", book: "Hebrews", chapter: 11 },
              { text: "In all your ways acknowledge him, and he shall direct your paths.", ref: "Proverbs 3:6", book: "Proverbs", chapter: 3 },
              { text: "Commit your way to the Lord; trust in him and he will do this.", ref: "Psalm 37:5", book: "Psalms", chapter: 37 },
              { text: "When I am afraid, I put my trust in you.", ref: "Psalm 56:3", book: "Psalms", chapter: 56 },
              { text: "Those who know your name trust in you, for you, Lord, have never forsaken those who seek you.", ref: "Psalm 9:10", book: "Psalms", chapter: 9 },
              { text: "Blessed is the man who trusts in the Lord, whose confidence is in him.", ref: "Jeremiah 17:7", book: "Jeremiah", chapter: 17 },
              { text: "The Lord is good, a refuge in times of trouble. He cares for those who trust in him.", ref: "Nahum 1:7", book: "Nahum", chapter: 1 },
              { text: "Trust in him at all times, you people; pour out your hearts to him, for God is our refuge.", ref: "Psalm 62:8", book: "Psalms", chapter: 62 },
              { text: "It is better to take refuge in the Lord than to trust in humans.", ref: "Psalm 118:8", book: "Psalms", chapter: 118 },
              { text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you.", ref: "Deuteronomy 31:8", book: "Deuteronomy", chapter: 31 },
              { text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", ref: "Isaiah 26:3", book: "Isaiah", chapter: 26 },
              { text: "The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge.", ref: "Psalm 18:2", book: "Psalms", chapter: 18 },
              { text: "Some trust in chariots and some in horses, but we trust in the name of the Lord our God.", ref: "Psalm 20:7", book: "Psalms", chapter: 20 },
              // — STRENGTH & COURAGE (16-30) —
              { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13", book: "Philippians", chapter: 4 },
              { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9", book: "Joshua", chapter: 1 },
              { text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", ref: "Psalm 28:7", book: "Psalms", chapter: 28 },
              { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", ref: "Isaiah 40:31", book: "Isaiah", chapter: 40 },
              { text: "God is our refuge and strength, an ever-present help in trouble.", ref: "Psalm 46:1", book: "Psalms", chapter: 46 },
              { text: "The joy of the Lord is your strength.", ref: "Nehemiah 8:10", book: "Nehemiah", chapter: 8 },
              { text: "The Lord will fight for you; you need only to be still.", ref: "Exodus 14:14", book: "Exodus", chapter: 14 },
              { text: "No weapon formed against you shall prosper.", ref: "Isaiah 54:17", book: "Isaiah", chapter: 54 },
              { text: "Greater is he that is in you, than he that is in the world.", ref: "1 John 4:4", book: "1 John", chapter: 4 },
              { text: "If God is for us, who can be against us?", ref: "Romans 8:31", book: "Romans", chapter: 8 },
              { text: "My grace is sufficient for you, for my power is made perfect in weakness.", ref: "2 Corinthians 12:9", book: "2 Corinthians", chapter: 12 },
              { text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.", ref: "John 16:33", book: "John", chapter: 16 },
              { text: "Wait on the Lord; be of good courage, and he shall strengthen your heart.", ref: "Psalm 27:14", book: "Psalms", chapter: 27 },
              { text: "The Lord is my light and my salvation — whom shall I fear?", ref: "Psalm 27:1", book: "Psalms", chapter: 27 },
              { text: "He gives strength to the weary and increases the power of the weak.", ref: "Isaiah 40:29", book: "Isaiah", chapter: 40 },
              // — LOVE & GRACE (31-45) —
              { text: "For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.", ref: "John 3:16", book: "John", chapter: 3 },
              { text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.", ref: "Romans 5:8", book: "Romans", chapter: 5 },
              { text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.", ref: "Ephesians 2:8", book: "Ephesians", chapter: 2 },
              { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", ref: "1 Corinthians 13:4", book: "1 Corinthians", chapter: 13 },
              { text: "Above all, love each other deeply, because love covers over a multitude of sins.", ref: "1 Peter 4:8", book: "1 Peter", chapter: 4 },
              { text: "Dear friends, let us love one another, for love comes from God.", ref: "1 John 4:7", book: "1 John", chapter: 4 },
              { text: "A new command I give you: Love one another. As I have loved you, so you must love one another.", ref: "John 13:34", book: "John", chapter: 13 },
              { text: "And now these three remain: faith, hope and love. But the greatest of these is love.", ref: "1 Corinthians 13:13", book: "1 Corinthians", chapter: 13 },
              { text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you.", ref: "Zephaniah 3:17", book: "Zephaniah", chapter: 3 },
              { text: "See what great love the Father has lavished on us, that we should be called children of God!", ref: "1 John 3:1", book: "1 John", chapter: 3 },
              { text: "Neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God.", ref: "Romans 8:39", book: "Romans", chapter: 8 },
              { text: "We love because he first loved us.", ref: "1 John 4:19", book: "1 John", chapter: 4 },
              { text: "The steadfast love of the Lord never ceases; his mercies never come to an end.", ref: "Lamentations 3:22", book: "Lamentations", chapter: 3 },
              { text: "Beloved, if God so loved us, we also ought to love one another.", ref: "1 John 4:11", book: "1 John", chapter: 4 },
              { text: "How precious is your steadfast love, O God!", ref: "Psalm 36:7", book: "Psalms", chapter: 36 },
              // — PEACE & COMFORT (46-60) —
              { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", book: "Psalms", chapter: 23 },
              { text: "Come to me, all who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28", book: "Matthew", chapter: 11 },
              { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7", book: "1 Peter", chapter: 5 },
              { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6", book: "Philippians", chapter: 4 },
              { text: "Peace I leave with you; my peace I give you.", ref: "John 14:27", book: "John", chapter: 14 },
              { text: "He heals the brokenhearted and binds up their wounds.", ref: "Psalm 147:3", book: "Psalms", chapter: 147 },
              { text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me.", ref: "Psalm 23:4", book: "Psalms", chapter: 23 },
              { text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", ref: "Philippians 4:7", book: "Philippians", chapter: 4 },
              { text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", ref: "Psalm 34:18", book: "Psalms", chapter: 34 },
              { text: "Blessed are the peacemakers, for they will be called children of God.", ref: "Matthew 5:9", book: "Matthew", chapter: 5 },
              { text: "Be still, and know that I am God.", ref: "Psalm 46:10", book: "Psalms", chapter: 46 },
              { text: "When you pass through the waters, I will be with you.", ref: "Isaiah 43:2", book: "Isaiah", chapter: 43 },
              { text: "Blessed are those who mourn, for they will be comforted.", ref: "Matthew 5:4", book: "Matthew", chapter: 5 },
              { text: "The Lord gives strength to his people; the Lord blesses his people with peace.", ref: "Psalm 29:11", book: "Psalms", chapter: 29 },
              { text: "Let the peace of Christ rule in your hearts.", ref: "Colossians 3:15", book: "Colossians", chapter: 3 },
              // — PURPOSE & CALLING (61-75) —
              { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11", book: "Jeremiah", chapter: 29 },
              { text: "And we know that in all things God works for the good of those who love him.", ref: "Romans 8:28", book: "Romans", chapter: 8 },
              { text: "He who began a good work in you will carry it on to completion.", ref: "Philippians 1:6", book: "Philippians", chapter: 1 },
              { text: "Seek first the kingdom of God and his righteousness, and all these things will be added to you.", ref: "Matthew 6:33", book: "Matthew", chapter: 6 },
              { text: "You are the light of the world. A town built on a hill cannot be hidden.", ref: "Matthew 5:14", book: "Matthew", chapter: 5 },
              { text: "For we are God's handiwork, created in Christ Jesus to do good works.", ref: "Ephesians 2:10", book: "Ephesians", chapter: 2 },
              { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4", book: "Psalms", chapter: 37 },
              { text: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", ref: "Proverbs 18:10", book: "Proverbs", chapter: 18 },
              { text: "But you are a chosen people, a royal priesthood, a holy nation, God's special possession.", ref: "1 Peter 2:9", book: "1 Peter", chapter: 2 },
              { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23", book: "Colossians", chapter: 3 },
              { text: "For where your treasure is, there your heart will be also.", ref: "Matthew 6:21", book: "Matthew", chapter: 6 },
              { text: "I press on toward the goal to win the prize for which God has called me heavenward.", ref: "Philippians 3:14", book: "Philippians", chapter: 3 },
              { text: "Before I formed you in the womb I knew you, before you were born I set you apart.", ref: "Jeremiah 1:5", book: "Jeremiah", chapter: 1 },
              { text: "The Lord will fulfill his purpose for me; your steadfast love, O Lord, endures forever.", ref: "Psalm 138:8", book: "Psalms", chapter: 138 },
              { text: "Many are the plans in a person's heart, but it is the Lord's purpose that prevails.", ref: "Proverbs 19:21", book: "Proverbs", chapter: 19 },
              // — PERSEVERANCE (76-90) —
              { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9", book: "Galatians", chapter: 6 },
              { text: "Consider it pure joy whenever you face trials of many kinds, because the testing of your faith produces perseverance.", ref: "James 1:2-3", book: "James", chapter: 1 },
              { text: "Let us run with perseverance the race marked out for us, fixing our eyes on Jesus.", ref: "Hebrews 12:1-2", book: "Hebrews", chapter: 12 },
              { text: "Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life.", ref: "James 1:12", book: "James", chapter: 1 },
              { text: "Suffering produces perseverance; perseverance, character; and character, hope.", ref: "Romans 5:3-4", book: "Romans", chapter: 5 },
              { text: "I have fought the good fight, I have finished the race, I have kept the faith.", ref: "2 Timothy 4:7", book: "2 Timothy", chapter: 4 },
              { text: "The righteous may fall seven times but still get up.", ref: "Proverbs 24:16", book: "Proverbs", chapter: 24 },
              { text: "For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.", ref: "2 Corinthians 4:17", book: "2 Corinthians", chapter: 4 },
              { text: "Stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord.", ref: "1 Corinthians 15:58", book: "1 Corinthians", chapter: 15 },
              { text: "But the one who stands firm to the end will be saved.", ref: "Matthew 24:13", book: "Matthew", chapter: 24 },
              { text: "I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.", ref: "Romans 8:18", book: "Romans", chapter: 8 },
              { text: "Weeping may stay for the night, but rejoicing comes in the morning.", ref: "Psalm 30:5", book: "Psalms", chapter: 30 },
              { text: "The Lord is faithful, and he will strengthen you and protect you from the evil one.", ref: "2 Thessalonians 3:3", book: "2 Thessalonians", chapter: 3 },
              { text: "Do not throw away your confidence; it will be richly rewarded.", ref: "Hebrews 10:35", book: "Hebrews", chapter: 10 },
              { text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.", ref: "Revelation 21:4", book: "Revelation", chapter: 21 },
              // — PRAYER & WORSHIP (91-105) —
              { text: "Rejoice always, pray continually, give thanks in all circumstances.", ref: "1 Thessalonians 5:16-18", book: "1 Thessalonians", chapter: 5 },
              { text: "If my people, who are called by my name, will humble themselves and pray, I will hear from heaven and will heal their land.", ref: "2 Chronicles 7:14", book: "2 Chronicles", chapter: 7 },
              { text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7", book: "Matthew", chapter: 7 },
              { text: "The Lord is near to all who call on him, to all who call on him in truth.", ref: "Psalm 145:18", book: "Psalms", chapter: 145 },
              { text: "Call to me and I will answer you and tell you great and unsearchable things you do not know.", ref: "Jeremiah 33:3", book: "Jeremiah", chapter: 33 },
              { text: "If we ask anything according to his will, he hears us.", ref: "1 John 5:14", book: "1 John", chapter: 5 },
              { text: "Give thanks to the Lord, for he is good; his love endures forever.", ref: "Psalm 107:1", book: "Psalms", chapter: 107 },
              { text: "Enter his gates with thanksgiving and his courts with praise.", ref: "Psalm 100:4", book: "Psalms", chapter: 100 },
              { text: "Draw near to God, and he will draw near to you.", ref: "James 4:8", book: "James", chapter: 4 },
              { text: "From the rising of the sun to the place where it sets, the name of the Lord is to be praised.", ref: "Psalm 113:3", book: "Psalms", chapter: 113 },
              { text: "Let everything that has breath praise the Lord.", ref: "Psalm 150:6", book: "Psalms", chapter: 150 },
              { text: "Devote yourselves to prayer, being watchful and thankful.", ref: "Colossians 4:2", book: "Colossians", chapter: 4 },
              { text: "The prayer of a righteous person is powerful and effective.", ref: "James 5:16", book: "James", chapter: 5 },
              { text: "Praise the Lord, my soul; all my inmost being, praise his holy name.", ref: "Psalm 103:1", book: "Psalms", chapter: 103 },
              { text: "Great is the Lord and most worthy of praise; his greatness no one can fathom.", ref: "Psalm 145:3", book: "Psalms", chapter: 145 },
              // — WISDOM & GUIDANCE (106-120) —
              { text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.", ref: "James 1:5", book: "James", chapter: 1 },
              { text: "The fear of the Lord is the beginning of wisdom.", ref: "Proverbs 9:10", book: "Proverbs", chapter: 9 },
              { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105", book: "Psalms", chapter: 119 },
              { text: "For the Lord gives wisdom; from his mouth come knowledge and understanding.", ref: "Proverbs 2:6", book: "Proverbs", chapter: 2 },
              { text: "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.", ref: "Psalm 32:8", book: "Psalms", chapter: 32 },
              { text: "The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.", ref: "Proverbs 4:7", book: "Proverbs", chapter: 4 },
              { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2", book: "Romans", chapter: 12 },
              { text: "Guard your heart above all else, for it determines the course of your life.", ref: "Proverbs 4:23", book: "Proverbs", chapter: 4 },
              { text: "Teach us to number our days, that we may gain a heart of wisdom.", ref: "Psalm 90:12", book: "Psalms", chapter: 90 },
              { text: "Where there is no vision, the people perish.", ref: "Proverbs 29:18", book: "Proverbs", chapter: 29 },
              { text: "How much better to get wisdom than gold, to get insight rather than silver!", ref: "Proverbs 16:16", book: "Proverbs", chapter: 16 },
              { text: "The mind governed by the Spirit is life and peace.", ref: "Romans 8:6", book: "Romans", chapter: 8 },
              { text: "Walk with the wise and become wise, for a companion of fools suffers harm.", ref: "Proverbs 13:20", book: "Proverbs", chapter: 13 },
              { text: "Plans fail for lack of counsel, but with many advisers they succeed.", ref: "Proverbs 15:22", book: "Proverbs", chapter: 15 },
              { text: "The tongue of the wise adorns knowledge, but the mouth of the fool gushes folly.", ref: "Proverbs 15:2", book: "Proverbs", chapter: 15 },
              // — IDENTITY & RENEWAL (121-124) —
              { text: "Create in me a clean heart, O God, and renew a right spirit within me.", ref: "Psalm 51:10", book: "Psalms", chapter: 51 },
              { text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", ref: "2 Corinthians 5:17", book: "2 Corinthians", chapter: 5 },
              { text: "I praise you because I am fearfully and wonderfully made.", ref: "Psalm 139:14", book: "Psalms", chapter: 139 },
              { text: "Set your minds on things above, not on earthly things.", ref: "Colossians 3:2", book: "Colossians", chapter: 3 },
            ];
            const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_VERSES.length;
            const verse = DAILY_VERSES[dayIndex];
            return (
              <Link to={createPageUrl(`Bible?book=${encodeURIComponent(verse.book)}&chapter=${verse.chapter}`)}>
                <div id="tour-verse-card" className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 dark:border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                    <span className="text-6xl">📖</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
                    <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
                  </div>
                  <p className="text-[#0A1A2F] dark:text-white text-base leading-relaxed font-medium mb-3">
                    "{verse.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#0A1A2F]/50 dark:text-white/50 font-medium">{verse.ref}</p>
                    <span className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })()}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Link to={createPageUrl('PersonalGrowth')}>
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#0A1A2F] to-[#1a3a5c] rounded-2xl px-4 py-3 shadow-md dark:shadow-none">
              <span className="text-xl flex-shrink-0">💛</span>
              <p className="text-xs text-white/80 leading-relaxed flex-1">What would help you grow today?</p>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </div>
          </Link>
        </motion.div>

        {(() => {
          const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
          const gm = GRACE_MOMENTS[dayOfYear % GRACE_MOMENTS.length];
          return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
              <Link to={createPageUrl('Prayer')}>
                <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 dark:from-white/5 dark:to-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 dark:border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <span className="text-4xl">🕊️</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🕊️</span>
                    <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
                  </div>
                  <p className="text-[#0A1A2F] dark:text-white text-[15px] leading-relaxed font-semibold mb-2">{gm.message}</p>
                  <p className="text-[#0A1A2F]/60 dark:text-white/60 text-xs leading-relaxed italic">{gm.verse}</p>
                </div>
              </Link>
            </motion.div>
          );
        })()}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">💬</span>
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">Talk to Your Guides</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { name: 'Gideon', role: 'Biblical Wisdom', bot: 'Gideon', color: 'from-amber-500 to-amber-600', img: gideonImg },
              { name: 'Hannah', role: 'Mindset Coach', bot: 'Hannah', color: 'from-sky-400 to-sky-500', img: hannahImg },
              { name: 'Coach David', role: 'Fitness', bot: 'CoachDavid', color: 'from-blue-500 to-blue-600', img: coachDavidImg },
              { name: 'Chef Daniel', role: 'Nutrition', bot: 'ChefDaniel', color: 'from-orange-400 to-orange-500', img: chefDanielImg },
              { name: 'Coach Paul', role: 'Discipline & Purpose', bot: 'CoachPaul', color: 'from-purple-500 to-purple-700', img: coachPaulImg },
            ].map(({ name, role, bot, color, img }) => (
              <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)} className="flex-shrink-0" style={{ width: 140 }}>
                <div className="bg-white dark:bg-white/5 rounded-2xl p-3 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} mx-auto mb-2 flex items-center justify-center shadow-sm dark:shadow-none overflow-hidden`}>
                    <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="text-xs font-bold text-[#0A1A2F] dark:text-white text-center leading-tight">{name}</p>
                  <p className="text-[9px] text-[#0A1A2F]/40 dark:text-white/40 text-center font-medium">{role}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link to={createPageUrl('CoachingPlans')}>
            <div className="bg-gradient-to-br from-[#0D4F3C] to-[#1a8a6a] rounded-3xl p-5 shadow-md dark:shadow-none relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-base leading-tight">Coaching Plans</p>
                  <p className="text-white/70 text-xs mt-0.5">8-week guided programs for body, mind & spirit</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Help Chatbot — floating guide button */}
      <HelpChatbot />
    </div>
  );
}

export default Home;