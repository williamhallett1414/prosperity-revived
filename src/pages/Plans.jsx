import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import CreateCustomPlanModal from '@/components/plans/CreateCustomPlanModal';
import { readingPlans } from '@/components/bible/BibleData';


export default function Plans() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCreateCustom, setShowCreateCustom] = useState(false);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const createCustomPlan = useMutation({
    mutationFn: async (planData) => {
      const customReadings = planData.readings.map((reading, index) => ({
        day: index + 1,
        book: reading.book,
        chapter: parseInt(reading.chapter)
      }));

      return base44.entities.ReadingPlanProgress.create({
        plan_id: `custom-${Date.now()}`,
        plan_name: planData.name,
        is_custom: true,
        custom_readings: customReadings,
        total_days: customReadings.length,
        completed_days: [],
        current_day: 1,
        started_date: new Date().toISOString().split('T')[0],
        current_streak: 0,
        longest_streak: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['planProgress']);
      setShowCreateCustom(false);
    }
  });

  const getProgressForPlan = (planId) => {
    return planProgress.find(p => p.plan_id === planId);
  };

  const categories = ['all', ...new Set(readingPlans.map(p => p.category))];

  const customPlans = planProgress.filter(p => p.is_custom).map(p => ({
    id: p.plan_id,
    name: p.plan_name,
    description: `${p.total_days} days of custom readings`,
    duration: p.total_days,
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    isCustom: true
  }));

  const allPlans = [...customPlans, ...readingPlans];

  const filteredPlans = allPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
                          plan.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || plan.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#2d2d4a] shadow-sm flex items-center justify-center text-[#1a1a2e] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3d3d5a] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Reading Plans</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-[52px]">Discover plans to guide your study</p>
        </motion.div>

        {/* Search & Create */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-[#2d2d4a] border-gray-200 dark:border-gray-700 rounded-xl h-12"
            />
          </div>
          <Button
            onClick={() => setShowCreateCustom(true)}
            className="bg-[#c9a227] hover:bg-[#b8922a] h-12 px-4 shadow-md"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Custom</span>
          </Button>
        </div>

        {/* Categories */}
        <Tabs value={category} onValueChange={setCategory} className="mb-6">
          <TabsList className="bg-white dark:bg-[#2d2d4a] p-1 h-auto flex-wrap gap-1 rounded-xl">
            {categories.map(cat => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg capitalize text-xs sm:text-sm data-[state=active]:bg-[#1a1a2e] dark:data-[state=active]:bg-[#c9a227] data-[state=active]:text-white"
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

      <CreateCustomPlanModal
        isOpen={showCreateCustom}
        onClose={() => setShowCreateCustom(false)}
        onSubmit={(data) => createCustomPlan.mutate(data)}
      />
    </div>
  );
}