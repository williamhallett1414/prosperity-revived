import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Search } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CommunityRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const overrideStyle = { color: '#000000' };

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date')
  });

  // Filter community recipes (shared by others)
  const communityRecipes = recipes.filter(r => r.is_shared);

  // Apply search and sort
  let filteredRecipes = communityRecipes.filter(recipe => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      recipe.title?.toLowerCase().includes(searchLower) ||
      recipe.description?.toLowerCase().includes(searchLower) ||
      recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchLower))
    );
  });

  // Sort recipes
  if (sortBy === 'popular') {
    filteredRecipes = [...filteredRecipes].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (sortBy === 'recent') {
    filteredRecipes = [...filteredRecipes].sort((a, b) => 
      new Date(b.created_date) - new Date(a.created_date)
    );
  }

  return (
    <div className="space-y-4" style={overrideStyle}>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold" style={overrideStyle}>Community Recipes</h3>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search community recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 !text-black"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 !text-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">
              <div className="flex items-center gap-2 !text-black">
                <TrendingUp className="w-4 h-4" />
                Popular
              </div>
            </SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm !text-black">Community Contributions</p>
            <p className="text-2xl font-bold text-purple-600">{communityRecipes.length}</p>
          </div>
          <Users className="w-12 h-12 text-purple-600/20" />
        </div>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl !text-black">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="!text-black mb-2">
            {searchTerm ? 'No recipes found' : 'No community recipes yet'}
          </p>
          {!searchTerm && (
            <p className="text-sm !text-black">Share your first recipe to inspire others!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} showCommunityFeatures />
          ))}
        </div>
      )}
    </div>
  );
}