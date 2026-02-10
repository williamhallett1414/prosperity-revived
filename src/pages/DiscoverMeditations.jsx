import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import MeditationFilters from '@/components/meditations/MeditationFilters';
import MeditationCard from '@/components/meditations/MeditationCard';

export default function DiscoverMeditations() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({}, '-created_date', 100);
      } catch {
        return [];
      }
    },
    retry: false
  });

  const { data: recentlyPlayed = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.MeditationSession.filter({}, '-created_date', 5);
      } catch {
        return [];
      }
    },
    retry: false
  });

  const filteredMeditations = useMemo(() => {
    return meditations.filter(m => {
      const matchesCategory = !categoryFilter || m.category === categoryFilter;
      const matchesSearch = !searchQuery || 
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [meditations, categoryFilter, searchQuery]);

  const recommendedMeditations = useMemo(() => {
    return meditations.filter(m => ['mindfulness', 'stress_relief', 'gratitude'].includes(m.category)).slice(0, 3);
  }, [meditations]);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors inline-flex"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
        </button>
        <h1 className="text-3xl font-bold text-[#0A1A2F] mt-4 mb-1">Guided Meditations</h1>
        <p className="text-[#0A1A2F]/60 text-sm">Find peace and spiritual renewal</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Filters */}
        <MeditationFilters 
          onFilterChange={setCategoryFilter}
          onSearch={setSearchQuery}
        />

        {/* Recommended */}
        {!categoryFilter && !searchQuery && recommendedMeditations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-4"
          >
            <h2 className="text-lg font-bold text-[#0A1A2F] mb-3">Recommended for You</h2>
            <div className="space-y-2">
              {recommendedMeditations.map((m, idx) => (
                <MeditationCard
                  key={m.id}
                  meditation={m}
                  onPlay={(med) => window.location.href = `/meditation-player?id=${med.id}`}
                  onBookmark={() => {}}
                  isBookmarked={false}
                  index={idx}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-4"
          >
            <h2 className="text-lg font-bold text-[#0A1A2F] mb-3">Recently Played</h2>
            <div className="space-y-2">
              {recentlyPlayed.slice(0, 3).map((session, idx) => {
                const meditation = meditations.find(m => m.id === session.meditation_id);
                return meditation ? (
                  <MeditationCard
                    key={session.id}
                    meditation={meditation}
                    onPlay={() => window.location.href = `/meditation-player?id=${meditation.id}`}
                    onBookmark={() => {}}
                    isBookmarked={false}
                    index={idx}
                  />
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        {/* All Meditations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-6"
        >
          <h2 className="text-lg font-bold text-[#0A1A2F] mb-3">
            {categoryFilter ? 'Filtered Meditations' : searchQuery ? 'Search Results' : 'All Meditations'}
          </h2>
          {filteredMeditations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#0A1A2F]/50">No meditations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMeditations.map((m, idx) => (
                <MeditationCard
                  key={m.id}
                  meditation={m}
                  onPlay={() => window.location.href = `/meditation-player?id=${m.id}`}
                  onBookmark={() => {}}
                  isBookmarked={false}
                  index={idx}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}