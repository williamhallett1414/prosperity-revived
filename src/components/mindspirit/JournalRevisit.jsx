import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import JournalThemeExplorer from './JournalThemeExplorer';

export default function JournalRevisit({ entry, user, onSelectExercise }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reflection, setReflection] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showThemeExplorer, setShowThemeExplorer] = useState(false);

  const generateReflection = async () => {
    setIsLoading(true);
    try {
      const daysAgo = Math.floor(
        (new Date() - new Date(entry.created_date)) / (1000 * 60 * 60 * 24)
      );

      const prompt = `I'm revisiting a journal entry from ${daysAgo} days ago. Here's what I wrote:

"${entry.content}"

Please provide:
1. A brief, warm reflection on this entry (2-3 sentences) that acknowledges growth or patterns
2. 3 thoughtful follow-up questions I can ask myself now to deepen my understanding

Format as:
REFLECTION: [your reflection]
QUESTIONS:
1. [question]
2. [question]
3. [question]`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      const parts = response.split('QUESTIONS:');
      const reflectionText = parts[0].replace('REFLECTION:', '').trim();
      const questionsText = parts[1]?.trim() || '';
      
      const parsedQuestions = questionsText
        .split('\n')
        .filter(q => q.match(/^\d+\./))
        .map(q => q.replace(/^\d+\.\s*/, '').trim());

      setReflection(reflectionText);
      setQuestions(parsedQuestions);
      setHasLoaded(true);
    } catch (error) {
      toast.error('Could not generate reflection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-purple-100 pt-4"
    >
      <button
        onClick={() => {
          if (!hasLoaded && !isExpanded) {
            generateReflection();
          }
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        Revisit & Reflect
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="ml-2 text-sm text-gray-600">Generating reflection...</span>
              </div>
            ) : hasLoaded ? (
              <>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900 mb-2">Reflection</h4>
                      <p className="text-sm text-purple-800 leading-relaxed">{reflection}</p>
                    </div>
                  </div>
                </div>

                {questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Reflection Questions
                    </h4>
                    {questions.map((question, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-blue-50 border border-blue-100 rounded-lg p-3"
                      >
                        <p className="text-sm text-blue-900">{question}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : null}

            {!isLoading && !hasLoaded && (
              <Button
                onClick={generateReflection}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Generate AI Reflection
              </Button>
            )}

            {user && (
              <Button
                onClick={() => setShowThemeExplorer(!showThemeExplorer)}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Themes & Emotions
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Explorer */}
      <AnimatePresence>
        {showThemeExplorer && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <JournalThemeExplorer
              user={user}
              onSelectExercise={(exercises) => {
                onSelectExercise?.(exercises);
                setShowThemeExplorer(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}