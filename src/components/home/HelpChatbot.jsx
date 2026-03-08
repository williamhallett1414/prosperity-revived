import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, X, Send, Loader2, Map, BookOpen, Play,
  ChevronRight, Sparkles, Navigation, Lightbulb, ExternalLink, Target, Salad, Brain
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

// ── Mini-tour definitions — triggered by intent ───────────────────────────────
export const MINI_TOURS = {
  daily_ritual: [
    {
      id: 'ritual_intro', targetId: null, navigateTo: 'Home',
      title: 'Daily Ritual 🌅',
      body: "Your daily ritual anchors the whole day. Let me show you where to find it.",
      tapToAdvance: false,
    },
    {
      id: 'ritual_btn', targetId: 'tour-ritual-btn', navigateTo: null,
      title: 'Start My Day button',
      body: 'Tap this every morning for scripture, a personal affirmation, and your intention for the day. At night it flips to "End My Day" for gratitude & reflection.',
      tip: 'Takes just 2–3 minutes — perfect first thing after waking up',
      tapToAdvance: true, tapLabel: 'Tap to open it now',
    },
    {
      id: 'ritual_verse', targetId: 'tour-verse-card', navigateTo: null,
      title: 'Daily Scripture card 📖',
      body: 'Below the ritual button is your personalized verse for today. Tap "Read →" to open it in the full Bible reader.',
      tapToAdvance: false,
    },
  ],

  workouts: [
    {
      id: 'wk_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Wellness Hub 💪',
      body: "All your fitness tools live here. Tap the Wellness tab to open it.",
      tapToAdvance: true, tapLabel: 'Tap Wellness tab', arrowDown: true,
    },
    {
      id: 'wk_card', targetId: 'tour-workouts-card', navigateTo: 'Workouts',
      title: 'Workouts section 🏋️',
      body: "Tap the Workouts card to see your full library — 33+ sessions across 6 categories. Coach David personalised this based on your fitness profile.",
      tip: 'HIIT · Strength · Cardio · Flexibility · Yoga · Recovery',
      tapToAdvance: true, tapLabel: 'Open Workouts',
    },
    {
      id: 'wk_quick', targetId: 'tour-quick-start', navigateTo: null,
      title: 'Quick Start sessions ⚡',
      body: 'These are ready to go right now — tap any row to log it. Each session auto-tracks in your Workout Trends so your streaks stay intact.',
      tapToAdvance: false,
    },
    {
      id: 'wk_cats', targetId: 'tour-categories', navigateTo: null,
      title: 'Browse by Category',
      body: 'Filter by workout type and difficulty. Tap any category to open its full library.',
      tapToAdvance: false,
    },
  ],

  nutrition: [
    {
      id: 'nut_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Wellness Hub 🍽️',
      body: 'Nutrition lives inside the Wellness hub. Tap to open it.',
      tapToAdvance: true, tapLabel: 'Open Wellness', arrowDown: true,
    },
    {
      id: 'nut_card', targetId: null, navigateTo: 'Nutrition',
      title: 'Nutrition section',
      body: "Inside Wellness, tap the Nutrition card to open your meal tracker, macros dashboard, water tracker, and meal planner.",
      tapToAdvance: false,
    },
    {
      id: 'nut_macros', targetId: 'tour-nutrition-macros', navigateTo: null,
      title: "Today's Macros 📊",
      body: "This card shows your daily calories, protein, carbs and fat targets. Each ring fills as you log meals throughout the day.",
      tapToAdvance: false,
    },
    {
      id: 'nut_water', targetId: 'tour-water-tracker', navigateTo: null,
      title: 'Water Tracker 💧',
      body: 'Track your daily water intake glass by glass. Tap + to add a glass. Your goal is set from your profile setup.',
      tip: 'Staying hydrated improves energy, focus, and recovery',
      tapToAdvance: false,
    },
    {
      id: 'nut_chef', targetId: 'tour-chef-daniel-btn', navigateTo: null,
      title: 'Chat with Chef Daniel 🍳',
      body: "This button opens Chef Daniel — your AI nutrition coach. Ask him for meal ideas, macro-friendly recipes, or help hitting your goals.",
      tapToAdvance: false,
    },
  ],

  bible: [
    {
      id: 'bib_nav', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Bible tab 📖',
      body: "The Bible tab is your full study companion. Tap it now to open it.",
      tapToAdvance: true, tapLabel: 'Open Bible', arrowDown: true,
    },
    {
      id: 'bib_tabs', targetId: 'tour-bible-tabs', navigateTo: null,
      title: 'Read · Study · Devotional',
      body: 'Three modes: Read opens the full 66-book Bible. Study gives topical guides on anxiety, purpose, relationships and more. Devotional gives daily meditations at your preferred depth.',
      tip: 'Your translation and devotional depth preference from onboarding are already saved',
      tapToAdvance: false,
    },
    {
      id: 'bib_gideon', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Chat with Gideon 🙏',
      body: "This floating button opens Gideon, your AI spiritual guide. He can answer scripture questions, pray with you, explain passages, or give a word of encouragement.",
      tip: 'Gideon remembers your faith profile and previous conversations',
      tapToAdvance: false,
    },
  ],

  growth: [
    {
      id: 'gr_nav', targetId: null, navigateTo: 'PersonalGrowth',
      title: 'Personal Growth hub 🧠',
      body: "Personal Growth is your toolkit for building the person God designed you to be. Let me walk you through it.",
      tapToAdvance: false,
    },
    {
      id: 'gr_tools', targetId: 'tour-daily-tools', navigateTo: null,
      title: 'Daily Practices ✅',
      body: 'Six daily tools: Habit Builder, Emotional Check-In, Gratitude Journal, Affirmations, Guided Meditation, and Identity in Christ. Check these off each day to build streaks.',
      tip: 'Green checkmarks appear as you complete each one',
      tapToAdvance: false,
    },
    {
      id: 'gr_hannah', targetId: 'tour-hannah-btn', navigateTo: null,
      title: 'Chat with Hannah 💬',
      body: "Hannah is your personal growth AI coach. Journal with her, process emotions, work through challenges, or just talk. She already knows your growth goals from setup.",
      tapToAdvance: false,
    },
  ],

  community: [
    {
      id: 'com_nav', targetId: 'nav-community', navigateTo: 'Community',
      title: 'Community 👥',
      body: "Community keeps you accountable and connected. Tap the tab to open it.",
      tapToAdvance: true, tapLabel: 'Open Community', arrowDown: true,
    },
    {
      id: 'com_tabs', targetId: 'tour-community-groups', navigateTo: null,
      title: 'Feed · Groups · Blog · Challenges',
      body: 'Feed is where members share wins and ask for prayer. Groups lets you join Bible study, workout, or prayer circles. Blog is for longer reflections. Challenges are community accountability goals.',
      tip: 'Members in groups stay on track 3× longer',
      tapToAdvance: false,
    },
  ],

  profile: [
    {
      id: 'pro_nav', targetId: 'nav-profile', navigateTo: 'Profile',
      title: 'Your Profile 📊',
      body: "Your profile is your journey dashboard — streaks, achievements, and progress all in one place.",
      tapToAdvance: true, tapLabel: 'Open Profile', arrowDown: true,
    },
    {
      id: 'pro_links', targetId: 'tour-profile-progress', navigateTo: null,
      title: 'Journey & Achievements',
      body: 'Tap Journey for a holistic progress report across workouts, mood, habits, and scripture. Tap Achievements to see badges you\'ve earned — or are close to earning.',
      tapToAdvance: false,
    },
  ],

  ai_coaches: [
    {
      id: 'bots_intro', targetId: null, navigateTo: null,
      title: 'Your 4 AI Coaches 🤖',
      body: "You have four AI coaches, each specialising in a different part of your journey. They all know your profile and goals from setup.",
      tapToAdvance: false,
      isDone: false,
    },
    {
      id: 'bots_gideon', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Gideon — Spiritual Guide',
      body: 'Gideon lives in the Bible tab. Tap to navigate there, then use the gold floating button to open him. Ask anything about scripture, prayer, or faith.',
      tapToAdvance: true, tapLabel: 'Go to Bible', arrowDown: true,
    },
    {
      id: 'bots_gideon_btn', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Open Gideon 🙏',
      body: 'This button opens a full-screen conversation with Gideon. He uses your Bible translation preference and faith profile automatically.',
      tapToAdvance: true, tapLabel: 'Open Gideon',
    },
  ],
  coaching: [
    {
      id: 'coach_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Coaching Programs 📚',
      body: 'Structured coaching plans live in the Wellness hub. Tap to open it.',
      tapToAdvance: true, tapLabel: 'Open Wellness', arrowDown: true,
    },
    {
      id: 'coach_section', targetId: 'tour-coaching-section', navigateTo: null,
      title: '8-Week Coaching Programs',
      body: 'These structured programs guide you day by day — Bible-based, fitness, or holistic. Coach David and Gideon co-facilitate them based on your goals.',
      tip: 'You can be in multiple programs at once. Progress is saved automatically.',
      tapToAdvance: false,
    },
  ],

  habits: [
    {
      id: 'hab_nav', targetId: null, navigateTo: 'PersonalGrowth',
      title: 'Habit Builder 📋',
      body: "Your habit tracking tools are in Personal Growth. Let me take you there.",
      tapToAdvance: false,
    },
    {
      id: 'hab_tools', targetId: 'tour-daily-tools', navigateTo: null,
      title: 'Daily Practices',
      body: 'The Habit Builder is the first tool in this list. Track habits daily to build streaks. Check each one off as you complete it — the green tick saves automatically.',
      tip: 'Even logging 1 habit a day builds momentum. Start small.',
      tapToAdvance: false,
    },
  ],

  prayer: [
    {
      id: 'pray_nav', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Prayer in the app 🙏',
      body: 'Prayer tools live alongside your Bible. Tap the Bible tab to open it.',
      tapToAdvance: true, tapLabel: 'Open Bible', arrowDown: true,
    },
    {
      id: 'pray_dev', targetId: 'tour-bible-tabs', navigateTo: null,
      title: 'Devotional tab',
      body: 'The Devotional tab has daily meditations and prayer prompts. Each day has a reflection, a prayer guide, and a scripture to sit with.',
      tapToAdvance: false,
    },
    {
      id: 'pray_gideon', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Pray with Gideon 🙏',
      body: "Tap this button and tell Gideon you want to pray. He will guide you through a personal prayer based on what's on your heart right now.",
      tip: 'Try: "Gideon, can we pray together about _____?"',
      tapToAdvance: false,
    },
  ],


  fitness_goals: [
    {
      id: 'fg_entry', targetId: 'tour-fitness-goals-entry', navigateTo: 'Workouts',
      title: 'Fitness Goals card 🎯',
      body: 'At the top of your Workouts page is a personalised Fitness Goals card. Tap it to open your full fitness dashboard.',
      tapToAdvance: true, tapLabel: 'Open Fitness Goals',
    },
    {
      id: 'fg_bmi', targetId: 'tour-bmi-card', navigateTo: 'FitnessGoalsPage',
      title: 'BMI Calculator 📊',
      body: 'Your Body Mass Index is calculated live from your height and weight. The gauge shows where you sit across Underweight / Healthy / Overweight / Obese.',
      tip: 'Log your latest weight at the bottom of this card to keep your BMI current',
      tapToAdvance: false,
    },
    {
      id: 'fg_cals', targetId: 'tour-calories-card', navigateTo: null,
      title: 'Calorie Targets 🔥',
      body: 'Your TDEE (maintenance calories) and goal calories are calculated using the Mifflin-St Jeor formula and your workout frequency. Tap ⓘ for the full breakdown.',
      tapToAdvance: false,
    },
    {
      id: 'fg_macros', targetId: 'tour-macros-split', navigateTo: null,
      title: 'Macro Split 🥗',
      body: 'Protein, carbs and fat targets are tuned to your goal. Losing weight gets more protein; building muscle gets more carbs. Tap "Open Nutrition" to log against these daily.',
      tapToAdvance: false,
    },
    {
      id: 'fg_timeline', targetId: 'tour-timeline-card', navigateTo: null,
      title: 'Goal Timeline ⏳',
      body: "Based on your current weight, goal weight, and deficit, this predicts when you'll hit your goal. It updates automatically when you log new weights.",
      tip: 'Log weight weekly for the most accurate timeline',
      tapToAdvance: false,
    },
  ],


  nutrition_goals: [
    {
      id: 'ng_entry', targetId: 'tour-nutrition-goals-entry', navigateTo: 'Nutrition',
      title: 'Nutrition Goals card 🥗',
      body: 'At the top of the Nutrition page is your personalised Nutrition Goals card. Tap it to open your full nutrition dashboard.',
      tapToAdvance: true, tapLabel: 'Open Nutrition Goals',
    },
    {
      id: 'ng_cals', targetId: 'tour-nutrition-calories', navigateTo: 'NutritionGoalsPage',
      title: 'Daily Calorie Target 🔥',
      body: 'Your calorie target is calculated from your diet type, fitness goal, and workout frequency. Keto users get an auto-adjusted macro split. Tap ⓘ for the full formula.',
      tapToAdvance: false,
    },
    {
      id: 'ng_macros', targetId: 'tour-nutrition-macros-goals', navigateTo: null,
      title: 'Macro Targets 📊',
      body: 'Protein, carbs and fat are split based on your goal and diet. Keto overrides carbs to under 5%. Tap "Track in Nutrition" to log meals against these daily.',
      tapToAdvance: false,
    },
    {
      id: 'ng_timing', targetId: 'tour-meal-timing', navigateTo: null,
      title: 'Meal Schedule ⏰',
      body: 'Your meal timing is built from your meals-per-day preference. Intermittent fasting users get a 16-hour window plan. Each slot shows how many calories to eat.',
      tip: 'Spacing meals evenly keeps energy stable throughout the day',
      tapToAdvance: false,
    },
    {
      id: 'ng_allergens', targetId: 'tour-allergens', navigateTo: null,
      title: 'Foods to Avoid 🛡️',
      body: 'Your allergens from onboarding are shown here. Chef Daniel checks these automatically when suggesting meals. Update them in Settings if they change.',
      tapToAdvance: false,
    },
    {
      id: 'ng_water', targetId: 'tour-nutrition-water', navigateTo: null,
      title: 'Water Goal 💧',
      body: 'Your daily water target is calculated at 33ml per kg of bodyweight, with an extra 0.5L added if you train 4+ times per week.',
      tapToAdvance: false,
    },
  ],


  bible_goals: [
    {
      id: 'bg_entry', targetId: 'tour-bible-goals-entry', navigateTo: 'Bible',
      title: 'Bible Study Goals 📖',
      body: 'At the top of the Bible Read tab is your personalised Bible Goals card. Tap it to open your full study profile.',
      tapToAdvance: true, tapLabel: 'Open Bible Goals',
    },
    {
      id: 'bg_translation', targetId: 'tour-bible-translation', navigateTo: 'BibleGoalsPage',
      title: 'Your Translation 📜',
      body: 'Your preferred Bible translation is shown here with a plain-English explanation of its reading style. Tap ⓘ for more detail.',
      tapToAdvance: false,
    },
    {
      id: 'bg_topics', targetId: 'tour-bible-topics', navigateTo: null,
      title: 'Topics That Matter ❤️',
      body: 'The themes you care most about — from prayer to finances — shape which reading plans and verses Gideon recommends to you.',
      tapToAdvance: false,
    },
    {
      id: 'bg_depth', targetId: 'tour-devotional-depth', navigateTo: null,
      title: 'Devotional Depth ⏱️',
      body: 'Your preferred study depth — short (2–3 min), medium (10–15 min), or deep (30+ min) — tells Gideon how detailed to be in devotional responses.',
      tip: 'You can ask Gideon to go deeper or shallower at any time in chat',
      tapToAdvance: false,
    },
    {
      id: 'bg_plans', targetId: 'tour-topic-plans', navigateTo: null,
      title: 'Recommended Plans 📚',
      body: 'Reading plans are matched to your selected topics. Each plan links directly into the Bible reader.',
      tapToAdvance: false,
    },
    {
      id: 'bg_gideon', targetId: 'tour-gideon-goals-cta', navigateTo: null,
      title: 'Start Studying with Gideon 🙏',
      body: 'Gideon knows your translation preference, topics, and depth level. Every chat session is personalised to your faith journey.',
      tapToAdvance: true, tapLabel: 'Open Gideon',
    },
  ],


  growth_goals: [
    {
      id: 'gg_entry', targetId: 'tour-growth-goals-entry', navigateTo: 'PersonalGrowth',
      title: 'Growth Profile 🧠',
      body: 'At the top of the Personal Growth page is your Growth Profile card. Tap it to see your full personalised growth dashboard.',
      tapToAdvance: true, tapLabel: 'Open Growth Goals',
    },
    {
      id: 'gg_areas', targetId: 'tour-growth-areas', navigateTo: 'PersonalGrowthGoalsPage',
      title: 'Your Growth Areas 💪',
      body: 'The up-to-3 areas you picked in onboarding — like Confidence, Habits, or Emotional Intelligence. Tap each card to expand it and see which daily tools are mapped to it.',
      tapToAdvance: false,
    },
    {
      id: 'gg_values', targetId: 'tour-core-values', navigateTo: null,
      title: 'Core Values ⭐',
      body: 'Your up-to-5 core values shape the affirmations Hannah gives you and the lens she uses in coaching. A personalised affirmation rooted in your top value is shown here.',
      tapToAdvance: false,
    },
    {
      id: 'gg_coaching', targetId: 'tour-coaching-style', navigateTo: null,
      title: "Hannah's Coaching Style 🌸",
      body: 'Your preferred style — Gentle, Direct, Exploratory, or Structured — tells Hannah exactly how to communicate. She adapts every response to match it.',
      tip: 'You can ask Hannah to switch styles at any time in chat',
      tapToAdvance: false,
    },
    {
      id: 'gg_tools', targetId: 'tour-growth-tools', navigateTo: null,
      title: 'Recommended Tools ⚡',
      body: 'Daily tools like Habit Builder, Emotional Check-in, and Gratitude Journal are matched to your growth areas. Each links directly into the tool.',
      tapToAdvance: false,
    },
    {
      id: 'gg_hannah', targetId: 'tour-hannah-goals-cta', navigateTo: null,
      title: 'Talk to Hannah 💬',
      body: 'Hannah knows your growth areas, core values, 90-day goal, and coaching style. Every session is built around you.',
      tapToAdvance: true, tapLabel: 'Open Hannah',
    },
  ],


};

