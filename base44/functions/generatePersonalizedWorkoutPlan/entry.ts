import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fitness_level, goals, available_time, equipment } = await req.json();

    // Fetch user's past workouts for personalization
    const workouts = await base44.entities.WorkoutPlan.filter({
      creator_name: user.full_name
    }, '-created_date', 10);

    const pastCategories = workouts.map(w => w.category);
    const averageDuration = workouts.length > 0 
      ? Math.round(workouts.reduce((sum, w) => sum + w.duration_minutes, 0) / workouts.length)
      : 45;

    const context = `You are a world-class personal trainer drawing from Mr. Olympia champions, Jillian Michaels, and military fitness training.

USER PROFILE:
- Fitness Level: ${fitness_level}
- Goals: ${Array.isArray(goals) ? goals.join(', ') : goals}
- Available Time: ${available_time} minutes
- Equipment: ${Array.isArray(equipment) ? equipment.join(', ') : equipment}
- Past Workout Categories: ${pastCategories.length > 0 ? pastCategories.join(', ') : 'None'}
- Average Workout Duration: ${averageDuration} minutes

TASK: Generate a highly personalized workout plan that:
1. Matches their fitness level and goals
2. Fits within their time constraint
3. Uses available equipment
4. Builds on past workout patterns
5. Includes progressive overload principles
6. Specifies sets, reps, rest periods, and intensity cues
7. Includes warm-up and cool-down

Format response as JSON with structure:
{
  "plan_name": "string",
  "difficulty": "beginner/intermediate/advanced",
  "duration_minutes": number,
  "warm_up": [{ exercise, duration_seconds }],
  "main_workout": [{ exercise, sets, reps, rest_seconds, intensity_cue }],
  "cool_down": [{ exercise, duration_seconds }],
  "recovery_advice": "string with specific recovery tips",
  "progression_notes": "how to progress this plan"
}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: context,
      response_json_schema: {
        type: 'object',
        properties: {
          plan_name: { type: 'string' },
          difficulty: { type: 'string' },
          duration_minutes: { type: 'number' },
          warm_up: { type: 'array' },
          main_workout: { type: 'array' },
          cool_down: { type: 'array' },
          recovery_advice: { type: 'string' },
          progression_notes: { type: 'string' }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});