import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoachDavidFormAnalysis({ onAnalysisComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setVideo(file_url);
    } catch (error) {
      toast.error('Failed to upload video');
    }
  };

  const handleAnalyze = async () => {
    if (!video || !exerciseName.trim()) {
      toast.error('Please provide a video and exercise name');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await base44.functions.invoke('analyzeExerciseForm', {
        video_url: video,
        exercise_name: exerciseName
      });

      setAnalysis(result.data);
      onAnalysisComplete?.(result.data);
    } catch (error) {
      toast.error('Failed to analyze form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="text-xs gap-2"
      >
        <Upload className="w-3 h-3" />
        Analyze Form
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-[#0A1A2F] text-sm">📹 Exercise Form Analysis</h4>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAnalysis(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!analysis ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#0A1A2F] block mb-2">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="e.g., Barbell Squat, Deadlift"
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white"
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    disabled={isAnalyzing}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-xs font-medium text-[#0A1A2F]">Click to upload video</p>
                    <p className="text-xs text-gray-600 mt-1">or drag and drop</p>
                  </label>
                  {video && (
                    <p className="text-xs text-green-600 mt-2">✓ Video uploaded</p>
                  )}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!video || !exerciseName.trim() || isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Form'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{analysis.overall_form_score}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#0A1A2F]">Form Score</p>
                    <p className="text-xs text-gray-600">Out of 10</p>
                  </div>
                </div>

                {analysis.diagram_url && (
                  <div className="rounded-lg overflow-hidden border border-blue-200">
                    <img src={analysis.diagram_url} alt="Form diagram" className="w-full" />
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#0A1A2F] mb-2">💪 Strengths</p>
                  <ul className="space-y-1">
                    {analysis.strengths?.map((s, i) => (
                      <li key={i} className="text-xs text-green-700 flex gap-2">
                        <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-[#0A1A2F] mb-2">⚠️ Areas to Improve</p>
                  <ul className="space-y-1">
                    {analysis.areas_for_improvement?.map((a, i) => (
                      <li key={i} className="text-xs text-amber-700 flex gap-2">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {analysis.detailed_corrections?.length > 0 && (
                  <div className="bg-white rounded-lg p-3 space-y-2 border border-blue-200">
                    <p className="font-semibold text-[#0A1A2F] text-xs">🔧 Corrections</p>
                    {analysis.detailed_corrections.map((c, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <p className="font-medium text-[#0A1A2F]">{c.issue}</p>
                        <p className="text-gray-700">Fix: {c.correction}</p>
                        <p className="text-gray-600 italic">Why: {c.why_it_matters}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => setAnalysis(null)}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Analyze Another Video
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}