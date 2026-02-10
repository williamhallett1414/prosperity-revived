import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AIDiscoveryFeed from '@/components/discover/AIDiscoveryFeed';
import TrendingContent from '@/components/discover/TrendingContent';
import SmartSummaries from '@/components/discover/SmartSummaries';

export default function Discover() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D9B878] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-[#0A1A2F]">
              <Sparkles className="w-8 h-8 text-[#D9B878]" />
              Discover
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="text-[#0A1A2F] hover:bg-[#E6EBEF]"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-[#0A1A2F]/60 text-sm">
            Personalized content curated just for you
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#E6EBEF] p-1 rounded-xl">
            <TabsTrigger value="for-you" className="data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">
              <Sparkles className="w-4 h-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="summaries" className="data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">
              <BookOpen className="w-4 h-4 mr-2" />
              Summaries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="for-you">
            <AIDiscoveryFeed user={user} refreshKey={refreshKey} />
          </TabsContent>

          <TabsContent value="trending">
            <TrendingContent user={user} />
          </TabsContent>

          <TabsContent value="summaries">
            <SmartSummaries user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}