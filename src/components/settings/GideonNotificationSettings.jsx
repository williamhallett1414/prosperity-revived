import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Sun, Coffee, Zap, Moon, BookOpen, Heart, TrendingUp, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function GideonNotificationSettings() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['gideonNotificationSettings'],
    queryFn: async () => {
      const results = await base44.entities.GideonNotificationSettings.list();
      if (results.length === 0) {
        // Create default settings
        return await base44.entities.GideonNotificationSettings.create({
          morning_enabled: false,
          midday_enabled: false,
          afternoon_enabled: false,
          evening_enabled: false,
          verse_of_day_enabled: false,
          weekly_checkin_enabled: false,
          challenge_reminders_enabled: false,
          growth_prompts_enabled: false
        });
      }
      return results[0];
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => base44.entities.GideonNotificationSettings.update(settings.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['gideonNotificationSettings']);
      toast.success('Notification settings updated');
    }
  });

  const handleToggle = (field, value) => {
    updateSettingsMutation.mutate({ [field]: value });
  };

  if (!settings) return null;

  const notificationOptions = [
    {
      id: 'morning_enabled',
      title: 'Morning Greetings',
      description: 'Identity, purpose, encouragement (6-9 AM)',
      icon: Sun,
      color: 'text-orange-500'
    },
    {
      id: 'midday_enabled',
      title: 'Midday Moments',
      description: 'Peace, clarity, refocus (11 AM-1 PM)',
      icon: Coffee,
      color: 'text-[#AFC7E3]'
    },
    {
      id: 'afternoon_enabled',
      title: 'Afternoon Grace',
      description: 'Strength, perseverance, grace (3-5 PM)',
      icon: Zap,
      color: 'text-[#c9a227]'
    },
    {
      id: 'evening_enabled',
      title: 'Evening Reflection',
      description: 'Reflection, gratitude, release (7-9 PM)',
      icon: Moon,
      color: 'text-[#AFC7E3]'
    }
  ];

  const futureOptions = [
    {
      id: 'personalized_notifications_enabled',
      title: 'Personalized Notifications',
      description: 'Behavior-based spiritual encouragement',
      icon: MessageCircle,
      color: 'text-[#c9a227]',
      badge: 'Smart'
    },
    {
      id: 'verse_of_day_enabled',
      title: 'Verse of the Day',
      description: 'Daily Scripture inspiration',
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      id: 'weekly_checkin_enabled',
      title: 'Weekly Check-Ins',
      description: 'Spiritual growth reflections',
      icon: Heart,
      color: 'text-[#D9B878]'
    },
    {
      id: 'challenge_reminders_enabled',
      title: 'Challenge Reminders',
      description: 'Stay on track with your goals',
      icon: Target,
      color: 'text-red-500'
    },
    {
      id: 'growth_prompts_enabled',
      title: 'Growth Prompts',
      description: 'Personalized spiritual insights',
      icon: TrendingUp,
      color: 'text-teal-500'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-[#FAD98D]/10 to-[#FFF8E7] dark:from-[#0A1A2F]/40 dark:to-[#1a1a2e]/40 border-[#D9B878]/40 dark:border-[#c9a227]/40">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#c9a227] to-[#D9B878] rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Gideon Daily Greetings</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive spiritual encouragement throughout your day
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Daily Greetings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Daily Greetings</h3>
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{option.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[option.id]}
                  onCheckedChange={(value) => handleToggle(option.id, value)}
                />
              </div>
            );
          })}
        </div>

        {/* Future Features */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Additional Features</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            More ways to stay connected with Gideon
          </p>
          {futureOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{option.title}</p>
                      {option.badge && (
                        <span className="px-2 py-0.5 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/10 text-[#8a6e1a] dark:text-[#c9a227] text-xs font-semibold rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[option.id]}
                  onCheckedChange={(value) => handleToggle(option.id, value)}
                />
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          Notifications use Gideon's conversational tone and emotional intelligence to encourage your spiritual growth
        </p>
      </CardContent>
    </Card>
  );
}