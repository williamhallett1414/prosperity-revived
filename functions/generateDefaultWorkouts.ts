import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const DEFAULT_WORKOUTS = {
  cardio: [
    { title: "Cardio Power Surge", description: "High-intensity cardio to build power and endurance", duration_minutes: 25, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Steady State Cardio Flow", description: "Consistent paced cardio for steady burn", duration_minutes: 30, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Cardio Endurance Challenge", description: "Build your cardiovascular endurance", duration_minutes: 40, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Fast Feet & Agility Drills", description: "Quick footwork and agility training", duration_minutes: 20, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Cardio Rhythm Burn", description: "Dance-inspired cardio to upbeat music", duration_minutes: 18, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "High-Energy Cardio Mix", description: "Mixed cardio exercises for total body burn", duration_minutes: 22, difficulty: "intermediate", equipment: "None", exercises: [] }
  ],
  strength: [
    { title: "Strength & Stability Circuit", description: "Build strength with stable movements", duration_minutes: 35, difficulty: "intermediate", equipment: "Dumbbells", exercises: [] },
    { title: "Upper Body Power Builder", description: "Develop upper body strength and power", duration_minutes: 28, difficulty: "intermediate", equipment: "Dumbbells", exercises: [] }
  ],
  hiit: [
    { title: "HIIT Inferno", description: "Intense high-interval training workout", duration_minutes: 18, difficulty: "advanced", equipment: "None", exercises: [] },
    { title: "Tabata Turbo", description: "Classic tabata intervals for maximum burn", duration_minutes: 16, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "HIIT Bodyweight Blast", description: "No equipment needed high-intensity workout", duration_minutes: 20, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "HIIT Power Push", description: "Explosive power-based HIIT training", duration_minutes: 22, difficulty: "advanced", equipment: "None", exercises: [] },
    { title: "HIIT Sweat Storm", description: "Quick intense sweat session", duration_minutes: 15, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "HIIT Ladder Challenge", description: "Progressive interval ladder training", duration_minutes: 25, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "HIIT & Core Fusion", description: "Combine HIIT with core strengthening", duration_minutes: 20, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Max Burn HIIT", description: "Maximum intensity calorie burner", duration_minutes: 30, difficulty: "advanced", equipment: "None", exercises: [] },
    { title: "Quick HIIT Shred", description: "Fast and effective HIIT session", duration_minutes: 12, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "HIIT Mobility Mix", description: "HIIT with mobility and flexibility focus", duration_minutes: 18, difficulty: "beginner", equipment: "None", exercises: [] }
  ],
  home: [
    { title: "Home Strength & Tone", description: "Full body strength and toning at home", duration_minutes: 30, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Living Room Sweat Session", description: "Effective workout in limited space", duration_minutes: 20, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Home Core Sculpt", description: "Sculpt and strengthen your core", duration_minutes: 18, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Home Full Body Burn", description: "Complete full body home workout", duration_minutes: 25, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Home Mobility Flow", description: "Improve mobility and flexibility at home", duration_minutes: 15, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Home Cardio Boost", description: "Cardio without leaving home", duration_minutes: 22, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Home Strength Circuit", description: "Strength training circuit at home", duration_minutes: 28, difficulty: "intermediate", equipment: "Dumbbells", exercises: [] },
    { title: "Home Power Workout", description: "Build explosive power at home", duration_minutes: 30, difficulty: "intermediate", equipment: "None", exercises: [] },
    { title: "Home Stretch & Strength", description: "Combine flexibility with strength work", duration_minutes: 20, difficulty: "beginner", equipment: "None", exercises: [] },
    { title: "Beginner Home Routine", description: "Perfect starting point for home workouts", duration_minutes: 15, difficulty: "beginner", equipment: "None", exercises: [] }
  ]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    let createdCount = 0;
    const createdWorkouts = [];
    
    for (const [category, workouts] of Object.entries(DEFAULT_WORKOUTS)) {
      for (const workout of workouts) {
        try {
          // Check if workout with this title already exists
          const existing = await base44.asServiceRole.entities.WorkoutPlan.filter({
            title: workout.title
          });
          
          if (existing.length === 0) {
            // Create the workout
            const newWorkout = {
              ...workout,
              category: category,
              completed_dates: [],
              is_shared: false,
              likes: 0,
              times_copied: 0
            };
            
            await base44.asServiceRole.entities.WorkoutPlan.create(newWorkout);
            createdWorkouts.push(workout.title);
            createdCount++;
          }
        } catch (error) {
          console.error(`Error processing workout "${workout.title}":`, error);
        }
      }
    }
    
    return Response.json({
      success: true,
      message: `Generated default workouts successfully`,
      created: createdCount,
      workouts: createdWorkouts
    });
  } catch (error) {
    console.error('Error in generateDefaultWorkouts:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});