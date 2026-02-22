import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Sparkles, Bell, Clock } from 'lucide-react';

export default function DailyReflectionSettings() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['reflectionSettings'],
    queryFn: async () => {
      const list = await base44.entities.DailyReflectionSettings.list();
      return list[0] || null;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (updates) => {
      if (settings?.id) {
        return await base44.entities.DailyReflectionSettings.update(settings.id, updates);
      } else {
        return await base44.entities.DailyReflectionSettings.create(updates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reflectionSettings']);
      toast.success('Settings updated');
    }
  });

  const handleToggle = (field, value) => {
    updateSettings.mutate({ [field]: value });
  };

  const handleTimeChange = (time) => {
    updateSettings.mutate({ reflection_time: time });
  };

  const handleFrequencyChange = (frequency) => {
    updateSettings.mutate({ suggestion_frequency: frequency });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Gideon's Proactive Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Reflections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <Label className="font-semibold">Daily Reflection Prompts</Label>
                <p className="text-xs text-gray-500">ICF-aligned questions based on your journey</p>
              </div>
            </div>
            <Switch
              checked={settings?.enabled ?? true}
              onCheckedChange={(value) => handleToggle('enabled', value)}
            />
          </div>

          {settings?.enabled && (
            <div className="ml-7 space-y-2">
              <Label className="text-sm">Preferred Time</Label>
              <Input
                type="time"
                value={settings?.reflection_time || '09:00'}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Gideon will send a personalized reflection question at this time
              </p>
            </div>
          )}
        </div>

        {/* Proactive Suggestions */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <Label className="font-semibold">AI-Driven Suggestions</Label>
                <p className="text-xs text-gray-500">Scripture & insights based on your patterns</p>
              </div>
            </div>
            <Switch
              checked={settings?.proactive_suggestions_enabled ?? true}
              onCheckedChange={(value) => handleToggle('proactive_suggestions_enabled', value)}
            />
          </div>

          {settings?.proactive_suggestions_enabled && (
            <div className="ml-7 space-y-2">
              <Label className="text-sm">Suggestion Frequency</Label>
              <Select
                value={settings?.suggestion_frequency || 'every_3_days'}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="every_3_days">Every 3 Days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Gideon analyzes your conversations and suggests relevant scriptures
              </p>
            </div>
          )}
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>How it works:</strong> Gideon uses AI to understand your spiritual journey, emotional patterns, and recurring themes—then proactively offers timely guidance, scripture, and reflection prompts tailored to what you need most.
          </p>
        </div>

        {/* Weekly Growth Summary */}
        <div className="space-y-4 pt-4 border-t mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <div>
                <Label className="font-semibold">Weekly Growth Summary</Label>
                <p className="text-xs text-gray-500">Celebrating your spiritual progress each week</p>
              </div>
            </div>
            <Switch
              checked={settings?.weekly_summary_enabled ?? true}
              onCheckedChange={(value) => handleToggle('weekly_summary_enabled', value)}
            />
          </div>

          {settings?.weekly_summary_enabled && (
            <div className="ml-7 space-y-2">
              <Label className="text-sm">Delivery Time</Label>
              <Select
                value={settings?.weekly_summary_day || 'sunday_evening'}
                onValueChange={(value) => updateSettings.mutate({ weekly_summary_day: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday_evening">Sunday Evening</SelectItem>
                  <SelectItem value="monday_morning">Monday Morning</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Gideon will send a warm summary of your weekly spiritual themes, growth areas, and coaching questions
              </p>
            </div>
          )}
        </div>

        {/* Monthly Progress Report */}
        <div className="space-y-4 pt-4 border-t mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <Label className="font-semibold">Monthly Progress Report</Label>
                <p className="text-xs text-gray-500">Deep reflection on your spiritual journey</p>
              </div>
            </div>
            <Switch
              checked={settings?.monthly_report_enabled ?? true}
              onCheckedChange={(value) => handleToggle('monthly_report_enabled', value)}
            />
          </div>

          {settings?.monthly_report_enabled && (
            <div className="ml-7 space-y-2">
              <p className="text-xs text-gray-500">
                Sent on the 1st of each month. Gideon will provide a comprehensive spiritual progress report with kingdom insights, grace perspective, and powerful coaching questions for the month ahead.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}