import React from 'react';
import { motion } from 'framer-motion';
import { Type, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FONT_SIZES = [
  { label: 'Small', value: 'text-sm', lineHeight: 'leading-relaxed' },
  { label: 'Medium', value: 'text-base', lineHeight: 'leading-relaxed' },
  { label: 'Large', value: 'text-lg', lineHeight: 'leading-loose' },
  { label: 'X-Large', value: 'text-xl', lineHeight: 'leading-loose' }
];

export default function BibleReaderSettings({ 
  isOpen, 
  onClose, 
  fontSize, 
  onFontSizeChange,
  isDarkMode,
  onThemeToggle 
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-4 w-72"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Reading Settings</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FONT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => onFontSizeChange(size.value, size.lineHeight)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                fontSize === size.value
                  ? 'bg-[#8fa68a] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Sun className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
        </div>
        <button
          onClick={onThemeToggle}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4" />
              Switch to Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Switch to Dark Mode
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}