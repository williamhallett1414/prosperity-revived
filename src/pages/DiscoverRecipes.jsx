import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, Plus, Sparkles, TrendingUp, Users, BookOpen,
  ShoppingCart, ArrowUpDown, Heart
} from 'lucide-react';
import RecipeCard          from '@/components/wellness/RecipeCard';
import RecipeFilters       from '@/components/wellness/RecipeFilters';
import CreateRecipeModal   from '@/components/wellness/CreateRecipeModal';
import PersonalizedRecipes from '@/components/recommendations/PersonalizedRecipes';
import RecipeCollections   from '@/components/wellness/RecipeCollections';
import GroceryListDrawer   from '@/components/wellness/GroceryListDrawer';
import ChefDaniel          from '@/components/wellness/ChefDaniel';
import HealthRecipesTab    from '@/components/wellness/HealthRecipesTab';
import { RECIPE_CONDITION_MAP } from '@/components/wellness/HealthRecipeSeed';
import { useGroceryList }  from '@/hooks/useGroceryList';

// ─── constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'all',         label: 'All',         icon: Sparkles   },
  { id: 'health',      label: 'Health',      icon: Heart      },
  { id: 'mine',        label: 'My Recipes',  icon: BookOpen   },
  { id: 'community',   label: 'Community',   icon: Users      },
  { id: 'collections', label: 'Collections', icon: TrendingUp },
];

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Newest'  },
  { value: 'popular', label: 'Popular' },
  { value: 'az',      label: 'A – Z'   },
  { value: 'fastest', label: 'Fastest' },
];

const isFiltered = (f) =>
  f.search || f.dietType !== 'all' || f.category !== 'all' || f.prepTime !== 'all';

