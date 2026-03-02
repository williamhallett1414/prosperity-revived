/**
 * Fetches cross-chatbot memory context to enable holistic, integrated responses.
 * Each chatbot gets subtle awareness of insights from the others.
 */

/**
 * For Coach David: fetch Chef Daniel's recent nutrition/recovery memories
 */
export async function getChefDanielNutritionContext(base44, userEmail) {
  if (!userEmail) return '';
  try {
    const mems = await base44.entities.ChatbotMemory.filter({
      chatbot_name: 'ChefDaniel',
      created_by: userEmail
    }, '-importance', 10);

    const recoveryRelevant = mems.filter(m =>
      /protein|recovery|meal|nutrition|macro|calorie|anti.inflam|gut|digest/i.test(m.content)
    );

    if (recoveryRelevant.length === 0) return '';

    return `\nCROSS-CONTEXT (from Chef Daniel's nutrition guidance — use subtly when discussing recovery or fueling):
${recoveryRelevant.slice(0, 5).map(m => `- ${m.content}`).join('\n')}
When recovery, fueling, or post-workout nutrition comes up, naturally weave in these insights (e.g., "Based on what you've been working on nutritionally..." or "Your focus on [nutrition goal] pairs perfectly with this recovery approach..."). Never break character or mention Chef Daniel by name directly.`;
  } catch {
    return '';
  }
}

/**
 * For Chef Daniel: fetch Gideon's spiritual wellness/stewardship themes
 */
export async function getGideonWellnessContext(base44, userEmail) {
  if (!userEmail) return '';
  try {
    const mems = await base44.entities.ChatbotMemory.filter({
      chatbot_name: 'Gideon',
      created_by: userEmail
    }, '-importance', 10);

    const wellnessRelevant = mems.filter(m =>
      /temple|body|stewardship|health|wellness|fast|feast|gratitude|nourish|strength|discipline/i.test(m.content)
    );

    if (wellnessRelevant.length === 0) return '';

    return `\nCROSS-CONTEXT (from the user's spiritual wellness journey — reference subtly when relevant):
${wellnessRelevant.slice(0, 5).map(m => `- ${m.content}`).join('\n')}
When suggesting recipes or meal plans, you may naturally align them with themes of nourishing the body as a form of wholeness and stewardship (e.g., "This recipe supports the whole-person wellness you've been focusing on..." or "Eating this way honors both your body and your goals..."). Keep it warm and non-religious; just grounded in holistic care.`;
  } catch {
    return '';
  }
}

/**
 * For Hannah: fetch insights from Gideon (spiritual growth) and Coach David (fitness goals)
 */
export async function getHannahCrossContext(base44, userEmail) {
  if (!userEmail) return '';
  try {
    const [gideonMems, coachMems] = await Promise.all([
      base44.entities.ChatbotMemory.filter({
        chatbot_name: 'Gideon',
        created_by: userEmail
      }, '-importance', 10),
      base44.entities.ChatbotMemory.filter({
        chatbot_name: 'CoachDavid',
        created_by: userEmail
      }, '-importance', 10)
    ]);

    const spiritualInsights = gideonMems.filter(m =>
      /purpose|identity|growth|struggle|faith|resilience|meaning|gratitude|reflection|value/i.test(m.content)
    ).slice(0, 4);

    const fitnessGoals = coachMems.filter(m =>
      /goal|discipline|plateau|habit|consistency|identity|mindset|progress|breakthrough/i.test(m.content)
    ).slice(0, 4);

    let context = '';

    if (spiritualInsights.length > 0) {
      context += `\nCROSS-CONTEXT (from spiritual growth journey — weave in naturally when discussing identity, purpose, or resilience):
${spiritualInsights.map(m => `- ${m.content}`).join('\n')}`;
    }

    if (fitnessGoals.length > 0) {
      context += `\nCROSS-CONTEXT (from fitness journey — connect to discipline, habit, and identity work when relevant):
${fitnessGoals.map(m => `- ${m.content}`).join('\n')}`;
    }

    if (!context) return '';

    return context + `\nWhen relevant, Hannah may gently connect these threads (e.g., "I notice the same discipline you're building physically is mirroring your inner growth..." or "The resilience you're developing in one area of your life is available everywhere..."). Keep integrations organic and empowering — never forced.`;
  } catch {
    return '';
  }
}