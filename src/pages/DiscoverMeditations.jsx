import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Heart, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MEDITATION_LIBRARY, MEDITATION_CATEGORIES } from '@/components/wellness/MeditationLibrary';
import MeditationSessionCard from '@/components/wellness/MeditationSessionCard';
import GuidedMeditationSession from '@/components/wellness/GuidedMeditationSession';
import MeditationAnalytics from '@/components/wellness/MeditationAnalytics';
import { queueTTSJob } from '@/functions/queueTTSJob';

export default function DiscoverMeditations() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSession, setActiveSession] = useState(null);
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

  // Combine library and user meditations
  const allMeditations = [...MEDITATION_LIBRARY, ...userMeditations];
  
  // Filter by category and search
  const filteredMeditations = allMeditations.filter(med => {
    if (!med || !med.title || !med.description) return false;
    const matchesSearch = med.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isFavorited = (id) => favorites.some(f => f.meditation_id === id && f.created_by === user?.email);

  const handleBeginSession = async (session) => {
    if (!session.tts_audio_url && session.id) {
      await queueTTSJob({ meditationId: session.id });
      alert("Voice instructions are being generated. Check back in a moment.");
      return;
    }

    setActiveSession(session);
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={createPageUrl('Wellness')}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Discover Meditations</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search meditations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900">
            <TabsTrigger value="library" className="data-[state=active]:bg-purple-600">Library</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            {/* Category Filter */}
            <div className="bg-gray-900 rounded-2xl p-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {MEDITATION_CATEGORIES.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id 
                      ? 'bg-purple-600 hover:bg-purple-700 flex-shrink-0' 
                      : 'border-gray-700 text-gray-400 hover:text-white flex-shrink-0'}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Your Favorites
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {filteredMeditations
                    .filter(med => isFavorited(med.id))
                    .map((med, index) => (
                      <div key={med.id} className="relative">
                        <MeditationSessionCard
                          session={{
                            ...med,
                            id: med.id,
                            title: med.title,
                            duration: med.duration_minutes,
                            description: med.description,
                            type: med.type,
                            audio_url: med.audio_url || med.voice_instructions_url || med.guidance_audio_url,
                            _original: med
                          }}
                          onBegin={handleBeginSession}
                          index={index}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* All Meditations */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                {searchTerm || selectedCategory !== 'all' ? 'Results' : 'All Sessions'}
              </h2>
              {filteredMeditations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMeditations.map((med, index) => (
                    <div key={med.id} className="relative">
                      <MeditationSessionCard
                        session={{
                          ...med,
                          id: med.id,
                          title: med.title,
                          duration: med.duration_minutes,
                          description: med.description,
                          type: med.type,
                          audio_url: med.audio_url || med.voice_instructions_url || med.guidance_audio_url,
                          _original: med
                        }}
                        onBegin={handleBeginSession}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No meditations found. Try a different search or category.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <MeditationAnalytics user={user} />
          </TabsContent>
        </Tabs>
      </div>

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
    </div>
  );
}