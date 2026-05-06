import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { getDisplayNameFromString } from '@/lib/userName';
export default function PostSummary({ content, comments }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const shouldShowSummary = content.length > 500 || comments.length > 5;

  const generateSummary = async () => {
    setLoading(true);
    try {
      const commentsText = comments.map(c => `${getDisplayNameFromString(c.user_name)}: ${c.content}`).join('\n');
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Summarize this community post and its discussion in 2-3 sentences. Post: "${content}". Comments: ${commentsText || 'No comments yet.'}`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_points: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setSummary(result);
      setExpanded(true);
    } catch (error) {
      console.error('Failed to generate summary', error);
    }
    setLoading(false);
  };

  if (!shouldShowSummary) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 dark:border-white/10">
      {!summary && !loading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={generateSummary}
          className="text-[#c9a227] hover:text-[#AFC7E3] text-xs"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          AI Summary
        </Button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Generating summary...</span>
        </div>
      )}

      {summary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gradient-to-r from-[#F2F6FA] to-[#F2F6FA] rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c9a227]" />
              <span className="text-xs font-semibold text-[#0A1A2F] dark:text-white dark:text-white">AI Summary</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 w-6 p-0"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
          
          {expanded && (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{summary.summary}</p>
              {summary.key_points && summary.key_points.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Key Points:</p>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                    {summary.key_points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}