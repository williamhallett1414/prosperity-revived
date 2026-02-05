import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function BibleQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const suggestedQuestions = [
    "What does the Bible say about forgiveness?",
    "How can I grow in my faith?",
    "What is God's purpose for my life?",
    "How do I deal with anxiety according to Scripture?",
    "What does it mean to have faith?"
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const userQuestion = question;
    setQuestion('');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a knowledgeable Bible teacher helping someone understand Scripture. Answer the following question with biblical wisdom, citing specific Bible verses and providing practical application.

Question: ${userQuestion}

Provide a clear, encouraging answer that:
1. Directly addresses the question
2. Includes 2-3 relevant Bible verses with references
3. Offers practical application for daily life
4. Is warm and pastoral in tone
5. Is concise (2-3 paragraphs max)`,
        add_context_from_internet: false
      });

      const newEntry = {
        question: userQuestion,
        answer: response,
        timestamp: new Date().toISOString()
      };

      setAnswer(response);
      setHistory([newEntry, ...history]);
    } catch (error) {
      setAnswer("I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (q) => {
    setQuestion(q);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-white mb-2">Ask a Bible Question</h2>
        <p className="text-gray-500 dark:text-gray-400">Get biblical guidance and wisdom</p>
      </motion.div>

      {/* Question Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-6 shadow-lg"
      >
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to know from Scripture?"
          className="min-h-[100px] mb-4 resize-none bg-gray-50 dark:bg-[#1a1a2e] border-gray-200 dark:border-gray-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAskQuestion();
            }
          }}
        />
        <Button
          onClick={handleAskQuestion}
          disabled={!question.trim() || isLoading}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#8fa68a] hover:opacity-90 h-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Searching Scripture...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Ask Question
            </>
          )}
        </Button>
      </motion.div>

      {/* Suggested Questions */}
      {!answer && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suggested Questions:</p>
          {suggestedQuestions.map((q, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => handleSuggestedQuestion(q)}
              className="w-full text-left bg-white dark:bg-[#2d2d4a] rounded-xl p-4 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 group"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#c9a227] mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{q}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Current Answer */}
      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-[#2d2d4a] dark:to-[#252540] rounded-2xl p-6 shadow-lg border-2 border-[#c9a227]/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
            <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Biblical Answer</h3>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {answer}
            </p>
          </div>
        </motion.div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">Previous Questions</h3>
          {history.slice(1).map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#2d2d4a] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#c9a227] mt-1 flex-shrink-0" />
                <p className="font-medium text-[#1a1a2e] dark:text-white text-sm">{entry.question}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {entry.answer}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}