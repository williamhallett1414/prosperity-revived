import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function MeditationGuide() {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const queryClient = useQueryClient();

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list()
  });

  const completeMeditation = useMutation({
    mutationFn: ({ id, meditation }) => {
      const dates = meditation.completed_dates || [];
      const today = new Date().toISOString().split('T')[0];
      if (!dates.includes(today)) {
        dates.push(today);
      }
      return base44.entities.Meditation.update(id, { completed_dates: dates });
    },
    onSuccess: () => queryClient.invalidateQueries(['meditations'])
  });

  const typeEmoji = { meditation: '🧘', prayer: '🙏', breathing: '🌬️' };

  return (
    <div className="space-y-4">
      {meditations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400">No guided sessions yet</p>
        </div>
      ) : (
        meditations.map((med, index) => {
          const today = new Date().toISOString().split('T')[0];
          const completedToday = med.completed_dates?.includes(today);

          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">
                    {typeEmoji[med.type]} {med.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{med.description}</p>
                </div>
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
            </motion.div>
          );
        })
      )}

      {selectedMeditation && (
        <Dialog open={!!selectedMeditation} onOpenChange={() => setSelectedMeditation(null)}>
          <DialogContent className="max-w-lg">
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
                  completeMeditation.mutate({ id: selectedMeditation.id, meditation: selectedMeditation });
                  setSelectedMeditation(null);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}