// ── Intent → tour key map (used to interpret LLM response) ───────────────────
const TOUR_KEYS = Object.keys(MINI_TOURS);

// ── Page navigation shortcuts ─────────────────────────────────────────────────
const PAGE_SHORTCUTS = {
  workouts:   { label: 'Open Workouts',       page: 'Workouts',         color: '#38BDF8' },
  nutrition:  { label: 'Open Nutrition',       page: 'Nutrition',        color: '#22C55E' },
  bible:      { label: 'Open Bible',           page: 'Bible',            color: '#C9A227' },
  growth:     { label: 'Open Personal Growth', page: 'PersonalGrowth',   color: '#AFC7E3' },
  community:  { label: 'Open Community',       page: 'Community',        color: '#8B5CF6' },
  profile:    { label: 'Open Profile',         page: 'Profile',          color: '#FD9C2D' },
  habits:     { label: 'Open Habit Builder',   page: 'HabitBuilderPage', color: '#22C55E' },
  gratitude:  { label: 'Open Gratitude Journal',page: 'GratitudeJournalPage', color: '#C9A227' },
  meditation: { label: 'Open Meditations',     page: 'GuidedMeditationsPage', color: '#AFC7E3' },
  affirmations:{ label: 'Open Affirmations',   page: 'AffirmationsPage', color: '#FAD98D' },
  checkin:    { label: 'Open Emotional Check-In',page: 'EmotionalCheckInPage', color: '#F87171' },
  challenges: { label: 'Open Challenges',      page: 'SelfCareChallengesPage', color: '#FD9C2D' },
  journal:    { label: 'Open Journal',         page: 'MyJournalEntries', color: '#AFC7E3' },
  plans:      { label: 'Browse Coaching Plans',page: 'CoachingPlans',    color: '#38BDF8' },
  fitness:    { label: 'Open Fitness Goals',   page: 'FitnessGoalsPage',    color: '#38BDF8' },
  nutrition_goals: { label: 'Open Nutrition Goals', page: 'NutritionGoalsPage', color: '#22C55E' },
  bible_goals:     { label: 'Open Bible Study Goals',  page: 'BibleGoalsPage',            color: '#C9A227' },
  growth_goals:    { label: 'Open Growth Goals',        page: 'PersonalGrowthGoalsPage',   color: '#AFC7E3' },
  gideon:     { label: 'Chat with Gideon',     page: 'ChatScreen?bot=Gideon',     color: '#C9A227' },
  hannah:     { label: 'Chat with Hannah',     page: 'ChatScreen?bot=Hannah',     color: '#AFC7E3' },
  david:      { label: 'Chat with Coach David',page: 'ChatScreen?bot=CoachDavid', color: '#38BDF8' },
  daniel:     { label: 'Chat with Chef Daniel',page: 'ChatScreen?bot=ChefDaniel', color: '#22C55E' },
};

