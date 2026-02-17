import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all workouts
    const allWorkouts = await base44.asServiceRole.entities.WorkoutPlan.list();
    
    let updatedCount = 0;
    const errors = [];

    for (const workout of allWorkouts) {
      // Check if exercises is missing, empty, or has length 0
      if (!workout.exercises || workout.exercises.length === 0) {
        try {
          const exercises = generateExercisesForCategory(workout.category, workout.difficulty);
          
          // Update the workout with generated exercises
          await base44.asServiceRole.entities.WorkoutPlan.update(workout.id, {
            exercises: exercises
          });
          
          updatedCount++;
        } catch (error) {
          errors.push({
            workoutId: workout.id,
            workoutTitle: workout.title,
            error: error.message
          });
        }
      }
    }

    return Response.json({
      success: true,
      message: `Populated exercises for ${updatedCount} workouts`,
      updatedCount,
      totalWorkouts: allWorkouts.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});

function generateExercisesForCategory(category, difficulty = 'beginner') {
  const difficultyMultiplier = {
    'beginner': 1,
    'intermediate': 1.3,
    'advanced': 1.6
  };
  
  const multiplier = difficultyMultiplier[difficulty] || 1;

  switch (category?.toLowerCase()) {
    case 'cardio':
      return [
        {
          name: 'High Knees',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 15
        },
        {
          name: 'Jumping Jacks',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 15
        },
        {
          name: 'Fast Feet',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 15
        },
        {
          name: 'Skaters',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 15
        },
        {
          name: 'Power March',
          sets: Math.round(2 * multiplier),
          reps: null,
          duration_seconds: 45,
          rest: 20
        }
      ];

    case 'strength':
      return [
        {
          name: 'Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Push-ups',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Lunges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Dumbbell Rows',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Shoulder Press',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration_seconds: null,
          rest: 30
        }
      ];

    case 'hiit':
      return [
        {
          name: 'Burpees',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        },
        {
          name: 'Mountain Climbers',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        },
        {
          name: 'Jump Squats',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        },
        {
          name: 'Plank Jacks',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        },
        {
          name: 'High Knees',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        },
        {
          name: 'Speed Skaters',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 40,
          rest: 20
        }
      ];

    case 'home':
      return [
        {
          name: 'Bodyweight Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(15 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Glute Bridges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Plank',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 20
        },
        {
          name: 'Reverse Lunges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Standing Crunches',
          sets: Math.round(3 * multiplier),
          reps: Math.round(15 * multiplier),
          duration_seconds: null,
          rest: 20
        }
      ];

    case 'flexibility':
    case 'yoga':
      return [
        {
          name: 'Cat-Cow Stretch',
          sets: 2,
          reps: null,
          duration_seconds: 45,
          rest: 15
        },
        {
          name: 'Downward Dog',
          sets: 2,
          reps: null,
          duration_seconds: 45,
          rest: 15
        },
        {
          name: 'Hip Flexor Stretch',
          sets: 2,
          reps: null,
          duration_seconds: 30,
          rest: 10
        },
        {
          name: 'Shoulder Rolls',
          sets: 2,
          reps: 10,
          duration_seconds: null,
          rest: 10
        },
        {
          name: 'Seated Forward Fold',
          sets: 2,
          reps: null,
          duration_seconds: 45,
          rest: 15
        }
      ];

    case 'full_body':
    default:
      return [
        {
          name: 'Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Push-ups',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration_seconds: null,
          rest: 30
        },
        {
          name: 'Mountain Climbers',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 20
        },
        {
          name: 'Plank',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 20
        },
        {
          name: 'Jumping Jacks',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration_seconds: 30,
          rest: 15
        }
      ];
  }
}