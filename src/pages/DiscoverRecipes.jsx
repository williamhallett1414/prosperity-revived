import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  UtensilsCrossed, Plus, Sparkles, TrendingUp, Users, BookOpen,
  ShoppingCart, ArrowUpDown, Heart, Menu, X, ArrowLeft
} from 'lucide-react';
import RecipeCard          from '@/components/wellness/RecipeCard';
import RecipeFilters       from '@/components/wellness/RecipeFilters';
import CreateRecipeModal   from '@/components/wellness/CreateRecipeModal';
import PersonalizedRecipes from '@/components/recommendations/PersonalizedRecipes';
import RecipeCollections   from '@/components/wellness/RecipeCollections';
import GroceryListDrawer   from '@/components/wellness/GroceryListDrawer';
import ChatButton from '@/components/chatbot/ChatButton';
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
      <div className="w-16 h-16 rounded-2xl bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <p className="font-bold text-[#0A1A2F]/60 dark:text-white/60 text-sm">{title}</p>
      {sub    && <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 mt-1 mb-4">{sub}</p>}
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

class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page encountered an error.</p>
          <button onClick={() => this.setState({ error: null })} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DiscoverRecipesInner() {
  const [user,       setUser]       = useState(null);
  const [activeTab,  setActiveTab]  = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [chefOpen,   setChefOpen]   = useState(false);
  const [showSort,   setShowSort]   = useState(false);
  const [showMenu,   setShowMenu]   = useState(false);
  const [sort,       setSort]       = useState('newest');
  const [filters,    setFilters]    = useState({
    search: '', dietType: 'all', category: 'all', prepTime: 'all',
  });

  const { totalCount } = useGroceryList();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const queryClient = useQueryClient();
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn:  () => base44.entities.Recipe.list('-created_date'),
  });

  // Auto-seed recipes on first visit if none exist
  const [recipesSeeded] = useState(() => !!localStorage.getItem('health_recipes_seeded_v3'));
  useEffect(() => {
    if (recipesSeeded || isLoading || recipes.length > 0 || !user?.email) return;
    const seed = async () => {
      try {
        const { SEED_RECIPES } = await import('@/components/wellness/HealthRecipeSeed');
        for (const recipe of SEED_RECIPES) {
          await base44.entities.Recipe.create({ ...recipe });
        }
        localStorage.setItem('health_recipes_seeded_v3', '1');
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
      } catch (e) { console.warn('Recipe seed failed:', e); }
    };
    seed();
  }, [recipesSeeded, isLoading, recipes.length, user?.email]);

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn:  () => base44.entities.MealLog.list('-date', 100),
    enabled:  !!user,
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
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-[#0A1A2F]/95 backdrop-blur-md border-b border-[#FAD98D]/15 dark:border-[#FAD98D]/8 px-4 pt-3 pb-3 shadow-sm">
        <div className="max-w-lg mx-auto space-y-3">

          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center shadow-lg shadow-[#c9a227]/25">
                <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-[#0A1A2F] dark:text-white leading-tight tracking-tight">Discover Recipes</h1>
                <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 font-medium">
                  {isLoading ? 'Loading…' : `${recipes.length} recipes in library`}
                </p>
              </div>
            </div>

            {/* Hamburger menu */}
            <div className="relative">
              <button onClick={() => setShowMenu(v => !v)}
                className="relative w-9 h-9 rounded-xl bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 flex items-center justify-center text-[#c9a227] hover:bg-[#FAD98D]/25 dark:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 transition-colors">
                {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                {totalCount > 0 && !showMenu && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c9a227] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                    style={{ width: 17, height: 17 }}>
                    {totalCount > 99 ? '99' : totalCount}
                  </span>
                )}
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#0A1A2F] rounded-2xl border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 shadow-xl dark:shadow-none py-2 z-50 min-w-[160px]">
                  {/* Add Recipe */}
                  <button onClick={() => { setShowCreate(true); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70 hover:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 flex items-center gap-2.5">
                    <Plus className="w-3.5 h-3.5 text-[#c9a227]" /> Add Recipe
                  </button>
                  {/* Grocery list */}
                  <button onClick={() => { setCartOpen(true); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70 hover:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 flex items-center gap-2.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#c9a227]" />
                    Grocery List
                    {totalCount > 0 && (
                      <span className="ml-auto bg-[#c9a227] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{totalCount}</span>
                    )}
                  </button>
                  {/* Sort — hidden on health / collections tabs */}
                  {showFilters && (
                    <>
                      <div className="border-t border-[#FAD98D]/15 dark:border-[#FAD98D]/8 my-1" />
                      <p className="px-4 pt-1 pb-0.5 text-[9px] font-bold text-[#0A1A2F]/30 dark:text-white/30 uppercase tracking-widest">Sort by</p>
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.value}
                          onClick={() => { setSort(opt.value); setShowMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-colors ${
                            sort === opt.value
                              ? 'text-[#c9a227] bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8'
                              : 'text-[#0A1A2F]/60 dark:text-white/60 hover:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5'
                          }`}>
                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                          {opt.label}
                          {sort === opt.value && <span className="ml-auto text-[#c9a227]">✓</span>}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Filters (hidden on health / collections) */}
          {showFilters && (
            <RecipeFilters filters={filters} onFilterChange={setFilters} />
          )}

          {/* Tab bar */}
          <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-[#FAD98D]/20 dark:border-white/10 -mx-4 px-4">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 py-3 px-4 text-xs font-semibold relative transition-colors ${
                  activeTab === id
                    ? id === 'health'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-[#c9a227] dark:text-[#FAD98D]'
                    : 'text-[#0A1A2F]/50 dark:text-white/50 hover:text-[#0A1A2F]/70 dark:hover:text-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id !== 'collections' && counts[id] > 0 && activeTab !== id && (
                  <span className="absolute top-2 right-2 bg-[#c9a227] text-white text-[7px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {counts[id]}
                  </span>
                )}
                {activeTab === id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    id === 'health' ? 'bg-red-500 dark:bg-red-400' : 'bg-[#c9a227] dark:bg-[#FAD98D]'
                  }`} />
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
              {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 h-36 animate-pulse" />)}
            </div>
          );
          if (allSrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />}
              title={isFiltered(filters) ? 'No recipes match' : 'No recipes yet'}
              sub={isFiltered(filters) ? 'Try adjusting your filters' : 'Add the first recipe to the library'}
              action={isFiltered(filters) ? 'Clear filters' : 'Add Recipe'}
              onAction={isFiltered(filters) ? clearFilters : () => setShowCreate(true)}
            />
          );
          return (
            <>
              {!isFiltered(filters) && <PersonalizedRecipes user={user} allRecipes={recipes} />}
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest pt-1">
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
              icon={<BookOpen className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />}
              title="No recipes yet"
              sub="Add your first recipe to build your personal cookbook"
              action="Add Recipe"
              onAction={() => setShowCreate(true)}
            />
          );
          if (mineSrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />}
              title="No matches"
              sub="None of your recipes match this filter"
              action="Clear filters"
              onAction={clearFilters}
            />
          );
          return (
            <>
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest pt-1">
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
              icon={<Users className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />}
              title="No shared recipes yet"
              sub="Share your recipes so others can discover them"
              action="Add Recipe"
              onAction={() => setShowCreate(true)}
            />
          );
          if (communitySrc.length === 0) return (
            <EmptyState
              icon={<UtensilsCrossed className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15" />}
              title="No matches"
              sub="Try adjusting your filters"
              action="Clear filters"
              onAction={clearFilters}
            />
          );

          return (
            <>
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest pt-1">
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

      {/* Allergen Safety Warning */}
      <div className="max-w-lg mx-auto px-4 pb-3">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl px-4 py-2.5">
          <p className="text-[10px] text-amber-800 leading-relaxed">
            <strong>⚠ Allergen Warning:</strong> Recipes may contain common allergens including nuts, dairy, gluten, eggs, soy, shellfish, and others. AI-generated recipes may not account for your specific allergies or dietary restrictions. Always verify ingredients before preparing any recipe. If you have food allergies, consult with a healthcare professional before trying new recipes.
          </p>
        </div>
      </div>

      <ChatButton bot="ChefDaniel" />
    </div>
  );
}

export default function DiscoverRecipes(props) {
  return <PageErrorBoundary><DiscoverRecipesInner {...props} /></PageErrorBoundary>;
}