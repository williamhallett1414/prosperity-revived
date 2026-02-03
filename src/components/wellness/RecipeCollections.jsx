import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RecipeCard from './RecipeCard';

export default function RecipeCollections({ allRecipes }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    recipe_ids: [],
    is_public: false
  });

  const queryClient = useQueryClient();

  const { data: collections = [] } = useQuery({
    queryKey: ['recipe-collections'],
    queryFn: () => base44.entities.RecipeCollection.list('-created_date')
  });

  const createCollection = useMutation({
    mutationFn: (data) => base44.entities.RecipeCollection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe-collections']);
      setShowCreateModal(false);
      setNewCollection({ name: '', description: '', recipe_ids: [], is_public: false });
    }
  });

  const deleteCollection = useMutation({
    mutationFn: (id) => base44.entities.RecipeCollection.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe-collections']);
      setSelectedCollection(null);
    }
  });

  const updateCollection = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RecipeCollection.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe-collections']);
    }
  });

  const getCollectionRecipes = (collection) => {
    return allRecipes.filter(r => collection.recipe_ids?.includes(r.id));
  };

  const removeRecipeFromCollection = (collectionId, recipeId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      const updatedRecipeIds = collection.recipe_ids.filter(id => id !== recipeId);
      updateCollection.mutate({
        id: collectionId,
        data: { recipe_ids: updatedRecipeIds }
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Collections Grid */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">My Collections</h3>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No collections yet</p>
          <Button onClick={() => setShowCreateModal(true)} variant="outline">
            Create Your First Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((collection) => {
            const recipeCount = collection.recipe_ids?.length || 0;
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1a1a2e] dark:text-white">
                      {collection.name}
                    </h4>
                    {collection.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  {collection.is_public && (
                    <Share2 className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>{recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Collection Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Collection name (e.g., Quick Weeknight Dinners)"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newCollection.description}
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              className="h-20"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => createCollection.mutate(newCollection)}
                disabled={!newCollection.name}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Create Collection
              </Button>
              <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Collection Modal */}
      <Dialog open={!!selectedCollection} onOpenChange={() => setSelectedCollection(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>{selectedCollection?.name}</DialogTitle>
                {selectedCollection?.description && (
                  <p className="text-sm text-gray-500 mt-1">{selectedCollection.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Delete this collection?')) {
                    deleteCollection.mutate(selectedCollection.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedCollection && getCollectionRecipes(selectedCollection).length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No recipes in this collection yet. Add recipes from the Recipes tab!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCollection && getCollectionRecipes(selectedCollection).map((recipe, index) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCard recipe={recipe} index={index} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => removeRecipeFromCollection(selectedCollection.id, recipe.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}