import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

export default function AIReflectionQuestions({ section, content, guideId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this Bible study content about "${section}", generate 3 thoughtful, personal reflection questions that help the reader apply these truths to their life. Make them deep, specific, and actionable.

Content: ${content}

Return exactly 3 questions that encourage personal reflection and application.`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: { type: "string" },
              description: "Array of 3 reflection questions"
            }
          }
        }
      });

      setQuestions(response.questions || []);
      setIsExpanded(true);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        onClick={isExpanded ? () => setIsExpanded(false) : generateQuestions}
        disabled={loading}
        variant="outline"
        className="w-full bg-gradient-to-r from-[#FAD98D]/10 to-[#FFF8E7] dark:from-[#0A1A2F]/40 dark:to-[#1a1a2e]/40 border-[#D9B878]/40 dark:border-[#c9a227]/60 hover:shadow-md transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Reflection Questions...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2 text-[#c9a227]" />
            Reflection Questions
            {isExpanded && <ChevronUp className="w-4 h-4 ml-2" />}
            {!isExpanded && questions.length === 0 && <ChevronDown className="w-4 h-4 ml-2" />}
          </>
        )}
      </Button>

      <AnimatePresence>
        {isExpanded && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 mt-3 bg-gradient-to-br from-[#FAD98D]/10 to-[#FFF8E7] dark:from-[#0A1A2F]/40 dark:to-[#1a1a2e]/40 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#c9a227]" />
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Personal Reflection Questions</h3>
              </div>
              {questions.map((question, index) => (
                <div key={index} className="bg-white dark:bg-[#2d2d4a] p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {index + 1}. {question}
                  </p>
                </div>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}