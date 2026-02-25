import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Plus, MessageCircle, Send, Loader2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import CreateCustomPlanModal from '@/components/plans/CreateCustomPlanModal';
import { readingPlans } from '@/components/bible/BibleData';


export default function Plans() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCreateCustom, setShowCreateCustom] = useState(false);
  const [user, setUser] = useState(null);
  const [showGideon, setShowGideon] = useState(false);
  const [gideonInput, setGideonInput] = useState('');
  const [gideonLoading, setGideonLoading] = useState(false);
  const [gideonResponse, setGideonResponse] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
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
      return allGroups.filter(g => memberships.some(m => m.group_id === g.id));
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
    return planProgress.find(p => p.plan_id === planId);
  };

  const handleGideonAsk = async () => {
    if (!gideonInput.trim() || gideonLoading) return;

    const question = gideonInput.trim();
    setGideonInput('');
    setGideonLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Gideon, a friendly pastoral cat assistant helping people with Bible reading plans. A user has a question about reading plans.

User's question: ${question}

Provide warm, helpful guidance (2-4 sentences) about reading plans, Bible study habits, or spiritual growth. Use a friendly, encouraging tone:`,
        add_context_from_internet: false
      });

      setGideonResponse({ question, advice: response });
    } catch (error) {
      setGideonResponse({ 
        question, 
        advice: 'Meow! I\'m having trouble right now. Please try again.' 
      });
    } finally {
      setGideonLoading(false);
    }
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
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 shadow-sm flex items-center justify-center text-[#0A1A2F] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#0A1A2F]">Reading Plans</h1>
          </div>
          <p className="text-[#0A1A2F]/60 ml-[52px]">Discover plans to guide your study</p>
        </motion.div>

        {/* Search & Create */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A1A2F]/40" />
            <Input
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#E6EBEF] border-[#E6EBEF] rounded-xl h-12"
            />
          </div>
          <Button
            onClick={() => setShowCreateCustom(true)}
            className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-12 px-4 shadow-md"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Custom</span>
          </Button>
        </div>

        {/* Categories */}
        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="bg-[#E6EBEF] p-1 h-auto flex-wrap gap-1 rounded-xl">
            {categories.map(cat => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-lg capitalize text-xs sm:text-sm data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Gideon Chat Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-24 right-6 z-30"
        >
          <Button
            onClick={() => setShowGideon(!showGideon)}
            className="w-14 h-14 rounded-full bg-[#AFC7E3] hover:bg-[#AFC7E3]/90 text-[#0A1A2F] shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Gideon Chat Panel */}
        <AnimatePresence>
          {showGideon && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-44 right-6 w-80 max-w-[calc(100vw-3rem)] z-30"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-[#E6EBEF] overflow-hidden">
                <div className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] p-5 text-[#0A1A2F]">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat with Gideon 🐱
                  </h3>
                  <p className="text-xs text-[#0A1A2F]/70 mt-1">Your pastoral cat assistant</p>
                </div>

                <div className="p-5 max-h-96 overflow-y-auto space-y-4 bg-[#F2F6FA]">
                  {gideonResponse && (
                    <div className="space-y-3">
                      <div className="bg-[#E6EBEF] p-4 rounded-xl">
                        <p className="text-xs font-medium text-[#0A1A2F]/60 mb-1">You asked:</p>
                        <p className="text-sm text-[#0A1A2F]">{gideonResponse.question}</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] p-4 rounded-xl">
                        <p className="text-xs font-medium text-[#0A1A2F]/80 mb-1">Gideon says:</p>
                        <p className="text-sm text-[#0A1A2F] leading-relaxed">{gideonResponse.advice}</p>
                      </div>
                    </div>
                  )}

                  {!gideonResponse && !gideonLoading && (
                    <p className="text-sm text-[#0A1A2F]/60 text-center py-8">
                      Ask me anything about reading plans! 🐱
                    </p>
                  )}

                  {gideonLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#AFC7E3]" />
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-[#E6EBEF] bg-white">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ask Gideon..."
                      value={gideonInput}
                      onChange={(e) => setGideonInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGideonAsk();
                        }
                      }}
                      className="flex-1 text-sm bg-[#F2F6FA] border-[#E6EBEF] h-11"
                      disabled={gideonLoading}
                    />
                    <Button
                      onClick={handleGideonAsk}
                      disabled={!gideonInput.trim() || gideonLoading}
                      className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F] h-11 px-5"
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <p className="text-[#0A1A2F]/60">No plans found matching your search</p>
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