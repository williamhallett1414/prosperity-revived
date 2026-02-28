import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ChefHat, Loader2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function IngredientRecipeBuilder() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [error, setError] = useState(null);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const generateRecipes = async () => {
    setIsGenerating(true);
    setError(null);
    setRecipes([]);
    setExpandedRecipe(null);

    const prompt = `You are Chef Daniel, a warm Christian nutrition coach. The user has these ingredients: ${ingredients.join(', ')}.

Generate exactly 3 recipe suggestions. Respond ONLY with a valid JSON array, no markdown, no explanation. Format:

[
  {
    "name": "Recipe Name",
    "description": "One sentence description that sounds appetizing",
    "usedIngredients": ["ingredient1", "ingredient2"],
    "additionalIngredients": ["salt", "olive oil"],
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "difficulty": "Easy",
    "steps": [
      "Step 1 instruction",
      "Step 2 instruction",
      "Step 3 instruction"
    ]
  }
]

Make recipes practical, healthy, and faith-encouraging. Only include recipes that genuinely use most of the provided ingredients.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      const cleaned = response.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setRecipes(parsed);
    } catch (e) {
      setError('Could not parse recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpand = (name) => {
    setExpandedRecipe(expandedRecipe === name ? null : name);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FD9C2D] to-[#E89020] flex items-center justify-center flex-shrink-0">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#0A1A2F] text-lg">What's in your kitchen?</h3>
          <p className="text-sm text-[#0A1A2F]/60">Add ingredients you have and we'll suggest recipes you can make right now.</p>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex gap-2 mt-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. chicken, rice, garlic..."
          className="flex-1"
        />
        <Button
          onClick={addIngredient}
          disabled={!inputValue.trim()}
          className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white px-3"
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Ingredient Pills */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {ingredients.map((ing) => (
              <motion.span
                key={ing}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-[#FAD98D]/30 text-[#0A1A2F] border border-[#D9B878]/40 rounded-full px-3 py-1 text-sm"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="text-[#0A1A2F]/50 hover:text-[#0A1A2F] leading-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generateRecipes}
        disabled={ingredients.length < 2 || isGenerating}
        className={`w-full mt-4 text-white font-semibold ${
          ingredients.length < 2 ? 'opacity-50 cursor-not-allowed bg-[#FD9C2D]' : 'bg-gradient-to-r from-[#FD9C2D] to-[#E89020]'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Finding recipes...
          </>
        ) : (
          <>
            <ChefHat className="w-4 h-4 mr-2" />
            Generate Recipes {ingredients.length < 2 && '(add 2+ ingredients)'}
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Recipe Cards */}
      <AnimatePresence>
        {recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-3"
          >
            {recipes.map((recipe, idx) => {
              const isExpanded = expandedRecipe === recipe.name;
              const difficultyClass = recipe.difficulty === 'Easy'
                ? 'bg-[#8fa68a]/20 text-[#4a6b50]'
                : 'bg-[#FAD98D]/30 text-[#8a6e1a]';

              return (
                <motion.div
                  key={recipe.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-[#F2F6FA] rounded-xl p-4 border border-[#D9B878]/20"
                >
                  {/* Recipe Header */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-[#0A1A2F] text-base leading-tight">{recipe.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${difficultyClass}`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-[#0A1A2F]/70 mb-3">{recipe.description}</p>

                  {/* Time & Ingredients */}
                  <div className="flex items-center gap-4 text-xs text-[#0A1A2F]/60 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Prep: {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cook: {recipe.cookTime}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#0A1A2F]/60 mb-1">Ingredients needed:</p>
                    <div className="flex flex-wrap gap-1">
                      {[...(recipe.usedIngredients || []), ...(recipe.additionalIngredients || [])].map((ing) => (
                        <span key={ing} className="text-xs bg-white border border-[#D9B878]/30 rounded-full px-2 py-0.5 text-[#0A1A2F]/80">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Full Recipe Toggle */}
                  <button
                    onClick={() => toggleExpand(recipe.name)}
                    className="flex items-center gap-1 text-[#FD9C2D] text-sm font-semibold"
                  >
                    {isExpanded ? (
                      <>Hide Recipe <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>View Full Recipe <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>

                  {/* Steps */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.ol
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 list-decimal list-inside overflow-hidden"
                      >
                        {(recipe.steps || []).map((step, i) => (
                          <li key={i} className="text-sm text-[#0A1A2F]/80 leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </motion.ol>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}