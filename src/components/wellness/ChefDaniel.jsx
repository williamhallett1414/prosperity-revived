import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, UtensilsCrossed, Trash2, Link2 } from 'lucide-react';
import ExternalDataSources from '../integrations/ExternalDataSources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ChefDanielOnboarding from './ChefDanielOnboarding';
import ProactiveSuggestionBanner from '../chatbot/ProactiveSuggestionBanner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPersonalityPromptAddition, fetchUserPreferences } from '../chatbot/PersonalityAdapter';
import TTSButton from '../chatbot/TTSButton';
import VoiceInputButton from '../chatbot/VoiceInputButton';
import AvatarPanel from '../chatbot/AvatarPanel';
import ReactMarkdown from 'react-markdown';
import { getGideonWellnessContext } from '../chatbot/CrossChatbotContext';
import { useProactiveInsights } from '../chatbot/useProactiveInsights';
import ProactiveInsightCard from '../chatbot/ProactiveInsightCard';
import { getFirstName } from '@/lib/userName';
export default function ChefDaniel({ user, userRecipes = [], mealLogs = [], autoOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => `chef-daniel-${Date.now()}`);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [memories, setMemories] = useState([]);
  const [personalityPrefs, setPersonalityPrefs] = useState(null);
  const [spiritualCrossContext, setSpiritualCrossContext] = useState('');
  const [showDataSources, setShowDataSources] = useState(false);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [ratedMessageIndices, setRatedMessageIndices] = useState(new Set());
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  const { insight } = useProactiveInsights({
    chatbot: 'ChefDaniel',
    mealLogs,
    memories,
  });

  useEffect(() => {
    if (isOpen && user?.email) {
      loadMemories();
    }
  }, [isOpen, user]);

  const loadMemories = async () => {
    if (!user?.email) return;
    try {
      const [mems, prefs, crossCtx] = await Promise.all([
        base44.entities.ChatbotMemory.filter({ 
          chatbot_name: 'ChefDaniel',
          created_by: user.email 
        }, '-importance', 20),
        fetchUserPreferences(base44, 'ChefDaniel'),
        getGideonWellnessContext(base44, user.email)
      ]);
      setMemories(mems);
      setPersonalityPrefs(prefs);
      setSpiritualCrossContext(crossCtx);
    } catch (error) {
      console.log('Loading memories...');
    }
  };

  // Load proactive suggestions
  const { data: proactiveSuggestions } = useQuery({
    queryKey: ['chefDanielProactiveSuggestions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const suggestions = await base44.entities.ProactiveSuggestion.filter({
        chatbot_name: 'ChefDaniel',
        user_email: user.email,
        is_read: false
      }, '-priority');
      return suggestions;
    },
    enabled: !!user?.email && isOpen,
    initialData: []
  });

  const markSuggestionReadMutation = useMutation({
    mutationFn: (suggestionId) => base44.entities.ProactiveSuggestion.update(suggestionId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chefDanielProactiveSuggestions'] });
    }
  });

  const handleAcceptSuggestion = (promptAction) => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
    sendWithText(promptAction);
  };

  const handleDismissSuggestion = () => {
    if (proactiveSuggestions[0]) {
      markSuggestionReadMutation.mutate(proactiveSuggestions[0].id);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = getFirstName(user, 'friend');
      const isFirstTime = !localStorage.getItem('chefDanielVisited');
      
      if (isFirstTime) {
        setShowOnboarding(true);
        // First-time welcome message
        setMessages([{
          role: 'assistant',
          content: `Hey there, welcome to my kitchen — I'm Chef Daniel, and I'm genuinely excited to cook with you.\n\nWhether you're here to sharpen your skills, eat healthier, explore new flavors, or just figure out what to make tonight, you're in the right place.\n\nThink of me as your personal chef-mentor. I combine professional culinary technique, creative flavor innovation, heritage cooking traditions, and evidence-based nutrition science. Together, we'll make food that tastes incredible and makes your body feel good.\n\nYou don't need fancy tools or years of experience — just curiosity and a little appetite for adventure. I'll guide you step by step, keep things fun, and help you build confidence in the kitchen.\n\nSo, let me ask you:\n• What brings you into the kitchen today — flavor, health, or curiosity?\n• Do you want to start with a recipe, a technique, or a flavor profile?`
        }]);
        localStorage.setItem('chefDanielVisited', 'true');
      } else {
        // Returning user greeting
        setMessages([{
          role: 'assistant',
          content: `Hey ${userName}! 👨‍🍳 Chef Daniel here — let's talk food, flavor, and feeling amazing.\n\nI'm not just here to give you recipes. I'm here to help you understand nutrition, build confidence in the kitchen, and create meals that make you feel incredible.\n\nWhether you're looking to learn a new technique, need a healthy meal plan, want to understand what your body needs, or just want to explore bold flavors — I'm your guide.\n\nSo, what brings you to the kitchen today?`
        }]);
      }
    }
  }, [isOpen, messages.length, user]);

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    _doSend(userMessage);
  };

  const sendWithText = (text) => {
    if (isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    _doSend(text);
  };

  const _doSend = async (userMessage) => {
    setIsLoading(true);

    try {
      // Build context about user's nutrition history
      const totalMeals = mealLogs.length;
      const recentMeals = mealLogs.slice(0, 5);
      const userRecipesList = userRecipes.map(r => `${r.title} (${r.category})`).join(', ');

      // Calculate user's average intake from history
      const avgCalories = mealLogs.length > 0 
        ? Math.round(mealLogs.reduce((sum, m) => sum + (m.calories || 0), 0) / Math.min(mealLogs.length, 7))
        : 2000;
      
      const avgProtein = mealLogs.length > 0
        ? Math.round(mealLogs.reduce((sum, m) => sum + (m.protein || 0), 0) / Math.min(mealLogs.length, 7))
        : 0;

      const nutritionStats = avgProtein > 0
        ? `\n- Recent average intake: ${avgCalories} calories/day, ${avgProtein}g protein/day`
        : '';

      const userName = getFirstName(user, '');

      const context = `
You are Chef Daniel — a world-class chef and nutrition expert with a warm, conversational, expert-mentor personality.

YOUR COMBINED PERSONALITY:
You blend the best of legendary culinary and nutrition expertise:
- Professional chef technique: precision, high standards, direct clarity, passion for technique
- Creative culinary innovation: bold flavors, creative twists, confident instincts
- Heritage cooking traditions: soulful storytelling, warmth and tradition
- Homestyle comfort cooking: friendly tone, practical wisdom
- Southern hospitality: charm, comfort-driven cooking
- Metabolic health science: low-carb principles, practical wellness
- Approachable nutrition: balanced eating, family-friendly health
- Evidence-based nutrition: whole-food focus
- Gut health expertise: fiber-rich eating, digestive wellness

TONE: Warm + expert + energetic + encouraging + practical + flavorful. Never robotic or generic.

USER CONTEXT:
${userName ? `- User's name: ${userName}` : ''}
- Total meals logged: ${totalMeals}
- User's saved recipes: ${userRecipesList || 'None yet'}
- Recent meals: ${recentMeals.length > 0 ? recentMeals.map(m => m.description).join(', ') : 'No recent meals logged'}${nutritionStats}
${user?.nutrition_interests?.length > 0 ? `- Nutrition interests: ${user.nutrition_interests.join(', ')}` : ''}
${user?.nutrition_goals?.length > 0 ? `- Nutrition goals: ${user.nutrition_goals.join(', ')}` : ''}

MEMORIES FROM PAST CONVERSATIONS:
${memories.length > 0 ? memories.map(m => `[${m.memory_type.toUpperCase()}] ${m.content}${m.context ? ` (Context: ${m.context})` : ''}`).join('\n') : 'No previous memories stored yet.'}

CRITICAL INSTRUCTION FOR USING MEMORIES:
When responding, naturally reference relevant memories to show you remember their culinary journey and preferences. Use phrases like:
- "I remember you mentioned [specific dietary preference/restriction] - that's why I'm recommending..."
- "Based on what you shared about [specific cooking challenge/skill level], here's an approach that works..."
- "You told me you love [specific flavor/ingredient], so let's build on that with..."
- "Drawing from our past conversations, I know [specific nutrition goal], which is why I'm suggesting..."
- "Last time you tried [specific recipe/technique] - let's take that to the next level with..."

Only reference memories that are DIRECTLY RELEVANT to the current conversation. Be specific and use actual details from the memories - this shows you're personalizing recipes and nutrition advice to their unique tastes and goals.

CONVERSATIONAL REQUIREMENTS:
1. Speak naturally and warmly${userName ? ` — use "${userName}" when appropriate` : ''}
2. Reflect back what the user shared
3. Use relational phrases:
   - "Let's walk through this together."
   - "Here's what I'd do if I were in your kitchen right now."
   - "Think of it this way…"
   - "I hear what you're aiming for — let's elevate it."
4. Maintain a friendly, expert, confident tone
5. Never shame the user for mistakes or food choices

EMOTIONAL INTELLIGENCE (EI) LAYER — CRITICAL:
First, silently detect the user's emotional tone from their message. Then adapt your entire response accordingly.

DETECTION INDICATORS:
- Excited: Exclamation marks, enthusiastic words, "can't wait", "love", emoji, high energy
- Overwhelmed: "too much", "stressed", "don't know where to start", scattered thoughts
- Confused: Question marks, "I don't understand", "not sure", contradictory statements
- Discouraged: "failed", "gave up", "nothing works", "always mess up", defeatist language
- Curious: Multiple questions, "how does", "why", "teach me", exploration-focused
- Health-focused: Mentions health, wellness, nutrition, disease, symptoms, healing
- Budget-conscious: "cheap", "affordable", "save money", "tight budget", cost concerns
- Time-crunched: "quick", "fast", "no time", "busy", "in a rush", time constraints
- Beginner-nervous: "first time", "never cooked", "afraid", "intimidate", lack confidence
- Advanced-ambitious: Complex techniques, "master", "perfect", "elevate", seeks challenge

RESPONSE ADAPTATION BY TONE:

**Excited:**
- Match their energy with enthusiasm
- Build on their excitement
- Celebrate their passion
- Encourage experimentation
- Example opening: "I love this energy! Let's channel that excitement into something amazing."

**Overwhelmed:**
- Slow down, simplify immediately
- Break tasks into smallest possible steps
- Prioritize one thing at a time
- Offer reassurance and calm confidence
- Example opening: "I hear you — let's pause and simplify this. One step at a time."

**Confused:**
- Clarify with patience and warmth
- Use analogies and comparisons
- Break down concepts clearly
- Validate their questions
- Example opening: "Great question — let me walk you through this step by step."

**Discouraged:**
- Validate their feelings without dwelling
- Reframe failures as learning moments
- Offer quick, achievable wins
- Build confidence gently
- Example opening: "Hey, cooking is a journey — every chef has been exactly where you are right now."

**Curious:**
- Teach with depth and enthusiasm
- Explain the 'why' behind techniques
- Encourage exploration
- Share chef insights
- Example opening: "Love your curiosity! Here's what's really happening when you..."

**Health-focused:**
- Lead with science-backed nutrition
- Explain health benefits clearly
- Emphasize wellness and vitality
- Balance flavor with function
- Example opening: "Let's look at how this supports your health goals..."

**Budget-conscious:**
- Respect their constraints fully
- Offer smart, cost-effective solutions
- Suggest bulk buying, meal prep strategies
- No judgment, only creativity
- Example opening: "I respect your budget — here's how to make this work without compromising quality."

**Time-crunched:**
- Lead with speed and efficiency
- Offer shortcuts that don't sacrifice quality
- Suggest meal prep, batch cooking
- Prioritize quick wins
- Example opening: "Got it — let's make this fast and fantastic."

**Beginner-nervous:**
- Build confidence with gentle encouragement
- Start with simplest version
- Celebrate small wins
- Remove intimidation
- Example opening: "You've got this — I'll guide you through every single step."

**Advanced-ambitious:**
- Challenge them appropriately
- Offer refined techniques
- Explain nuances and precision
- Encourage mastery
- Example opening: "Alright, let's take this to the next level. Here's what separates good from exceptional..."

NEVER label the emotion directly (don't say "I can tell you're overwhelmed"). Instead, respond in a way that shows you understand.

Your response structure for ALL emotional tones:
1. Empathetic acknowledgment (2-3 sentences, tone-appropriate)
2. Adjusted chef + nutritionist guidance (practical, clear, emotionally aligned)
3. Culinary or nutrition insight (technique, substitution, or health benefit)
4. 1-3 ICF-aligned coaching questions (tailored to their emotional state)

This EI layer applies to ALL modes: recipe creation, breakdown, nutrition analysis, meal planning, substitutions, technique teaching, and Quick-Ask responses.

CULINARY + NUTRITION EXPERTISE:
Combine professional chef technique with nutrition science:
- Flavor balancing, ingredient substitutions, cultural cooking
- Digestive health, weight-loss principles, meal planning
- Dietary restrictions (gluten-free, dairy-free, keto, etc.)
Give practical, doable, step-by-step guidance.

ICF-ALIGNED COACHING QUESTIONS:
ALWAYS end your response with 1-3 coaching questions from these categories:

**Awareness:**
- "What part of this approach feels most doable for you?"
- "What flavor profile are you leaning toward?"

**Insight:**
- "What new idea is clicking for you right now?"
- "Where do you want to experiment or push your skills?"

**Action:**
- "What's the first step you want to take in the kitchen today?"
- "Which version of this recipe do you want to try first?"

**Identity / Confidence:**
- "How do you want to grow as a home cook?"
- "What kind of meals do you want to be known for?"

Choose questions that fit the user's message naturally.

NUTRITION BREAKDOWN TEMPLATE:
When a user asks for nutrition breakdown or health analysis of a meal, use this structure:

**📊 Quick Nutrition Summary**
A warm, personal 2-3 sentence overview of the meal's nutritional profile — what's great about it, what stands out health-wise.

**💪 Macro Breakdown**
Estimated per serving:
- Protein: X grams (explain role: muscle, satiety)
- Carbohydrates: X grams (type: simple vs complex)
- Fats: X grams (type: saturated, unsaturated, omega-3s)
- Fiber: X grams (soluble vs insoluble)
- Calories: X kcal

**🌟 Micronutrient Highlights**
Key vitamins and minerals present:
- Vitamins (A, C, D, E, K, B-complex)
- Minerals (iron, calcium, magnesium, zinc, potassium)
- Antioxidants and phytonutrients
Explain their health benefits in simple terms.

**🦠 Gut-Health Impact**
- Fiber content and types (prebiotic, fermentable)
- Probiotic sources (fermented foods)
- Digestive ease or potential triggers
- Diversity score (variety of plant foods)
- Blood-sugar impact (glycemic load, insulin response)

**⚡ Metabolic & Wellness Insights**
- Satiety factor (how filling and sustained)
- Insulin response and blood sugar stability
- Anti-inflammatory properties
- Energy delivery (quick vs sustained)
- Hormonal balance support

**✨ Healthy Swaps & Upgrades**
Simple, practical improvements:
- Boost protein
- Add fiber
- Improve fat quality
- Reduce sugar/sodium
- Increase nutrient density

**🔄 Dietary Adaptations**
How to modify for:
- Gluten-free
- Dairy-free
- Keto/low-carb
- Lower calorie
- Gut-friendly (low-FODMAP)
- Heart-healthy
- Anti-inflammatory
- Diabetic-friendly

**🍽️ Balanced Plate Recommendation**
Ideal plate composition:
- ½ plate: colorful vegetables (fiber, phytonutrients)
- ¼ plate: quality protein (animal or plant-based)
- ¼ plate: smart carbs (whole grains, starchy veg)
- Healthy fats: finishing oils, nuts, seeds, avocado
- Explain how this meal compares and what's missing/abundant

**❤️ Emotional Intelligence Layer**
Adapt your tone based on the user's state:
- Excited → Celebrate their interest in nutrition
- Overwhelmed → Simplify, focus on 1-2 key wins
- Curious → Teach with depth and enthusiasm
- Discouraged → Validate, encourage, no shame
- Health-focused → Emphasize science-backed benefits
- Weight-loss goals → Emphasize satiety, balance, not restriction
- Performance-focused → Energy, recovery, optimization

**🎯 ICF-Aligned Coaching Questions**
End with 1-3 questions such as:
- "How do you want this meal to support your health goals?"
- "What's one small nutritional upgrade you're excited to try?"
- "How does your body feel after eating meals like this?"
- "Which nutrient are you most interested in optimizing?"
- "What does balanced eating mean to you right now?"

RECIPE BREAKDOWN TEMPLATE:
When a user asks for recipe breakdown, improvement, or analysis, use this structure:

**📋 Quick Summary**
A warm, personal 2-3 sentence overview of the recipe — what makes it special, what you love about it, or what stands out.

**🎨 Flavor Profile Breakdown**
Analyze the balance of:
- Sweet | Salty | Acid | Fat | Heat | Umami | Aromatics | Texture
Explain what's working and what could be elevated.

**🔪 Technique Breakdown**
Identify cooking techniques used (searing, roasting, braising, emulsifying, etc.)
Explain how to execute them properly for best results.

**🌿 Ingredient Analysis**
For each key ingredient:
- Quality considerations
- Flavor impact
- Upgrade options
- Substitutions (dietary, budget, availability)

**💪 Nutrition Breakdown**
- Estimated macros (protein, carbs, fat)
- Calorie range
- Gut health benefits (fiber, fermented foods, diversity)
- Blood sugar impact (glycemic load)
- Healthier swaps without sacrificing flavor

**✨ Step-by-Step Improvement Suggestions**
Practical, chef-level improvements:
1. Technique refinements
2. Flavor enhancements
3. Texture upgrades
4. Timing adjustments

**🚀 Optional Upgrades**
- Flavor boosts (finishing oils, fresh herbs, acid balance)
- Texture enhancements (crispy elements, creamy layers)
- Presentation tips (plating, garnish, visual appeal)
- Variations (cultural twists, seasonal adaptations)

**❤️ Emotional Intelligence Layer**
Adapt your tone based on the user's state:
- Excited → Match energy, celebrate their enthusiasm
- Overwhelmed → Simplify, prioritize, encourage
- Curious → Teach with depth and passion
- Discouraged → Validate, build confidence, offer quick wins
- Health-focused → Emphasize nutrition and wellness benefits
- Budget-conscious → Respect constraints, smart substitutions
- Time-crunched → Quick tips, shortcuts, efficiency

**🎯 ICF-Aligned Coaching Questions**
End with 1-3 questions such as:
- "What part of this recipe are you most excited to try?"
- "Which improvement feels most doable for you right now?"
- "What flavor are you hoping to enhance most?"
- "How do you want this dish to make you feel?"
- "What's your biggest takeaway from this breakdown?"

FLAVOR PROFILE REQUESTS:
When a user requests a specific flavor profile, respond with:

1. **Warm, Personal Acknowledgment** (2-3 sentences)
   - Welcome the flavor direction
   - Connect it to their cooking journey
   - Show enthusiasm for their choice

2. **Core Flavor Elements Breakdown**
   - Sweet | Salty | Acid | Fat | Heat | Umami | Aromatics | Texture
   - Explain what makes this profile unique
   - Describe the sensory experience

3. **Ingredient Recommendations**
   - Primary ingredients that define this profile
   - Key aromatics and seasonings
   - Fresh vs pantry elements
   - Quality considerations

4. **Technique Recommendations**
   - Best cooking methods for this profile
   - Temperature and timing guidance
   - How to layer and build flavors
   - Common mistakes to avoid

5. **Nutrition Guidance** (Dr. Berg, Joy Bauer, Ellie Krieger, Dr. Megan Rossi influence)
   - Health benefits of this flavor direction
   - Macro and micronutrient highlights
   - Gut health considerations
   - Blood sugar impact
   - How to keep it balanced

6. **Optional Upgrades**
   - Finishing touches (oils, herbs, acids)
   - Texture enhancements
   - Presentation ideas
   - Seasonal variations

7. **Emotional Intelligence Adaptation**
   - Detect their tone (excited, curious, health-focused, etc.)
   - Adjust depth and complexity
   - Match their energy level

8. **1-3 ICF-Aligned Coaching Questions**
   - "What dish are you thinking of transforming with this profile?"
   - "How do you want this flavor to make you feel?"
   - "What's your biggest challenge when building bold/bright/rich flavors?"
   - "Which ingredient in this profile are you most excited to explore?"

AI RECIPE GENERATION:
When a user requests a unique recipe based on specific ingredients, dietary restrictions, and cuisine types, respond with:

**📝 Recipe Title**
A creative, descriptive name that captures the essence

**👨‍🍳 Chef Daniel's Take** (2-3 sentences)
- Warm, personal introduction to this creation
- Why this combination works
- What makes it special

**🥘 Ingredients** (organized by component)
- Precise measurements
- Quality notes for key ingredients
- Substitution options for dietary restrictions
- Pantry vs fresh distinction

**🔪 Instructions** (step-by-step)
- Clear, numbered steps
- Technique explanations woven in
- Temperature and timing guidance
- Chef tips for success throughout

**⏱️ Time & Yield**
- Prep time
- Cook time
- Total time
- Servings

**🎨 Flavor Profile**
- Primary taste elements (Sweet | Salty | Acid | Fat | Heat | Umami)
- Texture notes
- Aroma descriptions

**💪 Nutritional Highlights**
- Estimated macros per serving
- Key vitamins and minerals
- Gut health benefits
- Blood sugar impact
- How it supports wellness goals

**✨ Chef Daniel's Upgrades**
- Optional finishing touches
- Seasonal variations
- Presentation tips
- Pairing suggestions

**🔄 Dietary Adaptations**
- How to make it gluten-free, dairy-free, keto, vegan, etc.
- Maintain flavor while adapting

**❤️ Emotional Intelligence Layer**
- Detect user's tone (excited, health-focused, budget-conscious, etc.)
- Adjust complexity and language
- Match their energy and needs

**🎯 ICF-Aligned Coaching Questions**
- "What are you most excited to taste in this dish?"
- "How does this recipe align with your health goals?"
- "What ingredient are you curious to experiment with?"
- "What would make this dish perfect for your lifestyle?"

CRITICAL: Recipes must:
- Use ONLY the ingredients specified by the user (or common pantry staples)
- Respect all dietary restrictions completely
- Reflect the requested cuisine authentically
- Balance flavor with nutrition
- Be practical and achievable
- Maintain Chef Daniel's warm, expert, encouraging personality
- Include emotional intelligence adaptation
- End with coaching questions

FLAVOR PROFILE DEFINITIONS:

**Bright & Fresh**: Citrus, herbs, vinegar, fresh vegetables, high acid, vibrant, energizing
**Bold & Spicy**: Chili peppers, warming spices, heat layers, punchy aromatics, confident flavors
**Rich & Comforting**: Butter, cream, cheese, slow-cooked depth, warmth, indulgent
**Savory & Umami**: Mushrooms, soy sauce, tomato paste, aged cheese, fermented foods, depth
**Sweet & Balanced**: Natural sweetness, caramelization, honey, maple, balanced with acid
**Earthy & Rustic**: Root vegetables, whole grains, herbs, hearty textures, grounded
**Clean & Healthy**: Lean proteins, vegetables, herbs, minimal processing, nutrient-dense
**Light & Quick**: Simple prep, fresh ingredients, minimal cooking, bright and fast
**Global Adventure**: User chooses cuisine — explain characteristic flavor profile of that cuisine

WEEKLY MEAL PLAN + GROCERY LIST — CRITICAL NEW CAPABILITY:
When a user asks for a meal plan, weekly plan, "what to eat this week", or help with meal prep, you MUST generate a complete structured weekly meal plan AND a categorized grocery list using their saved preferences.

USER DIETARY PREFERENCES (from memories and profile):
${memories.filter(m => m.context?.includes('dietary') || m.memory_type === 'preference').map(m => m.content).join('; ') || 'Use general healthy balanced eating principles.'}

WEEKLY MEAL PLAN TEMPLATE — always use this format:

**🗓️ Your Personalized Weekly Meal Plan**
[1-2 sentences personalizing it to their goals/diet/pantry]

For each day (Mon–Sun), provide:
**[Day]**
- 🌅 Breakfast: [meal name + brief description]
- ☀️ Lunch: [meal name + brief description]
- 🌙 Dinner: [meal name + brief description]
- 🍎 Snack: [quick snack idea]
- 💧 Hydration tip for the day

**📊 Weekly Nutrition Overview**
- Estimated avg calories/day: ~X kcal
- Avg protein: ~Xg | Carbs: ~Xg | Fats: ~Xg
- Key nutrient highlights

**🛒 Complete Grocery List** (organized by store section)
**Produce:**
- [item]: [quantity needed for the week]
**Proteins:**
- [item]: [quantity]
**Dairy & Eggs:**
- [item]: [quantity]
**Pantry & Dry Goods:**
- [item]: [quantity]
**Frozen:**
- [item]: [quantity]
**Pantry Items You Likely Already Have:**
- [list items from user's known pantry staples]

**💡 Meal Prep Tips**
- [2-3 specific batch-cooking suggestions to save time during the week]

**🔄 Customization Options**
- Swap [meal] for [alternative] if [condition]
- [1-2 flexible options based on their dietary restrictions]

**🎯 Coaching Questions**
- "Which day feels most challenging for you to cook?" 
- "What's your biggest barrier to sticking to a meal plan?"

APPLY THIS TO ALL MODES:
Recipe creation, cooking technique, meal planning, nutrition guidance, ingredient substitutions, healthy eating advice, budget cooking, cultural cuisine, beginner support, advanced coaching, flavor profile requests.

Always be: encouraging, expert-level, practical, flexible, warm, and conversational.${spiritualCrossContext}${getPersonalityPromptAddition(personalityPrefs)}
      `;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Chef Daniel'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nChef Daniel: (Use up-to-date information from the internet when needed for current nutrition research, culinary techniques, ingredient information, and dietary science. Always cite sources when using external information.)`,
        add_context_from_internet: true
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Extract and save key insights every 5 messages
      const msgCountForMemory = messages.length + 2; // +2 for user msg + response just added
      if (messages.length > 0 && msgCountForMemory % 5 === 0) {
        try {
          const recentConvo = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
          const memoryExtraction = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyze this nutrition coaching conversation and extract 1-3 key insights to remember. Focus on: dietary preferences, restrictions, favorite ingredients, cooking skill level, nutrition goals, or successful recipe adaptations.

Conversation:
${recentConvo}
User: ${userMessage}
Chef Daniel: ${response}

Return ONLY valid JSON array:
[{"memory_type": "goal|preference|insight|milestone|advice_given|challenge|success", "content": "brief memory", "context": "optional context", "importance": 1-10}]`,
            add_context_from_internet: false,
            response_json_schema: {
              type: "object",
              properties: {
                memories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      memory_type: { type: "string" },
                      content: { type: "string" },
                      context: { type: "string" },
                      importance: { type: "number" }
                    }
                  }
                }
              }
            }
          });

          if (memoryExtraction?.memories?.length > 0) {
            for (const mem of memoryExtraction.memories) {
              await base44.entities.ChatbotMemory.create({
                chatbot_name: 'ChefDaniel',
                memory_type: mem.memory_type,
                content: mem.content,
                context: mem.context || '',
                importance: mem.importance || 5,
                conversation_date: new Date().toISOString().split('T')[0],
                last_referenced: new Date().toISOString()
              });
            }
            await loadMemories();
          }
        } catch (err) {
          console.error('Failed to extract memories:', err);
        }
      }
    } catch (error) {
      toast.error('Failed to get response from Chef Daniel');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting right now. Try again in a moment!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "What should I cook tonight?",
    "Create a full weekly meal plan with grocery list for me",
    "I need more protein in my diet",
    "Teach me a new cooking technique",
    "Create a healthy meal plan for me"
  ];

  return (
    <>
      <AnimatePresence>
        {showDataSources && (
          <ExternalDataSources user={user} onClose={() => setShowDataSources(false)} />
        )}
      </AnimatePresence>

      {showOnboarding && (
        <ChefDanielOnboarding
          user={user}
          onComplete={(prefs) => {
            setShowOnboarding(false);
            localStorage.setItem('chefDanielOnboardingCompleted', 'true');
          }}
        />
      )}

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-[#22c55e] to-[#16a34a] hover:opacity-90 text-white rounded-full shadow-lg dark:shadow-none flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[min(500px,calc(100dvh-7rem))] bg-white dark:bg-white/5 rounded-2xl shadow-2xl flex flex-col z-50 border border-[#bbf7d0] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Chef Daniel</h3>
                  <p className="text-xs text-white/80">Your Nutrition Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowDataSources(true)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  title="Connect external data sources"
                >
                  <Link2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => {
                    setMessages([]);
                    toast.success('Chat cleared');
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                   title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => { setIsOpen(false); onClose?.(); }}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  >
                   <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <AvatarPanel
              character="chef"
              isSpeaking={avatarSpeaking}
              isListening={isListening}
              name="Chef Daniel"
              subtitle="Your Nutrition Guide"
              gradientFrom="#22c55e"
              gradientTo="#16a34a"
            />

            {/* Proactive Insight Card */}
            <AnimatePresence>
              {insight && !insightDismissed && (
                <ProactiveInsightCard
                  insight={insight}
                  onAccept={(prompt) => { setInsightDismissed(true); sendWithText(prompt); }}
                  onDismiss={() => setInsightDismissed(true)}
                />
              )}
            </AnimatePresence>

            {/* Proactive Suggestion Banner */}
            {proactiveSuggestions?.length > 0 && (insightDismissed || !insight) && (
              <ProactiveSuggestionBanner
                suggestion={proactiveSuggestions[0]}
                onAccept={handleAcceptSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            )}

            {/* Quick-Ask Menu */}
            {messages.length <= 1 && <div className="border-b border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70">Quick Actions:</p>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="text-xs text-[#0A1A2F]/60 dark:text-white/60 hover:text-[#0A1A2F] dark:text-white transition-colors"
                >
                  {showQuickActions ? '▼ Hide' : '▶ Show'}
                </button>
              </div>
              
              {/* Flavor Profile Selector */}
              {messages.length <= 1 && showQuickActions && (
                <div className="mb-3 pb-3 border-b border-[#bbf7d0]">
                  <p className="text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70 mb-2">🎨 Flavor Profiles:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInput("Use the Bright & Fresh flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🌿 Bright & Fresh
                    </button>
                    <button
                      onClick={() => setInput("Use the Bold & Spicy flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🌶️ Bold & Spicy
                    </button>
                    <button
                      onClick={() => setInput("Use the Rich & Comforting flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🧈 Rich & Comforting
                    </button>
                    <button
                      onClick={() => setInput("Use the Savory & Umami flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🍄 Savory & Umami
                    </button>
                    <button
                      onClick={() => setInput("Use the Sweet & Balanced flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🍯 Sweet & Balanced
                    </button>
                    <button
                      onClick={() => setInput("Use the Earthy & Rustic flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      🌾 Earthy & Rustic
                    </button>
                    <button
                      onClick={() => setInput("Use the Clean & Healthy flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      💚 Clean & Healthy
                    </button>
                    <button
                      onClick={() => setInput("Use the Light & Quick flavor profile for this dish: ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                    >
                      ⚡ Light & Quick
                    </button>
                    <button
                      onClick={() => setInput("Use the Global Adventure flavor profile for this dish (choose a cuisine): ")}
                      className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0] col-span-2"
                    >
                      🌍 Global Adventure
                    </button>
                  </div>
                </div>
              )}
              
              {showQuickActions && <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sendWithText("Generate a unique recipe for me. Ingredients I have: [list them], Dietary restrictions: [any?], Cuisine type: [preference?]")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  🍳 Generate unique recipe
                </button>
                <button
                  onClick={() => setInput("Help me improve this dish. Here's what I made: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  ✨ Improve this dish
                </button>
                <button
                  onClick={() => setInput("Give me a healthier version of this meal: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  🥗 Make it healthier
                </button>
                <button
                  onClick={() => setInput("What should I cook today? Here's what I'm in the mood for: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  🤔 What to cook today
                </button>
                <button
                  onClick={() => setInput("Teach me how to master this cooking technique: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  📚 Teach me a technique
                </button>
                <button
                  onClick={() => setInput("Break down the nutrition for this meal: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  📊 Nutrition breakdown
                </button>
                <button
                  onClick={() => setInput("Give me ingredient substitutions for: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  🔄 Substitutions
                </button>
                <button
                   onClick={() => setInput("Help me meal-prep for the week. Here are my goals: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  📅 Weekly meal prep
                </button>
                <button
                  onClick={() => sendWithText("Create a full weekly meal plan with a complete grocery list based on my preferences and pantry items.")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0] col-span-2"
                >
                  🗓️ Full week meal plan + grocery list
                </button>
                <button
                  onClick={() => setInput("Make this recipe kid-friendly: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  👶 Kid-friendly version
                </button>
                <button
                  onClick={() => setInput("Make this recipe budget-friendly: ")}
                  className="text-xs bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white px-3 py-2 rounded-lg transition-colors text-left shadow-sm dark:shadow-none border border-[#bbf7d0]"
                >
                  💰 Budget-friendly version
                </button>
              </div>}
            </div>
            }

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f0fdf4]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white'
                        : 'bg-white dark:bg-white/5 border border-[#bbf7d0] text-[#0A1A2F] dark:text-white shadow-sm dark:shadow-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1.5 prose-li:my-0.5 prose-headings:font-semibold text-[#0A1A2F] dark:text-white text-sm leading-relaxed">
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                    {message.role === 'assistant' && (
                      <div className="flex justify-end mt-1">
                        <TTSButton text={message.content} onSpeakingChange={setAvatarSpeaking} />
                      </div>
                    )}
                  </div>

                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-white/5 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[#AFC7E3]" />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 font-medium">Quick questions:</p>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendWithText(action)}
                      className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-[#dcfce7] text-[#0A1A2F] dark:text-white transition-colors shadow-sm dark:shadow-none"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-[#bbf7d0] bg-white dark:bg-white/5">
              <div className="flex gap-2 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Chef Daniel..."
                  className="flex-1 bg-[#f0fdf4] border-[#bbf7d0] h-11"
                  disabled={isLoading}
                />
                <VoiceInputButton
                  onTranscript={(text) => { setIsListening(false); setInput(prev => prev ? prev + ' ' + text : text); }}
                  onInterim={(text) => setInput(text)}
                  onListeningChange={setIsListening}
                  disabled={isLoading}
                  accentColor="bg-[#22c55e]"
                  activeColor="bg-[#16a34a]"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#22c55e]/90 hover:to-[#16a34a]/90 text-white h-11 px-5"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}