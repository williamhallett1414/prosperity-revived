import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Scan, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DetailedFoodLogModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState({
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
  });

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

      setMeal(prev => ({
        ...prev,
        ...response
      }));
    } catch (error) {
      console.error('AI analysis failed', error);
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

      setMeal(prev => ({
        ...prev,
        ...response,
        barcode
      }));
    } catch (error) {
      console.error('Barcode lookup failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave(meal);
    setMeal({
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
      serving_size: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Food</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="barcode">Barcode Scan</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <Select value={meal.meal_type} onValueChange={(v) => setMeal({ ...meal, meal_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                <SelectItem value="lunch">🥗 Lunch</SelectItem>
                <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                <SelectItem value="snack">🍎 Snack</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Input
                placeholder="Food description (e.g., Grilled chicken breast)"
                value={meal.description}
                onChange={(e) => setMeal({ ...meal, description: e.target.value })}
              />
              <Button
                onClick={handleAIAnalysis}
                disabled={loading || !meal.description}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Nutrition Estimate
                  </>
                )}
              </Button>
            </div>

            <Input
              placeholder="Serving size (e.g., 1 cup, 100g)"
              value={meal.serving_size}
              onChange={(e) => setMeal({ ...meal, serving_size: e.target.value })}
            />

            <Tabs defaultValue="macros" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="macros">Macros</TabsTrigger>
                <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
                <TabsTrigger value="minerals">Minerals</TabsTrigger>
              </TabsList>

              <TabsContent value="macros" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Calories</label>
                    <Input type="number" value={meal.calories || ''} onChange={(e) => setMeal({ ...meal, calories: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Protein (g)</label>
                    <Input type="number" value={meal.protein || ''} onChange={(e) => setMeal({ ...meal, protein: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Carbs (g)</label>
                    <Input type="number" value={meal.carbs || ''} onChange={(e) => setMeal({ ...meal, carbs: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Total Fats (g)</label>
                    <Input type="number" value={meal.fats || ''} onChange={(e) => setMeal({ ...meal, fats: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Saturated Fat (g)</label>
                    <Input type="number" value={meal.saturated_fat || ''} onChange={(e) => setMeal({ ...meal, saturated_fat: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Trans Fat (g)</label>
                    <Input type="number" value={meal.trans_fat || ''} onChange={(e) => setMeal({ ...meal, trans_fat: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Fiber (g)</label>
                    <Input type="number" value={meal.fiber || ''} onChange={(e) => setMeal({ ...meal, fiber: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Sugar (g)</label>
                    <Input type="number" value={meal.sugar || ''} onChange={(e) => setMeal({ ...meal, sugar: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Cholesterol (mg)</label>
                    <Input type="number" value={meal.cholesterol || ''} onChange={(e) => setMeal({ ...meal, cholesterol: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Sodium (mg)</label>
                    <Input type="number" value={meal.sodium || ''} onChange={(e) => setMeal({ ...meal, sodium: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitamins" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Vitamin A (mcg)</label>
                    <Input type="number" value={meal.vitamin_a || ''} onChange={(e) => setMeal({ ...meal, vitamin_a: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Vitamin C (mg)</label>
                    <Input type="number" value={meal.vitamin_c || ''} onChange={(e) => setMeal({ ...meal, vitamin_c: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Vitamin D (mcg)</label>
                    <Input type="number" value={meal.vitamin_d || ''} onChange={(e) => setMeal({ ...meal, vitamin_d: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="minerals" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Calcium (mg)</label>
                    <Input type="number" value={meal.calcium || ''} onChange={(e) => setMeal({ ...meal, calcium: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Iron (mg)</label>
                    <Input type="number" value={meal.iron || ''} onChange={(e) => setMeal({ ...meal, iron: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Potassium (mg)</label>
                    <Input type="number" value={meal.potassium || ''} onChange={(e) => setMeal({ ...meal, potassium: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Magnesium (mg)</label>
                    <Input type="number" value={meal.magnesium || ''} onChange={(e) => setMeal({ ...meal, magnesium: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Zinc (mg)</label>
                    <Input type="number" value={meal.zinc || ''} onChange={(e) => setMeal({ ...meal, zinc: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Textarea
              placeholder="Notes (optional)"
              value={meal.notes}
              onChange={(e) => setMeal({ ...meal, notes: e.target.value })}
              className="h-20"
            />
          </TabsContent>

          <TabsContent value="barcode" className="space-y-4 mt-4">
            <div className="text-center py-8">
              <Scan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-4">Enter barcode number manually</p>
              <Input
                placeholder="Enter barcode (e.g., 012345678905)"
                onChange={(e) => {
                  if (e.target.value.length >= 8) {
                    handleBarcodeInput(e.target.value);
                  }
                }}
              />
            </div>

            {meal.description && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{meal.description}</h4>
                <p className="text-sm text-gray-500">{meal.serving_size}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-gray-500">Calories:</span>
                    <span className="ml-1 font-medium">{meal.calories}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Protein:</span>
                    <span className="ml-1 font-medium">{meal.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Carbs:</span>
                    <span className="ml-1 font-medium">{meal.carbs}g</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            Save Food Log
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}