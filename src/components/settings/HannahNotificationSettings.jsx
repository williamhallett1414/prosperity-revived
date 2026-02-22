import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sun, Cloud, Zap, Moon, Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function HannahNotificationSettings({ user }) {
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['hannahNotificationSettings', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      try {
        const result = await base44.entities.HannahNotificationSettings.filter(
          { created_by: user.email },
          '-created_date',
          1
        );
        return result[0] || null;
      } catch {
        return null;
      }
    },
    enabled: !!user?.email
  });

  // Create or update settings
  const updateSettings = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return await base44.entities.HannahNotificationSettings.update(settings.id, data);
      } else {
        return await base44.entities.HannahNotificationSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hannahNotificationSettings'] });
      toast.success('Notification settings saved!');
    },
    onError: () => {
      toast.error('Failed to save settings');
    }
  });

  const handleToggle = (field) => {
    updateSettings.mutate({
      ...settings,
      [field]: !settings?.[field]
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  const notificationOptions = [
    {
      field: 'morning_enabled',
      title: '🌅 Morning Mindset',
      description: '6–9 AM',
      detail: 'Identity, intention, habit formation, emotional grounding',
      icon: Sun,
      color: 'from-orange-100 to-yellow-100'
    },
    {
      field: 'midday_enabled',
      title: '☀️ Midday Check-In',
      description: '11 AM–1 PM',
      detail: 'Stress check-ins, emotional regulation, productivity resets',
      icon: Cloud,
      color: 'from-blue-100 to-cyan-100'
    },
    {
      field: 'afternoon_enabled',
      title: '⚡ Afternoon Motivation',
      description: '3–5 PM',
      detail: 'Motivation, resilience, reframing, energy awareness',
      icon: Zap,
      color: 'from-yellow-100 to-orange-100'
    },
    {
      field: 'evening_enabled',
      title: '🌙 Evening Reflection',
      description: '7–9 PM',
      detail: 'Reflection, gratitude, self-compassion, emotional processing',
      icon: Moon,
      color: 'from-purple-100 to-pink-100'
    }
  ];

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Hannah Daily Mindset Notifications</CardTitle>
            <CardDescription>Get personalized mindset reminders throughout your day</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          const isEnabled = settings?.[option.field] || false;

          return (
            <motion.div
              key={option.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border border-purple-200 transition-all ${
                isEnabled
                  ? `bg-gradient-to-r ${option.color}`
                  : 'bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{option.detail}</p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(option.field)}
                  disabled={updateSettings.isPending}
                />
              </div>
            </motion.div>
          );
        })}

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <p className="text-xs text-purple-900 leading-relaxed">
            <span className="font-semibold">💡 What Hannah Does:</span> Each notification includes a warm, emotionally intelligent greeting, a mindset insight rooted in habit science, psychology, and personal development, plus a gentle coaching question to help you reflect and grow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}