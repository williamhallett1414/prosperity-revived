import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UtensilsCrossed, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PullToRefresh from '@/components/ui/PullToRefresh';
import MealTracker from '@/components/wellness/MealTracker';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import RecipeCollections from '@/components/wellness/RecipeCollections';
import PersonalizedNutritionPlan from '@/components/wellness/PersonalizedNutritionPlan';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';
import ChefDaniel from '@/components/wellness/ChefDaniel';
import CommunityRecipeFeed from '@/components/wellness/CommunityRecipeFeed';

export default function Nutrition() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const handleRefresh = async () => {
    await Promise.all([
    queryClient.invalidateQueries(['mealLogs']),
    queryClient.invalidateQueries(['recipes']),
    queryClient.invalidateQueries(['waterLogs'])]
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 pt-6 pb-6">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Today's Nutrition Section */}
            <div className="pt-2">
              <NutritionDashboard mealLogs={mealLogs} />
            </div>

            {/* Suggested Meals Section */}
            <div className="pt-2">
              <MealSuggestions />
            </div>

            {/* Discover Recipes Section */}
            <div className="pt-2">
              <Link to={createPageUrl('DiscoverRecipes')}>
                <div className="bg-slate-50 text-[#0A1A2F] p-5 rounded-2xl from-[#D9B878] to-[#AFC7E3] cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <UtensilsCrossed className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Discover Recipes</h3>
                  </div>
                  <p className="text-[#0A1A2F]/70 text-sm">Browse and create delicious recipes</p>
                </div>
              </Link>
            </div>

            {/* Trending Nutrition Articles Section */}
            <div className="pt-2">
              <TrendingNutritionArticles />
            </div>

            {/* Meal Tracker Section */}
            <div className="pt-2">
              <MealTracker />
            </div>

            {/* Personalized Nutrition Plan Section */}
            <div className="pt-2">
              <PersonalizedNutritionPlan />
            </div>

            {/* Community Feed Section */}
            <div className="pt-2">
              <CommunityRecipeFeed user={user} />
            </div>
          </div>
        </PullToRefresh>
      </div>

      {/* Chef Daniel - Nutrition Chat */}
      <ChefDaniel
        user={user}
        userRecipes={[]}
        mealLogs={mealLogs} />

    </div>);

}