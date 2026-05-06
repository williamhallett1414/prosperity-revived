import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, X, Send, Map, BookOpen, Play,
  ChevronRight, Sparkles, Lightbulb, ExternalLink, Target, Salad, Brain, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

// ── Mini-tour definitions — triggered by intent ───────────────────────────────
export const MINI_TOURS = {
  daily_ritual: [
    {
      id: 'ritual_intro', targetId: null, navigateTo: 'Home',
      title: 'Your Daily Ritual 🌅',
      body: "Your daily ritual is the heart of this app — a 2-minute morning and evening practice that keeps you grounded in faith, gratitude, and intention.",
      tapToAdvance: false,
    },
    {
      id: 'ritual_btn', targetId: 'tour-ritual-btn', navigateTo: null,
      title: 'Start My Day ☀️',
      body: 'Every morning, tap this button to read a personalized scripture, speak an affirmation over yourself, and set your intention for the day.',
      tip: 'At night it becomes "End My Day" — gratitude, reflection & rest',
      tapToAdvance: true, tapLabel: 'Tap to try it now',
    },
    {
      id: 'ritual_verse', targetId: 'tour-verse-card', navigateTo: null,
      title: 'Daily Scripture 📖',
      body: "Each day you get a personalized verse based on your faith profile. Tap 'Read →' to open the full passage in the Bible reader.",
      tip: 'Gideon picks verses based on your topics and what you\'re going through',
      tapToAdvance: false,
    },
  ],

  workouts: [
    {
      id: 'wk_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Wellness Hub 💪',
      body: "Your workouts live inside the Wellness hub along with nutrition, coaching plans, and more. Let's open it.",
      tapToAdvance: true, tapLabel: 'Tap Wellness tab', arrowDown: true,
    },
    {
      id: 'wk_card', targetId: 'tour-workouts-card', navigateTo: 'Workouts',
      title: 'Workouts Library 🏋️',
      body: "33+ guided workout sessions across 6 categories. Coach David built this library based on your fitness profile.",
      tip: 'HIIT · Strength · Cardio · Flexibility · Yoga · Recovery',
      tapToAdvance: true, tapLabel: 'Tap to open Workouts',
    },
    {
      id: 'wk_quick', targetId: 'tour-quick-start', navigateTo: null,
      title: 'Quick Start ⚡',
      body: 'These sessions are ready to go right now. Tap any card to start — it automatically logs to your Workout Trends and keeps your streak alive.',
      tapToAdvance: true, tapLabel: 'Tap any workout to try',
    },
    {
      id: 'wk_cats', targetId: 'tour-categories', navigateTo: null,
      title: 'Browse by Category 📋',
      body: 'Filter workouts by type and difficulty. Each category has its own library with detailed exercise breakdowns.',
      tapToAdvance: true, tapLabel: 'Tap a category',
    },
    {
      id: 'wk_goals', targetId: 'tour-fitness-goals-entry', navigateTo: null,
      title: 'Your Fitness Goals 🎯',
      body: 'This card shows your personalized fitness dashboard — BMI, calorie targets, macro split, and goal timeline. Tap to see the full breakdown.',
      tapToAdvance: true, tapLabel: 'Tap to view your goals',
    },
  ],

  nutrition: [
    {
      id: 'nut_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Nutrition Hub 🍽️',
      body: 'Your nutrition tools are inside the Wellness hub. Tap to open it.',
      tapToAdvance: true, tapLabel: 'Open Wellness', arrowDown: true,
    },
    {
      id: 'nut_card', targetId: null, navigateTo: 'Nutrition',
      title: 'Nutrition Dashboard',
      body: "Your daily nutrition command center — macros, meal logging, water tracking, and meal planning all in one place.",
      tapToAdvance: false,
    },
    {
      id: 'nut_macros', targetId: 'tour-nutrition-macros', navigateTo: null,
      title: "Today's Macros 📊",
      body: "These rings show your daily calories, protein, carbs and fat targets. Each ring fills as you log meals throughout the day.",
      tip: 'Tap any ring for a detailed breakdown',
      tapToAdvance: true, tapLabel: 'Tap to explore macros',
    },
    {
      id: 'nut_water', targetId: 'tour-water-tracker', navigateTo: null,
      title: 'Water Tracker 💧',
      body: 'Track your daily water intake glass by glass. Tap + to add a glass. Your goal is calculated from your body weight.',
      tip: 'Staying hydrated improves energy, focus, and recovery',
      tapToAdvance: true, tapLabel: 'Tap to log water',
    },
    {
      id: 'nut_chef', targetId: 'tour-chef-daniel-btn', navigateTo: null,
      title: 'Chat with Chef Daniel 🍳',
      body: "Chef Daniel is your AI nutrition coach. Ask him for meal ideas, macro-friendly recipes, substitutions, or help hitting your daily targets.",
      tip: 'Try: "Chef Daniel, what should I eat for dinner tonight?"',
      tapToAdvance: true, tapLabel: 'Tap to chat with Chef Daniel',
    },
    {
      id: 'nut_goals', targetId: 'tour-nutrition-goals-entry', navigateTo: null,
      title: 'Nutrition Goals 🎯',
      body: "Your personalized nutrition profile — calorie targets, macro split, meal schedule, and allergens. All calculated from your onboarding answers.",
      tapToAdvance: true, tapLabel: 'Tap to view your goals',
    },
  ],

  bible: [
    {
      id: 'bib_nav', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Bible Tab 📖',
      body: "Your complete Bible study companion. Tap to open it.",
      tapToAdvance: true, tapLabel: 'Open Bible', arrowDown: true,
    },
    {
      id: 'bib_tabs', targetId: 'tour-bible-tabs', navigateTo: null,
      title: 'Three Ways to Study',
      body: 'Read opens the full 66-book Bible. Study gives topical guides on anxiety, purpose, relationships & more. Devotional gives daily meditations at your preferred depth.',
      tip: 'Your translation and devotional depth from onboarding are already saved',
      tapToAdvance: true, tapLabel: 'Tap a tab to explore',
    },
    {
      id: 'bib_goals', targetId: 'tour-bible-goals-entry', navigateTo: null,
      title: 'Bible Study Profile 📋',
      body: "Your personalized study profile — translation, topics, reading plans, and devotional depth. Gideon uses all of this to personalize every conversation.",
      tapToAdvance: true, tapLabel: 'Tap to view your profile',
    },
    {
      id: 'bib_gideon', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Chat with Gideon 🙏',
      body: "Gideon is your AI spiritual guide. Ask him anything — scripture questions, prayer requests, devotional depth, or a word of encouragement.",
      tip: 'Gideon remembers your faith profile and previous conversations',
      tapToAdvance: true, tapLabel: 'Tap to chat with Gideon',
    },
  ],

  growth: [
    {
      id: 'gr_nav', targetId: null, navigateTo: 'PersonalGrowth',
      title: 'Personal Growth Hub 🧠',
      body: "Your toolkit for building the person God designed you to be — habits, journaling, mindset work, and emotional health.",
      tapToAdvance: false,
    },
    {
      id: 'gr_goals', targetId: 'tour-growth-goals-entry', navigateTo: null,
      title: 'Your Growth Profile 🎯',
      body: "This card holds your growth areas, core values, and coaching style. Hannah uses all of it to personalize every session.",
      tapToAdvance: true, tapLabel: 'Tap to view your profile',
    },
    {
      id: 'gr_tools', targetId: 'tour-daily-tools', navigateTo: null,
      title: 'Daily Practices ✅',
      body: 'Six daily tools: Habit Builder, Emotional Check-In, Gratitude Journal, Affirmations, Mindset Reset, and Guided Meditation. Green checkmarks appear as you complete each one.',
      tip: 'Start with just one — even logging 1 habit a day builds momentum',
      tapToAdvance: true, tapLabel: 'Tap any tool to start',
    },
    {
      id: 'gr_hannah', targetId: 'tour-hannah-btn', navigateTo: null,
      title: 'Chat with Hannah 💬',
      body: "Hannah is your personal growth AI coach. Journal with her, process emotions, work through challenges, or just talk. She adapts to your coaching style preference.",
      tip: 'Try: "Hannah, I\'m feeling overwhelmed today"',
      tapToAdvance: true, tapLabel: 'Tap to chat with Hannah',
    },
  ],

  community: [
    {
      id: 'com_nav', targetId: 'nav-community', navigateTo: 'Community',
      title: 'Community 👥',
      body: "Stay accountable and connected with other believers. Tap the Community tab to open it.",
      tapToAdvance: true, tapLabel: 'Open Community', arrowDown: true,
    },
    {
      id: 'com_groups', targetId: 'tour-community-groups', navigateTo: null,
      title: 'Groups & Feed 🤝',
      body: 'Feed is where members share wins and prayer requests. Groups lets you join Bible study, workout, or prayer circles. Blog is for longer reflections.',
      tip: 'Members with a group stay consistent 3× longer',
      tapToAdvance: true, tapLabel: 'Tap to browse groups',
    },
    {
      id: 'com_profile', targetId: 'nav-profile', navigateTo: 'Profile',
      title: 'Your Profile & Progress 📊',
      body: "Your profile is your journey dashboard — streaks, achievements, friends, and a holistic progress report across every area of the app.",
      tapToAdvance: true, tapLabel: 'Open your Profile', arrowDown: true,
    },
    {
      id: 'com_progress', targetId: 'tour-profile-progress', navigateTo: null,
      title: 'Journey & Achievements 🏆',
      body: "Tap Journey for a holistic progress report. Tap Achievements to see badges you've earned — or are close to earning. Every action in the app contributes to your level.",
      tapToAdvance: true, tapLabel: 'Tap to view progress',
    },
  ],

  profile: [
    {
      id: 'pro_nav', targetId: 'nav-profile', navigateTo: 'Profile',
      title: 'Your Dashboard 📊',
      body: "Your profile is your full journey dashboard — everything you've done across the app in one place.",
      tapToAdvance: true, tapLabel: 'Open Profile', arrowDown: true,
    },
    {
      id: 'pro_progress', targetId: 'tour-profile-progress', navigateTo: null,
      title: 'Progress & Achievements 🏆',
      body: "Journey shows your holistic progress across workouts, mood, habits, and scripture. Achievements shows badges you've earned and what's next.",
      tapToAdvance: true, tapLabel: 'Tap to explore',
    },
  ],

  ai_coaches: [
    {
      id: 'bots_intro', targetId: null, navigateTo: null,
      title: 'Your 5 AI Coaches 🤖',
      body: "You have five AI coaches, each specializing in a different part of your journey. They all know your profile and goals from setup.",
      tapToAdvance: false,
    },
    {
      id: 'bots_gideon', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Gideon — Spiritual Guide 🙏',
      body: 'Gideon lives in the Bible tab. He handles scripture questions, prayer, devotionals, and faith guidance.',
      tapToAdvance: true, tapLabel: 'Go to Bible', arrowDown: true,
    },
    {
      id: 'bots_gideon_btn', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Open Gideon',
      body: 'This button opens a full-screen conversation with Gideon. He uses your Bible translation and faith profile automatically.',
      tapToAdvance: true, tapLabel: 'Tap to chat with Gideon',
    },
    {
      id: 'bots_hannah', targetId: null, navigateTo: 'PersonalGrowth',
      title: 'Hannah — Growth Coach 💬',
      body: 'Hannah lives in the Personal Growth page. She handles emotions, journaling, habits, mindset, and personal development.',
      tapToAdvance: false,
    },
    {
      id: 'bots_hannah_btn', targetId: 'tour-hannah-btn', navigateTo: null,
      title: 'Open Hannah',
      body: 'This button opens Hannah. She adapts to your coaching style — gentle, direct, exploratory, or structured.',
      tapToAdvance: true, tapLabel: 'Tap to chat with Hannah',
    },
  ],

  coaching: [
    {
      id: 'coach_nav', targetId: 'nav-wellness', navigateTo: 'Wellness',
      title: 'Coaching Programs 📚',
      body: 'Structured coaching plans live in the Wellness hub. These are multi-week guided programs.',
      tapToAdvance: true, tapLabel: 'Open Wellness', arrowDown: true,
    },
    {
      id: 'coach_section', targetId: 'tour-coaching-section', navigateTo: null,
      title: 'Multi-Week Programs',
      body: 'These structured programs guide you day by day — faith-based, fitness, nutrition, or holistic. Your coaches co-facilitate based on your goals.',
      tip: 'You can be in multiple programs at once. Progress saves automatically.',
      tapToAdvance: true, tapLabel: 'Tap to browse programs',
    },
  ],

  habits: [
    {
      id: 'hab_nav', targetId: null, navigateTo: 'PersonalGrowth',
      title: 'Habit Tracking 📋',
      body: "Your habit tracking tools live in the Personal Growth page. Let me take you there.",
      tapToAdvance: false,
    },
    {
      id: 'hab_tools', targetId: 'tour-daily-tools', navigateTo: null,
      title: 'Daily Practices',
      body: 'The Habit Builder is the first tool in this list. Track habits daily to build streaks. Each green checkmark saves automatically.',
      tip: 'Even logging 1 habit a day builds momentum. Start small.',
      tapToAdvance: true, tapLabel: 'Tap Habit Builder to start',
    },
    {
      id: 'hab_hannah', targetId: 'tour-hannah-btn', navigateTo: null,
      title: 'Get Help from Hannah 💬',
      body: "If you're struggling to build habits, ask Hannah. She can help you set realistic goals, identify blockers, and stay accountable.",
      tapToAdvance: true, tapLabel: 'Tap to chat with Hannah',
    },
  ],

  prayer: [
    {
      id: 'pray_nav', targetId: 'nav-bible', navigateTo: 'Bible',
      title: 'Prayer & Devotion 🙏',
      body: 'Prayer tools live alongside your Bible. Tap the Bible tab.',
      tapToAdvance: true, tapLabel: 'Open Bible', arrowDown: true,
    },
    {
      id: 'pray_tabs', targetId: 'tour-bible-tabs', navigateTo: null,
      title: 'Devotional Tab',
      body: 'The Devotional tab has daily meditations and prayer prompts. Each day has a reflection, a prayer guide, and a scripture to sit with.',
      tapToAdvance: true, tapLabel: 'Tap Devotional tab',
    },
    {
      id: 'pray_gideon', targetId: 'tour-gideon-btn', navigateTo: null,
      title: 'Pray with Gideon 🙏',
      body: "Tell Gideon you want to pray and he'll guide you through a personal prayer based on what's on your heart.",
      tip: 'Try: "Gideon, can we pray together about _____?"',
      tapToAdvance: true, tapLabel: 'Tap to pray with Gideon',
    },
  ],

  fitness_goals: [
    {
      id: 'fg_entry', targetId: 'tour-fitness-goals-entry', navigateTo: 'Workouts',
      title: 'Fitness Goals 🎯',
      body: 'Your personalized fitness dashboard. Tap to open the full breakdown.',
      tapToAdvance: true, tapLabel: 'Tap to open Fitness Goals',
    },
    {
      id: 'fg_bmi', targetId: 'tour-bmi-card', navigateTo: 'FitnessGoalsPage',
      title: 'BMI Calculator 📊',
      body: 'Your Body Mass Index calculated from your height and weight. The gauge shows where you are across the spectrum.',
      tip: 'Log your latest weight to keep your BMI current',
      tapToAdvance: false,
    },
    {
      id: 'fg_cals', targetId: 'tour-calories-card', navigateTo: null,
      title: 'Calorie Targets 🔥',
      body: 'Your maintenance calories (TDEE) and goal calories calculated using the Mifflin-St Jeor formula and your workout frequency.',
      tapToAdvance: false,
    },
    {
      id: 'fg_macros', targetId: 'tour-macros-split', navigateTo: null,
      title: 'Macro Split 🥗',
      body: 'Protein, carbs and fat targets tuned to your goal. Weight loss gets more protein; muscle building gets more carbs.',
      tapToAdvance: false,
    },
    {
      id: 'fg_timeline', targetId: 'tour-timeline-card', navigateTo: null,
      title: 'Goal Timeline ⏳',
      body: "Predicts when you'll hit your goal weight based on your current deficit. Updates automatically when you log new weights.",
      tip: 'Log weight weekly for the most accurate timeline',
      tapToAdvance: false,
    },
    {
      id: 'fg_coach', targetId: 'tour-coach-david-cta', navigateTo: null,
      title: 'Ask Coach David 💪',
      body: "Coach David can adjust your plan, suggest workouts for specific goals, or help you push through plateaus.",
      tapToAdvance: true, tapLabel: 'Tap to chat with Coach David',
    },
  ],

  nutrition_goals: [
    {
      id: 'ng_entry', targetId: 'tour-nutrition-goals-entry', navigateTo: 'Nutrition',
      title: 'Nutrition Goals 🥗',
      body: 'Your personalized nutrition profile. Tap to see the full dashboard.',
      tapToAdvance: true, tapLabel: 'Open Nutrition Goals',
    },
    {
      id: 'ng_cals', targetId: 'tour-nutrition-calories', navigateTo: 'NutritionGoalsPage',
      title: 'Daily Calorie Target 🔥',
      body: 'Calculated from your diet type, fitness goal, and workout frequency. Keto users get auto-adjusted macros.',
      tapToAdvance: false,
    },
    {
      id: 'ng_macros', targetId: 'tour-nutrition-macros-goals', navigateTo: null,
      title: 'Macro Targets 📊',
      body: 'Protein, carbs and fat split based on your goal and diet. Tap "Track in Nutrition" to log meals against these daily.',
      tapToAdvance: false,
    },
    {
      id: 'ng_timing', targetId: 'tour-meal-timing', navigateTo: null,
      title: 'Meal Schedule ⏰',
      body: 'Built from your meals-per-day preference. Intermittent fasting users get a custom window plan.',
      tip: 'Spacing meals evenly keeps energy stable throughout the day',
      tapToAdvance: false,
    },
    {
      id: 'ng_allergens', targetId: 'tour-allergens', navigateTo: null,
      title: 'Foods to Avoid 🛡️',
      body: 'Your allergens from onboarding. Chef Daniel checks these automatically when suggesting meals.',
      tapToAdvance: false,
    },
    {
      id: 'ng_recipes', targetId: 'tour-recipe-ideas', navigateTo: null,
      title: 'Recipe Ideas 🍳',
      body: '77 expert-curated recipes matched to your health conditions and diet preferences. Browse by condition or meal type.',
      tapToAdvance: true, tapLabel: 'Tap to browse recipes',
    },
  ],

  bible_goals: [
    {
      id: 'bg_entry', targetId: 'tour-bible-goals-entry', navigateTo: 'Bible',
      title: 'Bible Study Profile 📖',
      body: 'Your personalized study profile. Tap to see the full dashboard.',
      tapToAdvance: true, tapLabel: 'Open Bible Goals',
    },
    {
      id: 'bg_translation', targetId: 'tour-bible-translation', navigateTo: 'BibleGoalsPage',
      title: 'Your Translation 📜',
      body: 'Your preferred Bible translation with a plain-English explanation of its reading style.',
      tapToAdvance: false,
    },
    {
      id: 'bg_topics', targetId: 'tour-bible-topics', navigateTo: null,
      title: 'Topics That Matter ❤️',
      body: 'The themes you care most about shape which reading plans and verses Gideon recommends.',
      tapToAdvance: false,
    },
    {
      id: 'bg_depth', targetId: 'tour-devotional-depth', navigateTo: null,
      title: 'Devotional Depth ⏱️',
      body: 'Short (2–3 min), medium (10–15 min), or deep (30+ min) — controls how detailed Gideon gets.',
      tip: 'Ask Gideon to go deeper or shallower at any time',
      tapToAdvance: false,
    },
    {
      id: 'bg_plans', targetId: 'tour-topic-plans', navigateTo: null,
      title: 'Recommended Plans 📚',
      body: 'Reading plans matched to your selected topics. Each links directly into the Bible reader.',
      tapToAdvance: true, tapLabel: 'Tap to start a plan',
    },
    {
      id: 'bg_gideon', targetId: 'tour-gideon-goals-cta', navigateTo: null,
      title: 'Study with Gideon 🙏',
      body: 'Gideon knows your translation, topics, and depth. Every chat session is personalized to your faith journey.',
      tapToAdvance: true, tapLabel: 'Tap to study with Gideon',
    },
  ],

  growth_goals: [
    {
      id: 'gg_entry', targetId: 'tour-growth-goals-entry', navigateTo: 'PersonalGrowth',
      title: 'Growth Profile 🧠',
      body: 'Your personalized growth dashboard. Tap to see the full breakdown.',
      tapToAdvance: true, tapLabel: 'Open Growth Goals',
    },
    {
      id: 'gg_areas', targetId: 'tour-growth-areas', navigateTo: 'PersonalGrowthGoalsPage',
      title: 'Your Growth Areas 💪',
      body: 'Up to 3 areas you picked in onboarding — like Confidence, Habits, or Emotional Intelligence. Tap each card to see which daily tools are mapped to it.',
      tapToAdvance: true, tapLabel: 'Tap to expand an area',
    },
    {
      id: 'gg_values', targetId: 'tour-core-values', navigateTo: null,
      title: 'Core Values ⭐',
      body: 'Your up-to-5 core values shape Hannah\'s affirmations and coaching lens. A personalized affirmation rooted in your top value is shown here.',
      tapToAdvance: false,
    },
    {
      id: 'gg_coaching', targetId: 'tour-coaching-style', navigateTo: null,
      title: "Hannah's Coaching Style 🌸",
      body: 'Gentle, Direct, Exploratory, or Structured — tells Hannah exactly how to talk to you.',
      tip: 'Ask Hannah to switch styles at any time',
      tapToAdvance: false,
    },
    {
      id: 'gg_tools', targetId: 'tour-growth-tools', navigateTo: null,
      title: 'Recommended Tools ⚡',
      body: 'Daily tools like Habit Builder, Emotional Check-in, and Gratitude Journal are matched to your growth areas.',
      tapToAdvance: true, tapLabel: 'Tap a tool to start',
    },
    {
      id: 'gg_hannah', targetId: 'tour-hannah-goals-cta', navigateTo: null,
      title: 'Talk to Hannah 💬',
      body: 'Hannah knows your growth areas, values, 90-day goal, and coaching style. Every session is built around you.',
      tapToAdvance: true, tapLabel: 'Tap to talk to Hannah',
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
  challenges: { label: 'Open Challenges',      page: 'Community?tab=challenges', color: '#FD9C2D' },
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
  { icon: Map,      label: 'Take the full guided tour', sub: 'Interactive walkthrough of every feature',  color: '#38BDF8', tourKey: null,           isTour: true },
  { icon: Sparkles, label: 'Show me the workouts',      sub: '5-step interactive fitness tour',           color: '#38BDF8', tourKey: 'workouts' },
  { icon: BookOpen, label: 'How does Bible study work?', sub: '4-step Bible & Gideon tour',              color: '#C9A227', tourKey: 'bible' },
  { icon: Play,     label: 'Walk me through nutrition', sub: '6-step nutrition & Chef Daniel tour',       color: '#22C55E', tourKey: 'nutrition' },
  { icon: Sparkles, label: 'Show me Personal Growth',   sub: '4-step growth & Hannah tour',              color: '#AFC7E3', tourKey: 'growth' },
  { icon: Play,     label: 'Show me the community',     sub: '4-step community & profile tour',          color: '#7C3AED', tourKey: 'community' },
  { icon: Target,   label: 'Show my fitness goals',     sub: '6-step BMI, calories & macros tour',       color: '#38BDF8', tourKey: 'fitness_goals' },
  { icon: Salad,    label: 'Show my nutrition goals',   sub: '6-step diet, macros & recipes tour',       color: '#22C55E', tourKey: 'nutrition_goals' },
  { icon: BookOpen, label: 'Show my Bible study profile',sub: '6-step translation & topics tour',        color: '#C9A227', tourKey: 'bible_goals' },
  { icon: Brain,    label: 'Show my growth profile',    sub: '6-step areas, values & tools tour',        color: '#AFC7E3', tourKey: 'growth_goals' },
  { icon: Target,   label: 'What is the 40-Day Wilderness?', sub: 'Our toughest spiritual challenge',       color: '#92400E', tourKey: null,   pageShortcuts: ['challenges'] },
  { icon: Play,     label: 'How do AI video avatars work?',  sub: 'Meet your animated coaching guides',     color: '#FD9C2D', tourKey: 'ai_coaches' },
  { icon: Sparkles, label: 'How does the app remember me?',  sub: 'Adaptive AI memory explained',           color: '#EC4899', tourKey: null },
];

// ── System prompt for LLM ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the in-app guide for "Prosperity Revived," a Christian wellness app. 
Respond in structured JSON only. No markdown, no preamble.

App features:
- Home: daily ritual (Start/End My Day), today's scripture, Grace Moment, Talk to Your Guides (video avatars), coaching plans
- Bible: 66-book reader, Gideon AI spiritual guide with video avatar & tabernacle background, sermon recorder, reading plans, bookmarks
- Wellness > Workouts: 33+ workouts in 6 categories, workout countdown timer, trends, Coach David AI with video avatar & iron temple background, Fitness Goals page
- Wellness > Nutrition: macro tracking, meal logging, water tracker, 77 auto-seeded recipes, meal planner, Chef Daniel AI with video avatar & herb garden background, Nutrition Goals page
- Personal Growth: habit builder, emotional check-in, gratitude journal, affirmations, guided meditations with Hannah Cloud TTS voice, identity in Christ, Hannah AI with video avatar & sacred garden background
- Community: feed with reporting & blocking, groups (Bible study/workout/prayer), blog, challenges including 40 Days in the Wilderness flagship challenge, leaderboards, find friends
- Profile: progress dashboard, achievements/badges, journal entries, settings, manage my data (account deletion)
- 5 AI coaches with VIDEO AVATARS (idle + speaking animations): Gideon (spiritual/Bible), Hannah (personal growth/emotions), Coach David (fitness), Chef Daniel (nutrition), Coach Paul (life wisdom)
- Adaptive AI Memory: all chatbots learn from your conversations — your communication style, goals, struggles, and preferences are remembered across sessions
- Dark mode support across the entire app
- Crisis resources (988 Lifeline) on emotional/mental health pages
- Health disclaimers on fitness/nutrition pages

Available tour keys: daily_ritual, workouts, nutrition, bible, growth, community, profile, ai_coaches, coaching, habits, prayer, fitness_goals, nutrition_goals, bible_goals, growth_goals, wilderness_challenge, meditation, dark_mode

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
        <div className="max-w-[88%] bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <p className="text-[#0A1A2F] dark:text-white text-sm leading-relaxed">{msg.answer}</p>
        </div>
      </div>

      {/* Tips */}
      {msg.tips?.length > 0 && (
        <div className="flex flex-col gap-1.5 pl-1">
          {msg.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 rounded-xl px-3 py-2">
              <Lightbulb className="w-3 h-3 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#0A1A2F]/65 dark:text-white/65 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tour action */}
      {msg.tourKey && (
        <motion.button
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onClick={() => onTour(msg.tourKey)}
          className="mx-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left active:scale-97 transition-transform border-2"
          style={{ borderColor: '#38BDF8', background: '#38BDF8' + '12' }}
        >
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#38BDF8' + '25' }}>
            <Map className="w-3.5 h-3.5" style={{ color: '#38BDF8' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#0A1A2F] dark:text-white text-xs leading-tight">Show me how →</p>
            <p className="text-gray-400 dark:text-gray-300 text-[10px]">Interactive spotlight tour</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-400 dark:text-gray-300" />
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
                onClick={() => onNavigate(s.page)}
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
  const [conversation, setConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, isOpen]);

  // Map tour keys to the page they should navigate to
  const TOUR_PAGE_MAP = {
    workouts: 'Workouts',
    nutrition: 'Nutrition',
    bible: 'Bible',
    growth: 'PersonalGrowth',
    daily_ritual: 'Home',
    community: 'Community',
    profile: 'Profile',
    ai_coaches: 'ChatScreen?bot=Gideon',
    coaching: 'CoachingPlans',
    habits: 'HabitBuilderPage',
    prayer: 'Prayer',
    fitness_goals: 'FitnessGoalsPage',
    nutrition_goals: 'NutritionGoalsPage',
    bible_goals: 'BibleGoalsPage',
    growth_goals: 'PersonalGrowthGoalsPage',
  };

  const launchTour = (tourKey) => {
    setIsOpen(false);
    const steps = tourKey ? MINI_TOURS[tourKey] : null;
    const firstNavPage = steps?.[0]?.navigateTo || 'Home';
    // Navigate with ?tour= param — Layout picks it up and launches the overlay
    const url = createPageUrl(firstNavPage) + (tourKey ? '?tour=' + tourKey : '?tour=full');
    navigate(url);
  };

  const navigateTo = (page) => {
    setIsOpen(false);
    navigate(createPageUrl(page));
  };

  const handleSend = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;
    setInput('');
    setShowQuickActions(false);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      // Create conversation on first message
      let conv = conversation;
      if (!conv) {
        conv = await base44.agents.createConversation({
          agent_name: 'app_guide',
          metadata: { name: 'App Guide Session' },
        });
        setConversation(conv);

        // Subscribe to real-time updates
        base44.agents.subscribeToConversation(conv.id, (data) => {
          const lastMsg = data.messages?.[data.messages.length - 1];
          if (lastMsg?.role === 'assistant' && lastMsg.content) {
            setMessages(prev => {
              // Replace or append the latest assistant message
              const withoutLast = prev.filter(m => m.role !== 'assistant' || prev.indexOf(m) < prev.length - 1 || m._final);
              return [...withoutLast.filter(m => !(m._streaming)), {
                role: 'assistant',
                answer: lastMsg.content,
                tourKey: null,
                pageShortcuts: [],
                tips: [],
                _streaming: !lastMsg.content.endsWith?.('\n') && data.is_streaming,
                _final: !data.is_streaming,
              }];
            });
            if (!data.is_streaming) setLoading(false);
          }
        });
      }

      await base44.agents.addMessage(conv, { role: 'user', content: text });

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        answer: 'Sorry, something went wrong. Try asking again!',
        tourKey: null, pageShortcuts: [], tips: [],
      }]);
      setLoading(false);
    }
  };

  const handleQuickAction = (qa) => {
    if (qa.isTour) {
      // Full guided tour
      launchTour(null);
    } else if (qa.tourKey) {
      launchTour(qa.tourKey);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed right-4 z-50 rounded-full shadow-xl flex items-center justify-center"
            style={{
              // Same lift treatment as ChatButton for visual consistency
              // and to clear the bottom tab bar's safe-area-inset.
              bottom: 'calc(env(safe-area-inset-bottom) + 6rem)',
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, #FD9C2D, #FAD98D)',
            }}
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
            className="fixed right-4 z-50 flex flex-col overflow-hidden rounded-3xl shadow-2xl"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom) + 6rem)',
              width: 320,
              maxHeight: '74vh',
              background: 'var(--pr-bg-card, #fff)',
              border: '1px solid var(--pr-border, #f0f0f0)',
            }}
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setMessages([]); setShowQuickActions(true); setConversation(null); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  title="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <X className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {/* Welcome */}
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-[#0A1A2F] dark:text-white text-sm leading-relaxed">
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
                        onClick={() => handleQuickAction(qa)}
                        className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left active:scale-97 transition-all border border-gray-100 dark:border-white/10"
                        style={{ background: '#F8FAFB' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: qa.color + '20' }}>
                          <Icon className="w-4 h-4" style={{ color: qa.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0A1A2F] dark:text-white text-xs leading-tight">{qa.label}</p>
                          <p className="text-gray-400 dark:text-gray-300 text-[10px]">{qa.sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-400 dark:text-gray-300 flex-shrink-0" />
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
                  <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl rounded-tl-sm px-4 py-3">
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
            <div className="px-3 py-3 border-t border-gray-100 dark:border-white/10 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any feature…"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm text-[#0A1A2F] dark:text-white outline-none border-2 border-gray-100 dark:border-white/10 focus:border-[#FD9C2D] transition-colors placeholder:text-gray-300 dark:text-gray-400 dark:text-gray-300 bg-[#F8FAFB]"
                disabled={loading}
              />
              <button onClick={() => handleSend()}
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