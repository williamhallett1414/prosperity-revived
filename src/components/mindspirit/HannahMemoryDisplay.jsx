import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown } from 'lucide-react';

export default function HannahMemoryDisplay({ memory }) {
  const [expanded, setExpanded] = useState(false);

  if (!memory || memory.totalConversations === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200 text-xs"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-800">
            Hannah's Memory ({memory.totalConversations} conversations)
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-indigo-600 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 pt-3 border-t border-indigo-200"
          >
            {memory.summary && (
              <div>
                <p className="font-medium text-gray-800 mb-1">Our Journey:</p>
                <p className="text-gray-700 leading-relaxed">{memory.summary}</p>
              </div>
            )}

            {memory.keyThemes?.length > 0 && (
              <div>
                <p className="font-medium text-gray-800 mb-1">Topics We've Explored:</p>
                <div className="flex flex-wrap gap-1">
                  {memory.keyThemes.map((theme, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {memory.emotionalPatterns?.length > 0 && (
              <div>
                <p className="font-medium text-gray-800 mb-1">Your Emotional Patterns:</p>
                <p className="text-gray-700">
                  I've noticed you often experience: {memory.emotionalPatterns.join(', ')}
                </p>
              </div>
            )}

            {memory.growthAreas?.length > 0 && (
              <div>
                <p className="font-medium text-gray-800 mb-1">Areas for Growth:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {memory.growthAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {memory.importantDetails?.length > 0 && (
              <div>
                <p className="font-medium text-gray-800 mb-1">Things I Remember About You:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {memory.importantDetails.slice(0, 3).map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}