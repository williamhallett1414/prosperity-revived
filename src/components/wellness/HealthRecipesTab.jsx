import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle2, Heart, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import RecipeCard from './RecipeCard';
import { HEALTH_CONDITIONS, SEED_RECIPES } from './HealthRecipeSeed';

// ── seed state key — bump version to force re-seed with condition markers ──────
const SEED_KEY = 'health_recipes_seeded_v3';

// Build title→conditions map from seed data at module load time
const CONDITION_BY_TITLE = {};
SEED_RECIPES.forEach(r => {
  if (r.health_conditions?.length) CONDITION_BY_TITLE[r.title] = r.health_conditions;
});

const MARKER_PREFIX = '__hc:';

// Encode conditions as a hidden cooking_tip marker so Base44 stores them
const encodeConditions = (conditions) => `${MARKER_PREFIX}${conditions.join(',')}`;

// Decode conditions from the hidden marker in cooking_tips
const decodeConditions = (tips = []) => {
  const marker = tips.find(t => t.startsWith(MARKER_PREFIX));
  if (!marker) return null;
  return marker.slice(MARKER_PREFIX.length).split(',').filter(Boolean);
};

// Priority: 1) hidden marker in cooking_tips  2) title map  3) health_conditions field
const getConditions = (recipe) => {
  const fromMarker = decodeConditions(recipe.cooking_tips);
  if (fromMarker?.length) return fromMarker;
  const fromTitle = CONDITION_BY_TITLE[recipe.title];
  if (fromTitle?.length) return fromTitle;
  return recipe.health_conditions || [];
};

// Prepare recipe for seeding: inject condition marker into cooking_tips
const prepareForSeed = (recipe) => ({
  ...recipe,
  cooking_tips: [
    encodeConditions(recipe.health_conditions || []),
    ...(recipe.cooking_tips || []),
  ],
});

function ConditionPill({ condition, selected, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
        selected
          ? 'bg-gradient-to-b from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
          : 'bg-white border border-[#FAD98D]/25 text-[#0A1A2F]/60 hover:border-[#c9a227]/40'
      }`}
    >
      <span>{condition.emoji}</span>
      <span>{condition.label}</span>
      {count > 0 && (
        <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${
          selected ? 'bg-white/25 text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/40'
        }`}>{count}</span>
      )}
    </button>
  );
}