// ── Quick actions shown before first message ──────────────────────────────────
const QUICK_ACTIONS = [
  { icon: Map,      label: 'Take the full guided tour', sub: 'Walk through every feature',        color: '#38BDF8', tourKey: null,           isTour: true },
  { icon: Sparkles, label: 'Show me the workouts',      sub: 'Fitness & training walkthrough',    color: '#38BDF8', tourKey: 'workouts' },
  { icon: BookOpen, label: 'How does Bible study work?', sub: 'Bible, Gideon & devotionals',      color: '#C9A227', tourKey: 'bible' },
  { icon: Play,     label: 'Walk me through nutrition', sub: 'Macros, meals & Chef Daniel',       color: '#22C55E', tourKey: 'nutrition' },
  { icon: Sparkles, label: 'Show me Personal Growth',   sub: 'Habits, emotions & Hannah',         color: '#AFC7E3', tourKey: 'growth' },
  { icon: Play,     label: "What's my daily routine?",  sub: 'Morning & evening ritual',          color: '#FD9C2D', tourKey: 'daily_ritual' },
  { icon: Target,   label: 'Show my fitness goals',      sub: 'BMI · calories · macros · timeline',  color: '#38BDF8', tourKey: 'fitness_goals' },
  { icon: Salad,    label: 'Walk me through nutrition goals', sub: 'Diet · macros · meal schedule',        color: '#22C55E', tourKey: 'nutrition_goals' },
  { icon: BookOpen, label: 'Show my Bible study profile',      sub: 'Translation · topics · reading plans',  color: '#C9A227', tourKey: 'bible_goals' },
  { icon: Brain,    label: 'Show my growth profile',           sub: 'Areas · values · coaching style',       color: '#AFC7E3', tourKey: 'growth_goals' },
];

