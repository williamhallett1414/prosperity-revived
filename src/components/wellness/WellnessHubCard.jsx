import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';

export default function WellnessHubCard({ icon: Icon, title, description, color, page, index }) {
  return (
    <Link to={createPageUrl(page)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-gradient-to-br ${color} rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-[#0A1A2F]" />
              <h3 className="text-lg font-bold text-[#0A1A2F]">{title}</h3>
            </div>
            <p className="text-sm text-[#0A1A2F]/70">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#0A1A2F] flex-shrink-0 ml-2 mt-1" />
        </div>
      </motion.div>
    </Link>
  );
}