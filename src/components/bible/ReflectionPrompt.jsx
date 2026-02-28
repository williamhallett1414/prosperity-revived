import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function ReflectionPrompt({ section, content }) {
  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this Bible study section about "${section}", generate ONE thoughtful reflection question that helps someone deeply engage with and apply the content. The question should be meaningful, personal, and encourage introspection.

Context: ${content.substring(0, 300)}...

Generate only the reflection question, no additional text.`,
        add_context_from_internet: false
      });
      setPrompt(response);
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3"
    >
      <Card className="p-4 bg-gradient-to-br from-[#FAD98D]/10 to-[#FFF8E7] dark:from-[#0A1A2F]/40 dark:to-[#1a1a2e]/40 border-l-4 border-[#D9B878]">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#8a6e1a] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {prompt ? (
              <>
                <p className="text-sm font-semibold text-[#1a1a2e] dark:text-white mb-3">Reflection Question:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 italic">"{prompt}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePrompt}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  Generate Another
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={generatePrompt}
                disabled={isLoading}
                className="gap-2 text-[#8a6e1a] hover:text-[#3C4E53]"
              >
                <Sparkles className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'AI Reflection Prompt'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}