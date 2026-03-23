import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const users = await base44.asServiceRole.entities.User.list();
    const suggestionsCreated = [];
    
    for (const user of users) {
      try {
        // Get spiritual data
        const recentPrayers = await base44.asServiceRole.entities.PrayerJournal.filter({
          created_by: user.email
        }, '-created_date', 10);
        
        const recentJournals = await base44.asServiceRole.entities.JournalEntry.filter({
          created_by: user.email,
          entry_type: ['prayer', 'scripture_reflection', 'reflection']
        }, '-created_date', 10);
        
        const readingProgress = await base44.asServiceRole.entities.ReadingPlanProgress.filter({
          created_by: user.email
        }, '-created_date', 1);
        
        const bookmarks = await base44.asServiceRole.entities.Bookmark.filter({
          created_by: user.email
        }, '-created_date', 10);
        
        const spiritualGoals = await base44.asServiceRole.entities.SpiritualGoal.filter({
          created_by: user.email,
          status: 'active'
        }, '-created_date', 5);
        
        const memories = await base44.asServiceRole.entities.ChatbotMemory.filter({
          chatbot_name: 'Gideon',
          created_by: user.email
        }, '-importance', 10);
        
        const spiritualThemes = await base44.asServiceRole.entities.SpiritualThemeInsight.filter({
          created_by: user.email
        }, '-created_date', 5);
        
        // Check existing suggestions
        const existingSuggestions = await base44.asServiceRole.entities.ProactiveSuggestion.filter({
          chatbot_name: 'Gideon',
          user_email: user.email,
          is_read: false
        });
        
        if (existingSuggestions.length > 0) continue;
        
        let suggestionMessage = null;
        let suggestionTitle = null;
        let promptAction = null;
        let priority = 5;
        let basedOn = null;
        let suggestionType = 'encouragement';
        
        const userName = user.full_name?.split(' ')[0] || 'friend';
        
        // Scenario 1: Daily Scripture meditation based on past reflections
        if (recentJournals.length >= 2 || recentPrayers.length >= 2) {
          // Analyze themes from journals and prayers
          const allContent = [
            ...recentJournals.map(j => j.content || ''),
            ...recentPrayers.map(p => p.content || '')
          ].join(' ').toLowerCase();
          
          let suggestedVerse = null;
          let theme = null;
          
          if (allContent.includes('anxious') || allContent.includes('worry') || allContent.includes('fear')) {
            suggestedVerse = { ref: 'Philippians 4:6-7', theme: 'anxiety and worry' };
          } else if (allContent.includes('strength') || allContent.includes('weak') || allContent.includes('tired')) {
            suggestedVerse = { ref: 'Isaiah 40:31', theme: 'strength and renewal' };
          } else if (allContent.includes('lonely') || allContent.includes('alone') || allContent.includes('isolated')) {
            suggestedVerse = { ref: 'Deuteronomy 31:6', theme: 'God\'s presence' };
          } else if (allContent.includes('joy') || allContent.includes('grateful') || allContent.includes('thankful')) {
            suggestedVerse = { ref: 'Psalm 118:24', theme: 'joy and gratitude' };
          } else if (allContent.includes('guidance') || allContent.includes('decision') || allContent.includes('wisdom')) {
            suggestedVerse = { ref: 'Proverbs 3:5-6', theme: 'guidance and wisdom' };
          } else if (allContent.includes('forgive') || allContent.includes('guilt') || allContent.includes('shame')) {
            suggestedVerse = { ref: '1 John 1:9', theme: 'forgiveness and grace' };
          }
          
          if (suggestedVerse) {
            suggestionTitle = "A Word for Your Heart";
            suggestionMessage = `${userName}, I've been reflecting on your recent prayers and journal entries, especially your thoughts on ${suggestedVerse.theme}.\n\nI believe ${suggestedVerse.ref} speaks directly to what you're walking through. Would you like to meditate on it together?`;
            promptAction = `Help me reflect on ${suggestedVerse.ref}`;
            priority = 9;
            basedOn = `Spiritual theme analysis: ${suggestedVerse.theme}`;
            suggestionType = 'insight';
          }
        }
        
        // Scenario 2: Reading plan encouragement
        if (!suggestionMessage && readingProgress.length > 0) {
          const plan = readingProgress[0];
          const completedDays = plan.completed_days?.length || 0;
          const totalDays = plan.total_days || 1;
          const progress = (completedDays / totalDays) * 100;
          
          if (progress >= 75 && progress < 100) {
            suggestionTitle = "You're Almost There!";
            suggestionMessage = `${userName}, you're ${Math.round(progress)}% through "${plan.plan_name}"! The finish line is in sight.\n\nYou've been so faithful. How has this reading plan been speaking to you? What's one thing God has shown you through it?`;
            promptAction = `Share what I've learned from ${plan.plan_name}`;
            priority = 8;
            basedOn = `Reading plan progress: ${Math.round(progress)}% complete`;
            suggestionType = 'encouragement';
          } else if (progress < 30 && completedDays >= 3) {
            suggestionTitle = "Keep the Momentum";
            suggestionMessage = `${userName}, you've started "${plan.plan_name}" strong with ${completedDays} days completed!\n\nThe beginning is often the hardest part. What would help you stay consistent? Should we adjust the plan or find a rhythm that works better for you?`;
            promptAction = "Help me stay consistent with my reading plan";
            priority = 7;
            basedOn = `Reading plan early stage: ${completedDays} days completed`;
            suggestionType = 'check_in';
          }
        }
        
        // Scenario 3: Bookmark reflection - revisit saved verses
        if (!suggestionMessage && bookmarks.length >= 3) {
          const oldestBookmark = bookmarks[bookmarks.length - 1];
          const daysSince = Math.floor((Date.now() - new Date(oldestBookmark.created_date).getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSince >= 14 && daysSince <= 60) {
            suggestionTitle = "Revisiting a Special Verse";
            suggestionMessage = `${userName}, remember when you bookmarked ${oldestBookmark.book} ${oldestBookmark.chapter}:${oldestBookmark.verse}? ${
              oldestBookmark.note ? `You wrote: "${oldestBookmark.note}"\n\n` : ''
            }It's been ${daysSince} days. How does that verse speak to you now? Sometimes God's Word reveals new layers as we grow.`;
            promptAction = `Reflect on ${oldestBookmark.book} ${oldestBookmark.chapter}:${oldestBookmark.verse} again`;
            priority = 7;
            basedOn = `Bookmarked verse revisit: ${oldestBookmark.book} ${oldestBookmark.chapter}:${oldestBookmark.verse}`;
            suggestionType = 'insight';
          }
        }
        
        // Scenario 4: Spiritual goal check-in
        if (!suggestionMessage && spiritualGoals.length > 0) {
          const goal = spiritualGoals[0];
          const daysSinceCreated = Math.floor((Date.now() - new Date(goal.created_date).getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceCreated >= 7 && daysSinceCreated <= 30) {
            suggestionTitle = "How's Your Spiritual Goal?";
            suggestionMessage = `${userName}, you set a goal to grow in ${goal.category}: "${goal.title}".\n\nHow's it going? Are you seeing God work in this area? Sometimes the growth is subtle but powerful.`;
            promptAction = `Update you on my progress with ${goal.title}`;
            priority = 7;
            basedOn = `Spiritual goal check-in: ${goal.title} (${goal.category})`;
            suggestionType = 'check_in';
          }
        }
        
        // Scenario 5: Answered prayer celebration
        if (!suggestionMessage && recentPrayers.length > 0) {
          const answeredPrayers = recentPrayers.filter(p => p.answered === true);
          
          if (answeredPrayers.length >= 1) {
            const answeredPrayer = answeredPrayers[0];
            suggestionTitle = "Celebrating God's Faithfulness";
            suggestionMessage = `${userName}, I see God answered your prayer! ${answeredPrayer.title ? `"${answeredPrayer.title}"` : 'That prayer you prayed'} - He came through!\n\nPausing to celebrate answered prayers strengthens our faith. How did you see God's hand in this?`;
            promptAction = "Share how God answered my prayer";
            priority = 9;
            basedOn = `Answered prayer celebration`;
            suggestionType = 'encouragement';
          }
        }
        
        // Scenario 6: Theme-based spiritual insight
        if (!suggestionMessage && spiritualThemes.length >= 2) {
          const dominantTheme = spiritualThemes[0];
          
          suggestionTitle = "A Pattern in Your Journey";
          suggestionMessage = `${userName}, I've noticed ${dominantTheme.theme_name} has been a recurring theme in your spiritual walk.\n\nGod often uses patterns to teach us deeper truths. What do you think He might be inviting you into through this theme?`;
          promptAction = `Explore what God is teaching me through ${dominantTheme.theme_name}`;
          priority = 8;
          basedOn = `Spiritual theme insight: ${dominantTheme.theme_name}`;
          suggestionType = 'insight';
        }
        
        // Fallback: General encouragement
        if (!suggestionMessage) {
          const dayOfWeek = new Date().getDay();
          if (dayOfWeek === 0) { // Sunday
            suggestionTitle = "Sabbath Rest";
            suggestionMessage = `${userName}, it's the Sabbath - a gift from God for rest and renewal.\n\nHow can you honor this day? What would it look like to truly rest in God's presence today?`;
            promptAction = "Help me make today a true Sabbath";
            priority = 6;
            basedOn = "Sunday Sabbath encouragement";
            suggestionType = 'encouragement';
          } else if (dayOfWeek === 1) { // Monday
            suggestionTitle = "Start Your Week with God";
            suggestionMessage = `${userName}, new week, new mercies! Monday is a chance to set the tone.\n\nWhat's one way you can invite God into your week from the very start?`;
            promptAction = "Help me start this week with intention";
            priority = 5;
            basedOn = "Monday week starter";
            suggestionType = 'encouragement';
          }
        }
        
        if (suggestionMessage) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 5);
          
          await base44.asServiceRole.entities.ProactiveSuggestion.create({
            chatbot_name: 'Gideon',
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
          
          suggestionsCreated.push({ user: user.email, type: 'Gideon' });
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