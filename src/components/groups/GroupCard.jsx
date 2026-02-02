import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function GroupCard({ group, onClick, index, isMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={group.cover_image}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          {group.is_private ? (
            <Lock className="w-4 h-4 text-white" />
          ) : (
            <Globe className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-[#1a1a2e] group-hover:text-[#c9a227] transition-colors">
            {group.name}
          </h3>
          {isMember && (
            <Badge className="bg-green-100 text-green-800 text-xs">Member</Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {group.description}
        </p>
        
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Users className="w-3.5 h-3.5" />
          <span>{group.member_count} member{group.member_count !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </motion.div>
  );
}