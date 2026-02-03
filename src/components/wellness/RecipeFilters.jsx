import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecipeFilters({ filters, onFilterChange }) {
  return (
    <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg space-y-3 mb-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search recipes or ingredients..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filters.dietType}
          onValueChange={(value) => onFilterChange({ ...filters, dietType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Diet Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diets</SelectItem>
            <SelectItem value="keto">Keto</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="paleo">Paleo</SelectItem>
            <SelectItem value="gluten_free">Gluten Free</SelectItem>
            <SelectItem value="any">Any</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.prepTime}
        onValueChange={(value) => onFilterChange({ ...filters, prepTime: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Prep Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Time</SelectItem>
          <SelectItem value="quick">Quick (Under 15 min)</SelectItem>
          <SelectItem value="medium">Medium (15-30 min)</SelectItem>
          <SelectItem value="long">Long (30+ min)</SelectItem>
        </SelectContent>
      </Select>

      {(filters.search || filters.dietType !== 'all' || filters.category !== 'all' || filters.prepTime !== 'all') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange({ search: '', dietType: 'all', category: 'all', prepTime: 'all' })}
          className="w-full text-xs"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
}