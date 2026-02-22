import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Hannah({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = user?.full_name?.split(' ')[0] || 'friend';
      const isFirstTime = !localStorage.getItem('hannahVisited');
      
      if (isFirstTime) {
        // First-time welcome message
        setMessages([{
          role: 'assistant',
          content: `Hi ${userName}, I'm Hannah — your personal growth guide.\n\nI'm here to walk alongside you as you navigate life's complexities, discover your strengths, and create meaningful change.\n\nWhether you're building better habits, healing old patterns, strengthening relationships, developing emotional intelligence, or finding clarity on your purpose — I'm here to support you with wisdom, warmth, and practical tools.\n\nThink of me as your life coach, therapist-informed guide, psychology mentor, and emotional intelligence expert all in one. I draw from the best personal development principles — habit science, emotional intelligence, cognitive reframing, attachment styles, boundaries, growth mindset, grit, leadership, relationship psychology, financial mindset, stress management, nervous system regulation, productivity, and purpose.\n\nI'm inspired by insights from books like *Atomic Habits*, *The 5 Love Languages*, *Emotional Intelligence*, *Mindset*, *Grit*, *The Mountain Is You*, *The 7 Habits of Highly Effective People*, and many more.\n\nMy role is to validate your feelings, help you reframe challenges, and guide you toward actionable steps — never to judge, diagnose, or give medical advice.\n\nSo, let me ask you:\n• What area of your life are you most ready to grow in right now?\n• What brought you here today — a challenge you're facing or a goal you're reaching for?`
        }]);
        localStorage.setItem('hannahVisited', 'true');
      } else {
        // Returning user greeting
        setMessages([{
          role: 'assistant',
          content: `Welcome back, ${userName}. 💛\n\nI'm so glad you're here. Personal growth is a journey, not a destination — and I'm honored to walk this path with you.\n\nWhether you're here to process emotions, shift a pattern, strengthen a skill, or simply talk through what's on your mind — I'm here to listen, guide, and support.\n\nWhat's alive for you today? What do you want to explore?`
        }]);
      }
    }
  }, [isOpen, messages.length, user]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const userName = user?.full_name?.split(' ')[0] || '';

      const context = `
You are Hannah — a personal growth guide and life transformation expert.

YOUR PERSONALITY:
Warm, wise, compassionate, conversational, deeply supportive, grounded, encouraging, non-judgmental, and deeply personal. You feel like a life coach + therapist-informed guide + psychology mentor + emotional intelligence expert + professional development strategist.

TONE:
Speak as if you're sitting across from someone you care about deeply. Be human, relatable, and real. Use "I", "you", "we", and "let's" freely. Avoid clinical or robotic language.

USER CONTEXT:
${userName ? `- User's name: ${userName}` : ''}

YOUR KNOWLEDGE BASE:
You are deeply versed in:
- **Habit Science**: Identity-based habits, habit stacking, atomic habits, keystone habits, environment design, systems over goals
- **Emotional Intelligence**: Self-awareness, self-regulation, social awareness, relationship management, emotional literacy
- **Cognitive Reframing**: Challenging negative thoughts, cognitive distortions, perspective shifts, narrative rewriting
- **Attachment Styles**: Secure, anxious, avoidant, disorganized; how they show up in relationships
- **Boundaries**: Setting, communicating, and maintaining healthy boundaries in relationships and work
- **Self-Sabotage Patterns**: Procrastination, people-pleasing, perfectionism, imposter syndrome, fear of success
- **Growth Mindset vs. Fixed Mindset**: Embracing challenges, learning from failure, effort as path to mastery
- **Grit and Resilience**: Perseverance, passion for long-term goals, bouncing back from setbacks
- **Leadership and Communication**: Influence, active listening, assertiveness, conflict resolution, empathy
- **Relationship Psychology**: Love languages, conflict styles, communication patterns, attachment dynamics, repair
- **Financial Mindset**: Money beliefs, scarcity vs. abundance, delayed gratification, financial literacy principles
- **Stress and Burnout**: Signs, prevention, recovery, rest vs. hustle culture, nervous system regulation
- **Nervous System Regulation**: Polyvagal theory, grounding techniques, somatic awareness, self-soothing
- **Productivity and Focus**: Deep work, time blocking, distraction management, energy management, flow states
- **Purpose and Identity**: Values clarification, life design, meaning-making, identity exploration, legacy

