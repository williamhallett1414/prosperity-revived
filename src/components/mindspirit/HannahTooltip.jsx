import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function HannahTooltip({ text, children, position = 'top', showIcon = true }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-b-0 border-l-transparent border-r-transparent border-t-purple-100',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-t-0 border-l-transparent border-r-transparent border-b-purple-100',
    left: 'left-full top-1/2 -translate-y-1/2 border-r-0 border-t-transparent border-b-transparent border-l-purple-100',
    right: 'right-full top-1/2 -translate-y-1/2 border-l-0 border-t-transparent border-b-transparent border-r-purple-100'
  };

  return (
    <div className="relative inline-block group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center"
      >
        {children}
        {showIcon && (
          <HelpCircle className="w-3.5 h-3.5 text-[#D9B878] ml-1 opacity-70 hover:opacity-100 transition-opacity" />
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
          >
            <div className="bg-[#FAD98D]/20 text-[#0A1A2F] text-xs rounded-lg px-3 py-2 max-w-xs whitespace-normal shadow-lg border border-[#D9B878]/40">
              {text}
            </div>
            <div
              className={`absolute w-2 h-2 bg-[#FAD98D]/20 border border-[#D9B878]/40 ${arrowClasses[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}