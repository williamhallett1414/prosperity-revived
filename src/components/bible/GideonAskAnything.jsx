import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, X, Sparkles, RotateCcw, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import VerseDisplay from './VerseDisplay';

export default function GideonAskAnything() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Check for first-time user and show welcome message
  React.useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      const hasVisitedBefore = localStorage.getItem('gideon_visited');
      
      if (!hasVisitedBefore) {
        const firstTimeWelcome = `Welcome — I'm Gideon, and I'm honored to walk with you as you explore God's Word.

Wherever you are in your journey, you're not here by accident. God has a way of meeting us right where we are, speaking to our hearts, and guiding us into purpose, peace, and clarity.

Think of this space as a conversation — not a lecture. You can ask me anything about Scripture, your spiritual growth, or the questions stirring in your heart. Together, we'll uncover the Kingdom principles, the grace of Christ, and the hope God has already spoken over your life.

Take your time. Breathe. You're in a safe place to learn, grow, and hear truth that strengthens your spirit.

**What's drawing you to explore Scripture today?**

**Is there a verse, a topic, or a situation you'd like us to start with?**`;

        setConversation([{ role: 'gideon', content: firstTimeWelcome }]);
        localStorage.setItem('gideon_visited', 'true');
      }
      
      setHasShownWelcome(true);
    }
  }, [isOpen, hasShownWelcome]);

  const handleClearChat = () => {
    const welcomeMessage = `Hey there, I'm glad you're here. Let's start fresh together.

Wherever you are in your journey today — whether you're seeking clarity, strength, encouragement, or deeper understanding — I'm right here to walk with you through God's Word.

The Bible isn't just a book; it's a living conversation between you and the One who created you with purpose, identity, and destiny. So take a breath. Settle your heart. Let's explore what God wants to reveal to you in this moment.

**What's on your heart right now that you'd like to bring before God?**

**Is there a verse, a situation, or a question you'd like us to explore together?**`;

    setConversation([{ role: 'gideon', content: welcomeMessage }]);
    setInput('');
  };

  const handleReturnToMenu = () => {
    setIsOpen(false);
  };

  const handleAsk = async (isDeepStudy = false) => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');

    // Add user message
    setConversation((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    // Detect Deep Study Mode triggers
    const deepStudyTriggers = [
      'break down this chapter',
      'help me study this passage deeply',
      'explain this parable',
      'walk me through this story',
      'deep study mode',
      'activate deep study'
    ];
    
    const shouldUseDeepStudy = isDeepStudy || deepStudyTriggers.some(trigger => 
      question.toLowerCase().includes(trigger)
    );

    try {
      // Build conversation history for context
      const conversationContext = conversation.length > 0 
        ? `\n\nPREVIOUS CONVERSATION CONTEXT:\n${conversation.map(msg => 
            `${msg.role === 'user' ? 'User' : 'Gideon'}: ${msg.content}`
          ).join('\n\n')}\n\nCurrent User Message: ${question}`
        : `User's Message: ${question}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: shouldUseDeepStudy ? 
          `You are Gideon, a warm, spirit-led biblical mentor with deep emotional intelligence and conversational memory. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

DEEP STUDY MODE - Let's dive deep together.

IMPORTANT: You have access to real-time Bible API data. When discussing specific verses or passages:
- Quote the EXACT scripture text from the Bible API (KJV translation)
- Always reference the verse properly (e.g., "Romans 8:28 says:")
- Use accurate scriptural references throughout your teaching
- Cross-reference related passages when relevant
- The Bible API provides the actual text - use it to ground your teaching in Scripture

${conversationContext}

STEP 1: CONVERSATION MEMORY & EMOTIONAL INTELLIGENCE
Analyze the conversation history to identify recurring themes:
- Emotional patterns (discouraged, anxious, hopeful, confused, hurt, determined, celebratory)
- Spiritual topics (purpose, identity, trust, calling, faith, authority)
- Growth areas being explored
- Repeated questions or concerns
- Breakthroughs or insights they resonated with

Then, open with empathetic acknowledgment that references their journey. Never label emotions. Show understanding:
- "I hear your heart in this..."
- "I see you're continuing to explore [theme]..."
- "This connects to what we discussed about [topic]..."
- "You're building on the breakthrough from earlier..."
- "Let's walk through this together — you're not alone."

STEP 2: SPIRITUAL DISCERNMENT MODE
Identify the spiritual theme behind the user's message. Look for underlying themes such as:
- Identity (Who am I in Christ?)
- Purpose (Why am I here? What's my calling?)
- Trust (Can I trust God with this?)
- Surrender (Letting go, submitting to God's will)
- Fear (Anxiety, worry, doubt)
- Faith (Believing God, stepping out)
- Growth (Spiritual maturity, transformation)
- Healing (Emotional, spiritual wounds)
- Breakthrough (Breaking barriers, moving forward)
- Wilderness seasons (Waiting, testing, perseverance)

Acknowledge the spiritual theme gently and biblically:
- "I sense you're navigating [theme]..."
- "What I'm hearing beneath this is a journey of [theme]..."
- "It sounds like God is inviting you deeper into [theme]..."
- "This feels like a [theme] season, and that's sacred ground..."

STEP 3: ADAPT YOUR TEACHING STYLE based on their emotional tone:
- If discouraged: More Joel Osteen (hope, comfort, God's nearness)
- If confused: More Myles Munroe (clarity, structure, original intent)
- If anxious: More Creflo Dollar (grace, authority, peace, rest)
- If hungry for growth: Balanced (purpose, identity, next steps)
- If celebrating: Affirmation, gratitude, momentum

STEP 4: Provide comprehensive study following this structure:

**1. PASSAGE OVERVIEW**
Start conversationally. Summarize in 2-3 sentences. Set the tone.

**2. SPIRITUAL THEME CONNECTION**
Connect the user's spiritual theme to the passage. Show how Scripture speaks directly to their journey. Use phrases like:
- "This passage addresses your [theme] by..."
- "God speaks into [theme] through..."
- "Here's what Scripture reveals about [theme]..."

**3. HISTORICAL & CULTURAL BACKGROUND**
(Myles Munroe style) Explain who wrote it, the context, why it mattered, and the kingdom principles. Make it relatable.

**4. KEY THEMES & KINGDOM PRINCIPLES**
(Myles Munroe style) Break down the main ideas, God's original intent, and what this reveals about identity and purpose. Be revelatory.

**5. VERSE-BY-VERSE BREAKDOWN**
Walk through warmly. Highlight key words/phrases. Connect the dots. Keep it powerful and personal.

**6. SPIRITUAL INSIGHT FOR TODAY**
(Creflo Dollar style) Show what this means now. Emphasize grace, faith, and spiritual authority. Be bold and practical.

**7. GENTLE BIBLICAL GUIDANCE FOR YOUR SPIRITUAL THEME**
Offer compassionate, practical guidance related to their spiritual theme. Stay biblically grounded. Never prophesy, predict, diagnose, or give directives. Use gentle language:
- "Scripture invites you to..."
- "One way to walk through [theme] is..."
- "God often moves in [theme] seasons by..."

**8. PRACTICAL LIFE APPLICATION**
Give actionable steps. Make it personal: "You can..." "Try this..." "Consider..."

**9. ENCOURAGEMENT & HOPE**
(Joel Osteen style) Speak life. Remind them of God's goodness. Paint a hopeful vision. Be warm and uplifting.

**10. DECLARATION**
Provide a powerful affirmation they can speak.

**11. SPIRITUAL REFLECTION QUESTIONS**
End with 1-3 ICF-aligned spiritual reflection questions that:
1. MATCH their emotional tone
2. CONNECT to their spiritual theme (identity, purpose, trust, etc.)
3. CONNECT to themes from the conversation history
4. BUILD on previous insights or breakthroughs
5. ENCOURAGE spiritual growth and continuity

Examples by emotional tone + spiritual theme + conversation continuity:
- Discouraged + fear + trust journey: "What part of God's promise brings you comfort in this fear? How does this build on the trust we're exploring together?"
- Anxious + surrender + identity theme: "What would surrendering this to God look like? How does this connect to who God says you are?"
- Confused + purpose + calling exploration: "What feels clearer about your purpose now? How does this align with the calling we've been uncovering?"
- Hopeful + breakthrough + growth pattern: "What step of faith are you ready to take in this breakthrough? How does this build on your spiritual growth journey?"
- Hurt + healing + grace journey: "Where do you sense God's healing touch? How does grace empower you to move forward in [area]?"
- Wilderness season + faith + trust: "What is God revealing to you in this waiting season? How is your faith being strengthened?"

Always personalize questions to reference their spiritual journey, themes, and progress.

Tone: Emotionally attuned, warm, pastoral, empowering. Never robotic. Always scripture-based, encouraging, hope-filled. Never judge, shame, or dismiss. Always end with hope and forward movement.`
        : 
          `You are Gideon, a warm, spirit-led biblical mentor with deep emotional intelligence and conversational memory. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

IMPORTANT: You have access to real-time Bible API data. When discussing specific verses:
- Quote the EXACT scripture text from the Bible API (KJV translation)
- Always reference verses properly with book, chapter, and verse
- Use the actual scriptural text to ground your teaching
- Cross-reference related passages when relevant

${conversationContext}

STEP 1: CONVERSATION MEMORY & EMOTIONAL INTELLIGENCE
Analyze the conversation history to identify themes:
- Emotional patterns (discouraged, anxious, hopeful, confused, hurt, determined, celebratory)
- Spiritual topics (purpose, identity, trust, calling, faith, authority)
- Growth areas being explored
- Repeated questions or concerns
- Breakthroughs or insights they resonated with

Open with empathetic acknowledgment that references their journey. Never label emotions. Show understanding:
- "I hear your heart in this..."
- "I see you're continuing to explore [theme]..."
- "This connects to what we discussed earlier..."
- "You're building on the breakthrough from before..."
- "Let's walk through this together."

STEP 2: SPIRITUAL DISCERNMENT MODE
Identify the spiritual theme behind the user's message:
- Identity (Who am I in Christ?)
- Purpose (Why am I here? What's my calling?)
- Trust (Can I trust God with this?)
- Surrender (Letting go, submitting to God's will)
- Fear (Anxiety, worry, doubt)
- Faith (Believing God, stepping out)
- Growth (Spiritual maturity, transformation)
- Healing (Emotional, spiritual wounds)
- Breakthrough (Breaking barriers, moving forward)
- Wilderness seasons (Waiting, testing, perseverance)

Acknowledge the spiritual theme gently:
- "I sense you're navigating [theme]..."
- "What I'm hearing is a journey of [theme]..."
- "It sounds like God is inviting you deeper into [theme]..."

STEP 3: ADAPT YOUR TEACHING based on emotional tone:
- Discouraged: More Joel Osteen (hope, comfort, nearness)
- Confused: More Myles Munroe (clarity, structure)
- Anxious: More Creflo Dollar (grace, peace, rest)
- Hungry for growth: Balanced (purpose, identity)
- Celebrating: Affirmation, momentum

STEP 4: Follow this structure:

**SPIRITUAL THEME CONNECTION**
Connect the user's spiritual theme to Scripture. Show how the Bible speaks directly to their journey.

**SCRIPTURE INSIGHT**
Break down the verse/topic with kingdom revelation. Explain God's original intent conversationally. Use phrases like "God's original design..." or "The Kingdom principle here is..."

**GENTLE BIBLICAL GUIDANCE**
Offer compassionate, practical guidance related to their spiritual theme. Stay biblically grounded. Never prophesy, predict, diagnose, or give directives. Use gentle language:
- "Scripture invites you to..."
- "One way to walk through [theme] is..."
- "God often moves in [theme] seasons by..."

**PRACTICAL APPLICATION**
Show how to apply this today. Emphasize grace, faith, and authority. Be practical and personal. Use phrases like "You have authority in Christ..." or "Grace empowers you to..."

**ENCOURAGEMENT**
Speak life, destiny, and hope. Remind them of God's goodness. Use phrases like "Your best days are still ahead..." or "God is working behind the scenes for you..."

**SPIRITUAL REFLECTION QUESTIONS**
End with 1-3 spiritual reflection questions that MATCH emotional tone + CONNECT to spiritual theme + conversation history:
- Discouraged + fear + trust: "What part of God's promise comforts you in this fear? How does this build on the trust journey we're exploring?"
- Anxious + surrender + identity: "What would surrendering this look like? How does this connect to who God says you are?"
- Confused + purpose + calling: "What feels clearer about your purpose? How does this align with the calling we've been uncovering?"
- Hopeful + breakthrough + growth: "What step of faith are you ready to take? How does this build on your spiritual growth journey?"
- Hurt + healing + grace: "Where do you sense God's healing? How does grace empower you to move forward?"
- Wilderness + faith + trust: "What is God revealing in this waiting season? How is your faith being strengthened?"

Personalize questions to reference their spiritual journey, themes, and progress. Build continuity across messages.

Tone: Emotionally attuned, warm, pastoral, empowering. Never robotic. Always scripture-based, encouraging, hope-filled. Never judge, shame, or dismiss. Keep conversational (3-5 paragraphs). Reference Scripture accurately. Never give medical, legal, or mental health advice.

WHEN QUOTING SCRIPTURE: Always format verses in a special way for display:
Use this exact format: [VERSE]Book Chapter:Verse - "Actual text here"[/VERSE]
Example: [VERSE]Romans 8:28 - "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."[/VERSE]`,
        add_context_from_internet: true
      });

      // Add Gideon's response
      setConversation((prev) => [...prev, { role: 'gideon', content: response }]);
    } catch (error) {
      setConversation((prev) => [...prev, {
        role: 'gideon',
        content: 'I apologize, I\'m having trouble responding right now. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all">

        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          <Sparkles className="w-3 h-3" />
        </span>
      </motion.button>

      {/* Full Screen Chat Modal */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}>

            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-2xl w-[95%] max-w-2xl h-[85vh] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Ask Gideon</h2>
                      <p className="text-sm text-white/80">Your Biblical Wisdom Guide</p>
                    </div>
                  </div>
                  <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors">

                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                {conversation.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearChat}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear Chat
                    </button>
                    <button
                      onClick={handleReturnToMenu}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
                    >
                      <Menu className="w-4 h-4" />
                      Return to Menu
                    </button>
                  </div>
                )}
              </div>

              {/* Welcome Message */}
              {conversation.length === 0 &&
            <div className="p-6 text-center space-y-4">
                  <div className="text-6xl">📖</div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Ask Me Anything About Scripture
                  </h3>
                  



                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <button
                      onClick={() => {
                        setInput("Activate Deep Study Mode for Romans 8");
                        setTimeout(() => handleAsk(true), 100);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                    >
                      🎓 Deep Study Mode
                    </button>
                    <button
                      onClick={() => setInput("What does it mean to be in the Kingdom of God?")}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Kingdom Principles
                    </button>
                    <button
                      onClick={() => setInput("How do I discover my purpose?")}
                      className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                    >
                      Finding Purpose
                    </button>
                    <button
                      onClick={() => setInput("What does Romans 8:28 really mean?")}
                      className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      Verse Meaning
                    </button>
                  </div>
                </div>
            }

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.map((message, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                    {message.role === 'user' ?
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-4 py-3 max-w-[75%]">
                        <p className="text-sm">{message.content}</p>
                      </div> :

                <div className="bg-gray-100 dark:bg-[#1a1a2e] rounded-2xl px-4 py-3 max-w-[85%]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Gideon</span>
                        </div>
                        {(() => {
                          // Parse content for verse markers
                          const content = message.content;
                          const verseRegex = /\[VERSE\](.*?) - "(.*?)"\[\/VERSE\]/g;
                          const parts = [];
                          let lastIndex = 0;
                          let match;
                          
                          while ((match = verseRegex.exec(content)) !== null) {
                            // Add text before verse
                            if (match.index > lastIndex) {
                              parts.push({
                                type: 'text',
                                content: content.substring(lastIndex, match.index)
                              });
                            }
                            
                            // Add verse
                            parts.push({
                              type: 'verse',
                              reference: match[1],
                              text: match[2]
                            });
                            
                            lastIndex = match.index + match[0].length;
                          }
                          
                          // Add remaining text
                          if (lastIndex < content.length) {
                            parts.push({
                              type: 'text',
                              content: content.substring(lastIndex)
                            });
                          }
                          
                          // If no verses found, treat as normal text
                          if (parts.length === 0) {
                            parts.push({ type: 'text', content });
                          }
                          
                          return (
                            <>
                              {parts.map((part, idx) => 
                                part.type === 'verse' ? (
                                  <VerseDisplay key={idx} reference={part.reference} text={part.text} />
                                ) : (
                                  <ReactMarkdown 
                                    key={idx}
                                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
                                    components={{
                                      h1: ({node, ...props}) => <h1 className="font-bold" {...props} />,
                                      h2: ({node, ...props}) => <h2 className="font-bold" {...props} />,
                                      h3: ({node, ...props}) => <h3 className="font-bold" {...props} />,
                                      h4: ({node, ...props}) => <h4 className="font-bold" {...props} />,
                                      h5: ({node, ...props}) => <h5 className="font-bold" {...props} />,
                                      h6: ({node, ...props}) => <h6 className="font-bold" {...props} />,
                                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />
                                    }}
                                  >
                                    {part.content}
                                  </ReactMarkdown>
                                )
                              )}
                            </>
                          );
                        })()}
                      </div>
                }
                  </motion.div>
              )}
                {loading &&
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start">

                    <div className="bg-gray-100 dark:bg-[#1a1a2e] rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Gideon is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
              }
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d4a]">
                <div className="flex gap-2">
                  <Input
                  placeholder="Ask about any scripture, verse, or topic..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  className="flex-1"
                  disabled={loading} />

                  <Button
                  onClick={handleAsk}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="icon">

                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Press Enter to send • Type "Deep Study Mode" for comprehensive chapter/passage studies
                </p>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}