import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const CATEGORY_WORKOUTS = {
  cardio: [
    { title: "20-Minute Fat Burn", description: "High-energy cardio to torch calories", duration_minutes: 20, difficulty: "intermediate", equipment: "None" },
    { title: "Beginner Cardio Flow", description: "Easy-paced cardio for beginners", duration_minutes: 15, difficulty: "beginner", equipment: "None" },
    { title: "Low-Impact Cardio Blast", description: "Joint-friendly cardio workout", duration_minutes: 25, difficulty: "beginner", equipment: "None" },
    { title: "Cardio Endurance Builder", description: "Build stamina and endurance", duration_minutes: 30, difficulty: "intermediate", equipment: "None" },
    { title: "Fast Feet Drills", description: "Quick footwork and agility training", duration_minutes: 15, difficulty: "advanced", equipment: "None" },
    { title: "Power Walk at Home", description: "Walking-based cardio routine", duration_minutes: 20, difficulty: "beginner", equipment: "None" },
    { title: "Cardio Ladder", description: "Progressive intensity cardio", duration_minutes: 25, difficulty: "intermediate", equipment: "None" },
    { title: "High-Energy Cardio Mix", description: "Mixed cardio exercises", duration_minutes: 30, difficulty: "intermediate", equipment: "None" },
    { title: "Rhythm Cardio", description: "Dance-inspired cardio moves", duration_minutes: 20, difficulty: "beginner", equipment: "None" },
    { title: "Cardio Sweat Session", description: "Maximum calorie burn", duration_minutes: 35, difficulty: "advanced", equipment: "None" }
  ],
  strength: [
    { title: "Full Body Strength", description: "Complete strength workout", duration_minutes: 30, difficulty: "intermediate", equipment: "Dumbbells" },
    { title: "Upper Body Sculpt", description: "Arms, shoulders, and back focus", duration_minutes: 25, difficulty: "intermediate", equipment: "Dumbbells" },
    { title: "Lower Body Power", description: "Legs and glutes strength", duration_minutes: 30, difficulty: "advanced", equipment: "Dumbbells" },
    { title: "Dumbbell Strength Circuit", description: "Full body with weights", duration_minutes: 35, difficulty: "intermediate", equipment: "Dumbbells" },
    { title: "Core Strength Builder", description: "Abs and core focused", duration_minutes: 20, difficulty: "beginner", equipment: "None" },
    { title: "Glutes & Legs Burn", description: "Lower body sculpting", duration_minutes: 25, difficulty: "intermediate", equipment: "Resistance Bands" },
    { title: "Strength Endurance", description: "High-rep strength training", duration_minutes: 40, difficulty: "advanced", equipment: "Dumbbells" },
    { title: "Push/Pull Strength", description: "Balanced upper body", duration_minutes: 30, difficulty: "intermediate", equipment: "Dumbbells" },
    { title: "Total Body Tone", description: "Full body toning workout", duration_minutes: 35, difficulty: "beginner", equipment: "Light Weights" },
    { title: "Strength Foundations", description: "Master basic movements", duration_minutes: 25, difficulty: "beginner", equipment: "None" }
  ],
  hiit: [
    { title: "15-Minute HIIT Blast", description: "Quick high-intensity workout", duration_minutes: 15, difficulty: "intermediate", equipment: "None" },
    { title: "Tabata Burn", description: "20 seconds on, 10 seconds off", duration_minutes: 20, difficulty: "advanced", equipment: "None" },
    { title: "HIIT Power Circuit", description: "Maximum effort intervals", duration_minutes: 25, difficulty: "advanced", equipment: "None" },
    { title: "Bodyweight HIIT", description: "No equipment needed", duration_minutes: 20, difficulty: "intermediate", equipment: "None" },
    { title: "Explosive HIIT", description: "Plyometric power moves", duration_minutes: 18, difficulty: "advanced", equipment: "None" },
    { title: "HIIT Ladder", description: "Progressive interval training", duration_minutes: 22, difficulty: "intermediate", equipment: "None" },
    { title: "Quick HIIT Sweat", description: "Fast-paced calorie burner", duration_minutes: 12, difficulty: "beginner", equipment: "None" },
    { title: "HIIT Shred", description: "Fat-burning intervals", duration_minutes: 25, difficulty: "advanced", equipment: "None" },
    { title: "HIIT & Core", description: "Abs and cardio combo", duration_minutes: 20, difficulty: "intermediate", equipment: "None" },
    { title: "Max Intensity HIIT", description: "All-out effort workout", duration_minutes: 18, difficulty: "advanced", equipment: "None" }
  ],
  home: [
    { title: "No-Equipment Full Body", description: "Complete workout at home", duration_minutes: 30, difficulty: "beginner", equipment: "None" },
    { title: "Home Core Workout", description: "Strengthen your core anywhere", duration_minutes: 20, difficulty: "beginner", equipment: "None" },
    { title: "Living Room Burn", description: "Small space workout", duration_minutes: 25, difficulty: "intermediate", equipment: "None" },
    { title: "Home Strength Circuit", description: "Bodyweight strength builder", duration_minutes: 30, difficulty: "intermediate", equipment: "None" },
    { title: "Quick Home Sweat", description: "Fast effective workout", duration_minutes: 15, difficulty: "beginner", equipment: "None" },
    { title: "Home Mobility Flow", description: "Flexibility and movement", duration_minutes: 20, difficulty: "beginner", equipment: "None" },
    { title: "Home Cardio Mix", description: "Heart-pumping home cardio", duration_minutes: 25, difficulty: "intermediate", equipment: "None" },
    { title: "Total Body Home Workout", description: "Complete home routine", duration_minutes: 35, difficulty: "intermediate", equipment: "None" },
    { title: "Home Stretch & Strength", description: "Flexibility meets strength", duration_minutes: 30, difficulty: "beginner", equipment: "None" },
    { title: "Beginner Home Routine", description: "Perfect for starting out", duration_minutes: 20, difficulty: "beginner", equipment: "None" }
  ]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    let created = 0;
    
    for (const [category, workouts] of Object.entries(CATEGORY_WORKOUTS)) {
      // Check existing workouts in this category
      const existing = await base44.asServiceRole.entities.WorkoutPlan.filter({ 
        category: category 
      });
      
      const needed = 10 - existing.length;
      
      if (needed > 0) {
        // Create missing workouts
        const workoutsToCreate = workouts.slice(0, needed).map(w => ({
          ...w,
          category: category,
          exercises: [
            { name: "Warm-up", sets: 1, reps: 1, duration_seconds: 300 },
            { name: "Main Exercise", sets: 3, reps: 12, duration_seconds: 0 },
            { name: "Cool-down", sets: 1, reps: 1, duration_seconds: 300 }
          ],
          completed_dates: []
        }));
        
        await base44.asServiceRole.entities.WorkoutPlan.bulkCreate(workoutsToCreate);
        created += workoutsToCreate.length;
      }
    }
    
    return Response.json({
      success: true,
      message: `Ensured workout categories have sufficient content`,
      created
    });
  } catch (error) {
    console.error('Error ensuring category workouts:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});