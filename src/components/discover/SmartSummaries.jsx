import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText, Loader2, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SmartSummaries({ user }) {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState({});

  const { data: posts = [] } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => base44.entities.Post.list('-created_date', 50)
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  // Filter posts with significant content or discussion
  const longPosts = posts.filter(post => {
    const postComments = comments.filter(c => c.post_id === post.id);
    return post.content.length > 200 || postComments.length > 5;
  }).slice(0, 8);

  const generateSummary = async (post) => {
    const postComments = comments.filter(c => c.post_id === post.id);
    
    setLoading(prev => ({ ...prev, [post.id]: true }));
    try {
      const prompt = `Summarize this post and its discussion in 2-3 concise sentences:

Post: "${post.content}"

Comments (${postComments.length}):
${postComments.slice(0, 10).map(c => `- ${c.content}`).join('\n')}

Provide a clear, engaging summary that captures the main points and key discussion themes.`;

      const result = await base44.integrations.Core.InvokeLLM({ prompt });
      setSummaries(prev => ({ ...prev, [post.id]: result }));
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setLoading(prev => ({ ...prev, [post.id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          ✨ AI-powered summaries help you quickly understand long posts and discussions
        </p>
      </div>

      {longPosts.map((post, index) => {
        const postComments = comments.filter(c => c.post_id === post.id);
        const hasSummary = summaries[post.id];
        const isLoading = loading[post.id];

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      by {post.user_name || 'Anonymous'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MessageCircle className="w-3 h-3" />
                      {postComments.length} comments
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                    {post.content}
                  </p>

                  {hasSummary ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          AI SUMMARY
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {hasSummary}
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => generateSummary(post)}
                      disabled={isLoading}
                      size="sm"
                      variant="outline"
                      className="mb-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  )}

                  <Link
                    to={createPageUrl('Community')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Full Discussion →
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}