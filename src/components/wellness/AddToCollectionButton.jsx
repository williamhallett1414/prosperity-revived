import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BookmarkPlus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AddToCollectionButton({ recipeId }) {
  const queryClient = useQueryClient();

  const { data: collections = [] } = useQuery({
    queryKey: ['recipe-collections'],
    queryFn: () => base44.entities.RecipeCollection.list('-created_date')
  });

  const updateCollection = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RecipeCollection.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe-collections']);
    }
  });

  const toggleRecipeInCollection = (collection) => {
    const recipeIds = collection.recipe_ids || [];
    const isInCollection = recipeIds.includes(recipeId);

    const updatedRecipeIds = isInCollection
      ? recipeIds.filter(id => id !== recipeId)
      : [...recipeIds, recipeId];

    updateCollection.mutate({
      id: collection.id,
      data: { recipe_ids: updatedRecipeIds }
    });
  };

  const isRecipeInCollection = (collection) => {
    return collection.recipe_ids?.includes(recipeId);
  };

  if (collections.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <BookmarkPlus className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {collections.map((collection) => (
          <DropdownMenuItem
            key={collection.id}
            onClick={() => toggleRecipeInCollection(collection)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{collection.name}</span>
            {isRecipeInCollection(collection) && (
              <Check className="w-4 h-4 text-green-500 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}