// ── System prompt for LLM ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the in-app guide for "Prosperity Revived," a Christian wellness app. 
Respond in structured JSON only. No markdown, no preamble.

App features:
- Home: daily ritual (Start/End My Day), verse of the day, progress ring, AI coach nudges
- Bible: 66-book reader, Gideon AI spiritual guide, Read/Study/Devotional tabs, bookmarks, topic search
- Wellness > Workouts: 33+ workouts in 6 categories, workout trends, quick-start, browse by category, Fitness Goals page (BMI, TDEE/calorie calculator, macro split, goal timeline, weight log, hydration goal, Coach David CTA)
- Wellness > Nutrition: macro tracking, meal logging, water tracker, meal planner, Chef Daniel AI coach, Nutrition Goals page (calorie target by diet type, macro split, meal schedule by meals/day including intermittent fasting, allergen list, water goal, recipe ideas per diet)
- Personal Growth: habit builder, emotional check-in, gratitude journal, affirmations, guided meditations, identity in Christ, Hannah AI growth coach
- Community: feed, groups (Bible study/workout/prayer), blog, challenges, leaderboards, friends
- Profile: progress dashboard (Journey), achievements/badges, journal entries, settings
- 4 AI coaches: Hannah (personal growth/emotions), Gideon (spiritual/Bible), Coach David (fitness), Chef Daniel (nutrition)

