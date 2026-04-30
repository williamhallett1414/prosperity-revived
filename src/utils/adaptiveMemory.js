/**
 * Adaptive AI Memory System (v2 — ChatbotMemory approach)
 * 
 * Mirrors the Prosperity Revived Teens app architecture:
 * - Each chatbot saves key memories to ChatbotMemory entity
 * - Cross-chatbot context lets avatars reference each other's insights
 * - LLM extracts memories inline as part of the response prompt
 * - No separate extraction step — memories are saved during conversation
 */

import { base44 } from '@/api/base44Client';
import {
  getChefDanielNutritionContext,
  getGideonWellnessContext,
  getHannahCrossContext,
} from '@/components/chatbot/CrossChatbotContext';

// ── Cache ────────────────────────────────────────────────────────────────────
let memoriesCache = {};
let cacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 min

// ── Load memories for a specific chatbot ─────────────────────────────────────
export async function getChatbotMemories(chatbotName) {
  const now = Date.now();
  const key = chatbotName;
  if (memoriesCache[key] && now - cacheTime < CACHE_TTL) return memoriesCache[key];

  try {
    const mems = await base44.entities.ChatbotMemory.filter(
      { chatbot_name: chatbotName },
      '-importance',
      20
    );
    memoriesCache[key] = mems;
    cacheTime = now;
    console.log(`[Memory] ✅ Loaded ${mems.length} memories for ${chatbotName}`);
    return mems;
  } catch (e) {
    console.warn('[Memory] ❌ Failed to load:', e);
    return [];
  }
}

// ── Build memory context for system prompt ───────────────────────────────────
export function buildMemoryContext(memories) {
  if (!memories || memories.length === 0) return '';

  const lines = memories
    .slice(0, 15)
    .map(m => `- [${m.category || 'note'}] ${m.content}`)
    .join('\n');

  return `\n\nWHAT YOU REMEMBER ABOUT THIS USER (from past conversations):
${lines}

Use these memories naturally — like a caring friend who remembers. Reference their goals, struggles, and wins when relevant. Never list these back or say "I remember that you..." — just weave the knowledge into your responses organically.`;
}

// ── Get cross-chatbot context ────────────────────────────────────────────────
export async function getCrossContext(characterKey, userEmail) {
  try {
    switch (characterKey) {
      case 'coach':
        return await getChefDanielNutritionContext(base44, userEmail);
      case 'chef':
        return await getGideonWellnessContext(base44, userEmail);
      case 'hannah':
        return await getHannahCrossContext(base44, userEmail);
      default:
        return '';
    }
  } catch {
    return '';
  }
}

// ── Save a memory after conversation ─────────────────────────────────────────
export async function saveMemories(messages, chatbotName) {
  if (!messages || messages.length < 4) return; // Need real conversation

  try {
    // Build the conversation for LLM extraction
    const convoText = messages.slice(-16)
      .map(m => `${m.role === 'user' ? 'User' : chatbotName}: ${m.content.substring(0, 300)}`)
      .join('\n');

    const extractPrompt = `Analyze this conversation and extract 1-3 key insights about the USER (not the assistant). Focus on: goals they mentioned, struggles they shared, wins they celebrated, preferences they expressed, emotions they showed, life events they mentioned, or habits/beliefs they revealed.

Return ONLY a JSON array of objects. Each object must have:
- "content": a concise 1-sentence insight about the user
- "category": one of: goal, struggle, win, preference, life_event, emotion, habit, belief, relationship
- "importance": 1-10 score (10 = life-changing insight, 5 = useful detail, 1 = minor preference)

If no meaningful insights, return [].
No markdown, no explanation — ONLY the JSON array.

CONVERSATION:
${convoText}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: extractPrompt,
      add_context_from_internet: false,
    });

    let insights;
    try {
      const cleaned = result.replace(/```json|```/g, '').trim();
      insights = JSON.parse(cleaned);
    } catch {
      console.warn('[Memory] ❌ Failed to parse:', result?.substring?.(0, 100));
      return;
    }

    if (!Array.isArray(insights) || insights.length === 0) return;

    // Save each insight as a ChatbotMemory record
    const botNameMap = {
      'Gideon': 'Gideon',
      'Hannah': 'Hannah',
      'Coach David': 'CoachDavid',
      'Chef Daniel': 'ChefDaniel',
      'Coach Paul': 'CoachPaul',
    };
    const dbName = botNameMap[chatbotName] || chatbotName;

    for (const insight of insights.slice(0, 3)) {
      if (!insight.content) continue;
      await base44.entities.ChatbotMemory.create({
        chatbot_name: dbName,
        content: insight.content.substring(0, 500),
        category: insight.category || 'note',
        importance: Math.min(10, Math.max(1, insight.importance || 5)),
      });
    }

    // Invalidate cache
    delete memoriesCache[dbName];
    console.log(`[Memory] ✅ Saved ${insights.length} memories for ${dbName}`);
  } catch (e) {
    console.warn('[Memory] ❌ Save failed:', e);
  }
}

// ── Legacy compatibility — getUserMemory wrapper ─────────────────────────────
export async function getUserMemory() {
  return null; // Replaced by getChatbotMemories
}
