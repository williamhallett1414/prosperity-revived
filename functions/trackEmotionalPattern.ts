import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { emotional_tone, intensity_level, spiritual_theme, context } = await req.json();
    
    if (!emotional_tone) {
      return Response.json({ error: 'Emotional tone is required' }, { status: 400 });
    }
    
    // Check if this emotional pattern already exists
    const existingPatterns = await base44.entities.EmotionalPattern.filter({
      created_by: user.email,
      emotional_tone
    });
    
    const now = new Date().toISOString();
    
    if (existingPatterns.length > 0) {
      // Update existing pattern
      const pattern = existingPatterns[0];
      const relatedThemes = pattern.related_spiritual_themes || [];
      if (spiritual_theme && !relatedThemes.includes(spiritual_theme)) {
        relatedThemes.push(spiritual_theme);
      }
      
      const triggers = pattern.contextual_triggers || [];
      if (context && !triggers.includes(context)) {
        triggers.push(context);
      }
      
      await base44.entities.EmotionalPattern.update(pattern.id, {
        occurrence_count: pattern.occurrence_count + 1,
        last_detected: now,
        intensity_level: intensity_level || pattern.intensity_level,
        related_spiritual_themes: relatedThemes.slice(-10),
        contextual_triggers: triggers.slice(-10)
      });
    } else {
      // Create new pattern
      await base44.entities.EmotionalPattern.create({
        emotional_tone,
        intensity_level: intensity_level || 'moderate',
        occurrence_count: 1,
        first_detected: now,
        last_detected: now,
        related_spiritual_themes: spiritual_theme ? [spiritual_theme] : [],
        contextual_triggers: context ? [context] : []
      });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});