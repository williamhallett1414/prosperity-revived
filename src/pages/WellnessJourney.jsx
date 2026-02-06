import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2, Circle, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodEnergyChart from '@/components/wellness/MoodEnergyChart';
import JourneyMetricsChart from '@/components/wellness/JourneyMetricsChart';
import GranularGoalsChart from '@/components/wellness/GranularGoalsChart';

export default function WellnessJourney() {
  const [user, setUser] = useState(null);
  const [journeyId, setJourneyId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [adaptingJourney, setAdaptingJourney] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    setJourneyId(params.get('id'));
  }, []);

  const { data: journey, isLoading } = useQuery({
    queryKey: ['journey', journeyId],
    queryFn: async () => {
      const all = await base44.entities.WellnessJourney.list();
      return all.find(j => j.id === journeyId);
    },
    enabled: !!journeyId
  });

  const updateJourney = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WellnessJourney.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journey', journeyId]);
      queryClient.invalidateQueries(['journeys']);
    }
  });

  const handleCompleteWeek = async (weekNumber) => {
    if (!journey) return;

    const updatedWeeks = journey.weeks.map(w =>
      w.week_number === weekNumber ? { ...w, completed: true } : w
    );
    
    const completedCount = updatedWeeks.filter(w => w.completed).length;
    const newProgress = (completedCount / journey.duration_weeks) * 100;

    await updateJourney.mutateAsync({
      id: journey.id,
      data: {
        weeks: updatedWeeks,
        current_week: Math.min(weekNumber + 1, journey.duration_weeks),
        progress_percentage: newProgress
      }
    });

    // Check if journey needs adaptation
    if (weekNumber % 2 === 0 && weekNumber < journey.duration_weeks) {
      setShowFeedback(true);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !journey) return;

    setAdaptingJourney(true);

    try {
      const feedbackNote = {
        week: journey.current_week,
        note: feedback,
        date: new Date().toISOString()
      };

      const prompt = `
You are a wellness coach. A user is on week ${journey.current_week} of their ${journey.duration_weeks}-week journey: "${journey.title}".

Their feedback: "${feedback}"

Journey details:
${JSON.stringify(journey.weeks.find(w => w.week_number === journey.current_week), null, 2)}

Based on their feedback, should we adapt the upcoming weeks? If yes, suggest specific adjustments to:
1. Difficulty level
2. Focus areas
3. Daily commitments

Return JSON with:
- should_adapt: boolean
- reason: Why adapt or not (1 sentence)
- suggested_changes: Object with modifications to upcoming weeks (if should_adapt is true)
`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            should_adapt: { type: 'boolean' },
            reason: { type: 'string' },
            suggested_changes: {
              type: 'object',
              properties: {
                difficulty_adjustment: { type: 'string' },
                focus_shift: { type: 'string' },
                new_commitments: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          }
        }
      });

      const updatedFeedbackNotes = [...(journey.feedback_notes || []), feedbackNote];
      let updatedAdaptations = journey.adaptations || [];

      if (result.should_adapt) {
        updatedAdaptations = [
          ...updatedAdaptations,
          {
            week: journey.current_week,
            reason: result.reason,
            changes: JSON.stringify(result.suggested_changes)
          }
        ];
      }

      await updateJourney.mutateAsync({
        id: journey.id,
        data: {
          feedback_notes: updatedFeedbackNotes,
          adaptations: updatedAdaptations
        }
      });

      setShowFeedback(false);
      setFeedback('');
    } catch (error) {
      console.error('Failed to process feedback:', error);
    } finally {
      setAdaptingJourney(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-purple-600 animate-pulse mx-auto mb-2" />
          <p className="text-gray-500">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Journey not found</p>
          <Link to={createPageUrl('Wellness')}>
            <Button className="mt-4">Back to Wellness</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedWeeks = journey.weeks?.filter(w => w.completed).length || 0;
  const progressPercent = (completedWeeks / journey.duration_weeks) * 100;
  const currentWeekData = journey.weeks?.find(w => w.week_number === journey.current_week);

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
         <div className="flex items-center gap-3 mb-6">
           <Link
             to={createPageUrl('Wellness')}
             className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
           >
             <ArrowLeft className="w-5 h-5" />
           </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#1a1a2e]">{journey.title}</h1>
            <p className="text-sm text-gray-500">Week {journey.current_week} of {journey.duration_weeks}</p>
          </div>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/80">Overall Progress</span>
            <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-white/20" />
          <p className="text-sm text-white/80 mt-3">{journey.description}</p>
        </motion.div>

        {/* Journey Goals */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-[#1a1a2e]">Journey Goals</h2>
          </div>
          <div className="space-y-2">
            {journey.goals?.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Week Focus */}
        {currentWeekData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 mb-6 shadow-sm border-2 border-purple-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-[#1a1a2e]">This Week: {currentWeekData.theme}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">🙏 Spiritual Focus</h3>
                <p className="text-sm text-gray-600">{currentWeekData.spiritual_focus}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">💪 Workout Focus</h3>
                <p className="text-sm text-gray-600">{currentWeekData.workout_focus}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">🥗 Nutrition Focus</h3>
                <p className="text-sm text-gray-600">{currentWeekData.nutrition_focus}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">✅ Daily Commitments</h3>
                <div className="space-y-1">
                  {currentWeekData.daily_commitment?.map((commitment, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Circle className="w-3 h-3 flex-shrink-0 mt-1" />
                      <span>{commitment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!currentWeekData.completed && (
              <Button
                onClick={() => handleCompleteWeek(currentWeekData.week_number)}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Week {currentWeekData.week_number}
              </Button>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <h2 className="font-semibold text-[#1a1a2e] mb-4">Weekly Timeline</h2>
              <div className="space-y-3">
                {journey.weeks?.map((week, idx) => {
                  const isCompleted = week.completed;
                  const isCurrent = week.week_number === journey.current_week;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-purple-50 border-2 border-purple-200'
                          : isCompleted
                          ? 'bg-green-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-semibold">{week.week_number}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-[#1a1a2e]">{week.theme}</h3>
                        <p className="text-xs text-gray-500">Week {week.week_number}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => setShowFeedback(true)}
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Share Feedback & Get AI Adaptation
            </Button>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Journey Metrics</h3>
              <JourneyMetricsChart
                journey={journey}
                workoutSessions={[]}
                recipeLogs={[]}
                readingProgress={[]}
              />
            </div>

            {journey.granular_goals?.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Granular Goals</h3>
                <GranularGoalsChart goals={journey.granular_goals} />
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Mood & Energy Trends</h3>
              <MoodEnergyChart moodEnergyData={journey.mood_energy_tracking || []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How's Your Journey Going?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Share your experience and the AI will adapt your journey to better fit your needs.
              </p>
              <Textarea
                placeholder="E.g., The workouts feel too easy, or I'm loving the spiritual readings..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim() || adaptingJourney}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {adaptingJourney ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing & Adapting...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}