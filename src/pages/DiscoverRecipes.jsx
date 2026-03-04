import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/wellness/RecipeCard';
import RecipeFilters from '@/components/wellness/RecipeFilters';
import CreateRecipeModal from '@/components/wellness/CreateRecipeModal';
import PersonalizedRecipes from '@/components/recommendations/PersonalizedRecipes';
import CommunityRecipes from '@/components/wellness/CommunityRecipes';
import RecipeCollections from '@/components/wellness/RecipeCollections';
import UniversalHeader from '@/components/navigation/UniversalHeader';


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

export default function DiscoverRecipes() {
  const [user, setUser] = useState(null);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [recipeFilters, setRecipeFilters] = useState({
    search: '',
    dietType: 'all',
    category: 'all',
    prepTime: 'all'
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date')
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const myRecipes = recipes.filter(r => r.created_by === user?.email);
  const allRecipes = recipes;
  const popularRecipes = [...allRecipes]
    .filter(r => !r.created_by || r.created_by !== user?.email)
    .slice(0, 6);

  const filteredRecipes = allRecipes.filter(recipe => {
    if (recipeFilters.search) {
      const searchLower = recipeFilters.search.toLowerCase();
      const matchesTitle = recipe.title?.toLowerCase().includes(searchLower);
      const matchesIngredients = recipe.ingredients?.some(ing => 
        ing.toLowerCase().includes(searchLower)
      );
      if (!matchesTitle && !matchesIngredients) return false;
    }

    if (recipeFilters.dietType !== 'all' && recipe.diet_type !== recipeFilters.dietType) {
      return false;
    }

    if (recipeFilters.category !== 'all' && recipe.category !== recipeFilters.category) {
      return false;
    }

    if (recipeFilters.prepTime !== 'all') {
      const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
      if (recipeFilters.prepTime === 'quick' && totalTime >= 15) return false;
      if (recipeFilters.prepTime === 'medium' && (totalTime < 15 || totalTime > 30)) return false;
      if (recipeFilters.prepTime === 'long' && totalTime < 30) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24">
      <UniversalHeader title="Discover Recipes" />

      <div className="px-4 pt-20 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#3C4E53]">Discover Recipes</h1>
          <Button
           onClick={() => setShowCreateRecipe(true)}
           className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90"
           size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
        </div>

        <RecipeFilters filters={recipeFilters} onFilterChange={setRecipeFilters} />

        {/* Personalized Recipes */}
        {recipeFilters.search === '' && recipeFilters.dietType === 'all' && recipeFilters.category === 'all' && recipeFilters.prepTime === 'all' && (
          <PersonalizedRecipes user={user} allRecipes={recipes} />
        )}

        {/* Popular Recipes */}
        {popularRecipes.length > 0 && recipeFilters.search === '' && recipeFilters.dietType === 'all' && recipeFilters.category === 'all' && recipeFilters.prepTime === 'all' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#FD9C2D]" />
              <h4 className="text-sm font-semibold text-[#0A1A2F]">Popular Recipes</h4>
            </div>
            <div className="grid gap-4">
              {popularRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* My Recipes */}
        {myRecipes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Recipes</h4>
            <div className="grid gap-4">
              {myRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Filtered Results */}
        {(recipeFilters.search || recipeFilters.dietType !== 'all' || recipeFilters.category !== 'all' || recipeFilters.prepTime !== 'all') && (
          <div>
            <h4 className="text-sm font-semibold text-[#0A1A2F] mb-3">
              Search Results ({filteredRecipes.length})
            </h4>
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recipes match your filters</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-[#0A1A2F] mb-3">Collections</h4>
          <RecipeCollections allRecipes={recipes} />
        </div>
        
        {/* Community Recipes */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-[#0A1A2F] mb-3">Community Recipes</h4>
          <CommunityRecipes />
        </div>
      </div>

      <CreateRecipeModal
        isOpen={showCreateRecipe}
        onClose={() => setShowCreateRecipe(false)}
      />
      <ChatFAB bot="ChefDaniel" gradFrom="#166534" gradTo="#22c55e" />
</div>
  );
}