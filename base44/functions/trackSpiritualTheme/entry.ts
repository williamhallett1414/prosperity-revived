import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { theme_name, secondary_themes, emotional_tone, scriptures } = await req.json();
    
    if (!theme_name) {
      return Response.json({ error: 'Theme name is required' }, { status: 400 });
    }
    
    // Check if this theme already exists for user
    const existingThemes = await base44.entities.SpiritualThemeInsight.filter({
      created_by: user.email,
      theme_name
    });
    
    const now = new Date().toISOString();
    
    if (existingThemes.length > 0) {
      // Update existing theme
      const theme = existingThemes[0];
      const newEmotions = theme.associated_emotions || [];
      if (emotional_tone && !newEmotions.includes(emotional_tone)) {
        newEmotions.push(emotional_tone);
      }
      
      const newScriptures = theme.key_scriptures || [];
      if (scriptures) {
        scriptures.forEach(scripture => {
          if (!newScriptures.includes(scripture)) {
            newScriptures.push(scripture);
          }
        });
      }
      
      // Determine growth progression based on frequency
      let progression = 'emerging';
      const newCount = theme.frequency_count + 1;
      if (newCount >= 15) progression = 'breakthrough';
      else if (newCount >= 8) progression = 'maturing';
      else if (newCount >= 3) progression = 'developing';
      
      await base44.entities.SpiritualThemeInsight.update(theme.id, {
        frequency_count: newCount,
        last_explored: now,
        associated_emotions: newEmotions.slice(-10), // Keep last 10
        key_scriptures: newScriptures.slice(-15), // Keep last 15
        growth_progression: progression
      });
    } else {
      // Create new theme
      await base44.entities.SpiritualThemeInsight.create({
        theme_name,
        frequency_count: 1,
        first_explored: now,
        last_explored: now,
        associated_emotions: emotional_tone ? [emotional_tone] : [],
        key_scriptures: scriptures || [],
        growth_progression: 'emerging'
      });
    }
    
    // Also track secondary themes
    if (secondary_themes && Array.isArray(secondary_themes)) {
      for (const secondaryTheme of secondary_themes) {
        const existing = await base44.entities.SpiritualThemeInsight.filter({
          created_by: user.email,
          theme_name: secondaryTheme
        });
        
        if (existing.length > 0) {
          await base44.entities.SpiritualThemeInsight.update(existing[0].id, {
            frequency_count: existing[0].frequency_count + 1,
            last_explored: now
          });
        } else {
          await base44.entities.SpiritualThemeInsight.create({
            theme_name: secondaryTheme,
            frequency_count: 1,
            first_explored: now,
            last_explored: now,
            growth_progression: 'emerging'
          });
        }
      }
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});