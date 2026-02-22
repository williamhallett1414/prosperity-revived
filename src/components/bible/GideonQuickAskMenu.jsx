import React from 'react';
import { Sparkles, Heart, BookOpen, Lightbulb, MessageSquare, Crown, Megaphone, Gift } from 'lucide-react';

const quickAskOptions = [
  {
    icon: BookOpen,
    label: 'Explain this verse',
    prompt: 'Explain this verse to me using the Scripture Breakdown Template:',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Lightbulb,
    label: 'Apply to my life',
    prompt: 'Help me apply this scripture to my life:',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: MessageSquare,
    label: 'What does Bible say',
    prompt: 'What does the Bible say about:',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Heart,
    label: 'Encourage me',
    prompt: 'Give me encouragement today based on scripture.',
    color: 'from-rose-500 to-rose-600'
  },
  {
    icon: Sparkles,
    label: 'Understand context',
    prompt: 'Help me understand the context of this passage:',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Crown,
    label: 'Kingdom principle',
    prompt: 'Teach me the kingdom principle behind this scripture:',
    color: 'from-violet-500 to-violet-600'
  },
  {
    icon: Megaphone,
    label: 'What to declare',
    prompt: 'What should I declare over my life according to scripture?',
    color: 'from-fuchsia-500 to-fuchsia-600'
  },
  {
    icon: Gift,
    label: "God's promise",
    prompt: 'Show me God\'s promise for this situation:',
    color: 'from-amber-500 to-amber-600'
  }
];

export default function GideonQuickAskMenu({ onSelectPrompt }) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-orange-50/50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-orange-900/10">
      <div className="mb-3 text-center">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Quick Ask Gideon
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Tap any question to get instant biblical wisdom
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickAskOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(option.prompt)}
              className={`bg-gradient-to-r ${option.color} text-white rounded-xl p-3 text-left shadow-md hover:shadow-lg active:scale-95 transition-all flex items-start gap-2 min-h-[70px]`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-medium leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}