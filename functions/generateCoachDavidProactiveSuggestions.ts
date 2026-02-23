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
        
        // Scenario 1: No workout in 7+ days
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
            suggestion_type: daysSinceLastWorkout >= 7 ? 'reminder' : 'check_in',
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