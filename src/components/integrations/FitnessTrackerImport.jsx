import React, { useState } from 'react';
import { Activity, Upload, Check, AlertCircle, ChevronRight, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const TRACKER_OPTIONS = [
  {
    id: 'apple_health',
    name: 'Apple Health',
    icon: '🍎',
    description: 'Export your Health data from iPhone',
    format: 'XML / CSV',
    instructions: [
      'Open the Health app on your iPhone',
      'Tap your profile picture (top right)',
      'Tap "Export All Health Data"',
      'Share the export.zip file and upload the workout CSV here',
    ],
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    icon: '🏃',
    description: 'Import workouts from Google Fit export',
    format: 'CSV',
    instructions: [
      'Go to takeout.google.com',
      'Select "Fit" data only',
      'Download and extract your archive',
      'Upload the "Daily activity metrics" CSV here',
    ],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: '⌚',
    description: 'Import activity and sleep data from Fitbit',
    format: 'CSV',
    instructions: [
      'Log in at fitbit.com/settings/data/export',
      'Export your data',
      'Upload the "activities-*.csv" file here',
    ],
  },
  {
    id: 'strava',
    name: 'Strava',
    icon: '🚴',
    description: 'Import running and cycling workouts',
    format: 'CSV',
    instructions: [
      'Go to strava.com/athlete/delete_your_account',
      'Request your data archive',
      'Upload the "activities.csv" from the download',
    ],
  },
  {
    id: 'manual',
    name: 'Manual Entry',
    icon: '📋',
    description: 'Paste recent workout data manually',
    format: 'Text',
    instructions: [
      'Describe your recent workouts in the text box below',
      'Include date, exercise type, duration, and intensity',
      'Coach David will use this context in your next conversation',
    ],
  },
];

export default function FitnessTrackerImport({ user }) {
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualText, setManualText] = useState('');
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      let dataToProcess = '';

      if (selectedTracker?.id === 'manual') {
        dataToProcess = manualText;
      } else if (file) {
        const text = await file.text();
        dataToProcess = text.slice(0, 8000); // cap for LLM
      } else {
        toast.error('Please select a file or enter manual data');
        setIsLoading(false);
        return;
      }

      // Use LLM to extract structured workout data
      const parsed = await base44.integrations.Core.InvokeLLM({
        prompt: `Extract workout data from the following fitness tracker export. Return a summary of recent workouts including: date, exercise type, duration (minutes), distance if applicable, heart rate if available, and intensity level. Keep it concise and factual. Return as a plain text summary formatted for a fitness coach.

Data:
${dataToProcess}`,
        add_context_from_internet: false,
      });

      // Save as a ChatbotMemory for Coach David
      await base44.entities.ChatbotMemory.create({
        chatbot_name: 'CoachDavid',
        memory_type: 'preference',
        content: `Wearable/tracker data imported (${selectedTracker?.name || 'Manual'}): ${parsed?.slice(0, 500)}`,
        context: 'external_data_import',
        importance: 8,
        conversation_date: new Date().toISOString().split('T')[0],
        last_referenced: new Date().toISOString(),
      });

      setSuccess(true);
      toast.success('Workout data imported! Coach David will use this in your next chat.');
    } catch (err) {
      toast.error('Import failed. Please check your file format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">Data Imported!</h3>
        <p className="text-sm text-gray-500 mb-4">Coach David now has context from your {selectedTracker?.name} data to give you more accurate recovery and performance advice.</p>
        <Button variant="outline" size="sm" onClick={() => { setSuccess(false); setSelectedTracker(null); setFile(null); setManualText(''); }}>
          Import More
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 bg-sky-50 rounded-xl p-3 text-xs text-sky-700">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>Import your fitness data so Coach David can give you personalized recovery timing, performance trends, and training advice based on your actual activity.</p>
      </div>

      {!selectedTracker ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Choose Source</p>
          {TRACKER_OPTIONS.map(tracker => (
            <button
              key={tracker.id}
              onClick={() => setSelectedTracker(tracker)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50 transition-all text-left"
            >
              <span className="text-2xl">{tracker.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{tracker.name}</p>
                <p className="text-xs text-gray-500 truncate">{tracker.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedTracker(null)} className="text-xs text-sky-600 hover:underline">← Back</button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedTracker.icon}</span>
            <div>
              <p className="font-bold text-gray-900">{selectedTracker.name}</p>
              <p className="text-xs text-gray-500">{selectedTracker.format}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">How to export:</p>
            <ol className="space-y-1">
              {selectedTracker.instructions.map((step, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="font-bold text-sky-500 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {selectedTracker.id === 'manual' ? (
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. Monday: 45min run, 5km, moderate intensity. Tuesday: Rest. Wednesday: Strength training, chest/back, 60min, high intensity..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-all">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600">{file ? file.name : 'Click to upload your export file'}</span>
              <span className="text-xs text-gray-400">{selectedTracker.format}</span>
              <input type="file" className="hidden" accept=".csv,.xml,.txt,.json" onChange={handleFileChange} />
            </label>
          )}

          <Button
            onClick={handleImport}
            disabled={isLoading || (!file && !manualText.trim())}
            className="w-full bg-gradient-to-r from-[#0A0A0A] to-[#38BDF8] text-white"
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : <><Activity className="w-4 h-4 mr-2" /> Import to Coach David</>}
          </Button>
        </div>
      )}
    </div>
  );
}