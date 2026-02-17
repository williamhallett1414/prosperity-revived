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
    
    let deletedCount = 0;
    const deletedWorkouts = [];

    for (const workout of allWorkouts) {
      // Check if image_url is missing, null, or empty string
      if (!workout.image_url || workout.image_url.trim() === '') {
        try {
          await base44.asServiceRole.entities.WorkoutPlan.delete(workout.id);
          deletedCount++;
          deletedWorkouts.push({
            id: workout.id,
            title: workout.title
          });
        } catch (error) {
          console.error(`Failed to delete workout ${workout.id}:`, error);
        }
      }
    }

    return Response.json({
      success: true,
      message: `Deleted ${deletedCount} workouts without images`,
      deletedCount,
      totalWorkouts: allWorkouts.length,
      deletedWorkouts
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});