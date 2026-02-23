import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users
    const users = await base44.asServiceRole.entities.User.list();
    const suggestionsCreated = [];
    
    for (const user of users) {
      try {
        // Check last workout session
        const recentWorkouts = await base44.asServiceRole.entities.WorkoutSession.filter({
          created_by: user.email
        }, '-created_date', 1);
        
        const lastWorkout = recentWorkouts[0];
        const daysSinceLastWorkout = lastWorkout 
          ? Math.floor((Date.now() - new Date(lastWorkout.created_date).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        // Get memories for context
        const memories = await base44.asServiceRole.entities.ChatbotMemory.filter({
          chatbot_name: 'CoachDavid',
          created_by: user.email
        }, '-importance', 5);
        
        // Get all recent workouts for intensity analysis
        const allRecentWorkouts = await base44.asServiceRole.entities.WorkoutSession.filter({
          created_by: user.email
        }, '-created_date', 10);
        
        // Get workout plans to check goals
        const workoutPlans = await base44.asServiceRole.entities.WorkoutPlan.filter({
          created_by: user.email
        }, '-created_date', 5);
        
        // Check if there's already an active suggestion
        const existingSuggestions = await base44.asServiceRole.entities.ProactiveSuggestion.filter({
          chatbot_name: 'CoachDavid',
          user_email: user.email,
          is_read: false
        });
        
        if (existingSuggestions.length > 0) continue; // Don't spam with multiple suggestions
        
        let suggestionMessage = null;
        let suggestionTitle = null;
        let promptAction = null;
        let priority = 5;
        let basedOn = null;
        let suggestionType = 'check_in';
        
        // NEW Scenario 1: Recovery routine after intense workout streak
        if (allRecentWorkouts.length >= 3) {
          const last3Days = allRecentWorkouts.slice(0, 3);
          const intenseLast3 = last3Days.every(w => 
            w.duration_minutes >= 40 || 
            (w.exercises_completed && w.exercises_completed >= 8)
          );
          
          const daysSinceLastWorkout = lastWorkout 
            ? Math.floor((Date.now() - new Date(lastWorkout.created_date).getTime()) / (1000 * 60 * 60 * 24))
            : 999;
          
          if (intenseLast3 && daysSinceLastWorkout === 0) {
            const userName = user.full_name?.split(' ')[0] || 'champion';
            suggestionTitle = "Time to Recover Like a Pro";
            suggestionMessage = `${userName}, you've been crushing it with 3+ intense sessions! Your body is strong, but recovery is where the magic happens.\n\nToday, let's focus on active recovery: stretching, mobility work, or a light walk. Your muscles will thank you, and you'll come back even stronger.`;
            promptAction = "Give me a recovery routine for today";
            priority = 9;
            basedOn = "Intense workout streak detected - recovery needed";
            suggestionType = 'tip';
          }
        }
        
        // NEW Scenario 2: Workout plan progress check
        if (!suggestionMessage && workoutPlans.length > 0) {
          const activePlan = workoutPlans[0];
          const completedDates = activePlan.completed_dates || [];
          const recentCompletions = completedDates.filter(date => {
            const daysAgo = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
            return daysAgo <= 14;
          });
          
          if (recentCompletions.length >= 3 && recentCompletions.length < completedDates.length * 0.5) {
            const userName = user.full_name?.split(' ')[0] || 'friend';
            suggestionTitle = "Let's Talk About Your Plan";
            suggestionMessage = `${userName}, I see you're working on "${activePlan.title}". You've done ${recentCompletions.length} sessions recently.\n\nHow's the plan feeling? Too easy? Too hard? Let's adjust it so it fits where you are right now.`;
            promptAction = "Help me adjust my workout plan";
            priority = 8;
            basedOn = `Progress check on plan: ${activePlan.title}`;
            suggestionType = 'check_in';
          }
        }
        
        // NEW Scenario 3: Consistency milestone celebration
        if (!suggestionMessage && allRecentWorkouts.length >= 5) {
          const last7Days = allRecentWorkouts.filter(w => {
            const daysAgo = Math.floor((Date.now() - new Date(w.created_date).getTime()) / (1000 * 60 * 60 * 24));
            return daysAgo <= 7;
          });
          
          if (last7Days.length >= 4) {
            const userName = user.full_name?.split(' ')[0] || 'athlete';
            suggestionTitle = "You're Building Something Special";
            suggestionMessage = `${userName}, ${last7Days.length} workouts in 7 days? That's not luck - that's discipline!\n\nThis is where champions are made. Not in the gym, but in showing up again and again. What's driving you right now?`;
            promptAction = "Tell you what's motivating me to keep going";
            priority = 7;
            basedOn = `Consistency streak: ${last7Days.length} workouts in 7 days`;
            suggestionType = 'encouragement';
          }
        }
        
        // Existing Scenario 1: No workout in 7+ days
        if (!suggestionMessage && daysSinceLastWorkout >= 7) {
        if (daysSinceLastWorkout >= 7) {
          const goalMemory = memories.find(m => m.memory_type === 'goal');
          const userName = user.full_name?.split(' ')[0] || 'friend';
          
          suggestionTitle = "Time to Get Moving!";
          suggestionMessage = `Hey ${userName}! It's been ${daysSinceLastWorkout} days since your last workout. ${
            goalMemory 
              ? `I remember you're working on ${goalMemory.content}. Let's not lose that momentum!` 
              : "Your body is ready for some action!"
          }\n\nEven 15 minutes today makes a difference. What do you say?`;
          promptAction = "Give me a quick 15-minute workout I can do today";
          priority = 8;
          basedOn = `Inactivity: ${daysSinceLastWorkout} days since last workout`;
        }
        // Scenario 2: Active but no workout in 3-6 days
        else if (daysSinceLastWorkout >= 3 && daysSinceLastWorkout < 7) {
          const userName = user.full_name?.split(' ')[0] || '';
          suggestionTitle = "Keep the Streak Alive";
          suggestionMessage = `${userName}, you've been doing great! Don't let a few days off turn into a week. Your discipline is what sets you apart.\n\nReady to jump back in?`;
          promptAction = "What should I focus on today?";
          priority = 6;
          basedOn = `Moderate inactivity: ${daysSinceLastWorkout} days`;
        }
        // Scenario 3: Check on challenges from memories
        else if (memories.some(m => m.memory_type === 'challenge')) {
          const challengeMemory = memories.find(m => m.memory_type === 'challenge');
          const userName = user.full_name?.split(' ')[0] || '';
          
          suggestionTitle = "How's It Going?";
          suggestionMessage = `${userName}, last time we talked about ${challengeMemory.content}. I've been thinking about your progress.\n\nHow's that going for you now?`;
          promptAction = `Update you on ${challengeMemory.content}`;
          priority = 7;
          basedOn = `Follow-up on challenge: ${challengeMemory.content}`;
        }
        
        if (suggestionMessage) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days
          
          await base44.asServiceRole.entities.ProactiveSuggestion.create({
            chatbot_name: 'CoachDavid',
            user_email: user.email,
            suggestion_type: suggestionType,
            title: suggestionTitle,
            message: suggestionMessage,
            prompt_action: promptAction,
            priority: priority,
            is_read: false,
            expires_at: expiresAt.toISOString(),
            based_on: basedOn
          });
          
          suggestionsCreated.push({ user: user.email, type: 'CoachDavid' });
        }
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
      }
    }
    
    return Response.json({
      success: true,
      suggestionsCreated: suggestionsCreated.length,
      details: suggestionsCreated
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});