import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Dumbbell, Apple, Brain, Target, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function InterestsGoalsEditor({ user }) {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      toast.success('Profile updated!');
      setEditMode(null);
      setInputValue('');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const sections = [
    {
      key: 'spiritual',
      title: 'Spiritual Growth',
      icon: Heart,
      color: 'purple',
      interestsField: 'spiritual_interests',
      goalsField: 'spiritual_goals',
      interestsPlaceholder: 'e.g., Prayer, Bible study, Worship',
      goalsPlaceholder: 'e.g., Read the Bible daily, Grow in faith'
    },
    {
      key: 'personal',
      title: 'Personal Growth',
      icon: Brain,
      color: 'pink',
      interestsField: 'personal_growth_interests',
      goalsField: 'personal_growth_goals',
      interestsPlaceholder: 'e.g., Emotional intelligence, Mindfulness',
      goalsPlaceholder: 'e.g., Build better habits, Improve relationships'
    },
    {
      key: 'fitness',
      title: 'Fitness',
      icon: Dumbbell,
      color: 'blue',
      interestsField: 'fitness_interests',
      goalsField: 'fitness_goals',
      interestsPlaceholder: 'e.g., Strength training, Yoga, Running',
      goalsPlaceholder: 'e.g., Lose 10 lbs, Run a 5K, Build muscle'
    },
    {
      key: 'nutrition',
      title: 'Nutrition',
      icon: Apple,
      color: 'green',
      interestsField: 'nutrition_interests',
      goalsField: 'nutrition_goals',
      interestsPlaceholder: 'e.g., Meal prep, Plant-based, Low-carb',
      goalsPlaceholder: 'e.g., Eat more vegetables, Track macros'
    }
  ];

  const handleAddItem = (field, section) => {
    if (!inputValue.trim()) return;
    
    const currentItems = user[field] || [];
    const newItems = [...currentItems, inputValue.trim()];
    
    updateUser.mutate({ [field]: newItems });
  };

  const handleRemoveItem = (field, index) => {
    const currentItems = user[field] || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    
    updateUser.mutate({ [field]: newItems });
  };

  const colorClasses = {
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      icon: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      icon: 'text-pink-600 dark:text-pink-400',
      badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
      button: 'bg-pink-600 hover:bg-pink-700'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const Icon = section.icon;
        const colors = colorClasses[section.color];
        const interests = user[section.interestsField] || [];
        const goals = user[section.goalsField] || [];

        return (
          <Card key={section.key} className={`p-4 ${colors.bg} ${colors.border}`}>
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-5 h-5 ${colors.icon}`} />
              <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interests
                </label>
                {editMode !== `${section.key}-interests` && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditMode(`${section.key}-interests`)}
                    className="h-7"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              {editMode === `${section.key}-interests` && (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={section.interestsPlaceholder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(section.interestsField, section);
                      } else if (e.key === 'Escape') {
                        setEditMode(null);
                        setInputValue('');
                      }
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddItem(section.interestsField, section)}
                    className={colors.button}
                    disabled={!inputValue.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditMode(null);
                      setInputValue('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {interests.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No interests added yet
                  </p>
                )}
                {interests.map((interest, idx) => (
                  <Badge key={idx} className={`${colors.badge} flex items-center gap-1`}>
                    {interest}
                    <button
                      onClick={() => handleRemoveItem(section.interestsField, idx)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Goals
                </label>
                {editMode !== `${section.key}-goals` && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditMode(`${section.key}-goals`)}
                    className="h-7"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              {editMode === `${section.key}-goals` && (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={section.goalsPlaceholder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(section.goalsField, section);
                      } else if (e.key === 'Escape') {
                        setEditMode(null);
                        setInputValue('');
                      }
                    }}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddItem(section.goalsField, section)}
                    className={colors.button}
                    disabled={!inputValue.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditMode(null);
                      setInputValue('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {goals.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No goals added yet
                  </p>
                )}
                {goals.map((goal, idx) => (
                  <Badge key={idx} className={`${colors.badge} flex items-center gap-1`}>
                    {goal}
                    <button
                      onClick={() => handleRemoveItem(section.goalsField, idx)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}