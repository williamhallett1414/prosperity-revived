import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, BookOpen, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

export default function PostCard({ post, comments = [], onLike, onComment, index }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => 
        (f.user_email === user?.email || f.friend_email === user?.email)
      );
    },
    enabled: !!user
  });

  const sendFriendRequest = useMutation({
    mutationFn: async () => {
      return base44.entities.Friend.create({
        user_email: user.email,
        friend_email: post.created_by,
        user_name: user.full_name || user.email,
        friend_name: post.user_name,
        status: 'pending'
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['friends'])
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id, !isLiked);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleVerseClick = () => {
    if (post.verse_book) {
      window.location.href = createPageUrl(`Bible?book=${post.verse_book}&chapter=${post.verse_chapter}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user_name}`,
        text: post.content,
        url: window.location.href
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.content}\n\n- ${post.user_name}`);
      alert('Post copied to clipboard!');
    }
  };

  const postComments = comments.filter(c => c.post_id === post.id);
  
  const isMyPost = user?.email === post.created_by;
  const alreadyFriends = friends.some(f => 
    (f.user_email === post.created_by || f.friend_email === post.created_by) && f.status === 'accepted'
  );
  const requestSent = friends.some(f => 
    f.user_email === user?.email && f.friend_email === post.created_by && f.status === 'pending'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#c9a227] flex items-center justify-center text-white font-semibold">
          {post.user_name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#1a1a2e]">{post.user_name || 'Anonymous'}</p>
          <p className="text-xs text-gray-500">{format(new Date(post.created_date), 'MMM d, yyyy')}</p>
        </div>
        {!isMyPost && user && !alreadyFriends && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendFriendRequest.mutate()}
            disabled={requestSent || sendFriendRequest.isPending}
            className="text-[#c9a227] hover:text-[#8fa68a]"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            {requestSent ? 'Sent' : 'Add'}
          </Button>
        )}
        {alreadyFriends && !isMyPost && (
          <span className="text-xs text-[#8fa68a] font-medium">Friends</span>
        )}
      </div>

      {/* Verse Quote */}
      {post.verse_text && (
        <div 
          onClick={handleVerseClick}
          className="bg-[#faf8f5] rounded-xl p-4 mb-3 border-l-4 border-[#c9a227] cursor-pointer hover:bg-[#f5f3ed] transition-colors"
        >
          <p className="font-serif text-gray-800 leading-relaxed mb-2">
            "{post.verse_text}"
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">
              {post.verse_book} {post.verse_chapter}:{post.verse_number}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-500"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{postComments.length}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 text-gray-500"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {/* Comment List */}
          {postComments.map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                {comment.user_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-2">
                <p className="text-sm font-medium text-gray-900">{comment.user_name || 'Anonymous'}</p>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="bg-[#1a1a2e] hover:bg-[#2d2d4a] self-end"
            >
              Post
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}