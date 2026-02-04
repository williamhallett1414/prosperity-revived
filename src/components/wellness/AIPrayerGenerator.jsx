import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPrayerGenerator({ isOpen, onClose, user }) {
  const [prayerType, setPrayerType] = useState('general');
  const [intention, setIntention] = useState('');
  const [biblicalTheme, setBiblicalTheme] = useState('');
  const [generatedPrayer, setGeneratedPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  
  const queryClient = useQueryClient();

  const { data: readingProgress = [] } = useQuery({
    queryKey: ['readingProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list(),
    enabled: !!user
  });

  const generatePrayer = async () => {
    setIsGenerating(true);
    try {
      const recentBibleReading = readingProgress
        .filter(p => p.completion_dates?.length > 0)
        .slice(0, 1)[0];

      const prompt = `Create a heartfelt, personal prayer based on the following:

USER CONTEXT:
- Name: ${user?.full_name?.split(' ')[0] || 'Beloved'}
- Spiritual Goal: ${user?.spiritual_goal || 'Grow closer to God'}
- Prayer Type: ${prayerType}
- Personal Intention: ${intention}
- Biblical Theme/Verse: ${biblicalTheme || 'none specified'}
${recentBibleReading ? `- Recently Reading: ${recentBibleReading.plan_name}` : ''}

PRAYER TYPES GUIDE:
- Morning: Start the day with God, seeking guidance and strength
- Evening: Reflect on the day, express gratitude, seek peace
- Gratitude: Deep thanksgiving for blessings and God's goodness
- Intercession: Praying for others, their needs and wellbeing
- Confession: Honest admission of struggles, seeking forgiveness
- Guidance: Seeking wisdom for decisions and direction
- Healing: Physical, emotional, or spiritual healing
- Strength: During difficult times, facing challenges
- General: Comprehensive prayer touching on multiple aspects

REQUIREMENTS:
1. Make it personal and conversational, as if speaking to a loving Father
2. If a biblical theme or verse is mentioned, weave it naturally into the prayer
3. Address the specific intention they shared
4. Include elements of:
   - Honest expression of current state/feelings
   - Scripture-based truth or promises
   - Specific requests aligned with their intention
   - Trust and surrender to God's will
   - A sense of peace and hope
5. Use "I/my/me" language (first person)
6. Length: 150-250 words
7. End with "In Jesus' name, Amen" or similar closing

Make it authentic, biblical, and deeply meaningful. This should feel like a genuine conversation with God.

Return ONLY the prayer text, no additional formatting or explanation.`;

      const prayer = await base44.integrations.Core.InvokeLLM({ prompt });
      
      // Generate a title
      const titlePrompt = `Based on this prayer intention: "${intention || prayerType}", create a short prayer title (max 5 words). Return only the title.`;
      const title = await base44.integrations.Core.InvokeLLM({ prompt: titlePrompt });
      
      setGeneratedPrayer(prayer);
      setGeneratedTitle(title.trim());
    } catch (error) {
      console.error('Failed to generate prayer:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePrayer = useMutation({
    mutationFn: () => base44.entities.Meditation.create({
      title: generatedTitle,
      type: 'prayer',
      duration_minutes: 5,
      script: generatedPrayer,
      category: 'prayer'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['meditations']);
      onClose();
      setGeneratedPrayer('');
      setGeneratedTitle('');
      setIntention('');
      setBiblicalTheme('');
    }
  });

  const prayerTypes = [
    { value: 'morning', label: 'Morning Prayer', icon: '🌅' },
    { value: 'evening', label: 'Evening Prayer', icon: '🌙' },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'intercession', label: 'Intercession', icon: '❤️' },
    { value: 'confession', label: 'Confession', icon: '💭' },
    { value: 'guidance', label: 'Guidance', icon: '🧭' },
    { value: 'healing', label: 'Healing', icon: '✨' },
    { value: 'strength', label: 'Strength', icon: '💪' },
    { value: 'general', label: 'General Prayer', icon: '🕊️' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            AI Prayer Generator
          </DialogTitle>
        </DialogHeader>

        {!generatedPrayer ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Share what's on your heart, and I'll help you craft a meaningful prayer. 🙏
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                What type of prayer?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {prayerTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setPrayerType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      prayerType === type.value
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What would you like to pray about?
              </label>
              <Textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="e.g., 'Strength for a difficult conversation', 'Gratitude for my family', 'Wisdom in a big decision'..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Biblical Theme or Verse (optional)
              </label>
              <Textarea
                value={biblicalTheme}
                onChange={(e) => setBiblicalTheme(e.target.value)}
                placeholder="e.g., 'Philippians 4:6-7', 'God's faithfulness', 'Trust in the Lord'..."
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                I'll weave this theme or verse into your prayer
              </p>
            </div>

            <Button
              onClick={generatePrayer}
              disabled={isGenerating || !intention.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Crafting Your Prayer...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Prayer
                </>
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{generatedTitle}</h3>
              <p className="text-white/80 text-sm">Personal prayer</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#1a1a2e] rounded-lg p-6 max-h-96 overflow-y-auto">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-serif">
                {generatedPrayer}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setGeneratedPrayer('');
                  setGeneratedTitle('');
                }}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New
              </Button>
              <Button
                onClick={() => savePrayer.mutate()}
                disabled={savePrayer.isPending}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Prayer
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}