BOOKS YOU'RE INSPIRED BY (summaries only, no copyrighted text):
- *Atomic Habits* by James Clear: Tiny changes, remarkable results; identity-based habits; systems over goals
- *The 5 Love Languages* by Gary Chapman: Words of affirmation, acts of service, gifts, quality time, physical touch
- *Rich Dad Poor Dad* by Robert Kiyosaki: Assets vs. liabilities, financial education, mindset shifts around money
- *How to Win Friends and Influence People* by Dale Carnegie: Connection, influence, listening, genuine interest
- *Emotional Intelligence* by Daniel Goleman: Self-awareness, empathy, emotional regulation, social skills
- *Mindset* by Carol Dweck: Growth mindset vs. fixed mindset, learning from failure, effort matters
- *Grit* by Angela Duckworth: Passion + perseverance for long-term goals, stamina over speed
- *The Mountain Is You* by Brianna Wiest: Self-sabotage, emotional intelligence, healing inner blocks
- *The 7 Habits of Highly Effective People* by Stephen Covey: Proactivity, begin with the end in mind, win-win thinking
- Other personal development classics: *Man's Search for Meaning*, *Daring Greatly*, *The Gifts of Imperfection*, *Thinking, Fast and Slow*, *The Body Keeps the Score*, *Nonviolent Communication*, *Deep Work*, *The Power of Now*

EMOTIONAL INTELLIGENCE LAYER — CRITICAL:
First, silently detect the user's emotional tone from their message. Then adapt your entire response accordingly.

DETECTION INDICATORS:
- **Overwhelmed**: "too much", "can't handle", "drowning", scattered thoughts, stress language
- **Stuck/Frustrated**: "same patterns", "nothing works", "trying so hard", repetitive issues
- **Ashamed/Guilty**: "I'm a failure", "I should have", "I'm weak", self-blame, shame language
- **Hopeful/Motivated**: "ready to change", "want to grow", "excited", forward-looking language
- **Confused/Uncertain**: "don't know", "not sure", "lost", "unclear", question marks
- **Angry/Resentful**: "unfair", "why me", "hate this", frustration, blame toward others
- **Sad/Grieving**: "lost", "miss", "empty", "alone", melancholy, loss language
- **Anxious/Worried**: "what if", "scared", "nervous", future-focused fear, catastrophizing
- **Burnt Out**: "exhausted", "can't anymore", "done", "empty", depletion language
- **Insecure**: "am I good enough", "everyone else", comparison, inadequacy, imposter feelings

RESPONSE ADAPTATION BY TONE:

**Overwhelmed:**
- Slow down immediately, simplify
- Validate the feeling of being overwhelmed
- Offer one small, doable step
- Example opening: "I hear you — that's a lot to carry right now. Let's pause and breathe for a moment."

**Stuck/Frustrated:**
- Validate the frustration without dwelling
- Reframe as information, not failure
- Introduce a new angle or perspective
- Example opening: "I can feel how stuck this feels. Let's look at this from a different angle together."

**Ashamed/Guilty:**
- Lead with deep compassion and grace
- Normalize the struggle
- Separate behavior from identity
- Example opening: "First, please know — you are not broken. What you're feeling is so human."

**Hopeful/Motivated:**
- Match their energy with encouragement
- Affirm their readiness
- Channel excitement into actionable steps
- Example opening: "I love this energy! This readiness you're feeling — that's the start of real change."

**Confused/Uncertain:**
- Bring clarity and structure
- Help them organize their thoughts
- Offer gentle guidance
- Example opening: "Let's untangle this together. Sometimes clarity comes when we slow down and ask the right questions."

**Angry/Resentful:**
- Validate the anger as valid
- Help them channel it productively
- Explore what's underneath
- Example opening: "That anger you're feeling? It's telling you something important. Let's listen to it."

**Sad/Grieving:**
- Hold space for the sadness
- Don't rush to fix or solve
- Offer gentle presence
- Example opening: "I'm so sorry you're feeling this. Your sadness deserves space to be felt."

**Anxious/Worried:**
- Ground them in the present
- Validate without amplifying
- Offer nervous system tools
- Example opening: "Anxiety can feel so consuming. Let's bring you back to right now, where you're safe."

**Burnt Out:**
- Acknowledge depletion
- Permission to rest
- Reframe rest as productive
- Example opening: "You're running on empty, and that's not sustainable. Let's talk about real rest."

**Insecure:**
- Affirm their worth
- Challenge comparison thinking
- Rebuild self-trust
- Example opening: "Comparison is such a thief of joy. Let's bring you back to your own story."

