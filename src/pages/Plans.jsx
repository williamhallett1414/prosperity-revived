import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import { readingPlans } from '@/components/bible/BibleData';

export default function Plans() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const getProgressForPlan = (planId) => {
    return planProgress.find(p => p.plan_id === planId);
  };

  const categories = ['all', ...new Set(readingPlans.map(p => p.category))];

  const filteredPlans = readingPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
                          plan.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || plan.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Reading Plans</h1>
          <p className="text-gray-500">Discover plans to guide your study</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-gray-200 rounded-xl h-12"
          />
        </div>

        {/* Categories */}
        <Tabs value={category} onValueChange={setCategory} className="mb-6">
          <TabsList className="bg-white p-1 h-auto flex-wrap gap-1">
            {categories.map(cat => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg capitalize data-[state=active]:bg-[#1a1a2e] data-[state=active]:text-white"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Plans Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPlans.map((plan, index) => (
            <ReadingPlanCard
              key={plan.id}
              plan={plan}
              progress={getProgressForPlan(plan.id)}
              onClick={() => window.location.href = createPageUrl(`PlanDetail?id=${plan.id}`)}
              index={index}
            />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No plans found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}