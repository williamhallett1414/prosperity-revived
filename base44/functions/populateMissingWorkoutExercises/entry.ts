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
      // Check if exercises is missing, null, not an array, or has length 0
      if (!workout.exercises || 
          workout.exercises === null || 
          !Array.isArray(workout.exercises) || 
          workout.exercises.length === 0) {
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
          duration: 30
        },
        {
          name: 'Jumping Jacks',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Fast Feet',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Skaters',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Power March',
          sets: Math.round(2 * multiplier),
          reps: null,
          duration: 45
        }
      ];

    case 'strength':
      return [
        {
          name: 'Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration: null
        },
        {
          name: 'Push-ups',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration: null
        },
        {
          name: 'Lunges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration: null
        },
        {
          name: 'Dumbbell Rows',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration: null
        },
        {
          name: 'Shoulder Press',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration: null
        }
      ];

    case 'hiit':
      return [
        {
          name: 'Burpees',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration: 40
        },
        {
          name: 'Mountain Climbers',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration: 40
        },
        {
          name: 'Jump Squats',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration: 40
        },
        {
          name: 'Plank Jacks',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration: 40
        },
        {
          name: 'High Knees',
          sets: Math.round(4 * multiplier),
          reps: null,
          duration: 40
        },
        {
          name: 'Speed Skaters',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 40
        }
      ];

    case 'home':
      return [
        {
          name: 'Bodyweight Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(15 * multiplier),
          duration: null
        },
        {
          name: 'Glute Bridges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration: null
        },
        {
          name: 'Plank',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Reverse Lunges',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration: null
        },
        {
          name: 'Standing Crunches',
          sets: Math.round(3 * multiplier),
          reps: Math.round(15 * multiplier),
          duration: null
        }
      ];

    case 'flexibility':
    case 'yoga':
      return [
        {
          name: 'Cat-Cow Stretch',
          sets: 2,
          reps: null,
          duration: 45
        },
        {
          name: 'Downward Dog',
          sets: 2,
          reps: null,
          duration: 45
        },
        {
          name: 'Hip Flexor Stretch',
          sets: 2,
          reps: null,
          duration: 30
        },
        {
          name: 'Shoulder Rolls',
          sets: 2,
          reps: 10,
          duration: null
        },
        {
          name: 'Seated Forward Fold',
          sets: 2,
          reps: null,
          duration: 45
        }
      ];

    case 'full_body':
    default:
      return [
        {
          name: 'Squats',
          sets: Math.round(3 * multiplier),
          reps: Math.round(12 * multiplier),
          duration: null
        },
        {
          name: 'Push-ups',
          sets: Math.round(3 * multiplier),
          reps: Math.round(10 * multiplier),
          duration: null
        },
        {
          name: 'Mountain Climbers',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Plank',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        },
        {
          name: 'Jumping Jacks',
          sets: Math.round(3 * multiplier),
          reps: null,
          duration: 30
        }
      ];
  }
}