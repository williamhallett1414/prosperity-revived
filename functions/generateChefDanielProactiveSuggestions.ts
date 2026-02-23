import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const users = await base44.asServiceRole.entities.User.list();
    const suggestionsCreated = [];
    
    for (const user of users) {
      try {
        // Check last meal log
        const recentMeals = await base44.asServiceRole.entities.MealLog.filter({
          created_by: user.email
        }, '-created_date', 1);
        
        const lastMeal = recentMeals[0];
        const daysSinceLastMeal = lastMeal 
          ? Math.floor((Date.now() - new Date(lastMeal.created_date).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        // Get memories
        const memories = await base44.asServiceRole.entities.ChatbotMemory.filter({
          chatbot_name: 'ChefDaniel',
          created_by: user.email
        }, '-importance', 5);
        
        // Check existing suggestions
        const existingSuggestions = await base44.asServiceRole.entities.ProactiveSuggestion.filter({
          chatbot_name: 'ChefDaniel',
          user_email: user.email,
          is_read: false
        });
        
        if (existingSuggestions.length > 0) continue;
        
        let suggestionMessage = null;
        let suggestionTitle = null;
        let promptAction = null;
        let priority = 5;
        let basedOn = null;
        
        const userName = user.full_name?.split(' ')[0] || 'friend';
        
        // Scenario 1: No meal logging in 5+ days
        if (daysSinceLastMeal >= 5) {
          const goalMemory = memories.find(m => m.memory_type === 'goal');
          
          suggestionTitle = "Let's Get Cooking!";
          suggestionMessage = `Hey ${userName}! It's been a minute since we talked food. ${
            goalMemory 
              ? `I remember you're working toward ${goalMemory.content}. How's that going?` 
              : "I've got some fresh recipe ideas that might inspire you."
          }\n\nWhat are you in the mood for?`;
          promptAction = "Show me a healthy recipe for tonight";
          priority = 7;
          basedOn = `Inactivity: ${daysSinceLastMeal} days since last meal log`;
        }
        // Scenario 2: Check on dietary preferences/restrictions
        else if (memories.some(m => m.memory_type === 'preference' && m.content.includes('dietary'))) {
          const prefMemory = memories.find(m => m.memory_type === 'preference');
          
          suggestionTitle = "Recipe Idea for You";
          suggestionMessage = `${userName}, I know you're into ${prefMemory.content}. I've been thinking about a recipe that fits perfectly with your preferences.\n\nWant to try something new this week?`;
          promptAction = `Give me a recipe that matches ${prefMemory.content}`;
          priority = 6;
          basedOn = `Personalized to preference: ${prefMemory.content}`;
        }
        // Scenario 3: Weekly meal prep reminder
        else {
          const dayOfWeek = new Date().getDay();
          if (dayOfWeek === 0) { // Sunday
            suggestionTitle = "Meal Prep Sunday!";
            suggestionMessage = `${userName}, it's Sunday - perfect time to set yourself up for a successful week!\n\nWant help planning and prepping some meals? I can make it simple and delicious.`;
            promptAction = "Help me meal prep for the week";
            priority = 8;
            basedOn = "Weekly meal prep reminder (Sunday)";
          }
        }
        
        if (suggestionMessage) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 3);
          
          await base44.asServiceRole.entities.ProactiveSuggestion.create({
            chatbot_name: 'ChefDaniel',
            user_email: user.email,
            suggestion_type: daysSinceLastMeal >= 5 ? 'reminder' : 'tip',
            title: suggestionTitle,
            message: suggestionMessage,
            prompt_action: promptAction,
            priority: priority,
            is_read: false,
            expires_at: expiresAt.toISOString(),
            based_on: basedOn
          });
          
          suggestionsCreated.push({ user: user.email, type: 'ChefDaniel' });
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