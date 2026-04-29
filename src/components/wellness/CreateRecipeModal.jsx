import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Share2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const BLANK = {
  title: '', description: '', category: 'lunch', diet_type: 'any', difficulty: 'easy',
  prep_time_minutes: 15, cook_time_minutes: 30, servings: 4, serving_size: '',
  calories: '', protein: '', carbs: '', fat: '', fiber: '', sodium: '',
  ingredients: [], instructions: [], cooking_tips: [], serving_suggestions: '',
  is_shared: false,
};

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-[#0A1A2F]/50 dark:text-white/50 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl border border-[#FAD98D]/30 bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/30 focus:outline-none focus:border-[#c9a227]/50 ${className}`} />
  );
}

function ChipSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ v, label }) => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            value === v
              ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
              : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#FAD98D]/30 hover:border-[#c9a227]/40'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ListBuilder({ items, setItems, placeholder, multiline }) {
  const [current, setCurrent] = useState('');

  const add = () => {
    if (current.trim()) { setItems([...items, current.trim()]); setCurrent(''); }
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 bg-white dark:bg-white/5 rounded-xl border border-[#FAD98D]/20 p-2.5">
          <span className="text-[#c9a227] font-bold text-xs mt-0.5 flex-shrink-0">
            {items.length > 1 ? `${i + 1}.` : '·'}
          </span>
          <p className="flex-1 text-sm text-[#0A1A2F]/75 leading-relaxed">{item}</p>
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            className="text-[#0A1A2F]/25 dark:text-white/25 hover:text-red-400 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        {multiline
          ? <Textarea value={current} onChange={e => setCurrent(e.target.value)} placeholder={placeholder}
              className="min-h-[60px] text-sm border-[#FAD98D]/30 bg-[#F2F6FA] dark:bg-[#0A1A2F] resize-none flex-1"
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) add(); }} />
          : <input value={current} onChange={e => setCurrent(e.target.value)} placeholder={placeholder}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
              className="flex-1 px-3 py-2 rounded-xl border border-[#FAD98D]/30 bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/30 focus:outline-none focus:border-[#c9a227]/50" />
        }
        <button onClick={add}
          className="w-10 h-10 rounded-xl bg-[#FAD98D]/30 text-[#c9a227] flex items-center justify-center hover:bg-[#FAD98D]/50 transition-colors flex-shrink-0 self-end">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CreateRecipeModal({ isOpen, onClose }) {
  const [recipe, setRecipe] = useState(BLANK);
  const queryClient = useQueryClient();

  const createRecipe = useMutation({
    mutationFn: data => base44.entities.Recipe.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      onClose();
      setRecipe(BLANK);
    },
  });

  const set = (key, val) => setRecipe(r => ({ ...r, [key]: val }));
  const num = (key, val) => set(key, val === '' ? '' : parseInt(val) || 0);

  const canSubmit = recipe.title.trim() && recipe.ingredients.length > 0 && recipe.instructions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#F2F6FA] dark:bg-[#0A1A2F]">
        <DialogHeader>
          <DialogTitle className="text-[#0A1A2F] dark:text-white dark:text-white">Add Recipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Basic info */}
          <Field label="Recipe Title *">
            <TextInput value={recipe.title} onChange={e => set('title', e.target.value)} placeholder="e.g., Lemon Herb Chicken" />
          </Field>

          <Field label="Description">
            <Textarea value={recipe.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief description of the dish" className="text-sm border-[#FAD98D]/30 bg-[#F2F6FA] dark:bg-[#0A1A2F] resize-none min-h-[60px]" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Meal Type">
              <ChipSelect value={recipe.category} onChange={v => set('category', v)} options={[
                { v:'breakfast', label:'🍳 Breakfast' }, { v:'lunch', label:'🥗 Lunch' },
                { v:'dinner', label:'🍽️ Dinner' }, { v:'snack', label:'🍎 Snack' }, { v:'dessert', label:'🍰 Dessert' },
              ]} />
            </Field>
            <Field label="Difficulty">
              <ChipSelect value={recipe.difficulty} onChange={v => set('difficulty', v)} options={[
                { v:'easy', label:'Easy' }, { v:'medium', label:'Medium' }, { v:'hard', label:'Hard' },
              ]} />
            </Field>
          </div>

          <Field label="Diet Type">
            <ChipSelect value={recipe.diet_type} onChange={v => set('diet_type', v)} options={[
              { v:'any', label:'Any' }, { v:'vegetarian', label:'Vegetarian' }, { v:'vegan', label:'Vegan' },
              { v:'keto', label:'Keto' }, { v:'paleo', label:'Paleo' }, { v:'gluten_free', label:'Gluten Free' },
            ]} />
          </Field>

          {/* Timing & servings */}
          <div className="grid grid-cols-4 gap-2">
            <Field label="Prep (min)">
              <TextInput type="number" value={recipe.prep_time_minutes} onChange={e => num('prep_time_minutes', e.target.value)} placeholder="15" />
            </Field>
            <Field label="Cook (min)">
              <TextInput type="number" value={recipe.cook_time_minutes} onChange={e => num('cook_time_minutes', e.target.value)} placeholder="30" />
            </Field>
            <Field label="Servings">
              <TextInput type="number" value={recipe.servings} onChange={e => num('servings', e.target.value)} placeholder="4" />
            </Field>
            <Field label="Serving size">
              <TextInput value={recipe.serving_size} onChange={e => set('serving_size', e.target.value)} placeholder="1 cup" />
            </Field>
          </div>

          {/* Nutrition facts */}
          <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">Nutrition per Serving (optional)</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['calories', 'Calories', ''],
                ['protein',  'Protein (g)', 'g'],
                ['carbs',    'Carbs (g)', 'g'],
                ['fat',      'Fat (g)', 'g'],
                ['fiber',    'Fiber (g)', 'g'],
                ['sodium',   'Sodium (mg)', 'mg'],
              ].map(([key, label]) => (
                <div key={key}>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 mb-1">{label}</p>
                  <input type="number" value={recipe[key]} onChange={e => num(key, e.target.value)} placeholder="0"
                    className="w-full px-2.5 py-2 rounded-xl border border-[#FAD98D]/25 bg-white dark:bg-white/5 text-sm text-[#0A1A2F] dark:text-white text-center focus:outline-none focus:border-[#c9a227]/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <Field label="Ingredients *">
            <ListBuilder items={recipe.ingredients} setItems={v => set('ingredients', v)}
              placeholder="e.g., 2 cups chicken broth" multiline={false} />
          </Field>

          {/* Instructions */}
          <Field label="Instructions *">
            <ListBuilder items={recipe.instructions} setItems={v => set('instructions', v)}
              placeholder="Describe this step clearly… (⌘+Enter to add)" multiline />
          </Field>

          {/* Cooking tips */}
          <Field label="Chef's Tips (optional)">
            <ListBuilder items={recipe.cooking_tips} setItems={v => set('cooking_tips', v)}
              placeholder="e.g., Let meat rest 5 min before slicing" multiline={false} />
          </Field>

          {/* Serving suggestions */}
          <Field label="Serving Suggestions (optional)">
            <Textarea value={recipe.serving_suggestions} onChange={e => set('serving_suggestions', e.target.value)}
              placeholder="e.g., Serve over brown rice with a side of roasted vegetables"
              className="text-sm border-[#FAD98D]/30 bg-[#F2F6FA] dark:bg-[#0A1A2F] resize-none min-h-[50px]" />
          </Field>

          {/* Share toggle */}
          <div className="flex items-center justify-between p-4 bg-[#FAD98D]/10 rounded-2xl">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#c9a227]" />
              <div>
                <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Share with community</p>
                <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Others can discover and save your recipe</p>
              </div>
            </div>
            <Switch checked={recipe.is_shared} onCheckedChange={v => set('is_shared', v)} />
          </div>

          <button onClick={() => canSubmit && createRecipe.mutate(recipe)}
            disabled={!canSubmit || createRecipe.isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
            {createRecipe.isPending ? 'Saving…' : 'Save Recipe'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
