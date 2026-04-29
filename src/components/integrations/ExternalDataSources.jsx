import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, X, Activity, UtensilsCrossed, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FitnessTrackerImport from './FitnessTrackerImport';
import RecipeSourceImport from './RecipeSourceImport';
import CalendarJournalImport from './CalendarJournalImport';

export default function ExternalDataSources({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('fitness');

  const tabs = [
    { id: 'fitness', label: 'Fitness', icon: Activity, color: 'text-sky-500', for: 'Coach David' },
    { id: 'recipes', label: 'Nutrition', icon: UtensilsCrossed, color: 'text-green-600', for: 'Chef Daniel' },
    { id: 'calendar', label: 'Life & Growth', icon: Heart, color: 'text-purple-500', for: 'Hannah' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="bg-white dark:bg-white/5 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3C4E53] to-[#c9a227] flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">External Data Sources</h2>
              <p className="text-xs text-gray-500">Enrich your chatbot experience with real data</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-5 mt-4 mb-0 grid grid-cols-3 h-10">
            {tabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs gap-1.5">
                <tab.icon className={`w-3.5 h-3.5 ${tab.color}`} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="fitness" className="p-5 mt-0">
              <FitnessTrackerImport user={user} />
            </TabsContent>
            <TabsContent value="recipes" className="p-5 mt-0">
              <RecipeSourceImport user={user} />
            </TabsContent>
            <TabsContent value="calendar" className="p-5 mt-0">
              <CalendarJournalImport user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}