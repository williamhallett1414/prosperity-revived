import React, { useState } from 'react';
import { UtensilsCrossed, Upload, Check, Info, ChevronRight, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const SOURCE_OPTIONS = [
  {
    id: 'grocery_list',
    name: 'My Grocery List',
    icon: '🛒',
    description: 'Paste your grocery list for personalized meal suggestions',
    placeholder: 'e.g.\nChicken breast x2\nBroccoli\nQuinoa\nOlive oil\nGreek yogurt...',
  },
  {
    id: 'pantry',
    name: 'My Pantry',
    icon: '🧺',
    description: "Tell Chef Daniel what's in your pantry/fridge right now",
    placeholder: 'e.g.\nIn fridge: eggs, spinach, cheddar, leftover rice\nPantry: canned tomatoes, lentils, pasta, garlic...',
  },
  {
    id: 'dietary_prefs',
    name: 'Dietary Preferences',
    icon: '🥗',
    description: 'Import from a meal planning app or describe your diet',
    placeholder: 'e.g.\nDiet: High protein, low carb\nAllergies: None\nAvoiding: Processed sugar, fried foods\nFavorite cuisines: Mediterranean, Asian...',
  },
  {
    id: 'recipe_url',
    name: 'Recipe from URL',
    icon: '🔗',
    description: 'Paste a recipe link for Chef Daniel to analyze and improve',
    placeholder: 'https://...',
  },
  {
    id: 'weekly_plan',
    name: 'Weekly Meal Plan',
    icon: '📅',
    description: 'Upload a meal plan and get shopping list + prep tips',
    placeholder: 'Mon: Oatmeal / Chicken salad / Salmon\nTue: Smoothie / Lentil soup / Stir fry...',
  },
];

export default function RecipeSourceImport({ user }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    if (!user?.email || !textInput.trim()) return;
    setIsLoading(true);
    try {
      const prompt = selectedSource?.id === 'recipe_url'
        ? `Analyze this recipe URL and extract: recipe name, key ingredients, macros estimate, and 2-3 improvement suggestions from Chef Daniel's perspective. URL: ${textInput}`
        : `As Chef Daniel, summarize this ${selectedSource?.name} data for future meal planning and recipe suggestions. Keep it practical and specific. Data:\n${textInput}`;

      const summary = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: selectedSource?.id === 'recipe_url',
      });

      await base44.entities.ChatbotMemory.create({
        chatbot_name: 'ChefDaniel',
        memory_type: 'preference',
        content: `${selectedSource?.name} imported: ${(summary || '').slice(0, 500)}`,
        context: 'external_data_import',
        importance: 8,
        conversation_date: new Date().toISOString().split('T')[0],
        last_referenced: new Date().toISOString(),
      });

      setSuccess(true);
      toast.success('Data imported! Chef Daniel will use this for personalized meal advice.');
    } catch (err) {
      toast.error('Import failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Data Imported!</h3>
        <p className="text-sm text-gray-500 mb-4">Chef Daniel now has your {selectedSource?.name} context for personalized meal planning, grocery suggestions, and recipe ideas.</p>
        <Button variant="outline" size="sm" onClick={() => { setSuccess(false); setSelectedSource(null); setTextInput(''); }}>
          Import More
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-green-50 rounded-xl p-3 text-xs text-green-700">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>Give Chef Daniel your grocery list, pantry contents, or dietary preferences to get meal suggestions that match exactly what you have and need.</p>
      </div>

      {!selectedSource ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Choose Type</p>
          {SOURCE_OPTIONS.map(source => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all text-left"
            >
              <span className="text-2xl">{source.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{source.name}</p>
                <p className="text-xs text-gray-500 truncate">{source.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedSource(null)} className="text-xs text-green-600 hover:underline">← Back</button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSource.icon}</span>
            <div>
              <p className="font-bold text-gray-900">{selectedSource.name}</p>
              <p className="text-xs text-gray-500">{selectedSource.description}</p>
            </div>
          </div>

          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={selectedSource.placeholder}
            className="w-full text-sm border border-gray-200 rounded-xl p-3 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <Button
            onClick={handleImport}
            disabled={isLoading || !textInput.trim()}
            className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#6B7280] text-white"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : <><UtensilsCrossed className="w-4 h-4 mr-2" /> Import to Chef Daniel</>}
          </Button>
        </div>
      )}
    </div>
  );
}