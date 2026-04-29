import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UtensilsCrossed, Coffee, Sun, Sunset, Moon } from 'lucide-react';
import { toast } from 'sonner';

export default function ChefDanielNotificationSettings({ user }) {
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings } = useQuery({
    queryKey: ['chefDanielNotificationSettings', user?.email],
    queryFn: async () => {
      try {
        const results = await base44.entities.ChefDanielNotificationSettings.filter({ created_by: user.email });
        if (results.length === 0) {
          return await base44.entities.ChefDanielNotificationSettings.create({
            morning_enabled: false, midday_enabled: false,
            afternoon_enabled: false, evening_enabled: false
          });
        }
        return results[0];
      } catch { return null; }
    },
    enabled: !!user,
    retry: false,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updates) => base44.entities.ChefDanielNotificationSettings.update(settings.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chefDanielNotificationSettings'] ,
    onError: () => {},
  });
      toast.success('Notification settings updated');
    }
  });

  const notificationOptions = [
    {
      id: 'morning_enabled',
      title: 'Morning Tips',
      description: 'Breakfast ideas, prep shortcuts, nutrition boosts (7-10 AM)',
      icon: Coffee,
      color: 'text-amber-600'
    },
    {
      id: 'midday_enabled',
      title: 'Midday Tips',
      description: 'Lunch ideas, flavor tricks, gut-friendly swaps (12-2 PM)',
      icon: Sun,
      color: 'text-yellow-500'
    },
    {
      id: 'afternoon_enabled',
      title: 'Afternoon Tips',
      description: 'Technique tips, ingredient hacks, dinner prep (3-5 PM)',
      icon: Sunset,
      color: 'text-orange-500'
    },
    {
      id: 'evening_enabled',
      title: 'Evening Tips',
      description: 'Healthy habits, digestion tips, next-day prep (7-9 PM)',
      icon: Moon,
      color: 'text-[#3C4E53]'
    }
  ];

  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-[#AFC7E3]" />
          Chef Daniel's Daily Tips
        </CardTitle>
        <CardDescription>
          Get personalized cooking, nutrition, and technique tips throughout your day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.id} className="flex items-start gap-4 p-4 rounded-lg bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-gray-100 transition-colors">
              <div className={`mt-1 ${option.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{option.title}</h4>
                  <Switch
                    checked={settings[option.id]}
                    onCheckedChange={(checked) => {
                      updateSettingsMutation.mutate({ [option.id]: checked });
                    }}
                  />
                </div>
                <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60">{option.description}</p>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-[#F2F6FA]">
          <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60">
            💡 Each notification includes a warm greeting, practical cooking tip, and a coaching question to inspire your culinary journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}