import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import { MEDITATION_LIBRARY, MEDITATION_CATEGORIES } from './MeditationLibrary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CommentSection from './CommentSection';
import AIGuidedMeditationGenerator from './AIGuidedMeditationGenerator';
import AIPrayerGenerator from './AIPrayerGenerator';
import MeditationSessionCard from './MeditationSessionCard';
import GuidedMeditationSession from './GuidedMeditationSession';

export default function MeditationGuide() {
  const [activeSession, setActiveSession] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [showAIMeditation, setShowAIMeditation] = useState(false);
  const [showAIPrayer, setShowAIPrayer] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: userMeditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list(),
    enabled: !!user
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['meditation-favorites'],
    queryFn: () => base44.entities.MeditationFavorite.list(),
    enabled: !!user
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ meditationId, title }) => {
      const existing = favorites.find(f => f.meditation_id === meditationId && f.created_by === user?.email);
      if (existing) {
        return base44.entities.MeditationFavorite.delete(existing.id);
      } else {
        return base44.entities.MeditationFavorite.create({
          meditation_id: meditationId,
          meditation_title: title
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['meditation-favorites'])
  });

  const completeMeditation = useMutation({
    mutationFn: async ({ id, meditation }) => {
      const dates = meditation.completed_dates || [];
      const today = new Date().toISOString().split('T')[0];
      if (!dates.includes(today)) {
        dates.push(today);
        
        const allProgress = await base44.entities.UserProgress.list();
        const userProgress = allProgress.find(p => p.created_by === user?.email);
        const meditationCount = (userProgress?.meditations_completed || 0) + 1;
        
        await awardPoints(user?.email, 10, { meditations_completed: meditationCount });
        await checkAndAwardBadges(user?.email);
      }
      return base44.entities.Meditation.update(id, { completed_dates: dates });
    },
    onSuccess: () => queryClient.invalidateQueries(['meditations'])
  });

  // Combine library and user meditations
  const allMeditations = [...MEDITATION_LIBRARY, ...userMeditations];
  
  // Filter by category
  const filteredMeditations = selectedCategory === 'all' 
    ? allMeditations 
    : allMeditations.filter(m => m.category === selectedCategory);
  
  // Check if favorited
  const isFavorited = (id) => favorites.some(f => f.meditation_id === id && f.created_by === user?.email);

  // Progress chart data (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last30Days.map(date => {
    const count = allMeditations.filter(m => 
      m.completed_dates?.some(d => d.startsWith(date))
    ).length;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: count
    };
  });

  const typeEmoji = { meditation: '🧘', prayer: '🙏', breathing: '🌬️' };

  return (
    <div className="space-y-4">
      {/* Header with AI and Stats */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Meditation & Prayer</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className="text-purple-600 border-purple-600"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {showStats ? 'Hide' : 'Show'} Progress
        </Button>
      </div>

      {/* AI Generation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAIMeditation(true)}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-left shadow-lg"
        >
          <Sparkles className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">AI Meditation</p>
          <p className="text-xs text-white/80">Personalized for you</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAIPrayer(true)}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white text-left shadow-lg"
        >
          <Sparkles className="w-6 h-6 mb-2" />
          <p className="font-semibold text-sm">AI Prayer</p>
          <p className="text-xs text-white/80">Custom prayer prompts</p>
        </motion.button>
      </div>

      {/* Progress Chart */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4"
        >
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">30-Day Meditation History</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#6b7280" interval={6} />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="sessions" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="text-xs text-gray-500">Total Sessions</p>
              <p className="font-bold text-purple-600">{chartData.reduce((sum, d) => sum + d.sessions, 0)}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="text-xs text-gray-500">This Week</p>
              <p className="font-bold text-purple-600">{chartData.slice(-7).reduce((sum, d) => sum + d.sessions, 0)}</p>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <p className="text-xs text-gray-500">Favorites</p>
              <p className="font-bold text-purple-600">{favorites.length}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Discover Meditations Link */}
      <Link to={createPageUrl('DiscoverMeditations')}>
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Discover All Meditations</h3>
          </div>
          <p className="text-white/90 text-sm">Browse our full library of guided sessions</p>
        </div>
      </Link>

      {/* Active meditation session */}
      {activeSession && (
        <GuidedMeditationSession
          session={activeSession}
          user={user}
          onComplete={() => {
            queryClient.invalidateQueries(['meditations']);
            setActiveSession(null);
          }}
          onClose={() => setActiveSession(null)}
        />
      )}

      {/* AI Generators */}
      <AIGuidedMeditationGenerator
        isOpen={showAIMeditation}
        onClose={() => setShowAIMeditation(false)}
        user={user}
      />
      <AIPrayerGenerator
        isOpen={showAIPrayer}
        onClose={() => setShowAIPrayer(false)}
        user={user}
      />
    </div>
  );
}