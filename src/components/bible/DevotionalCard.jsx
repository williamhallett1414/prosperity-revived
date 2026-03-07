import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function DevotionalCard({ devotional, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group w-full text-left bg-[#F2F6FA] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#FAD98D]/15"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={devotional.image}
          alt={devotional.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg mb-1">{devotional.title}</h3>
          <p className="text-white/90 text-xs">{devotional.subtitle}</p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-[#0A1A2F]/60 line-clamp-2 mb-3">
          {devotional.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-[#0A1A2F]/40">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{devotional.readTime}</span>
          </div>
          
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#c9a227]" />
        </div>
      </div>
    </motion.button>
  );
}