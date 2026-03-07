import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Heart, Lightbulb, MessageSquare, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GideonQuickAskMenu({ onSelectPrompt, isLoading, isCollapsed, onToggleCollapse }) {
  const quickPrompts = [
    {
      category: 'Scripture Study',
      icon: BookOpen,
      prompts: [
        "Help me understand a specific Bible passage",
        "What does the Bible say about forgiveness?",
        "Find verses about overcoming anxiety"
      ]
    },
    {
      category: 'Prayer & Devotion',
      icon: Heart,
      prompts: [
        "Guide me in prayer for a difficult situation",
        "Create a daily devotional plan",
        "How can I deepen my prayer life?"
      ]
    },
    {
      category: 'Faith Questions',
      icon: Lightbulb,
      prompts: [
        "How do I strengthen my faith during trials?",
        "What's God's purpose for my life?",
        "Help me understand God's grace"
      ]
    },
    {
      category: 'Spiritual Growth',
      icon: Sparkles,
      prompts: [
        "How do I grow closer to God?",
        "What are practical spiritual disciplines?",
        "Help me overcome spiritual struggles"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: isCollapsed ? 'auto' : 'auto',
        maxHeight: isCollapsed ? '48px' : '320px'
      }}
      className="border-b border-[#FAD98D]/20 bg-gradient-to-r from-[#FAD98D]/15 to-[#FAD98D]/10"
    >
      <div className="p-3">
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-between text-[#c9a227] hover:bg-[#FAD98D]/20"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-semibold">Quick Topics</span>
          </div>
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 space-y-3 max-h-[260px] overflow-y-auto"
          >
            {quickPrompts.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#c9a227]" />
                    <h4 className="text-xs font-semibold text-[#C9A227]">
                      {category.category}
                    </h4>
                  </div>
                  <div className="space-y-1 ml-6">
                    {category.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => onSelectPrompt(prompt)}
                        disabled={isLoading}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-white hover:bg-[#FAD98D]/20 text-[#0A1A2F]/75 transition-colors border border-[#FAD98D]/20 disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}