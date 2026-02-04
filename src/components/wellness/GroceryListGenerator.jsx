import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Download, Printer } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function GroceryListGenerator({ isOpen, onClose, mealPlanDays }) {
  const [checkedItems, setCheckedItems] = useState({});

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list()
  });

  // Aggregate all ingredients from the meal plan
  const generateGroceryList = () => {
    const ingredientMap = {};
    
    mealPlanDays.forEach(day => {
      day.meals?.forEach(meal => {
        const recipe = recipes.find(r => r.id === meal.recipe_id);
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach(ingredient => {
            // Simple aggregation - could be enhanced with unit parsing
            const key = ingredient.toLowerCase().trim();
            if (ingredientMap[key]) {
              ingredientMap[key].count++;
              ingredientMap[key].recipes.push(meal.recipe_title);
            } else {
              ingredientMap[key] = {
                name: ingredient,
                count: 1,
                recipes: [meal.recipe_title]
              };
            }
          });
        }
      });
    });

    // Group by category (simple categorization)
    const categories = {
      produce: [],
      protein: [],
      dairy: [],
      grains: [],
      pantry: [],
      other: []
    };

    Object.values(ingredientMap).forEach(item => {
      const name = item.name.toLowerCase();
      
      if (name.match(/\b(chicken|beef|pork|fish|salmon|turkey|meat|tofu|egg)\b/)) {
        categories.protein.push(item);
      } else if (name.match(/\b(tomato|lettuce|spinach|onion|garlic|pepper|carrot|broccoli|potato|apple|banana|berry|fruit|vegetable)\b/)) {
        categories.produce.push(item);
      } else if (name.match(/\b(milk|cheese|yogurt|butter|cream)\b/)) {
        categories.dairy.push(item);
      } else if (name.match(/\b(rice|pasta|bread|flour|oat|quinoa|grain)\b/)) {
        categories.grains.push(item);
      } else if (name.match(/\b(oil|salt|pepper|spice|sauce|vinegar|sugar|honey)\b/)) {
        categories.pantry.push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  };

  const groceryList = generateGroceryList();
  const allIngredients = Object.values(groceryList).flat();
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleItem = (itemName) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    let text = '🛒 Grocery List\n\n';
    
    Object.entries(groceryList).forEach(([category, items]) => {
      if (items.length > 0) {
        text += `\n${category.toUpperCase()}\n`;
        text += '─'.repeat(30) + '\n';
        items.forEach(item => {
          text += `☐ ${item.name}${item.count > 1 ? ` (x${item.count})` : ''}\n`;
        });
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryIcons = {
    produce: '🥬',
    protein: '🍗',
    dairy: '🥛',
    grains: '🌾',
    pantry: '🧂',
    other: '📦'
  };

  const categoryNames = {
    produce: 'Produce',
    protein: 'Protein & Meat',
    dairy: 'Dairy',
    grains: 'Grains & Bread',
    pantry: 'Pantry',
    other: 'Other'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            Grocery List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-emerald-600">{allIngredients.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Checked Off</p>
                <p className="text-2xl font-bold text-teal-600">{checkedCount}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Grocery List by Category */}
          {Object.entries(groceryList).map(([category, items]) => (
            items.length > 0 && (
              <div key={category}>
                <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">{categoryIcons[category]}</span>
                  {categoryNames[category]}
                  <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h4>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        checkedItems[item.name]
                          ? 'bg-gray-100 dark:bg-[#1a1a2e]'
                          : 'bg-white dark:bg-[#2d2d4a] hover:bg-gray-50 dark:hover:bg-[#3d3d5a]'
                      }`}
                    >
                      <Checkbox
                        checked={checkedItems[item.name] || false}
                        onCheckedChange={() => toggleItem(item.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${
                          checkedItems[item.name]
                            ? 'text-gray-500 line-through'
                            : 'text-[#1a1a2e] dark:text-white'
                        }`}>
                          {item.name}
                          {item.count > 1 && (
                            <span className="ml-2 text-xs font-normal text-emerald-600">
                              ×{item.count}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          For: {item.recipes.slice(0, 2).join(', ')}
                          {item.recipes.length > 2 && ` +${item.recipes.length - 2} more`}
                        </p>
                      </div>
                      {checkedItems[item.name] && (
                        <Check className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          {allIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No ingredients found in your meal plan</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}