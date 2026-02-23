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
        
        // Get nutrition plans and recent meals for goal tracking
        const nutritionPlans = await base44.asServiceRole.entities.NutritionPlan.filter({
          created_by: user.email
        }, '-created_date', 1);
        
        const allRecentMeals = await base44.asServiceRole.entities.MealLog.filter({
          created_by: user.email
        }, '-created_date', 14);
        
        // Get user progress to check nutritional goals
        const userProgress = await base44.asServiceRole.entities.UserProgress.filter({
          created_by: user.email
        }, '-created_date', 1);
        
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
        let suggestionType = 'tip';
        
        const userName = user.full_name?.split(' ')[0] || 'friend';
        
        // NEW Scenario 1: Recipe suggestion based on logged nutritional goals
        if (nutritionPlans.length > 0 && allRecentMeals.length >= 3) {
          const plan = nutritionPlans[0];
          const targetCalories = plan.target_calories;
          const targetProtein = plan.target_protein;
          
          // Calculate recent average
          const recentCalories = allRecentMeals.slice(0, 7).reduce((sum, m) => sum + (m.calories || 0), 0) / 7;
          
          if (targetCalories && recentCalories < targetCalories * 0.8) {
            suggestionTitle = "Let's Fuel You Better";
            suggestionMessage = `${userName}, I've been looking at your meal logs. You're averaging ${Math.round(recentCalories)} calories per day, but your goal is ${targetCalories}.\n\nYou're not eating enough to support your goals! Let me suggest some nutrient-dense recipes that'll help you hit your targets without feeling stuffed.`;
            promptAction = "Show me high-calorie healthy recipes";
            priority = 9;
            basedOn = `Nutritional gap: ${Math.round(recentCalories)} cal vs ${targetCalories} cal target`;
            suggestionType = 'tip';
          } else if (targetProtein && allRecentMeals.some(m => (m.protein || 0) < targetProtein * 0.25)) {
            suggestionTitle = "Protein Power-Up";
            suggestionMessage = `${userName}, your protein target is ${targetProtein}g per day, but some of your meals are coming up short.\n\nProtein keeps you satisfied and supports your goals. Want some delicious high-protein recipes that don't feel like "diet food"?`;
            promptAction = "Give me high-protein meal ideas";
            priority = 8;
            basedOn = `Low protein in recent meals vs ${targetProtein}g target`;
            suggestionType = 'tip';
          }
        }
        
        // NEW Scenario 2: Ingredient-based recipe suggestion from past preferences
        if (!suggestionMessage && allRecentMeals.length >= 5) {
          const mealTypes = allRecentMeals.map(m => m.meal_type).filter(Boolean);
          const typeCounts = {};
          mealTypes.forEach(type => {
            typeCounts[type] = (typeCounts[type] || 0) + 1;
          });
          
          const favoriteType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
          
          if (favoriteType && favoriteType[1] >= 3) {
            suggestionTitle = "New Twist on a Favorite";
            suggestionMessage = `${userName}, I noticed you love ${favoriteType[0]} meals! I've got a fresh recipe idea that matches your taste but adds some exciting new flavors.\n\nWant to try something that feels familiar but totally new?`;
            promptAction = `Show me a creative ${favoriteType[0]} recipe`;
            priority = 7;
            basedOn = `Preference pattern: enjoys ${favoriteType[0]} (${favoriteType[1]} times logged)`;
            suggestionType = 'tip';
          }
        }
        
        // NEW Scenario 3: Seasonal ingredient recommendation
        if (!suggestionMessage) {
          const currentMonth = new Date().getMonth();
          let seasonalSuggestion = null;
          
          if ([2, 3, 4].includes(currentMonth)) { // Spring
            seasonalSuggestion = { season: 'spring', ingredients: 'asparagus, peas, strawberries' };
          } else if ([5, 6, 7].includes(currentMonth)) { // Summer
            seasonalSuggestion = { season: 'summer', ingredients: 'tomatoes, zucchini, berries' };
          } else if ([8, 9, 10].includes(currentMonth)) { // Fall
            seasonalSuggestion = { season: 'fall', ingredients: 'squash, apples, sweet potatoes' };
          } else { // Winter
            seasonalSuggestion = { season: 'winter', ingredients: 'root vegetables, citrus, kale' };
          }
          
          if (seasonalSuggestion && Math.random() > 0.7) {
            suggestionTitle = `Fresh ${seasonalSuggestion.season.charAt(0).toUpperCase() + seasonalSuggestion.season.slice(1)} Flavors`;
            suggestionMessage = `${userName}, ${seasonalSuggestion.season} is here! The markets are bursting with fresh ${seasonalSuggestion.ingredients}.\n\nThese ingredients are at their peak flavor AND nutrition right now. Want a recipe that celebrates the season?`;
            promptAction = `Show me a ${seasonalSuggestion.season} recipe with ${seasonalSuggestion.ingredients.split(',')[0]}`;
            priority = 6;
            basedOn = `Seasonal recommendation: ${seasonalSuggestion.season}`;
            suggestionType = 'tip';
          }
        }
        
        // Existing Scenario 1: No meal logging in 5+ days
        if (!suggestionMessage && daysSinceLastMeal >= 5) {
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
            suggestion_type: suggestionType,
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