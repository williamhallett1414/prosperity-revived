import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Plus, MessageCircle, Send, Loader2, Users, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import CreateCustomPlanModal from '@/components/plans/CreateCustomPlanModal';
import { readingPlans } from '@/components/bible/BibleData';


export default function Plans() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCreateCustom, setShowCreateCustom] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: myGroupPlans = [] } = useQuery({
    queryKey: ['myGroupPlans', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const memberships = await base44.entities.GroupReadingMember.filter({
        user_email: user.email
      });
      if (memberships.length === 0) return [];

      const allGroups = await base44.entities.GroupReadingPlan.list();
      return allGroups.filter((g) => memberships.some((m) => m.group_id === g.id));
    },
    enabled: !!user?.email
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
    return planProgress.find((p) => p.plan_id === planId);
  };

  const categories = ['all', ...new Set(readingPlans.map((p) => p.category))];

  const customPlans = planProgress.filter((p) => p.is_custom).map((p) => ({
    id: p.plan_id,
    name: p.plan_name,
    description: `${p.total_days} days of custom readings`,
    duration: p.total_days,
    category: 'Custom',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    isCustom: true
  }));

  const allPlans = [...customPlans, ...readingPlans];

  const filteredPlans = allPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase()) ||
    plan.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || plan.category === category;
    return matchesSearch && matchesCategory;
  });

    if (!user) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        







        
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          
          <div className="flex items-center gap-3 mb-2">
            




            
            
          </div>
          <p className="text-[#0A1A2F]/60 dark:text-white/60 font-bold text-center w-full mt-1">Discover plans to guide your study</p>
        </motion.div>

        {/* Search & Create */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40 dark:text-white/40" />
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-white/5 border-[#F2F6FA] rounded-xl h-12" />
            
          </div>
          <Button
            onClick={() => setShowCreateCustom(true)}
            className="bg-gradient-to-r from-[#FAD98D] to-[#AFC7E3] hover:from-[#FAD98D]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] dark:text-white h-12 px-4 shadow-md dark:shadow-none">
            
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Custom</span>
          </Button>
        </div>

        {/* My Group Plans */}
        {myGroupPlans.length > 0 &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#AFC7E3]" />
              <h2 className="text-lg font-semibold text-[#0A1A2F] dark:text-white dark:text-white">My Group Plans</h2>
              <Badge variant="secondary">{myGroupPlans.length}</Badge>
            </div>
            <div className="grid gap-3">
              {myGroupPlans.map((group) =>
            <motion.div
              key={group.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(createPageUrl(`GroupPlanDetail?id=${group.id}`))}
              className="bg-gradient-to-br from-green-50 dark:from-green-900/15 to-emerald-50 rounded-xl p-4 border border-green-200 dark:border-green-800/30 cursor-pointer">
              
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.group_name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{group.plan_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        {group.member_count} members • {group.total_days} days
                      </p>
                    </div>
                    <Button
                  size="sm"
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100 dark:bg-green-900/25">
                  
                      View
                    </Button>
                  </div>
                </motion.div>
            )}
            </div>
          </motion.div>
        }

        {/* Categories */}
        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="bg-gray-100 dark:bg-white/5 p-1 h-auto flex-wrap gap-1 rounded-xl">
            {categories.map((cat) =>
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-lg capitalize text-xs sm:text-sm data-[state=active]:bg-[#FAD98D] data-[state=active]:text-[#0A1A2F] dark:text-white dark:text-white">
              
                {cat}
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        {/* Gideon Chat Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-6 z-30">
          <Link to="/ChatScreen?bot=Gideon">
            <Button className="w-14 h-14 rounded-full bg-[#7c5a00] hover:bg-[#7c5a00]/90 text-white shadow-lg dark:shadow-none">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </Link>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPlans.map((plan, index) =>
          <ReadingPlanCard
            key={plan.id}
            plan={plan}
            progress={getProgressForPlan(plan.id)}
            onClick={() => navigate(createPageUrl(`PlanDetail?id=${plan.id}`))}
            index={index} />

          )}
        </div>

        {filteredPlans.length === 0 &&
        <div className="text-center py-12">
            <p className="text-[#0A1A2F]/60 dark:text-white/60">No plans found matching your search</p>
          </div>
        }
      </div>

      <CreateCustomPlanModal
        isOpen={showCreateCustom}
        onClose={() => setShowCreateCustom(false)}
        onSubmit={(data) => createCustomPlan.mutate(data)} />
      
    </div>);

}