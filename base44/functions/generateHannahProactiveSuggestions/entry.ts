import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users
    const users = await base44.asServiceRole.entities.User.list();
    const suggestionsCreated = [];
    
    for (const user of users) {
      try {
        // Check last journal entry
        const recentJournals = await base44.asServiceRole.entities.JournalEntry.filter({
          created_by: user.email
        }, '-created_date', 5);
        
        const lastJournal = recentJournals[0];
        const daysSinceLastJournal = lastJournal 
          ? Math.floor((Date.now() - new Date(lastJournal.created_date).getTime()) / (1000 * 60 * 60 * 24))
          : 999;
        
        // Get memories and emotional patterns
        const memories = await base44.asServiceRole.entities.ChatbotMemory.filter({
          chatbot_name: 'Hannah',
          created_by: user.email
        }, '-importance', 10);
        
        const emotionalPatterns = await base44.asServiceRole.entities.EmotionalPattern.filter({
          created_by: user.email
        }, '-created_date', 5);
        
        // Check if there's already an active suggestion
        const existingSuggestions = await base44.asServiceRole.entities.ProactiveSuggestion.filter({
          chatbot_name: 'Hannah',
          user_email: user.email,
          is_read: false
        });
        
        if (existingSuggestions.length > 0) continue;
        
        let suggestionMessage = null;
        let suggestionTitle = null;
        let promptAction = null;
        let priority = 5;
        let basedOn = null;
        let suggestionType = 'check_in';
        
        // NEW Scenario 1: Deep dive on emotional pattern with specific reflection
        if (emotionalPatterns.length >= 3) {
          const recentPattern = emotionalPatterns[0];
          const userName = user.full_name?.split(' ')[0] || 'friend';
          
          suggestionTitle = "Let's Explore This Pattern";
          suggestionMessage = `${userName}, I've been reflecting on our conversations. I notice ${recentPattern.pattern_type} keeps coming up for you.\n\nHere's what I'm curious about: What need might ${recentPattern.pattern_type} be trying to meet? Sometimes our emotions are messengers pointing to something deeper.`;
          promptAction = `Help me understand what ${recentPattern.pattern_type} is trying to tell me`;
          priority = 9;
          basedOn = `Emotional pattern analysis: ${recentPattern.pattern_type}`;
          suggestionType = 'insight';
        }
        // NEW Scenario 2: Contrasting emotional states - growth recognition
        else if (recentJournals.length >= 3) {
          const oldestMood = recentJournals[recentJournals.length - 1]?.mood;
          const latestMood = recentJournals[0]?.mood;
          
          if (oldestMood && latestMood && oldestMood !== latestMood) {
            const userName = user.full_name?.split(' ')[0] || 'friend';
            const isImprovement = ['Great', 'Good'].includes(latestMood) && ['Low', 'Okay'].includes(oldestMood);
            
            if (isImprovement) {
              suggestionTitle = "I See Your Growth";
              suggestionMessage = `${userName}, I noticed something beautiful - you've moved from feeling ${oldestMood} to ${latestMood}. That shift didn't happen by accident.\n\nWhat do you think helped create that change? Naming it can help you do it again.`;
              promptAction = "Reflect on what helped me shift my mood";
              priority = 8;
              basedOn = `Emotional growth: ${oldestMood} → ${latestMood}`;
              suggestionType = 'encouragement';
            }
          }
        }
        // NEW Scenario 3: Specific theme-based reflection
        else if (recentJournals.some(j => j.key_themes?.length > 0)) {
          const themeCounts = {};
          recentJournals.forEach(j => {
            j.key_themes?.forEach(theme => {
              themeCounts[theme] = (themeCounts[theme] || 0) + 1;
            });
          });
          
          const recurringTheme = Object.entries(themeCounts)
            .sort((a, b) => b[1] - a[1])[0];
          
          if (recurringTheme && recurringTheme[1] >= 2) {
            const userName = user.full_name?.split(' ')[0] || 'friend';
            suggestionTitle = "A Theme Worth Exploring";
            suggestionMessage = `${userName}, I've noticed '${recurringTheme[0]}' coming up ${recurringTheme[1]} times recently in your reflections.\n\nWhat if we went deeper? I'm curious what new insights might emerge if you explore this theme intentionally.`;
            promptAction = `Help me explore the theme of ${recurringTheme[0]}`;
            priority = 7;
            basedOn = `Recurring theme: ${recurringTheme[0]} (${recurringTheme[1]}x)`;
            suggestionType = 'insight';
          }
        }
        // Existing Scenario: Detect recurring emotional pattern
        else if (emotionalPatterns.length >= 2) {
          const recentPattern = emotionalPatterns[0];
          const userName = user.full_name?.split(' ')[0] || 'friend';
          
          suggestionTitle = "I've Noticed a Pattern";
          suggestionMessage = `${userName}, I've been reflecting on our conversations. I notice ${recentPattern.pattern_type} keeps coming up for you.\n\nWould it help to explore what's beneath that pattern? Sometimes awareness is the first step to shifting it.`;
          promptAction = `Help me understand why ${recentPattern.pattern_type} keeps showing up`;
          priority = 9;
          basedOn = `Emotional pattern: ${recentPattern.pattern_type}`;
          suggestionType = 'insight';
        }
        // Scenario 2: No journal in 7+ days
        else if (daysSinceLastJournal >= 7) {
          const userName = user.full_name?.split(' ')[0] || 'friend';
          const goalMemory = memories.find(m => m.memory_type === 'goal');
          
          suggestionTitle = "Time to Check In";
          suggestionMessage = `${userName}, it's been a while since we last connected. ${
            goalMemory 
              ? `I'm curious how you're doing with ${goalMemory.content}.` 
              : "I'm wondering what's alive for you right now."
          }\n\nSometimes just a few minutes of reflection can bring clarity. What's on your mind?`;
          promptAction = "Let me journal about what I'm feeling today";
          priority = 7;
          basedOn = `Inactivity: ${daysSinceLastJournal} days since last journal`;
        }
        // Scenario 3: Follow up on recent challenge
        else if (memories.some(m => m.memory_type === 'challenge' && 
                  (Date.now() - new Date(m.created_date).getTime()) < 7 * 24 * 60 * 60 * 1000)) {
          const challengeMemory = memories.find(m => m.memory_type === 'challenge');
          const userName = user.full_name?.split(' ')[0] || '';
          
          suggestionTitle = "Checking In on Your Journey";
          suggestionMessage = `${userName}, I've been thinking about what you shared - ${challengeMemory.content}.\n\nHow are you feeling about that now? Sometimes it helps to pause and notice what's shifted.`;
          promptAction = `Reflect on ${challengeMemory.content}`;
          priority = 8;
          basedOn = `Follow-up on recent challenge`;
        }
        // Scenario 4: Insight-based prompt
        else if (memories.some(m => m.memory_type === 'insight')) {
          const insightMemory = memories.find(m => m.memory_type === 'insight');
          const userName = user.full_name?.split(' ')[0] || '';
          
          suggestionTitle = "Building on Your Insight";
          suggestionMessage = `${userName}, remember when you realized ${insightMemory.content}?\n\nThat was powerful. I'm curious - what actions have grown from that awareness?`;
          promptAction = "Tell you what I've done with that insight";
          priority = 6;
          basedOn = `Building on insight: ${insightMemory.content}`;
        }
        
        if (suggestionMessage) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 5); // Expires in 5 days
          
          await base44.asServiceRole.entities.ProactiveSuggestion.create({
            chatbot_name: 'Hannah',
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
          
          suggestionsCreated.push({ user: user.email, type: 'Hannah' });
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