import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Activity, Utensils } from 'lucide-react';

export default function CreateNutritionPlan({ isOpen, onClose, onPlanCreated }) {
  const [plan, setPlan] = useState({
    name: 'My Nutrition Plan',
    goal: 'maintenance',
    activity_level: 'moderately_active',
    dietary_preferences: [],
    meals_per_day: 3,
    is_active: true,
    start_date: new Date().toISOString().split('T')[0]
  });
  const [userStats, setUserStats] = useState({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'other'
  });

  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: async (data) => {
      const calculatedPlan = calculateMacros(data, userStats);
      const newPlan = await base44.entities.NutritionPlan.create(calculatedPlan);
      return newPlan;
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries(['nutrition-plans']);
      if (onPlanCreated) onPlanCreated(newPlan);
      onClose();
    }
  });

  const calculateMacros = (planData, stats) => {
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (stats.gender === 'male') {
      bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age + 5;
    } else if (stats.gender === 'female') {
      bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age - 161;
    } else {
      bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age - 78;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    let tdee = bmr * activityMultipliers[planData.activity_level];

    // Adjust for goal
    if (planData.goal === 'weight_loss') {
      tdee -= 500; // 500 calorie deficit
    } else if (planData.goal === 'muscle_gain') {
      tdee += 300; // 300 calorie surplus
    }

    // Calculate macros based on goal
    let protein, carbs, fats;
    if (planData.goal === 'muscle_gain') {
      protein = stats.weight * 2; // 2g per kg
      fats = (tdee * 0.25) / 9;
      carbs = (tdee - (protein * 4) - (fats * 9)) / 4;
    } else if (planData.goal === 'weight_loss') {
      protein = stats.weight * 1.8; // 1.8g per kg
      fats = (tdee * 0.25) / 9;
      carbs = (tdee - (protein * 4) - (fats * 9)) / 4;
    } else {
      protein = stats.weight * 1.5; // 1.5g per kg
      fats = (tdee * 0.30) / 9;
      carbs = (tdee - (protein * 4) - (fats * 9)) / 4;
    }

    return {
      ...planData,
      daily_calories: Math.round(tdee),
      protein_grams: Math.round(protein),
      carbs_grams: Math.round(carbs),
      fats_grams: Math.round(fats)
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Nutrition Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Plan name"
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
          />

          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Stats
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Weight (kg)"
                value={userStats.weight}
                onChange={(e) => setUserStats({ ...userStats, weight: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Height (cm)"
                value={userStats.height}
                onChange={(e) => setUserStats({ ...userStats, height: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Age"
                value={userStats.age}
                onChange={(e) => setUserStats({ ...userStats, age: parseInt(e.target.value) })}
              />
              <Select value={userStats.gender} onValueChange={(v) => setUserStats({ ...userStats, gender: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2">Goal</Label>
            <Select value={plan.goal} onValueChange={(v) => setPlan({ ...plan, goal: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="healthy_eating">Healthy Eating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Level
            </Label>
            <Select value={plan.activity_level} onValueChange={(v) => setPlan({ ...plan, activity_level: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="extremely_active">Extremely Active (athlete)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Meals Per Day
            </Label>
            <Select value={plan.meals_per_day.toString()} onValueChange={(v) => setPlan({ ...plan, meals_per_day: parseInt(v) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 meals</SelectItem>
                <SelectItem value="3">3 meals</SelectItem>
                <SelectItem value="4">4 meals</SelectItem>
                <SelectItem value="5">5 meals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => createPlan.mutate(plan)} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Create Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}