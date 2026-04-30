/**
 * Adaptive AI Memory System
 * 
 * After each chat conversation, this module:
 * 1. Sends the conversation to the LLM with an extraction prompt
 * 2. The LLM identifies new insights about the user
 * 3. Those insights are merged into the UserMemory entity
 * 
 * Before each conversation, buildMemoryContext() generates a
 * context string that the avatar's system prompt uses to
 * personalize responses.
 */

import { base44 } from '@/api/base44Client';

// ── Load or create user memory ──────────────────────────────────────────────
let memoryCache = null;
let memoryCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min cache

export async function getUserMemory() {
  const now = Date.now();
  if (memoryCache && now - memoryCacheTime < CACHE_TTL) return memoryCache;

  try {
    const memories = await base44.entities.UserMemory.list('-updated_date', 1);
    if (memories.length > 0) {
      memoryCache = memories[0];
      memoryCacheTime = now;
      console.log('[Memory] ✅ Loaded existing memory, interaction_count:', memoryCache.interaction_count || 0);
      return memoryCache;
    }
    // Create first memory record
    const newMem = await base44.entities.UserMemory.create({
      interaction_count: 0,
      last_updated: new Date().toISOString(),
    });
    memoryCache = newMem;
    memoryCacheTime = now;
    console.log('[Memory] ✅ Created new memory record');
    return newMem;
  } catch (e) {
    console.warn('[Memory] ❌ Failed to load:', e);
    return null;
  }
}

// ── Build context string for system prompt ──────────────────────────────────
export function buildMemoryContext(memory) {
  if (!memory) return '';

  const sections = [
    memory.communication_style && `Communication style: ${memory.communication_style}`,
    memory.emotional_patterns && `Emotional patterns: ${memory.emotional_patterns}`,
    memory.spiritual_maturity && `Spiritual maturity: ${memory.spiritual_maturity}`,
    memory.fitness_observations && `Fitness notes: ${memory.fitness_observations}`,
    memory.nutrition_observations && `Nutrition notes: ${memory.nutrition_observations}`,
    memory.life_events && `Life events: ${memory.life_events}`,
    memory.goals_mentioned && `Goals: ${memory.goals_mentioned}`,
    memory.struggles_mentioned && `Struggles: ${memory.struggles_mentioned}`,
    memory.wins_celebrated && `Wins: ${memory.wins_celebrated}`,
    memory.favorite_topics && `Favorite topics: ${memory.favorite_topics}`,
    memory.conversation_preferences && `Preferences: ${memory.conversation_preferences}`,
  ].filter(Boolean);

  if (sections.length === 0) return '';

  return `\n\nADAPTIVE MEMORY (learned from past conversations — use naturally, never recite back):
${sections.join('\n')}

Use this knowledge to personalize your responses. Reference things you've learned naturally, like a friend who remembers. Anticipate their needs based on patterns. If they mentioned a struggle before, gently check in. If they celebrated a win, build on it.`;
}

// ── Extract insights after a conversation ───────────────────────────────────
const EXTRACTION_PROMPT = `You are an insight extraction engine. Analyze this conversation and extract NEW insights about the user. Only include things that are genuinely new or updated — don't repeat what's already known.

Return a JSON object with ONLY the fields that have new information (omit fields with no new data):
{
  "communication_style": "how they prefer to talk (direct, gentle, humorous, detailed, brief)",
  "emotional_patterns": "stress triggers, joy sources, coping mechanisms, mood tendencies",
  "spiritual_maturity": "faith level, Bible comfort, prayer life, church involvement",
  "fitness_observations": "workout preferences, limitations, progress, motivation",
  "nutrition_observations": "food preferences, cooking skill, dietary struggles",
  "life_events": "relationships, work, losses, celebrations mentioned",
  "goals_mentioned": "specific goals stated",
  "struggles_mentioned": "challenges or pain points",
  "wins_celebrated": "achievements or breakthroughs shared",
  "favorite_topics": "topics they return to or light up about",
  "conversation_preferences": "how they want to be coached"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation. If no new insights, return {}.`;

export async function extractAndSaveInsights(messages, avatarName) {
  if (!messages || messages.length < 3) return; // Need at least a real exchange

  try {
    const memory = await getUserMemory();
    if (!memory) return;

    // Build conversation text (last 20 messages max)
    const convoText = messages.slice(-20)
      .map(m => `${m.role === 'user' ? 'User' : avatarName}: ${m.content}`)
      .join('\n');

    // Include existing memory so LLM knows what's already known
    const existingContext = buildMemoryContext(memory);
    const existingNote = existingContext
      ? `\n\nALREADY KNOWN ABOUT THIS USER:${existingContext}\n\nOnly extract NEW information not already captured above.`
      : '';

    // Call LLM to extract insights
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${EXTRACTION_PROMPT}${existingNote}\n\nCONVERSATION WITH ${avatarName.toUpperCase()}:\n${convoText}`,
      add_context_from_internet: false,
    });

    // Parse the JSON response
    let insights;
    try {
      const cleaned = result.replace(/```json|```/g, '').trim();
      insights = JSON.parse(cleaned);
    } catch {
      console.warn('[Memory] ❌ Failed to parse insights:', result?.substring?.(0, 200));
      return;
    }

    // Merge insights — append new info to existing fields
    if (Object.keys(insights).length === 0) return;

    const updates = {};
    const mergeFields = [
      'communication_style', 'emotional_patterns', 'spiritual_maturity',
      'fitness_observations', 'nutrition_observations', 'life_events',
      'goals_mentioned', 'struggles_mentioned', 'wins_celebrated',
      'favorite_topics', 'conversation_preferences',
    ];

    for (const field of mergeFields) {
      if (insights[field]) {
        const existing = memory[field] || '';
        if (existing) {
          // Append new insight, keep total under 500 chars per field
          const merged = `${existing}. ${insights[field]}`;
          updates[field] = merged.length > 500 ? merged.slice(-500) : merged;
        } else {
          updates[field] = insights[field].slice(0, 500);
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.last_updated = new Date().toISOString();
      updates.interaction_count = (memory.interaction_count || 0) + 1;

      // Add to raw insights log
      const timestamp = new Date().toLocaleDateString();
      const newInsight = `[${timestamp} ${avatarName}] ${JSON.stringify(insights)}`;
      const rawLog = memory.raw_insights || '';
      updates.raw_insights = (rawLog + '\n' + newInsight).slice(-2000); // Keep last 2000 chars

      await base44.entities.UserMemory.update(memory.id, updates);
      memoryCache = { ...memory, ...updates };
      memoryCacheTime = Date.now();
      console.log('[Memory] ✅ Updated with', Object.keys(updates).length, 'fields:', Object.keys(updates).filter(k => k !== 'last_updated' && k !== 'interaction_count' && k !== 'raw_insights').join(', '));
    }
  } catch (e) {
    console.warn('[Memory] ❌ Extraction failed:', e);
  }
}
