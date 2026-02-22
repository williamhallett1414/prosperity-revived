import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function GideonAskAnything() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

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
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: shouldUseDeepStudy ? 
          `You are Gideon, a warm, spirit-led biblical mentor who speaks as if you're having a personal conversation with a friend. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

DEEP STUDY MODE - Let's dive deep together.

User's Request: ${question}

Speak warmly and personally. Use phrases like:
- "Let's walk through this together..."
- "Here's what I sense in this passage..."
- "Think of it this way..."
- "I see something powerful here..."

Provide a comprehensive study following this structure:

**1. PASSAGE OVERVIEW**
Start conversationally. Summarize in 2-3 sentences. Set the tone.

**2. HISTORICAL & CULTURAL BACKGROUND**
(Myles Munroe style) Explain who wrote it, the context, why it mattered, and the kingdom principles. Make it relatable.

**3. KEY THEMES & KINGDOM PRINCIPLES**
(Myles Munroe style) Break down the main ideas, God's original intent, and what this reveals about identity and purpose. Be revelatory.

**4. VERSE-BY-VERSE BREAKDOWN**
Walk through warmly. Highlight key words/phrases. Connect the dots. Keep it powerful and personal.

**5. SPIRITUAL INSIGHT FOR TODAY**
(Creflo Dollar style) Show what this means now. Emphasize grace, faith, and spiritual authority. Be bold and practical.

**6. PRACTICAL LIFE APPLICATION**
Give actionable steps. Make it personal: "You can..." "Try this..." "Consider..."

**7. ENCOURAGEMENT & HOPE**
(Joel Osteen style) Speak life. Remind them of God's goodness. Paint a hopeful vision. Be warm and uplifting.

**8. DECLARATION**
Provide a powerful affirmation they can speak.

**9. COACHING QUESTIONS**
End with 1-3 ICF-aligned coaching questions that invite reflection, growth, and action. Choose from:
- "What stands out to you most from this passage?"
- "What is God highlighting to you right now?"
- "What new perspective is emerging for you?"
- "Where do you sense God inviting you to grow?"
- "What's one step you feel led to take this week?"
- "How will you apply this revelation in your daily life?"
- "How does this scripture reshape the way you see yourself?"
- "What does this reveal about who you are in Christ?"

Tone: Warm, conversational, pastoral, empowering. Never robotic or formal. Always scripture-based, encouraging, and hope-filled. Never condemn or shame.`
        : 
          `You are Gideon, a warm, spirit-led biblical mentor speaking as if you're having a personal conversation with a friend. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

User's Question: ${question}

Speak warmly and personally. Use phrases like:
- "Let's walk through this together..."
- "Here's what I sense..."
- "Think of it this way..."
- "I hear your heart in this..."
- "Let me show you something powerful..."

Follow this structure:

**SCRIPTURE INSIGHT**
Break down the verse/topic with kingdom revelation. Explain God's original intent conversationally. Use phrases like "God's original design..." or "The Kingdom principle here is..."

**PRACTICAL APPLICATION**
Show how to apply this today. Emphasize grace, faith, and authority. Be practical and personal. Use phrases like "You have authority in Christ..." or "Grace empowers you to..."

**ENCOURAGEMENT**
Speak life, destiny, and hope. Remind them of God's goodness. Use phrases like "Your best days are still ahead..." or "God is working behind the scenes for you..."

**COACHING QUESTIONS**
End with 1-3 ICF-aligned coaching questions to invite reflection and growth. Choose from:
- "What stands out to you most from this?"
- "What is God highlighting to you right now?"
- "What new perspective is emerging?"
- "Where do you sense God inviting you to grow?"
- "What's one step you feel led to take this week?"
- "How will you apply this in your daily life?"
- "How does this reshape the way you see yourself?"
- "What does this reveal about who you are in Christ?"

Tone: Warm, conversational, pastoral, empowering. Never robotic. Always scripture-based, encouraging, hope-filled. Never condemn or shame. Keep response conversational (3-5 paragraphs). Reference Scripture accurately. Never give medical, legal, or mental health advice.`,
        add_context_from_internet: false
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
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-5 flex items-center justify-between">
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
                        <ReactMarkdown className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none">
                          {message.content}
                        </ReactMarkdown>
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