export default function HealthRecipesTab({ recipes, user }) {
  const [selected,  setSelected]  = useState(null); // condition id or null = all
  const [seeding,   setSeeding]   = useState(false);
  const [seeded,    setSeeded]    = useState(() => !!localStorage.getItem(SEED_KEY));
  const queryClient = useQueryClient();

  // Group loaded recipes by condition
  const byCondition = (conditionId) =>
    recipes.filter(r => getConditions(r).includes(conditionId));

  const displayList = selected
    ? recipes.filter(r => getConditions(r).includes(selected))
    : recipes.filter(r => getConditions(r).length > 0);

  const hasHealthRecipes = recipes.some(r => getConditions(r).length > 0);

  // ── Seed recipes into the DB ──────────────────────────────────────────────
  const handleSeed = async () => {
    setSeeding(true);
    try {
      let created = 0;
      for (const recipe of SEED_RECIPES) {
        await base44.entities.Recipe.create(prepareForSeed(recipe));
        created++;
      }
      localStorage.setItem(SEED_KEY, '1');
      setSeeded(true);
      queryClient.invalidateQueries(['recipes']);
      toast.success(`${created} health recipes added to the library!`);
    } catch (e) {
      console.error(e);
      toast.error('Some recipes may not have saved — try again');
    }
    setSeeding(false);
  };

  const resetSeed = () => {
    localStorage.removeItem(SEED_KEY);
    setSeeded(false);
  };

  return (
    <div className="space-y-4">

      {/* ── Condition pills (horizontal scroll) ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelected(null)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            selected === null
              ? 'bg-gradient-to-b from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
              : 'bg-white border border-[#FAD98D]/25 text-[#0A1A2F]/60 hover:border-[#c9a227]/40'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          All Conditions
          {displayList.length > 0 && (
            <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${
              selected === null ? 'bg-white/25 text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/40'
            }`}>{recipes.filter(r => getConditions(r).length > 0).length}</span>
          )}
        </button>
        {HEALTH_CONDITIONS.map(c => (
          <ConditionPill
            key={c.id}
            condition={c}
            selected={selected === c.id}
            count={byCondition(c.id).length}
            onClick={() => setSelected(s => s === c.id ? null : c.id)}
          />
        ))}
      </div>

      {/* ── Active condition header ── */}
      <AnimatePresence mode="wait">
        {selected && (() => {
          const cond = HEALTH_CONDITIONS.find(c => c.id === selected);
          return (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className={`rounded-2xl p-4 flex items-start gap-3 ${cond.color}`}
            >
              <span className="text-2xl flex-shrink-0">{cond.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-[#0A1A2F] text-sm">{cond.label}</p>
                <p className="text-xs text-[#0A1A2F]/55 mt-0.5">{cond.description}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#0A1A2F]/30 hover:text-[#0A1A2F]/60">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Empty / seed state ── */}
      {!hasHealthRecipes && (
        <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">No health recipes yet</p>
            <p className="text-xs text-[#0A1A2F]/45 mt-1 leading-relaxed">
              Add {SEED_RECIPES.length} expert-curated recipes covering{' '}
              {HEALTH_CONDITIONS.length} health conditions — diabetes, hypertension,
              heart health, anti-inflammatory, gut health, and more.
            </p>
          </div>

          {/* Condition preview grid */}
          <div className="grid grid-cols-2 gap-2 text-left">
            {HEALTH_CONDITIONS.slice(0, 6).map(c => (
              <div key={c.id} className={`rounded-xl px-3 py-2 flex items-center gap-2 ${c.color}`}>
                <span className="text-base">{c.emoji}</span>
                <p className="text-[11px] font-bold">{c.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#0A1A2F]/30">
            + {HEALTH_CONDITIONS.slice(6).map(c => c.label).join(', ')}
          </p>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {seeding
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding recipes ({SEED_RECIPES.length})…</>
              : <><Heart className="w-4 h-4" /> Add Health Recipe Library</>
            }
          </button>
          <p className="text-[10px] text-[#0A1A2F]/25">Recipes are added once and shared with the whole app</p>
        </div>
      )}

      {/* ── Recipe list ── */}
      {hasHealthRecipes && displayList.length === 0 && (
        <div className="text-center py-10">
          <p className="font-bold text-[#0A1A2F]/50 text-sm">No recipes for this condition yet</p>
          <p className="text-xs text-[#0A1A2F]/30 mt-1">More will be added over time</p>
        </div>
      )}

      {hasHealthRecipes && displayList.length > 0 && (
        <>
          {/* Show condition groups when "All" is selected */}
          {!selected
            ? HEALTH_CONDITIONS
                .filter(c => byCondition(c.id).length > 0)
                .map(cond => {
                  const condRecipes = byCondition(cond.id);
                  return (
                    <div key={cond.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cond.emoji}</span>
                          <div>
                            <p className="font-bold text-[#0A1A2F] text-sm">{cond.label}</p>
                            <p className="text-[10px] text-[#0A1A2F]/40">{cond.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelected(cond.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#c9a227] hover:opacity-70"
                        >
                          All {condRecipes.length} <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Show first 2 as preview */}
                      <div className="space-y-3">
                        {condRecipes.slice(0, 2).map((r, i) => (
                          <RecipeCard key={r.id} recipe={r} index={i} />
                        ))}
                      </div>
                      {condRecipes.length > 2 && (
                        <button
                          onClick={() => setSelected(cond.id)}
                          className="w-full py-2.5 rounded-xl border border-[#FAD98D]/25 text-xs font-bold text-[#c9a227] hover:bg-[#FAD98D]/10 transition-colors"
                        >
                          + {condRecipes.length - 2} more {cond.label} recipes
                        </button>
                      )}
                    </div>
                  );
                })
            : (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest">
                  {HEALTH_CONDITIONS.find(c => c.id === selected)?.label} · {displayList.length} recipes
                </p>
                {displayList.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} index={i} />
                ))}
              </div>
            )
          }

          {/* Re-seed link (dev utility) */}
          {seeded && !hasHealthRecipes && (
            <button onClick={resetSeed} className="text-[10px] text-[#0A1A2F]/20 text-center w-full mt-2">
              Reset seed state
            </button>
          )}
        </>
      )}
    </div>
  );
}
