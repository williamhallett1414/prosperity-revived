import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipeCard            from '@/components/wellness/RecipeCard';
import RecipeFilters         from '@/components/wellness/RecipeFilters';
import CreateRecipeModal     from '@/components/wellness/CreateRecipeModal';
import PersonalizedRecipes   from '@/components/recommendations/PersonalizedRecipes';
import RecipeCollections     from '@/components/wellness/RecipeCollections';
import ChefDaniel            from '@/components/wellness/ChefDaniel';

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'browse',      label: 'Browse',      icon: Sparkles   },
  { id: 'mine',        label: 'My Recipes',  icon: BookOpen   },
  { id: 'community',   label: 'Community',   icon: Users      },
  { id: 'collections', label: 'Collections', icon: TrendingUp },
];

const isFiltered = (f) =>
  f.search || f.dietType !== 'all' || f.category !== 'all' || f.prepTime !== 'all';

export default function DiscoverRecipes() {
  const [user,             setUser]             = useState(null);
  const [activeTab,        setActiveTab]        = useState('browse');
  const [showCreate,       setShowCreate]       = useState(false);
  const [chefOpen,         setChefOpen]         = useState(false);
  const [filters,          setFilters]          = useState({
    search: '', dietType: 'all', category: 'all', prepTime: 'all',
  });

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn:  () => base44.entities.Recipe.list('-created_date'),
  });

  // mealLogs only needed when ChefDaniel is open
  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn:  () => base44.entities.MealLog.list('-date', 100),
    enabled:  !!user && chefOpen,
  });

  const myRecipes        = recipes.filter(r => r.created_by === user?.email);
  const communityRecipes = recipes.filter(r => r.is_shared && r.created_by !== user?.email);
  const popularRecipes   = [...communityRecipes]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 8);

  const applyFilters = (list) => {
    if (!isFiltered(filters)) return list;
    return list.filter(recipe => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!recipe.title?.toLowerCase().includes(q) &&
            !recipe.ingredients?.some(i => i.toLowerCase().includes(q))) return false;
      }
      if (filters.dietType !== 'all' && recipe.diet_type !== filters.dietType) return false;
      if (filters.category !== 'all' && recipe.category !== filters.category)   return false;
      if (filters.prepTime !== 'all') {
        const t = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
        if (filters.prepTime === 'quick'  && t >= 15)          return false;
        if (filters.prepTime === 'medium' && (t < 15 || t > 30)) return false;
        if (filters.prepTime === 'long'   && t < 30)           return false;
      }
      return true;
    });
  };

  const browseSrc    = isFiltered(filters) ? applyFilters(recipes) : popularRecipes;
  const mineSrc      = applyFilters(myRecipes);
  const communitySrc = applyFilters(communityRecipes);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#D9B878]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[#0A1A2F]">Discover Recipes</h1>
                <p className="text-xs text-[#0A1A2F]/45">{recipes.length} recipes in the library</p>
              </div>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Filters */}
          <RecipeFilters filters={filters} onFilterChange={setFilters} />

          {/* Tabs */}
          <div className="flex gap-1.5 mt-3">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-b from-[#c9a227] to-[#D9B878] text-white shadow-sm'
                    : 'bg-[#F2F6FA] text-[#0A1A2F]/45 hover:text-[#0A1A2F]/65'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* BROWSE */}
        {activeTab === 'browse' && (
          <>
            {/* Personalized picks (only when no filter active) */}
            {!isFiltered(filters) && (
              <PersonalizedRecipes user={user} allRecipes={recipes} />
            )}

            {browseSrc.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
                title="No recipes match"
                sub="Try adjusting your filters"
                action="Clear filters"
                onAction={() => setFilters({ search: '', dietType: 'all', category: 'all', prepTime: 'all' })}
              />
            ) : (
              <>
                {!isFiltered(filters) && (
                  <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest">
                    Popular · {browseSrc.length} recipes
                  </p>
                )}
                {isFiltered(filters) && (
                  <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest">
                    Results · {browseSrc.length} found
                  </p>
                )}
                <div className="space-y-3">
                  {browseSrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
                </div>
              </>
            )}
          </>
        )}

        {/* MY RECIPES */}
        {activeTab === 'mine' && (
          <>
            {myRecipes.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-[#0A1A2F]/15" />}
                title="No recipes yet"
                sub="Add your first recipe to build your personal cookbook"
                action="Add Recipe"
                onAction={() => setShowCreate(true)}
              />
            ) : mineSrc.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
                title="No matches"
                sub="None of your recipes match this filter"
                action="Clear filters"
                onAction={() => setFilters({ search: '', dietType: 'all', category: 'all', prepTime: 'all' })}
              />
            ) : (
              <div className="space-y-3">
                {mineSrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            )}
          </>
        )}

        {/* COMMUNITY */}
        {activeTab === 'community' && (
          <>
            {communityRecipes.length === 0 ? (
              <EmptyState
                icon={<Users className="w-8 h-8 text-[#0A1A2F]/15" />}
                title="No shared recipes yet"
                sub="Share your recipes so others can discover them"
                action="Add Recipe"
                onAction={() => setShowCreate(true)}
              />
            ) : communitySrc.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
                title="No matches"
                sub="Try adjusting your filters"
                action="Clear filters"
                onAction={() => setFilters({ search: '', dietType: 'all', category: 'all', prepTime: 'all' })}
              />
            ) : (
              <div className="space-y-3">
                {communitySrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            )}
          </>
        )}

        {/* COLLECTIONS */}
        {activeTab === 'collections' && (
          <RecipeCollections allRecipes={recipes} />
        )}
      </div>

      {/* ── Modals ── */}
      <CreateRecipeModal isOpen={showCreate} onClose={() => setShowCreate(false)} />

      <ChefDaniel
        user={user}
        userRecipes={myRecipes}
        mealLogs={mealLogs}
        onOpen={() => setChefOpen(true)}
        onClose={() => setChefOpen(false)}
      />
    </div>
  );
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#F2F6FA] flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="font-bold text-[#0A1A2F]/60 text-sm">{title}</p>
      {sub && <p className="text-xs text-[#0A1A2F]/35 mt-1 mb-4">{sub}</p>}
      {action && (
        <button onClick={onAction}
          className="text-xs font-bold text-[#c9a227] hover:opacity-70 transition-opacity">
          {action}
        </button>
      )}
    </div>
  );
}
