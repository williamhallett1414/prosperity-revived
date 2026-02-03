import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import { MEDITATION_LIBRARY, MEDITATION_CATEGORIES } from './MeditationLibrary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MeditationGuide() {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showStats, setShowStats] = useState(false);
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
      {/* Stats Toggle */}
      <div className="flex justify-end">
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

      {/* Category Filter */}
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MEDITATION_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-purple-600 hover:bg-purple-700 flex-shrink-0' : 'flex-shrink-0'}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Meditations List */}
      <div className="space-y-3">
        {filteredMeditations.map((med, index) => {
          const today = new Date().toISOString().split('T')[0];
          const completedToday = med.completed_dates?.includes(today);
          const favorited = isFavorited(med.id);

          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#2d2d4a] rounded-2xl overflow-hidden shadow-sm"
            >
              {med.image_url && (
                <img src={med.image_url} alt={med.title} className="w-full h-32 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">
                      {typeEmoji[med.type]} {med.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{med.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite.mutate({ meditationId: med.id, title: med.title })}
                    className={favorited ? 'text-red-500' : 'text-gray-400'}
                  >
                    <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{med.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{med.completed_dates?.length || 0} times</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedMeditation(med)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Begin Session
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedMeditation && (
        <Dialog open={!!selectedMeditation} onOpenChange={() => setSelectedMeditation(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMeditation.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{selectedMeditation.description}</p>
              
              {selectedMeditation.script && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMeditation.script}
                  </p>
                </div>
              )}

              {selectedMeditation.audio_url && (
                <audio controls className="w-full">
                  <source src={selectedMeditation.audio_url} />
                </audio>
              )}

              <Button
                onClick={() => {
                  if (selectedMeditation.created_by) {
                    completeMeditation.mutate({ id: selectedMeditation.id, meditation: selectedMeditation });
                  }
                  setSelectedMeditation(null);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {selectedMeditation.created_by ? 'Complete Session' : 'Done'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}