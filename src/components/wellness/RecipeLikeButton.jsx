import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function RecipeLikeButton({ recipe }) {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: likes = [] } = useQuery({
    queryKey: ['recipe-likes', recipe.id],
    queryFn: () => base44.entities.RecipeLike.filter({ recipe_id: recipe.id }),
    enabled: !!recipe.id
  });

  const toggleLike = useMutation({
    mutationFn: async () => {
      const userLike = likes.find(l => l.user_email === user?.email);
      
      if (userLike) {
        // Unlike
        await base44.entities.RecipeLike.delete(userLike.id);
        await base44.entities.Recipe.update(recipe.id, {
          likes: Math.max(0, (recipe.likes || 0) - 1)
        });
      } else {
        // Like
        await base44.entities.RecipeLike.create({
          recipe_id: recipe.id,
          user_email: user.email
        });
        await base44.entities.Recipe.update(recipe.id, {
          likes: (recipe.likes || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe-likes', recipe.id]);
      queryClient.invalidateQueries(['recipes']);
    }
  });

  if (!user || !recipe.id) return null;

  const userHasLiked = likes.some(l => l.user_email === user?.email);
  const likeCount = recipe.likes || 0;

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          toggleLike.mutate();
        }}
        className="gap-1"
      >
        <Heart
          className={`w-4 h-4 ${userHasLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
        />
        {likeCount > 0 && (
          <span className={`text-xs ${userHasLiked ? 'text-red-500' : 'text-gray-500'}`}>
            {likeCount}
          </span>
        )}
      </Button>
    </motion.div>
  );
}