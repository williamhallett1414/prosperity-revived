import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Dumbbell, ChefHat, BookOpen, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const chatbots = [
  { name: 'Hannah', icon: Heart, color: 'from-[#c9a227] to-[#D9B878]', description: 'Personal Growth Guide' },
  { name: 'CoachDavid', icon: Dumbbell, color: 'from-[#AFC7E3] to-[#7ab3d4]', description: 'Fitness Coach' },
  { name: 'ChefDaniel', icon: ChefHat, color: 'from-orange-500 to-red-500', description: 'Nutrition Expert' },
  { name: 'Gideon', icon: BookOpen, color: 'from-green-500 to-emerald-500', description: 'Spiritual Guide' }
];

const defaultPreferences = {
  communication_style: 'empathetic',
  tone: 'warm',
  response_length: 'balanced',
  humor_level: 'light',
  formality: 'balanced'
};

export default function ChatbotPersonalitySettings({ user }) {
  const [selectedChatbot, setSelectedChatbot] = useState('Hannah');
  const queryClient = useQueryClient();

  const { data: preferences = {} } = useQuery({
    queryKey: ['chatbotPreferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const allPrefs = await base44.entities.ChatbotPreferences.filter({
        created_by: user.email
      });
      
      const prefsMap = {};
      allPrefs.forEach(pref => {
        prefsMap[pref.chatbot_name] = pref;
      });
      return prefsMap;
    },
    enabled: !!user?.email
  });

  const currentPrefs = preferences[selectedChatbot] || { ...defaultPreferences, chatbot_name: selectedChatbot };

  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs) => {
      if (currentPrefs.id) {
        return await base44.entities.ChatbotPreferences.update(currentPrefs.id, prefs);
      } else {
        return await base44.entities.ChatbotPreferences.create({
          ...prefs,
          chatbot_name: selectedChatbot
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbotPreferences'] });
      toast.success(`${selectedChatbot} personality updated!`);
    }
  });

  const resetToDefaultMutation = useMutation({
    mutationFn: async () => {
      if (currentPrefs.id) {
        return await base44.entities.ChatbotPreferences.update(currentPrefs.id, defaultPreferences);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbotPreferences'] });
      toast.success('Reset to default settings');
    }
  });

  const [formData, setFormData] = useState(currentPrefs);

  React.useEffect(() => {
    setFormData(currentPrefs);
  }, [selectedChatbot, preferences]);

  const handleSave = () => {
    savePreferencesMutation.mutate(formData);
  };

  const handleReset = () => {
    if (currentPrefs.id) {
      resetToDefaultMutation.mutate();
    }
    setFormData({ ...defaultPreferences, chatbot_name: selectedChatbot });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chatbot Personalities</h2>
        <p className="text-gray-600">Customize how your AI guides communicate with you</p>
      </div>

      <Tabs value={selectedChatbot} onValueChange={setSelectedChatbot}>
        <TabsList className="grid w-full grid-cols-4">
          {chatbots.map((bot) => {
            const Icon = bot.icon;
            return (
              <TabsTrigger key={bot.name} value={bot.name} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{bot.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {chatbots.map((bot) => {
          const Icon = bot.icon;
          return (
            <TabsContent key={bot.name} value={bot.name}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{bot.name}</CardTitle>
                      <CardDescription>{bot.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Communication Style */}
                  <div className="space-y-2">
                    <Label htmlFor="communication_style">Communication Style</Label>
                    <Select
                      value={formData.communication_style}
                      onValueChange={(value) => setFormData({ ...formData, communication_style: value })}
                    >
                      <SelectTrigger id="communication_style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empathetic">Empathetic - Understanding and compassionate</SelectItem>
                        <SelectItem value="direct">Direct - Straightforward and to the point</SelectItem>
                        <SelectItem value="motivational">Motivational - Inspiring and energizing</SelectItem>
                        <SelectItem value="casual">Casual - Friendly and relaxed</SelectItem>
                        <SelectItem value="formal">Formal - Professional and structured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tone */}
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => setFormData({ ...formData, tone: value })}
                    >
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warm">Warm - Caring and friendly</SelectItem>
                        <SelectItem value="professional">Professional - Clear and competent</SelectItem>
                        <SelectItem value="encouraging">Encouraging - Supportive and uplifting</SelectItem>
                        <SelectItem value="straightforward">Straightforward - Honest and direct</SelectItem>
                        <SelectItem value="gentle">Gentle - Soft and nurturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Response Length */}
                  <div className="space-y-2">
                    <Label htmlFor="response_length">Response Length</Label>
                    <Select
                      value={formData.response_length}
                      onValueChange={(value) => setFormData({ ...formData, response_length: value })}
                    >
                      <SelectTrigger id="response_length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief - Concise and quick</SelectItem>
                        <SelectItem value="balanced">Balanced - Moderate detail</SelectItem>
                        <SelectItem value="detailed">Detailed - Thorough and comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Humor Level */}
                  <div className="space-y-2">
                    <Label htmlFor="humor_level">Humor Level</Label>
                    <Select
                      value={formData.humor_level}
                      onValueChange={(value) => setFormData({ ...formData, humor_level: value })}
                    >
                      <SelectTrigger id="humor_level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None - Serious and focused</SelectItem>
                        <SelectItem value="light">Light - Occasional lightheartedness</SelectItem>
                        <SelectItem value="moderate">Moderate - Balanced with humor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Formality */}
                  <div className="space-y-2">
                    <Label htmlFor="formality">Formality Level</Label>
                    <Select
                      value={formData.formality}
                      onValueChange={(value) => setFormData({ ...formData, formality: value })}
                    >
                      <SelectTrigger id="formality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual - Like talking to a friend</SelectItem>
                        <SelectItem value="balanced">Balanced - Professional but friendly</SelectItem>
                        <SelectItem value="formal">Formal - Respectful and proper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={resetToDefaultMutation.isPending}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={savePreferencesMutation.isPending}
                      className={`flex-1 bg-gradient-to-r ${bot.color} hover:opacity-90 text-white`}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card className="bg-[#F2F6FA] border-[#AFC7E3]/40">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Your chatbot will adapt its communication style immediately after you save changes. 
            Try different combinations to find what works best for you!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}