function applySort(list, sort) {
  const sorted = [...list];
  if (sort === 'popular') sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  else if (sort === 'az')  sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  else if (sort === 'fastest') sorted.sort((a, b) => {
    const ta = (a.prep_time_minutes || 0) + (a.cook_time_minutes || 0);
    const tb = (b.prep_time_minutes || 0) + (b.cook_time_minutes || 0);
    return ta - tb;
  });
  return sorted;
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#F2F6FA] flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="font-bold text-[#0A1A2F]/60 text-sm">{title}</p>
      {sub    && <p className="text-xs text-[#0A1A2F]/35 mt-1 mb-4">{sub}</p>}
      {action && (
        <button onClick={onAction}
          className="text-xs font-bold text-[#c9a227] hover:opacity-70 transition-opacity">
          {action}
        </button>
      )}
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────
export default function DiscoverRecipes() {
  const [user,       setUser]       = useState(null);
  const [activeTab,  setActiveTab]  = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [chefOpen,   setChefOpen]   = useState(false);
  const [showSort,   setShowSort]   = useState(false);
  const [sort,       setSort]       = useState('newest');
  const [filters,    setFilters]    = useState({
    search: '', dietType: 'all', category: 'all', prepTime: 'all',
  });

  const { totalCount } = useGroceryList();

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn:  () => base44.entities.Recipe.list('-created_date'),
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn:  () => base44.entities.MealLog.list('-date', 100),
    enabled:  !!user && chefOpen,
  });

  const myRecipes        = recipes.filter(r => r.created_by === user?.email);
  const communityRecipes = recipes.filter(r => r.is_shared && r.created_by !== user?.email);
  const healthRecipes    = recipes.filter(r =>
    (r.health_conditions?.length > 0) || (RECIPE_CONDITION_MAP[r.title]?.length > 0)
  );

  const filterList = (list) => {
    if (!isFiltered(filters)) return list;
    return list.filter(r => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.title?.toLowerCase().includes(q) &&
            !r.ingredients?.some(i => i.toLowerCase().includes(q))) return false;
      }
      if (filters.dietType !== 'all' && r.diet_type !== filters.dietType) return false;
      if (filters.category !== 'all' && r.category !== filters.category)   return false;
      if (filters.prepTime !== 'all') {
        const t = (r.prep_time_minutes || 0) + (r.cook_time_minutes || 0);
        if (filters.prepTime === 'quick'  && t >= 15)            return false;
        if (filters.prepTime === 'medium' && (t < 15 || t > 30)) return false;
        if (filters.prepTime === 'long'   && t < 30)             return false;
      }
      return true;
    });
  };

  const allSrc       = applySort(filterList(recipes),          sort);
  const mineSrc      = applySort(filterList(myRecipes),        sort);
  const communitySrc = applySort(filterList(communityRecipes), sort);
  const clearFilters = () => setFilters({ search: '', dietType: 'all', category: 'all', prepTime: 'all' });

  const activeSort = SORT_OPTIONS.find(o => o.value === sort);

  const counts = {
    all:       allSrc.length,
    health:    healthRecipes.length,
    mine:      mineSrc.length,
    community: communitySrc.length,
  };

  // Hide sort + filters on health tab (has its own filtering)
  const showFilters = activeTab !== 'health' && activeTab !== 'collections';

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#D9B878]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto space-y-3">

          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[#0A1A2F]">Discover Recipes</h1>
                <p className="text-xs text-[#0A1A2F]/45">
                  {isLoading ? 'Loading…' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} in the library`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort — hidden on health / collections tabs */}
              {showFilters && (
                <div className="relative">
                  <button onClick={() => setShowSort(s => !s)}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#F2F6FA] text-xs font-bold text-[#0A1A2F]/55 hover:bg-[#FAD98D]/15 transition-colors">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {activeSort?.label}
                  </button>
                  {showSort && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl border border-[#D9B878]/20 shadow-lg py-1.5 z-50 min-w-[110px]">
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.value}
                          onClick={() => { setSort(opt.value); setShowSort(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                            sort === opt.value
                              ? 'text-[#c9a227] bg-[#FAD98D]/15'
                              : 'text-[#0A1A2F]/60 hover:bg-[#F2F6FA]'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              <button onClick={() => setCartOpen(true)}
                className="relative w-10 h-10 rounded-xl bg-[#FAD98D]/20 flex items-center justify-center text-[#c9a227] hover:bg-[#FAD98D]/35 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c9a227] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ width: 18, height: 18 }}>
                    {totalCount > 99 ? '99' : totalCount}
                  </span>
                )}
              </button>

              {/* Add */}
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 shadow-sm">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Filters (hidden on health / collections) */}
          {showFilters && (
            <RecipeFilters filters={filters} onFilterChange={setFilters} />
          )}

          {/* Tab bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-[11px] font-bold transition-all relative ${
                  activeTab === id
                    ? id === 'health'
                      ? 'bg-gradient-to-b from-red-400 to-pink-400 text-white shadow-sm'
                      : 'bg-gradient-to-b from-[#c9a227] to-[#D9B878] text-white shadow-sm'
                    : 'bg-[#F2F6FA] text-[#0A1A2F]/45 hover:text-[#0A1A2F]/65'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
                {id !== 'collections' && counts[id] > 0 && activeTab !== id && (
                  <span className="absolute -top-1 -right-1 bg-[#0A1A2F]/15 text-[#0A1A2F] text-[8px] font-bold rounded-full px-1 leading-4">
                    {counts[id]}
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">

        {/* ALL */}
        {activeTab === 'all' && (() => {
          if (isLoading) return (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-[#D9B878]/20 h-36 animate-pulse" />)}
            </div>
          );
          if (allSrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
              title={isFiltered(filters) ? 'No recipes match' : 'No recipes yet'}
              sub={isFiltered(filters) ? 'Try adjusting your filters' : 'Add the first recipe to the library'}
              action={isFiltered(filters) ? 'Clear filters' : 'Add Recipe'}
              onAction={isFiltered(filters) ? clearFilters : () => setShowCreate(true)}
            />
          );
          return (
            <>
              {!isFiltered(filters) && <PersonalizedRecipes user={user} allRecipes={recipes} />}
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest pt-1">
                {isFiltered(filters) ? `${allSrc.length} result${allSrc.length !== 1 ? 's' : ''}` : `All · ${allSrc.length} recipes`}
              </p>
              <div className="space-y-3">
                {allSrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            </>
          );
        })()}

        {/* HEALTH */}
        {activeTab === 'health' && (
          <HealthRecipesTab recipes={recipes} user={user} />
        )}

        {/* MY RECIPES */}
        {activeTab === 'mine' && (() => {
          if (myRecipes.length === 0) return (
            <EmptyState
              icon={<BookOpen className="w-8 h-8 text-[#0A1A2F]/15" />}
              title="No recipes yet"
              sub="Add your first recipe to build your personal cookbook"
              action="Add Recipe"
              onAction={() => setShowCreate(true)}
            />
          );
          if (mineSrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
              title="No matches"
              sub="None of your recipes match this filter"
              action="Clear filters"
              onAction={clearFilters}
            />
          );
          return (
            <>
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest pt-1">
                Your recipes · {mineSrc.length}
              </p>
              <div className="space-y-3">
                {mineSrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            </>
          );
        })()}

        {/* COMMUNITY */}
        {activeTab === 'community' && (() => {
          if (communityRecipes.length === 0) return (
            <EmptyState
              icon={<Users className="w-8 h-8 text-[#0A1A2F]/15" />}
              title="No shared recipes yet"
              sub="Share your recipes so others can discover them"
              action="Add Recipe"
              onAction={() => setShowCreate(true)}
            />
          );
          if (communitySrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15" />}
              title="No matches"
              sub="Try adjusting your filters"
              action="Clear filters"
              onAction={clearFilters}
            />
          );
          return (
            <>
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest pt-1">
                Shared by the community · {communitySrc.length}
              </p>
              <div className="space-y-3">
                {communitySrc.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
              </div>
            </>
          );
        })()}

        {/* COLLECTIONS */}
        {activeTab === 'collections' && (
          <RecipeCollections allRecipes={recipes} />
        )}

      </div>

      {/* ── Modals ── */}
      <CreateRecipeModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      <GroceryListDrawer isOpen={cartOpen}   onClose={() => setCartOpen(false)} />

      <ChefDaniel
        user={user} userRecipes={myRecipes} mealLogs={mealLogs}
        onOpen={() => setChefOpen(true)} onClose={() => setChefOpen(false)}
      />
    </div>
  );
}
