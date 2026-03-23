import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const DEFAULT_CHALLENGES = [
  {
    title: "7-Day Movement Challenge",
    description: "Move your body every day for 7 days",
    duration_days: 7,
    category: "fitness",
    tasks: [
      { day: 1, title: "Morning Stretch", description: "10-minute full body stretch" },
      { day: 2, title: "Light Cardio", description: "15-minute walk or jog" },
      { day: 3, title: "Core Work", description: "10-minute core exercises" },
      { day: 4, title: "Yoga Flow", description: "20-minute gentle yoga" },
      { day: 5, title: "Strength Training", description: "15-minute bodyweight exercises" },
      { day: 6, title: "Active Recovery", description: "Light movement and stretching" },
      { day: 7, title: "Full Body Workout", description: "20-minute complete routine" }
    ],
    participant_count: 0
  },
  {
    title: "14-Day Mobility Reset",
    description: "Improve flexibility and reduce stiffness",
    duration_days: 14,
    category: "fitness",
    tasks: [
      { day: 1, title: "Hip Openers", description: "Focus on hip mobility" },
      { day: 2, title: "Shoulder Mobility", description: "Upper body flexibility" },
      { day: 3, title: "Hamstring Stretches", description: "Lower body focus" },
      { day: 4, title: "Spine Mobility", description: "Back and core stretches" },
      { day: 5, title: "Full Body Flow", description: "Complete mobility routine" },
      { day: 6, title: "Active Rest", description: "Light movement" },
      { day: 7, title: "Assessment", description: "Check your progress" }
    ],
    participant_count: 0
  },
  {
    title: "30-Day Strength Builder",
    description: "Build strength with progressive workouts",
    duration_days: 30,
    category: "fitness",
    tasks: [
      { day: 1, title: "Foundation Day", description: "Learn basic movements" },
      { day: 2, title: "Upper Body", description: "Push and pull exercises" },
      { day: 3, title: "Lower Body", description: "Squats and lunges" }
    ],
    participant_count: 0
  },
  {
    title: "21-Day Core Transformation",
    description: "Strengthen your core with daily targeted sessions",
    duration_days: 21,
    category: "fitness",
    tasks: [
      { day: 1, title: "Core Basics", description: "Plank and basic holds" },
      { day: 2, title: "Lower Abs", description: "Leg raises and holds" },
      { day: 3, title: "Obliques", description: "Side planks and twists" }
    ],
    participant_count: 0
  },
  {
    title: "10-Day Low-Impact Burn",
    description: "Gentle but effective workouts for all levels",
    duration_days: 10,
    category: "fitness",
    tasks: [
      { day: 1, title: "Walking Workout", description: "30-minute brisk walk" },
      { day: 2, title: "Chair Exercises", description: "Seated strength training" },
      { day: 3, title: "Water Aerobics", description: "Low-impact cardio" }
    ],
    participant_count: 0
  },
  {
    title: "28-Day Full Body Rebuild",
    description: "A complete reset for strength, mobility, and endurance",
    duration_days: 28,
    category: "fitness",
    tasks: [
      { day: 1, title: "Assessment Day", description: "Baseline measurements" },
      { day: 2, title: "Full Body Strength", description: "Total body workout" },
      { day: 3, title: "Cardio Endurance", description: "Heart health focus" }
    ],
    participant_count: 0
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check if challenges exist
    const existingChallenges = await base44.asServiceRole.entities.Challenge.filter({});
    
    if (existingChallenges.length === 0) {
      // No challenges exist, create default ones
      await base44.asServiceRole.entities.Challenge.bulkCreate(DEFAULT_CHALLENGES);
      
      return Response.json({
        success: true,
        message: 'Default challenges created successfully',
        count: DEFAULT_CHALLENGES.length
      });
    }
    
    return Response.json({
      success: true,
      message: 'Challenges already exist',
      count: existingChallenges.length
    });
  } catch (error) {
    console.error('Error ensuring challenges exist:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});