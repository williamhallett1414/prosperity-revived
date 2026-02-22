import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChefHat, Clock, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RecipeRecommendationEngine({ user }) {
  const [cuisine, setCuisine] = useState('all');
  const [dietType, setDietType] = useState('all');
  const [maxCookTime, setMaxCookTime] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user's meal logs
  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs', user?.email],
    queryFn: () => base44.entities.MealLog.filter({ created_by: user.email }, '-created_date', 30),
    enabled: !!user
  });

  // Fetch user's saved recipes
  const { data: userRecipes = [] } = useQuery({
    queryKey: ['userRecipes', user?.email],
    queryFn: () => base44.entities.Recipe.filter({ created_by: user.email }),
    enabled: !!user
  });

  // Fetch all community recipes
  const { data: allRecipes = [] } = useQuery({
    queryKey: ['allRecipes'],
    queryFn: () => base44.entities.Recipe.list('-likes', 100)
  });

  const generateRecommendations = async () => {
    if (!user) {
      toast.error('Please log in to get recommendations');
      return;
    }

    setIsGenerating(true);

    try {
      // Build user context
      const recentMeals = mealLogs.slice(0, 10).map(m => m.description).join(', ');
      const savedRecipeTitles = userRecipes.map(r => `${r.title} (${r.category})`).join(', ');
      
      // Filter recipes based on criteria
      let filteredRecipes = allRecipes.filter(recipe => {
        if (dietType !== 'all' && recipe.diet_type !== dietType) return false;
        if (maxCookTime !== 'all') {
          const maxTime = parseInt(maxCookTime);
          const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
          if (totalTime > maxTime) return false;
        }
        return true;
      });

      // Use AI to analyze and recommend
      const prompt = `You are Chef Daniel, a personalized nutrition and recipe expert.

USER CONTEXT:
- Recent meals: ${recentMeals || 'None logged'}
- Saved recipes: ${savedRecipeTitles || 'None saved'}
- Preferred diet: ${dietType === 'all' ? 'No restrictions' : dietType}
- Preferred cuisine: ${cuisine === 'all' ? 'Any' : cuisine}
- Max cooking time: ${maxCookTime === 'all' ? 'No limit' : maxCookTime + ' minutes'}
- Skill level: ${difficulty === 'all' ? 'Any' : difficulty}

AVAILABLE RECIPES:
${filteredRecipes.slice(0, 50).map((r, i) => `${i + 1}. ${r.title} - ${r.category} - ${r.diet_type} - ${(r.prep_time_minutes || 0) + (r.cook_time_minutes || 0)} min`).join('\n')}

TASK:
Analyze the user's eating patterns and preferences. Recommend 5-8 recipes that:
1. Match their dietary preferences
2. Complement their recent meal history (variety and balance)
3. Align with their cuisine preference
4. Fit their time and skill constraints
5. Offer nutritional balance

Return a JSON array of recipe recommendations with this exact structure:
[
  {
    "title": "exact recipe title from the list",
    "reason": "one warm, personal sentence explaining why this recipe is perfect for them",
    "highlight": "key benefit (e.g., 'High protein', 'Quick & easy', 'Gut-healthy')"
  }
]

Be conversational and encouraging in your reasons. Think like a personal chef who knows this user.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  reason: { type: "string" },
                  highlight: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Match recommendations to actual recipe objects
      const recommendedRecipes = response.recommendations
        .map(rec => {
          const recipe = filteredRecipes.find(r => r.title === rec.title);
          return recipe ? { ...recipe, reason: rec.reason, highlight: rec.highlight } : null;
        })
        .filter(r => r !== null);

      setRecommendations(recommendedRecipes);
      toast.success(`Found ${recommendedRecipes.length} personalized recommendations!`);
    } catch (error) {
      console.error('Recommendation error:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalTime = (recipe) => (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="w-8 h-8 text-[#AFC7E3]" />
          <h1 className="text-3xl font-bold text-[#0A1A2F]">Recipe Recommendations</h1>
        </div>
        <p className="text-[#0A1A2F]/60">Personalized suggestions based on your tastes and goals</p>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-[#F2F6FA] to-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FD9C2D]" />
            Customize Your Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0A1A2F]/70 mb-2 block">Cuisine</label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Cuisine</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#0A1A2F]/70 mb-2 block">Diet Type</label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Diet</SelectItem>
                  <SelectItem value="any">No Restrictions</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="gluten_free">Gluten-Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#0A1A2F]/70 mb-2 block">Max Cook Time</label>
              <Select value={maxCookTime} onValueChange={setMaxCookTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">No Limit</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#0A1A2F]/70 mb-2 block">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F] font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4 mr-2" />
                Get Personalized Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0A1A2F] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FD9C2D]" />
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-t-xl overflow-hidden">
                    {recipe.image_url ? (
                      <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#FD9C2D] text-white">{recipe.highlight}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-[#0A1A2F]">{recipe.title}</h3>
                    <p className="text-sm text-[#0A1A2F]/70 italic">"{recipe.reason}"</p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#0A1A2F]/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{totalTime(recipe)} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        <span>{recipe.calories || '~'} cal</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">{recipe.category}</Badge>
                      {recipe.diet_type !== 'any' && (
                        <Badge variant="outline" className="text-xs">{recipe.diet_type}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recommendations.length === 0 && !isGenerating && (
        <Card className="text-center py-12">
          <ChefHat className="w-16 h-16 text-[#AFC7E3] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#0A1A2F] mb-2">Ready to Discover Amazing Recipes?</h3>
          <p className="text-[#0A1A2F]/60 mb-4">Set your preferences and let Chef Daniel find the perfect recipes for you</p>
        </Card>
      )}
    </div>
  );
}