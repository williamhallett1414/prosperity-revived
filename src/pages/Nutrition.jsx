import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UtensilsCrossed, Link as LinkIcon } from 'lucide-react';
import { Link, useNavigate} from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PullToRefresh from '@/components/ui/PullToRefresh';
import MealTracker from '@/components/wellness/MealTracker';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import RecipeCollections from '@/components/wellness/RecipeCollections';
import PersonalizedNutritionPlan from '@/components/wellness/PersonalizedNutritionPlan';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';
import CommunityRecipeFeed from '@/components/wellness/CommunityRecipeFeed';
import IngredientRecipeBuilder from '@/components/nutrition/IngredientRecipeBuilder';
import MealPlannerCard from '@/components/nutrition/MealPlannerCard';


// Floating chat button that navigates to ChatScreen
function ChatFAB({ bot, gradFrom, gradTo }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/ChatScreen?bot=' + bot)}
      style={{
        position: 'fixed', bottom: '6rem', right: '1rem', zIndex: 40,
        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        color: 'white', borderRadius: '9999px', padding: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '56px', height: '56px',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      title={`Chat with ${bot}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}

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
    <div className="min-h-screen bg-[#F4F7F4] pb-24">
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

            {/* Weekly Meal Planner Section */}
            <div className="pt-2">
              <MealPlannerCard />
            </div>

            {/* Recipe Builder Section */}
            <div className="pt-2">
              <IngredientRecipeBuilder />
            </div>

            {/* Discover Recipes Section */}
            <div className="pt-2">
              <Link to={createPageUrl('DiscoverRecipes')}>
                <div className="bg-white border border-[#8fa68a]/20 text-[#0A1A2F] p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8fa68a] to-[#6b8f72] flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Discover Recipes</h3>
                  </div>
                  <p className="text-[#0A1A2F]/60 text-sm">Browse and create delicious recipes</p>
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
      <ChatFAB bot="ChefDaniel" gradFrom="#166534" gradTo="#22c55e" />
</div>);

}