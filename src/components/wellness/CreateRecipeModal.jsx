import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CreateRecipeModal({ isOpen, onClose }) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: 'lunch',
    diet_type: 'any',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 4,
    calories: 0,
    ingredients: [],
    instructions: []
  });
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentInstruction, setCurrentInstruction] = useState('');
  const queryClient = useQueryClient();

  const createRecipe = useMutation({
    mutationFn: (data) => base44.entities.Recipe.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes']);
      onClose();
      setRecipe({ title: '', description: '', category: 'lunch', diet_type: 'any', prep_time_minutes: 15, cook_time_minutes: 30, servings: 4, calories: 0, ingredients: [], instructions: [] });
    }
  });

  const handleSubmit = () => {
    if (recipe.title.trim() && recipe.ingredients.length > 0 && recipe.instructions.length > 0) {
      createRecipe.mutate(recipe);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Recipe title"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          />

          <Textarea
            placeholder="Brief description"
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select value={recipe.category} onValueChange={(v) => setRecipe({ ...recipe, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={recipe.diet_type} onValueChange={(v) => setRecipe({ ...recipe, diet_type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="gluten_free">Gluten Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              placeholder="Prep (min)"
              value={recipe.prep_time_minutes}
              onChange={(e) => setRecipe({ ...recipe, prep_time_minutes: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Cook (min)"
              value={recipe.cook_time_minutes}
              onChange={(e) => setRecipe({ ...recipe, cook_time_minutes: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Servings"
              value={recipe.servings}
              onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ingredients</label>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="flex-1 text-sm">{ing}</span>
                <Button variant="ghost" size="sm" onClick={() => setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, idx) => idx !== i) })}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add ingredient"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentIngredient.trim()) {
                    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, currentIngredient] });
                    setCurrentIngredient('');
                  }
                }}
              />
              <Button variant="outline" onClick={() => {
                if (currentIngredient.trim()) {
                  setRecipe({ ...recipe, ingredients: [...recipe.ingredients, currentIngredient] });
                  setCurrentIngredient('');
                }
              }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Instructions</label>
            {recipe.instructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span className="text-sm flex-1">{i + 1}. {inst}</span>
                <Button variant="ghost" size="sm" onClick={() => setRecipe({ ...recipe, instructions: recipe.instructions.filter((_, idx) => idx !== i) })}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add step"
                value={currentInstruction}
                onChange={(e) => setCurrentInstruction(e.target.value)}
                className="min-h-[60px]"
              />
              <Button variant="outline" onClick={() => {
                if (currentInstruction.trim()) {
                  setRecipe({ ...recipe, instructions: [...recipe.instructions, currentInstruction] });
                  setCurrentInstruction('');
                }
              }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600">
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}