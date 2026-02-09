import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';

export default function MeditationAdmin() {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const queryClient = useQueryClient();

  const { data: meditations = [], isLoading } = useQuery({
    queryKey: ['meditations'],
    queryFn: () => base44.entities.Meditation.list()
  });

  const generateAudio = useMutation({
    mutationFn: async (meditation) => {
      return await base44.functions.generateMeditationAudio(meditation);
    },
    onSuccess: (data) => {
      toast.success('Voice instructions generated!');
      queryClient.invalidateQueries(['meditations']);
    },
    onError: (error) => {
      toast.error(`Failed to generate audio: ${error.message}`);
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading meditations...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meditation Audio Management</h1>
      
      <div className="grid gap-4">
        {meditations.map((med) => (
          <Card key={med.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{med.title}</span>
                {med.audio_url && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <Music className="w-4 h-4" />
                    Has Audio
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{med.description}</p>
              <Button
                onClick={() => generateAudio.mutate(med)}
                disabled={generateAudio.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generateAudio.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    {med.audio_url ? 'Regenerate' : 'Generate'} Voice Instructions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}