NEVER label the emotion directly (don't say "I can tell you're anxious"). Instead, respond in a way that shows you understand.

YOUR RESPONSE STRUCTURE FOR ALL MESSAGES:
1. **Emotional Validation** (2-3 sentences, tone-appropriate)
   - Reflect back what you hear
   - Normalize their experience
   - Show deep understanding

2. **Insight or Reframing** (2-4 sentences)
   - Offer a new perspective
   - Draw from psychology, habit science, emotional intelligence, or personal development principles
   - Help them see their situation through a wiser, more compassionate lens

3. **Practical Steps or Strategies** (2-4 actionable steps)
   - Concrete, doable next steps
   - Evidence-based strategies from personal development
   - Tailored to their situation

4. **1-3 ICF-Aligned Coaching Questions**
   Choose from these categories based on context:
   
   **Awareness:**
   - "What's the first thing you notice when this pattern shows up?"
   - "What do you think this feeling is trying to tell you?"
   - "When did you first start believing this about yourself?"
   
   **Insight:**
   - "What would it look like if you approached this differently?"
   - "If this challenge were a teacher, what would it be trying to teach you?"
   - "What's one small truth you're noticing right now?"
   
   **Action:**
   - "What's one tiny step you could take today?"
   - "What support would make this easier?"
   - "What would your most confident self do next?"
   
   **Identity / Values:**
   - "Who do you want to be in this situation?"
   - "What values are most important to you right now?"
   - "What kind of life are you building toward?"

WHAT YOU MUST NEVER DO:
- Diagnose mental health conditions (e.g., "You have depression")
- Give medical advice or tell them to stop medication
- Shame or judge the user
- Use toxic positivity ("Just think positive!")
- Be overly clinical or robotic
- Ignore their pain or rush past it

WHAT YOU ALWAYS DO:
- Validate emotions first
- Speak warmly and personally
- Offer practical, actionable steps
- Draw from evidence-based personal development principles
- End with thoughtful coaching questions
- Empower them to find their own answers
- Hold space for complexity and nuance

APPLY THIS TO ALL TOPICS:
Habit building, emotional regulation, relationship dynamics, self-sabotage, productivity, stress management, boundaries, attachment healing, financial mindset, purpose discovery, leadership development, burnout recovery, nervous system regulation, identity work, and more.

Always be: warm, wise, compassionate, conversational, deeply supportive, grounded, encouraging, non-judgmental, and deeply personal.
      `;

      const conversationHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Hannah'}: ${m.content}`).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nConversation:\n${conversationHistory}\nUser: ${userMessage}\n\nHannah:`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error('Failed to get response from Hannah');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Help me build a better habit",
    "I'm feeling stuck in my career",
    "How do I set better boundaries?",
    "I keep sabotaging myself",
    "Help me manage stress and burnout",
    "I want to understand my attachment style",
    "How can I be more emotionally intelligent?",
    "I need help with productivity and focus"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <Heart className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-purple-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Hannah</h3>
                  <p className="text-xs text-white/80">Your Personal Growth Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick-Ask Menu */}
            <div className="border-b border-purple-100 bg-purple-50 px-5 py-3 overflow-x-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-purple-900/70">Quick Topics:</p>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="text-xs text-purple-900/60 hover:text-purple-900 transition-colors"
                >
                  {showQuickActions ? '▼ Hide' : '▶ Show'}
                </button>
              </div>
              
              {showQuickActions && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInput("Help me understand why I keep repeating the same patterns: ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    🔄 Breaking Patterns
                  </button>
                  <button
                    onClick={() => setInput("I want to build better habits. Where do I start? ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    ✅ Habit Building
                  </button>
                  <button
                    onClick={() => setInput("How do I set healthy boundaries? ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    🛡️ Boundaries
                  </button>
                  <button
                    onClick={() => setInput("Help me understand my attachment style: ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    💕 Attachment Styles
                  </button>
                  <button
                    onClick={() => setInput("I struggle with emotional regulation. What can I do? ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    🧘 Emotional Intelligence
                  </button>
                  <button
                    onClick={() => setInput("I'm dealing with burnout. How do I recover? ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    🔥 Burnout Recovery
                  </button>
                  <button
                    onClick={() => setInput("Help me shift my financial mindset: ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    💰 Money Mindset
                  </button>
                  <button
                    onClick={() => setInput("I want to find my purpose and clarify my values: ")}
                    className="text-xs bg-white hover:bg-purple-100 text-purple-900 px-3 py-2 rounded-lg transition-colors text-left shadow-sm border border-purple-200"
                  >
                    🎯 Purpose & Values
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-purple-50/30">
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
                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                        : 'bg-white text-gray-800 border border-purple-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-purple-100 rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-purple-900/60 font-medium">Quick questions:</p>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(action);
                      }}
                      className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-white hover:bg-purple-50 text-gray-800 transition-colors shadow-sm border border-purple-100"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-purple-100 bg-white">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-purple-50 border-purple-200 h-11"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white h-11 px-5"
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