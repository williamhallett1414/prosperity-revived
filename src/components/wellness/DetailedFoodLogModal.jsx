import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Scan, Sparkles, Camera } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DetailedFoodLogModal({ isOpen, onClose, onSave, initialData }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [previousMeals, setPreviousMeals] = useState([]);
  const fileInputRef = useRef(null);
  const defaultMeal = {
    date: new Date().toISOString().split('T')[0],
    meal_type: 'lunch',
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0,
    saturated_fat: 0,
    trans_fat: 0,
    polyunsaturated_fat: 0,
    monounsaturated_fat: 0,
    potassium: 0,
    vitamin_a: 0,
    vitamin_c: 0,
    vitamin_d: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    zinc: 0,
    serving_size: '',
    notes: ''
  };
  const [meal, setMeal] = useState(initialData || defaultMeal);

  useEffect(() => {
    if (initialData) {
      setMeal(initialData);
    } else {
      setMeal(defaultMeal);
    }
  }, [initialData, isOpen]);

  // Load previous meals on mount
  useEffect(() => {
    const loadPreviousMeals = async () => {
      try {
        const meals = await base44.entities.MealLog.list('-created_date', 50);
        setPreviousMeals(meals || []);
      } catch (error) {
        console.error('Failed to load previous meals', error);
      }
    };
    if (isOpen) loadPreviousMeals();
  }, [isOpen]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setMeal({ ...meal, description: value });
    
    if (value.length > 1) {
      const filtered = previousMeals
        .filter(m => m.description?.toLowerCase().includes(value.toLowerCase()))
        .map(m => m.description)
        .filter((v, i, a) => a.indexOf(v) === i) // unique only
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    const previousMeal = previousMeals.find(m => m.description === suggestion);
    if (previousMeal) {
      setMeal(prev => ({
        ...prev,
        description: suggestion,
        calories: previousMeal.calories || 0,
        protein: previousMeal.protein || 0,
        carbs: previousMeal.carbs || 0,
        fats: previousMeal.fats || 0,
        fiber: previousMeal.fiber || 0,
        sugar: previousMeal.sugar || 0,
        sodium: previousMeal.sodium || 0,
        cholesterol: previousMeal.cholesterol || 0,
        saturated_fat: previousMeal.saturated_fat || 0,
        trans_fat: previousMeal.trans_fat || 0,
        serving_size: previousMeal.serving_size || ''
      }));
    }
    setShowSuggestions(false);
  };

  const handleAIAnalysis = async () => {
    if (!meal.description) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this food item and provide detailed nutritional information: "${meal.description}"
        
Provide accurate estimates for a typical serving size.`,
        response_json_schema: {
          type: 'object',
          properties: {
            calories: { type: 'number' },
            protein: { type: 'number' },
            carbs: { type: 'number' },
            fats: { type: 'number' },
            fiber: { type: 'number' },
            sugar: { type: 'number' },
            sodium: { type: 'number' },
            serving_size: { type: 'string' }
          }
        }
      });

      setMeal(prev => {
        let parsed = response;
        if (typeof response === 'string') {
          try { parsed = JSON.parse(response.replace(/```json|```/g, '').trim()); } catch (_e) { parsed = {}; }
        }
        return { ...prev, ...parsed };
      });
    } catch (error) {
      console.error('AI analysis failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = async (file) => {
    if (!file) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      const imageUrl = response.file_url;

      const analysisResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this photo of food and provide detailed nutritional information. Describe what foods are visible and estimate the amounts. Return ONLY valid JSON.`,
        file_urls: [imageUrl],
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            calories: { type: 'number' },
            protein: { type: 'number' },
            carbs: { type: 'number' },
            fats: { type: 'number' },
            fiber: { type: 'number' },
            sugar: { type: 'number' },
            sodium: { type: 'number' },
            serving_size: { type: 'string' }
          }
        }
      });

      // Parse the response — InvokeLLM returns a string, not an object
      let parsed = analysisResponse;
      if (typeof analysisResponse === 'string') {
        try {
          parsed = JSON.parse(analysisResponse.replace(/```json|```/g, '').trim());
        } catch (_e) {
          console.warn('Failed to parse analysis:', analysisResponse);
          parsed = {};
        }
      }

      if (parsed.description) {
        setMeal(prev => ({
          ...prev,
          food_name: parsed.description || prev.food_name,
          calories: parsed.calories || prev.calories,
          protein: parsed.protein || prev.protein,
          carbs: parsed.carbs || prev.carbs,
          fats: parsed.fats || prev.fats,
          fiber: parsed.fiber || prev.fiber,
          sugar: parsed.sugar || prev.sugar,
          sodium: parsed.sodium || prev.sodium,
          serving_size: parsed.serving_size || prev.serving_size,
          image_url: imageUrl,
        }));
      }
      setActiveTab('manual');
    } catch (error) {
      console.error('Photo analysis failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeInput = async (barcode) => {
    if (!barcode) return;
    
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Look up nutritional information for product with barcode: ${barcode}
        
If you can't find the exact product, provide a reasonable estimate based on similar products.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            calories: { type: 'number' },
            protein: { type: 'number' },
            carbs: { type: 'number' },
            fats: { type: 'number' },
            fiber: { type: 'number' },
            sugar: { type: 'number' },
            sodium: { type: 'number' },
            serving_size: { type: 'string' }
          }
        }
      });

      setMeal(prev => {
        let parsed = response;
        if (typeof response === 'string') {
          try { parsed = JSON.parse(response.replace(/```json|```/g, '').trim()); } catch (_e) { parsed = {}; }
        }
        return { ...prev, ...parsed, barcode };
      });
    } catch (error) {
      console.error('Barcode lookup failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave(meal);
    setMeal(defaultMeal);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-hidden dark:bg-[#0F1A2E] p-0 rounded-3xl border-0">

        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0A1A2F] dark:text-white">Log Food</h2>
              <p className="text-xs text-[#0A1A2F]/40 dark:text-white/35">Track what fuels your body</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#0A1A2F]/5 dark:bg-white/8 flex items-center justify-center">
              <span className="text-[#0A1A2F]/40 dark:text-white/40 text-lg">×</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-5" style={{ maxHeight: 'calc(92vh - 140px)' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>

            {/* Mode toggle */}
            <TabsList className="grid w-full grid-cols-2 bg-[#0A1A2F]/5 dark:bg-white/5 rounded-xl p-1 mb-4">
              <TabsTrigger value="manual"
                className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:dark:bg-white/15 data-[state=active]:shadow-sm text-[#0A1A2F] dark:text-white">
                ✏️ Manual Entry
              </TabsTrigger>
              <TabsTrigger value="barcode"
                className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:dark:bg-white/15 data-[state=active]:shadow-sm text-[#0A1A2F] dark:text-white">
                📸 Picture Mode
              </TabsTrigger>
            </TabsList>

            {/* ── MANUAL ENTRY ── */}
            <TabsContent value="manual" className="space-y-3 mt-0">

              {/* Meal type pills */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {[
                  { value: 'breakfast', emoji: '🍳', label: 'Breakfast' },
                  { value: 'lunch', emoji: '🥗', label: 'Lunch' },
                  { value: 'dinner', emoji: '🍽️', label: 'Dinner' },
                  { value: 'snack', emoji: '🍎', label: 'Snack' },
                ].map(mt => (
                  <button key={mt.value}
                    onClick={() => setMeal({ ...meal, meal_type: mt.value })}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                      meal.meal_type === mt.value
                        ? 'bg-[#c9a227] text-white shadow-sm'
                        : 'bg-[#0A1A2F]/5 dark:bg-white/8 text-[#0A1A2F]/60 dark:text-white/50'
                    }`}>
                    <span>{mt.emoji}</span> {mt.label}
                  </button>
                ))}
              </div>

              {/* Food description + AI */}
              <div className="relative">
                <Input
                  placeholder="What did you eat? (e.g., Grilled chicken breast)"
                  value={meal.description}
                  onChange={handleDescriptionChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="rounded-xl border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 pr-10"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1A2540] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-10 overflow-hidden">
                    {suggestions.map((suggestion, idx) => (
                      <button key={idx} onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#0A1A2F] dark:text-white hover:bg-[#F2F6FA] dark:hover:bg-white/5 transition-colors">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Analyze button */}
              <button onClick={handleAIAnalysis} disabled={loading || !meal.description}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-sm font-bold disabled:opacity-40 transition-all min-h-[44px]">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Get AI Nutrition Estimate</>
                )}
              </button>

              {/* Serving size */}
              <Input
                placeholder="Serving size (e.g., 1 cup, 100g)"
                value={meal.serving_size}
                onChange={(e) => setMeal({ ...meal, serving_size: e.target.value })}
                className="rounded-xl border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5"
              />

              {/* Macro cards — visual summary */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Cal', value: meal.calories, color: '#EF4444', key: 'calories' },
                  { label: 'Protein', value: meal.protein, color: '#3B82F6', key: 'protein', unit: 'g' },
                  { label: 'Carbs', value: meal.carbs, color: '#F59E0B', key: 'carbs', unit: 'g' },
                  { label: 'Fat', value: meal.fats, color: '#8B5CF6', key: 'fats', unit: 'g' },
                ].map(m => (
                  <div key={m.key} className="bg-[#F2F6FA] dark:bg-white/5 rounded-xl p-2.5 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#0A1A2F]/40 dark:text-white/35">{m.label}</p>
                    <input
                      type="number"
                      value={m.value || ''}
                      onChange={(e) => setMeal({ ...meal, [m.key]: parseFloat(e.target.value) || 0 })}
                      className="w-full text-center text-lg font-black bg-transparent border-0 outline-none text-[#0A1A2F] dark:text-white"
                      style={{ color: m.color }}
                    />
                    {m.unit && <p className="text-[8px] text-[#0A1A2F]/30 dark:text-white/25">{m.unit}</p>}
                  </div>
                ))}
              </div>

              {/* Detailed nutrients — collapsible */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2 text-xs font-bold text-[#0A1A2F]/50 dark:text-white/40">
                  <span>More Nutrients</span>
                  <span className="group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {[
                    { label: 'Fiber (g)', key: 'fiber' },
                    { label: 'Sugar (g)', key: 'sugar' },
                    { label: 'Sodium (mg)', key: 'sodium' },
                    { label: 'Cholesterol (mg)', key: 'cholesterol' },
                    { label: 'Sat. Fat (g)', key: 'saturated_fat' },
                    { label: 'Trans Fat (g)', key: 'trans_fat' },
                    { label: 'Vitamin A (mcg)', key: 'vitamin_a' },
                    { label: 'Vitamin C (mg)', key: 'vitamin_c' },
                    { label: 'Vitamin D (mcg)', key: 'vitamin_d' },
                    { label: 'Calcium (mg)', key: 'calcium' },
                    { label: 'Iron (mg)', key: 'iron' },
                    { label: 'Potassium (mg)', key: 'potassium' },
                  ].map(n => (
                    <div key={n.key}>
                      <label className="text-[10px] font-medium text-[#0A1A2F]/50 dark:text-white/40">{n.label}</label>
                      <Input type="number" value={meal[n.key] || ''} onChange={(e) => setMeal({ ...meal, [n.key]: parseFloat(e.target.value) || 0 })}
                        className="h-9 rounded-lg border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 text-sm" />
                    </div>
                  ))}
                </div>
              </details>

              {/* Notes */}
              <Textarea
                placeholder="Notes (optional)"
                value={meal.notes}
                onChange={(e) => setMeal({ ...meal, notes: e.target.value })}
                className="h-16 rounded-xl border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5 resize-none"
              />
            </TabsContent>

            {/* ── PICTURE MODE ── */}
            <TabsContent value="barcode" className="space-y-4 mt-0">
              <div className="bg-gradient-to-br from-[#0A1A2F]/5 to-[#0A1A2F]/3 dark:from-white/5 dark:to-white/3 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/15 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-[#c9a227]" />
                </div>
                <p className="text-sm font-bold text-[#0A1A2F] dark:text-white mb-1">Snap your plate</p>
                <p className="text-xs text-[#0A1A2F]/50 dark:text-white/40 mb-4">AI will identify the food and estimate nutrition</p>

                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoCapture(e.target.files[0])} />

                <button onClick={() => fileInputRef.current?.click()} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-sm font-bold disabled:opacity-40 transition-all min-h-[44px]">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing photo...</>
                  ) : (
                    <><Camera className="w-4 h-4" /> Take Photo or Choose from Library</>
                  )}
                </button>
              </div>

              {/* Barcode input */}
              <div>
                <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/30 uppercase tracking-widest mb-1.5">Or enter barcode</p>
                <Input placeholder="Enter barcode number..."
                  className="rounded-xl border-gray-200 dark:border-white/10 bg-[#F2F6FA] dark:bg-white/5"
                  onChange={(e) => { if (e.target.value.length >= 8) handleBarcodeInput(e.target.value); }} />
              </div>

              {/* Result preview */}
              {meal.description && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white mb-1">{meal.description}</p>
                  {meal.serving_size && <p className="text-xs text-[#0A1A2F]/40 dark:text-white/35 mb-3">{meal.serving_size}</p>}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Calories', value: meal.calories, color: '#EF4444' },
                      { label: 'Protein', value: `${meal.protein || 0}g`, color: '#3B82F6' },
                      { label: 'Carbs', value: `${meal.carbs || 0}g`, color: '#F59E0B' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[9px] text-[#0A1A2F]/40 dark:text-white/35 font-medium">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Save / Cancel */}
        <div className="px-5 pb-5 pt-2 flex gap-2 border-t border-gray-100 dark:border-white/8">
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold min-h-[44px] hover:shadow-lg transition-all">
            ✓ Save Food Log
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl bg-[#0A1A2F]/5 dark:bg-white/8 text-[#0A1A2F]/60 dark:text-white/50 text-sm font-bold min-h-[44px]">
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