Available tour keys: daily_ritual, workouts, nutrition, bible, growth, community, profile, ai_coaches, coaching, habits, prayer, fitness_goals, nutrition_goals, bible_goals, growth_goals

Available page shortcuts: workouts, nutrition, bible, growth, community, profile, habits, gratitude, meditation, affirmations, checkin, challenges, journal, plans, gideon, hannah, david, daniel

Respond with JSON matching this exact schema:
{
  "answer": "2-3 sentence friendly explanation",
  "tourKey": "one of the tour keys above, or null if not applicable",
  "pageShortcuts": ["array of up to 2 page shortcut keys most relevant to the question"],
  "tips": ["up to 2 short practical tips as strings, or empty array"]
}`;

// ── Message component ─────────────────────────────────────────────────────────
function AssistantMessage({ msg, onTour, onNavigate }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Text bubble */}
      <div className="flex justify-start">
        <div className="max-w-[88%] bg-[#F2F6FA] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <p className="text-[#0A1A2F] text-sm leading-relaxed">{msg.answer}</p>
        </div>
      </div>

      {/* Tips */}
      {msg.tips?.length > 0 && (
        <div className="flex flex-col gap-1.5 pl-1">
          {msg.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 bg-[#FAD98D]/15 rounded-xl px-3 py-2">
              <Lightbulb className="w-3 h-3 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#0A1A2F]/65 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tour action */}
      {msg.tourKey && (
        <motion.button
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onPointerDown={() => onTour(msg.tourKey)}
          className="mx-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left active:scale-97 transition-transform border-2"
          style={{ borderColor: '#38BDF8', background: '#38BDF8' + '12' }}
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#38BDF8' + '25' }}>
            <Map className="w-3.5 h-3.5" style={{ color: '#38BDF8' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#0A1A2F] text-xs leading-tight">Show me how →</p>
            <p className="text-gray-400 text-[10px]">Interactive spotlight tour</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        </motion.button>
      )}

      {/* Page shortcuts */}
      {msg.pageShortcuts?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-0.5">
          {msg.pageShortcuts.map((key) => {
            const s = PAGE_SHORTCUTS[key];
            if (!s) return null;
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                onPointerDown={() => onNavigate(s.page)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                style={{ background: s.color + '18', color: s.color, border: `1.5px solid ${s.color}30` }}
              >
                <ExternalLink className="w-3 h-3" />
                {s.label}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, isOpen]);

  const launchTour = (tourKey) => {
    setIsOpen(false);
    const steps = tourKey ? MINI_TOURS[tourKey] : null;
    setTimeout(() => {
      if (steps) {
        window.__pendingMiniTourSteps = steps;
        if (window.__startGuidedTour) window.__startGuidedTour();
      } else {
        if (window.__startGuidedTour) window.__startGuidedTour();
      }
    }, 300);
  };

  const navigateTo = (page) => {
    setIsOpen(false);
    setTimeout(() => { window.location.href = createPageUrl(page); }, 200);
  };

  const handleSend = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;
    setInput('');
    setShowQuickActions(false);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nUser question: "${text}"`,
        response_json_schema: {
          type: 'object',
          properties: {
            answer:        { type: 'string' },
            tourKey:       { type: ['string', 'null'] },
            pageShortcuts: { type: 'array', items: { type: 'string' } },
            tips:          { type: 'array', items: { type: 'string' } },
          },
          required: ['answer'],
        },
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        answer: response.answer || 'I can help with that! Try asking about a specific feature.',
        tourKey: TOUR_KEYS.includes(response.tourKey) ? response.tourKey : null,
        pageShortcuts: (response.pageShortcuts || []).filter(k => PAGE_SHORTCUTS[k]),
        tips: response.tips || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        answer: 'Sorry, something went wrong. Try asking again!',
        tourKey: null, pageShortcuts: [], tips: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (qa) => {
    if (qa.isTour) {
      launchTour(null);
    } else if (qa.tourKey) {
      setShowQuickActions(false);
      setMessages(prev => [...prev, { role: 'user', content: qa.label }]);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          answer: `Sure! Let me walk you through that. Tap "Show me how →" below to start the interactive tour.`,
          tourKey: qa.tourKey,
          pageShortcuts: [],
          tips: [],
        }]);
      }, 400);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onPointerDown={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-50 rounded-full shadow-xl flex items-center justify-center"
            style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)' }}
            whileTap={{ scale: 0.9 }}
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-3xl shadow-2xl"
            style={{ width: 320, maxHeight: '74vh', background: '#fff', border: '1px solid #f0f0f0' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #3C4E53 100%)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(253,156,45,0.25)' }}>
                  <HelpCircle className="w-4 h-4 text-[#FD9C2D]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">App Guide</p>
                  <p className="text-white/45 text-[10px] mt-0.5">Ask anything · Tour any feature</p>
                </div>
              </div>
              <button onPointerDown={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {/* Welcome */}
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] bg-[#F2F6FA] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-[#0A1A2F] text-sm leading-relaxed">
                      Hi! Ask me about any feature, or tap a quick action to explore.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick actions (pre-chat) */}
              {showQuickActions && (
                <div className="space-y-2">
                  {QUICK_ACTIONS.map((qa) => {
                    const Icon = qa.icon;
                    return (
                      <motion.button key={qa.label}
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                        onPointerDown={() => handleQuickAction(qa)}
                        className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left active:scale-97 transition-all border border-gray-100"
                        style={{ background: '#F8FAFB' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: qa.color + '20' }}>
                          <Icon className="w-4 h-4" style={{ color: qa.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0A1A2F] text-xs leading-tight">{qa.label}</p>
                          <p className="text-gray-400 text-[10px]">{qa.sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Conversation */}
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[84%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm font-medium"
                        style={{ background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)', color: '#0A1A2F' }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <AssistantMessage
                      msg={msg}
                      onTour={launchTour}
                      onNavigate={navigateTo}
                    />
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#F2F6FA] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FD9C2D]"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any feature…"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-gray-100 focus:border-[#FD9C2D] transition-colors placeholder:text-gray-300 bg-[#F8FAFB]"
                disabled={loading}
              />
              <button onPointerDown={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-35 active:scale-90"
                style={{ background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)' }}>
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
