import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ReadingPlanCard({ plan, progress, onClick, index }) {
  const progressPercent = progress 
    ? Math.round((progress.completed_days?.length || 0) / plan.duration * 100)
    : 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 w-full text-left"
    >
      <div className="relative h-32 overflow-hidden pointer-events-none">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
            {plan.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 pointer-events-none">
        <h3 className="font-semibold text-[#1a1a2e] mb-1 group-hover:text-[#c9a227] transition-colors">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {plan.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{plan.duration} days</span>
          </div>
          
          {progress && (
            <div className="flex items-center gap-2 pointer-events-none">
              <Progress value={progressPercent} className="w-16 h-1.5" />
              <span>{progressPercent}%</span>
            </div>
          )}
          
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform pointer-events-none" />
        </div>
      </div>
    </motion.button>
  );
}