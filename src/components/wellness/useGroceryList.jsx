import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'grocery_list_v1';

function loadList() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function categorise(ing) {
  const s = ing.toLowerCase();
  if (/\b(spinach|lettuce|kale|tomato|onion|garlic|pepper|broccoli|carrot|celery|cucumber|potato|sweet potato|zucchini|mushroom|lemon|lime|apple|banana|berry|fruit|vegetable|herb|cilantro|parsley|basil|avocado|cabbage|corn|pea|bean sprout)\b/.test(s)) return 'Produce';
  if (/\b(chicken|beef|pork|fish|salmon|tuna|shrimp|turkey|lamb|steak|ground|mince|sausage|bacon|egg|eggs)\b/.test(s)) return 'Protein & Meat';
  if (/\b(milk|cheese|yogurt|cream|butter|dairy)\b/.test(s)) return 'Dairy';
  if (/\b(flour|bread|rice|pasta|oat|grain|noodle|tortilla|quinoa|farro|sourdough|pita|wrap)\b/.test(s)) return 'Grains & Bread';
  if (/\b(salt|pepper|spice|cumin|paprika|cinnamon|oregano|thyme|sauce|oil|vinegar|soy|honey|sugar|syrup|stock|broth|baking)\b/.test(s)) return 'Pantry & Spices';
  if (/\b(almond|walnut|pecan|cashew|peanut|nut|seed|tahini|flax|chia|sesame|sunflower)\b/.test(s)) return 'Nuts & Seeds';
  return 'Other';
}

function recipeToItems(recipe) {
  return (recipe.ingredients || []).map((ing, idx) => ({
    id: `${recipe.id}-${idx}`,
    ingredient: ing,
    recipeTitle: recipe.title,
    recipeId: recipe.id,
    category: categorise(ing),
    checked: false,
  }));
}

// Module-level shared state
let _list = loadList();
const _listeners = new Set();

function notifyAll() {
  _listeners.forEach(fn => fn());
}

export function useGroceryList() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  }, []);

  const addRecipe = useCallback((recipe) => {
    const newItems = recipeToItems(recipe).filter(
      ni => !_list.some(ex => ex.id === ni.id)
    );
    _list = [..._list, ...newItems];
    saveList(_list);
    notifyAll();
  }, []);

  const removeRecipe = useCallback((recipeId) => {
    _list = _list.filter(i => i.recipeId !== recipeId);
    saveList(_list);
    notifyAll();
  }, []);

  const isRecipeAdded = useCallback((recipeId) => {
    return _list.some(i => i.recipeId === recipeId);
  }, []);

  const toggleItem = useCallback((id) => {
    _list = _list.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    saveList(_list);
    notifyAll();
  }, []);

  const removeItem = useCallback((id) => {
    _list = _list.filter(i => i.id !== id);
    saveList(_list);
    notifyAll();
  }, []);

  const clearChecked = useCallback(() => {
    _list = _list.filter(i => !i.checked);
    saveList(_list);
    notifyAll();
  }, []);

  const clearAll = useCallback(() => {
    _list = [];
    saveList(_list);
    notifyAll();
  }, []);

  const download = useCallback(() => {
    const lines = ['Grocery List\n'];
    const groups = {};
    _list.forEach(i => {
      if (!groups[i.category]) groups[i.category] = [];
      groups[i.category].push(i);
    });
    Object.entries(groups).forEach(([cat, items]) => {
      lines.push(`\n${cat}`);
      items.forEach(i => lines.push(`  ${i.checked ? '✓' : '○'} ${i.ingredient} (${i.recipeTitle})`));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'grocery-list.txt'; a.click();
    URL.revokeObjectURL(url);
  }, []);

  const grouped = (() => {
    const map = {};
    _list.forEach(i => {
      if (!map[i.category]) map[i.category] = [];
      map[i.category].push(i);
    });
    return Object.entries(map).map(([category, items]) => ({ category, items }));
  })();

  return {
    items: _list,
    grouped,
    totalCount: _list.length,
    checkedCount: _list.filter(i => i.checked).length,
    addRecipe,
    removeRecipe,
    isRecipeAdded,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
    download,
  };
}