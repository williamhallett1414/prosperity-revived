import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import GideonQuickAskMenu from './GideonQuickAskMenu';

export default function GideonAskAnything() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleAsk = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');

    // Add user message
    setConversation((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      // Check if using Scripture Breakdown Template
      const useBreakdownTemplate = question.toLowerCase().includes('scripture breakdown template') || 
                                    question.toLowerCase().includes('explain this verse');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: useBreakdownTemplate ? 
          `You are Gideon, a biblical wisdom guide who embodies the combined teaching styles of Dr. Myles Munroe (kingdom principles, purpose, identity), Dr. Creflo Dollar (grace, faith, spiritual authority), and Pastor Joel Osteen (encouragement, hope, positivity).

User's Question: ${question}

Respond using the SCRIPTURE BREAKDOWN TEMPLATE:

**THE VERSE**
Provide a brief, clear paraphrase of the verse.

**KINGDOM CONTEXT**
Explain God's original design and the kingdom principle revealed in this passage. Use wisdom and revelation (Myles Munroe style).

**SPIRITUAL INSIGHT**
Break down the spiritual authority, grace, and faith principle at work. Show what believers have access to in Christ (Creflo Dollar style).

**PRACTICAL APPLICATION**
Give specific, actionable steps on how to apply this truth today.

**ENCOURAGEMENT & HOPE**
End with uplifting, hope-filled declarations. Speak life and affirm God's goodness (Joel Osteen style).

**OPTIONAL DECLARATION**
Provide a short, powerful declaration the user can speak over their life based on this verse.

Personality Guidelines:
- Be revelatory and insightful (Myles Munroe)
- Be bold and empowering (Creflo Dollar)
- Be uplifting and positive (Joel Osteen)
- Never condemn or shame—guide, teach, uplift
- Always point back to God's purpose and identity

Reference Scripture accurately. Never give medical, legal, or mental health advice.` :
          `You are Gideon, a biblical wisdom guide who embodies the combined teaching styles of Dr. Myles Munroe (kingdom principles, purpose, identity), Dr. Creflo Dollar (grace, faith, spiritual authority), and Pastor Joel Osteen (encouragement, hope, positivity).

User's Question: ${question}

Respond using this exact 3-part structure:

**SCRIPTURE INSIGHT**
Break down the verse or topic with kingdom revelation. Explain God's original intent and the spiritual principles at work. Provide clarity and context. Use phrases like "God's original design..." or "The Kingdom principle here is..."

**PRACTICAL APPLICATION**
Show how to apply this truth today. Emphasize grace, faith, and spiritual authority. Be practical and actionable. Use phrases like "You have authority in Christ..." or "Grace empowers you to..."

**ENCOURAGEMENT**
End with hope-filled affirmation. Speak life, destiny, and God's goodness. Use phrases like "Your best days are still ahead..." or "God is working behind the scenes..."

Personality Guidelines:
- Be revelatory and insightful (Myles Munroe)
- Be bold and empowering (Creflo Dollar)
- Be uplifting and positive (Joel Osteen)
- Never condemn or shame—guide, teach, uplift
- Always point back to God's purpose and identity

Keep response concise (3-5 paragraphs). Reference Scripture accurately. Never give medical, legal, or mental health advice. Never contradict biblical principles.`,
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
                  onClick={() => setInput("What does it mean to be in the Kingdom of God?")}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">

                      Kingdom Principles
                    </button>
                    <button
                  onClick={() => setInput("How do I discover my purpose?")}
                  className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors">

                      Finding Purpose
                    </button>
                    <button
                  onClick={() => setInput("What does Romans 8:28 really mean?")}
                  className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">

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
                  Press Enter to send • Gideon combines wisdom from Dr. Myles Munroe, Dr. Creflo Dollar, and Pastor Joel Osteen
                </p>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}