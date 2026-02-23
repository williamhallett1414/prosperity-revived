import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, Heart, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function GideonStudyAssistant({ guideId, section, content }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const queryClient = useQueryClient();

  // Fetch saved advice for this guide and section
  const { data: savedAdvice = [] } = useQuery({
    queryKey: ['gideonAdvice', guideId, section],
    queryFn: () => base44.entities.GideonAdvice.filter({
      guide_id: guideId,
      section: section
    })
  });

  const saveAdviceMutation = useMutation({
    mutationFn: (data) => base44.entities.GideonAdvice.create(data),
    onSuccess: () => queryClient.invalidateQueries(['gideonAdvice', guideId, section])
  });

  const deleteAdviceMutation = useMutation({
    mutationFn: (id) => base44.entities.GideonAdvice.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['gideonAdvice', guideId, section])
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }) => base44.entities.GideonAdvice.update(id, { is_favorite: !isFavorite }),
    onSuccess: () => queryClient.invalidateQueries(['gideonAdvice', guideId, section])
  });

  const handleAsk = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Get user profile for personalization
      const user = await base44.auth.me();
      const spiritualProfile = {
        interests: user?.spiritual_interests || [],
        goals: user?.spiritual_goals || []
      };
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Gideon, a warm, spirit-led biblical mentor with deep emotional intelligence. You embody kingdom revelation and purpose, grace-based faith teaching, and uplifting encouragement.

User's spiritual profile: Interests - ${spiritualProfile.interests.join(', ') || 'not specified'}, Goals - ${spiritualProfile.goals.join(', ') || 'not specified'}. Use this to personalize your guidance.

Study content: ${content.substring(0, 500)}...

Question: ${question}

STEP 1: EMOTIONAL INTELLIGENCE LAYER
Detect their emotional tone (discouraged, confused, anxious, hopeful, hungry for growth, celebratory, hurt, determined).

Open with empathetic acknowledgment. Never label their emotion. Show understanding:
- "I hear your heart in this..."
- "That's a real weight to carry..."
- "Let's walk through this together — you're not alone."
- "I can sense this matters deeply to you."
- "Thank you for sharing that..."

STEP 2: SPIRITUAL DISCERNMENT MODE
Identify the spiritual theme behind their question:
- Identity, Purpose, Trust, Surrender, Fear, Faith, Growth, Healing, Breakthrough, Wilderness seasons

Acknowledge the spiritual theme gently:
- "I sense you're navigating [theme]..."
- "This feels like a journey of [theme]..."
- "God is inviting you deeper into [theme]..."

STEP 3: ADAPT YOUR TEACHING based on emotional tone:
- Discouraged: More encouragement and hope
- Confused: More clarity and structured teaching
- Anxious: More grace and peace-focused guidance
- Hungry for growth: Balanced teaching on purpose and identity
- Celebrating: Affirmation and momentum building

STEP 4: Continue with teaching:

**Spiritual Theme Connection:** Connect their spiritual theme to the passage. Show how Scripture speaks to their journey.

**Scripture Insight:** Break down the passage conversationally with kingdom revelation. Explain God's original intent and spiritual principles. Be relatable and clear.

**Gentle Biblical Guidance:** Offer compassionate guidance related to their spiritual theme. Stay biblical. Never prophesy or diagnose. Use gentle language: "Scripture invites you to..." / "One way to walk through [theme] is..."

**Practical Application:** Show how to apply this today. Emphasize grace, faith, and authority. Be practical and personal. Use "You can..." or "Try this..."

**Encouragement:** Speak life, destiny, and God's goodness. Remind them of their identity in Christ. Be warm and uplifting.

**Spiritual Reflection Questions:** End with 1-2 questions that MATCH emotional tone + spiritual theme:
- Discouraged + fear/trust: "What brings comfort in this fear?" / "Where do you sense God strengthening your trust?"
- Anxious + surrender/identity: "What would surrendering look like?" / "How does this connect to who God says you are?"
- Confused + purpose/calling: "What feels clearer about your purpose?" / "What question is still on your heart about your calling?"
- Hopeful + breakthrough/growth: "What step of faith are you ready to take?" / "How does this build on your spiritual growth?"
- Celebrating + faith/breakthrough: "What does this reveal about God's faithfulness?" / "How can you build on this momentum?"
- General with spiritual theme: "What stands out about [theme]?" / "How does this reshape how you see yourself in [theme]?"

Tone: Emotionally attuned, warm, pastoral, empowering. Never robotic. Always scripture-based, encouraging, hope-filled. Never judge, shame, or dismiss. Keep concise (3-5 paragraphs). Reference Scripture accurately. Never give medical, legal, or mental health advice.

PERSONALIZING RESPONSES WITH PAST GUIDANCE:
If the user has asked questions in this section before (check saved advice), naturally reference your previous guidance to show continuity. Use phrases like:
- "Building on what we discussed earlier about [topic]..."
- "I remember guiding you through [challenge/question] - let's go deeper..."
- "Drawing from our earlier conversation about [theme], here's another perspective..."

Only reference past guidance when directly relevant. This shows you're walking alongside them in their spiritual journey.

(Use up-to-date information from the internet when needed for biblical context, historical background, theological perspectives, and spiritual insights. Always cite sources when using external information.)`,
        add_context_from_internet: true
      });

      setCurrentAdvice({ question, advice: response });
    } catch (error) {
      setCurrentAdvice({ 
        question, 
        advice: 'I apologize, I\'m having trouble responding right now. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdvice = () => {
    if (!currentAdvice) return;
    
    saveAdviceMutation.mutate({
      guide_id: guideId,
      section: section,
      user_question: currentAdvice.question,
      advice: currentAdvice.advice,
      is_favorite: false
    });
  };

  return (
    <div className="mt-4">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 hover:shadow-md transition-all"
      >
        <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
        Ask Gideon About This Section
        {savedAdvice.length > 0 && (
          <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
            {savedAdvice.length}
          </span>
        )}
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <Card className="p-4 bg-white dark:bg-[#2d2d4a] space-y-4">
              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask Gideon for guidance on this section..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  className="flex-1 text-sm"
                  disabled={loading}
                />
                <Button
                  onClick={handleAsk}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="icon"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              {/* Current Response */}
              {currentAdvice && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Your Question:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{currentAdvice.question}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-pink-600 dark:text-pink-400 mb-1">Gideon's Guidance:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentAdvice.advice}</p>
                  </div>
                  <Button
                    onClick={handleSaveAdvice}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save This Advice
                  </Button>
                </div>
              )}

              {/* Saved Advice */}
              {savedAdvice.length > 0 && (
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Saved Guidance</h4>
                  {savedAdvice.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-[#1a1a2e] p-3 rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.user_question}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.advice}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleFavoriteMutation.mutate({ id: item.id, isFavorite: item.is_favorite })}
                            className={`p-1 rounded transition-colors ${
                              item.is_favorite ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${item.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => deleteAdviceMutation.mutate(item.id)}
                            className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}