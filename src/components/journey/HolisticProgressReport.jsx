import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Heart,
  Dumbbell,
  ChefHat,
  BookOpen,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

export default function HolisticProgressReport({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: reportData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['holisticProgressReport', user?.email],
    queryFn: async () => {
      const response = await base44.functions.invoke('generateHolisticProgressReport', {});
      return response.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });

  if (!user) return null;

  const report = reportData?.report;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Holistic Progress Report</CardTitle>
                <p className="text-purple-100 text-sm mt-1">
                  AI-powered insights across all areas of your growth
                </p>
              </div>
            </div>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              {isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600">Analyzing your wellness journey...</p>
              <p className="text-sm text-gray-500 mt-2">Connecting insights from all your guides</p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Overall Wellbeing</h3>
                    <p className="text-gray-700 leading-relaxed">{report.overall_summary}</p>
                  </div>
                </div>
                
                {/* Data Summary Pills */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {report.data_summary && (
                    <>
                      <Badge variant="outline" className="bg-purple-50 border-purple-200">
                        <Heart className="w-3 h-3 mr-1" />
                        {report.data_summary.total_journals} journals
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200">
                        <Dumbbell className="w-3 h-3 mr-1" />
                        {report.data_summary.total_workouts} workouts
                      </Badge>
                      <Badge variant="outline" className="bg-orange-50 border-orange-200">
                        <ChefHat className="w-3 h-3 mr-1" />
                        {report.data_summary.total_meals} meals
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 border-green-200">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {report.data_summary.total_prayers} prayers
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Interconnected Insights */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 text-lg">Interconnected Insights</h3>
                </div>
                <div className="space-y-3">
                  {report.interconnected_insights?.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-700">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Collapsible Detailed Insights */}
              <div>
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="outline"
                  className="w-full justify-between hover:bg-purple-50"
                >
                  <span className="font-semibold">
                    {isExpanded ? 'Hide' : 'Show'} Detailed Insights
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      {/* Areas of Strength */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">Areas of Strength</h3>
                        </div>
                        <ul className="space-y-2">
                          {report.areas_of_strength?.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Growth Opportunities */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">Growth Opportunities</h3>
                        </div>
                        <ul className="space-y-2">
                          {report.growth_opportunities?.map((opportunity, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                              <span className="text-blue-500 mt-1">→</span>
                              <span>{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Personalized Recommendation */}
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-5 border-2 border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Next Step Recommendation</h3>
                            <p className="text-gray-700 leading-relaxed">{report.personalized_recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Generated {format(new Date(report.generated_date), 'MMM d, yyyy \'at\' h:mm a')}</span>
                </div>
                <span className="text-purple-600 font-medium">
                  {report.data_summary?.total_memories || 0} total insights analyzed
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Start your journey to see your holistic progress report</p>
              <p className="text-sm text-gray-500">
                Engage with Hannah, Coach David, Chef Daniel, and Gideon to build your personalized insights.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}