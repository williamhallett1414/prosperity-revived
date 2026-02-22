import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Heart, BookOpen, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpiritualInsightsDashboard() {
  // Fetch spiritual themes
  const { data: themes = [] } = useQuery({
    queryKey: ['spiritual-themes'],
    queryFn: () => base44.entities.SpiritualThemeInsight.filter({}, '-frequency_count', 20)
  });

  // Fetch emotional patterns
  const { data: emotions = [] } = useQuery({
    queryKey: ['emotional-patterns'],
    queryFn: () => base44.entities.EmotionalPattern.filter({}, '-occurrence_count', 20)
  });

  // Get top themes
  const topThemes = themes.slice(0, 5);
  const topEmotions = emotions.slice(0, 5);

  // Progression icons
  const progressionConfig = {
    emerging: { icon: '🌱', color: 'text-green-500', label: 'Emerging' },
    developing: { icon: '🌿', color: 'text-green-600', label: 'Developing' },
    maturing: { icon: '🌳', color: 'text-green-700', label: 'Maturing' },
    breakthrough: { icon: '✨', color: 'text-yellow-500', label: 'Breakthrough' }
  };

  if (themes.length === 0 && emotions.length === 0) {
    return (
      <div className="px-4 py-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold text-lg mb-2">Start Your Journey</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Have conversations with Gideon to unlock your spiritual insights dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-4">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Spiritual Insights</h2>
          <p className="text-sm text-gray-500">Gideon's analysis of your journey</p>
        </div>
      </div>

      {/* Spiritual Themes */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-purple-600" />
            Spiritual Themes You're Exploring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topThemes.map((theme, idx) => {
            const config = progressionConfig[theme.growth_progression] || progressionConfig.emerging;
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h4 className="font-semibold capitalize text-gray-800 dark:text-white">
                        {theme.theme_name}
                      </h4>
                      <p className={`text-xs ${config.color} font-medium`}>
                        {config.label}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-600">{theme.frequency_count}x</div>
                    <div className="text-xs text-gray-500">explored</div>
                  </div>
                </div>
                
                {theme.associated_emotions && theme.associated_emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {theme.associated_emotions.slice(0, 4).map((emotion, i) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}
                
                {theme.key_scriptures && theme.key_scriptures.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-3 h-3" />
                    <span>{theme.key_scriptures.length} scriptures connected</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Emotional Patterns */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-600" />
            Emotional Patterns Gideon Sees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topEmotions.map((emotion, idx) => (
            <motion.div
              key={emotion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold capitalize text-gray-800 dark:text-white">
                    {emotion.emotional_tone}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Intensity: <span className="font-medium">{emotion.intensity_level}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-pink-600">{emotion.occurrence_count}x</div>
                  <div className="text-xs text-gray-500">detected</div>
                </div>
              </div>
              
              {emotion.related_spiritual_themes && emotion.related_spiritual_themes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {emotion.related_spiritual_themes.slice(0, 4).map((theme, i) => (
                    <span
                      key={i}
                      className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full capitalize"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Growth Stats */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-yellow-600" />
            Your Spiritual Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{themes.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Themes Explored</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{emotions.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Emotional States</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center col-span-2">
              <div className="text-2xl font-bold text-green-600">
                {themes.filter(t => t.growth_progression === 'breakthrough' || t.growth_progression === 'maturing').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Areas of Breakthrough</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-medium mb-1">💡 How Gideon Uses This</p>
        <p className="text-xs">
          Gideon analyzes these patterns to offer more personalized guidance, proactive suggestions, 
          and scriptures that speak directly to your spiritual journey and emotional state.
        </p>
      </div>
    </div>
  );
}