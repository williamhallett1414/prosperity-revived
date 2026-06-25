/**
 * WorkoutAudioAudition — DEV ONLY page for auditioning generated workout audio.
 *
 * Invokes the generateWorkoutAudio Base44 function with Section 1 (warmup) of
 * the "strong-bones-01" session. Shows the returned URL so we can open it on
 * the device or copy it for desktop playback.
 *
 * This page exists ONLY during the audio-iteration phase of building the
 * coached workout feature. Once the script + voice settings are locked and
 * the production pipeline ships, this page should be deleted:
 *   - Remove this file
 *   - Remove its registration in src/pages.config.js
 *   - Remove the "Workout Audio Audition (Dev)" link from Settings
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Play, RotateCcw, Copy, Check, Loader2 } from 'lucide-react';

// Section 1 (Warmup) text — paragraphs separated, [pause Xs] cues stripped.
// ElevenLabs interprets punctuation as natural pauses; longer silences will
// be inserted later by the stitching code at the marked positions.
const SECTION_1_TEXT = `Hey. Welcome in.

Before we start, take a breath. A real one. In through the nose. Out through the mouth.

Again. Slower this time.

Good. You showed up. That's the hardest part, and you already did it.

Here's the deal. Twenty minutes. Bodyweight only. No equipment, no excuses. We're going to move, we're going to breathe, and at every rest, I'm going to hand you a verse to carry with you. Listen to it or don't. It's there.

Let's get the body warm. Stand tall. Feet under your hips.

Roll your shoulders back. Three times.

Now circle your arms. Big slow circles, forward. Five of them.

Reverse. Five more.

Hands on your hips. Open your hips. Knees out, knees in. Just loosen them up.

Now drop into a shallow squat. Not all the way down. Just enough to wake the legs up. Five of them, slow.

One more set. Five more, slow and easy.

Stand tall. Roll your neck. Gentle. Left, then right.

Last thing. Hands above your head, reach up. Stretch tall.

Drop them. Shake your arms out.

Body's warm. Time to work.`;

// Voice settings — locked to match Coach David's swapped Bill voice.
const VOICE_CONFIG = {
  voice_id: 'pqHfZKP75CvOlQylNhV4',
  voice_label: 'Bill',
  stability: 0.55,
  similarity_boost: 0.85,
  style: 0.30,
};

export default function WorkoutAudioAudition() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [force, setForce] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await base44.functions.invoke('generateWorkoutAudio', {
        session_id: 'strong-bones-01',
        segment_id: '01-warmup',
        text: SECTION_1_TEXT,
        ...VOICE_CONFIG,
        force,
      });
      if (response?.error) {
        setError(response.error);
      } else if (response?.audio_url) {
        setResult(response);
      } else {
        setError('Function returned no audio_url and no error — unexpected response shape');
      }
    } catch (e) {
      setError(e?.message || 'Function invocation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!result?.audio_url) return;
    try {
      await navigator.clipboard.writeText(result.audio_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Some iOS contexts block clipboard — fall back to selection-only.
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F]">
      <div className="max-w-md mx-auto px-5 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white">Workout Audio Audition</h1>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-widest">Dev only</p>
          </div>
        </div>

        {/* Context */}
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 mb-4">
          <p className="text-[10px] tracking-widest uppercase font-bold text-[#3C4E53]/50 dark:text-white/50 mb-2">Session</p>
          <p className="text-[14px] text-[#0A1A2F] dark:text-white font-semibold mb-1">strong-bones-01 / 01-warmup</p>
          <p className="text-[13px] text-[#3C4E53]/70 dark:text-white/70 leading-relaxed">
            Coach David's voice (Bill, stability 0.55). Generates the warmup section (~3 min) of the flagship coached workout session.
          </p>
        </div>

        {/* The script we're sending */}
        <details className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 mb-4">
          <summary className="text-[14px] font-semibold text-[#0A1A2F] dark:text-white cursor-pointer">
            Section 1 text ({SECTION_1_TEXT.length} chars)
          </summary>
          <pre className="text-[12px] text-[#3C4E53]/80 dark:text-white/70 leading-relaxed whitespace-pre-wrap mt-3 font-sans">
            {SECTION_1_TEXT}
          </pre>
        </details>

        {/* Generate button + force toggle */}
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 mb-4 space-y-3">
          <label className="flex items-center gap-2 text-[13px] text-[#3C4E53] dark:text-white/85">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="w-4 h-4"
            />
            Force regeneration (skip cache, burns credits)
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-br from-[#FD9C2D] to-[#c9a227] text-white font-bold py-3 px-5 text-[15px] shadow-md active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating…
              </span>
            ) : (
              'Generate Section 1 Audio'
            )}
          </button>
        </div>

        {/* Result */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 mb-4">
            <p className="text-[12px] tracking-widest uppercase font-bold text-red-700 dark:text-red-300 mb-2">Error</p>
            <pre className="text-[13px] text-red-800 dark:text-red-200 whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-white/[0.04] rounded-2xl p-4 mb-4">
            <p className="text-[10px] tracking-widest uppercase font-bold text-[#c9a227] mb-2">
              {result.cached ? 'Cached (no credits spent)' : 'Generated fresh'}
            </p>

            <p className="text-[12px] text-[#3C4E53]/60 dark:text-white/60 mb-3">
              {result.char_count} chars · segment <span className="font-mono">{result.segment_id}</span>
            </p>

            {/* Inline audio player */}
            <audio
              key={result.audio_url}
              controls
              src={result.audio_url}
              className="w-full mb-3"
            >
              Your browser does not support the audio element.
            </audio>

            {/* Copy URL */}
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[10px] bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded font-mono text-[#3C4E53]/80 dark:text-white/70 truncate">
                {result.audio_url}
              </code>
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded bg-[#FAD98D]/30 text-[#c9a227] text-[12px] font-bold flex items-center gap-1.5 active:scale-95"
              >
                {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          </div>
        )}

        {/* Reset */}
        {(result || error) && (
          <button
            onClick={() => { setResult(null); setError(null); }}
            className="w-full text-[13px] text-[#3C4E53]/60 dark:text-white/60 py-2 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear and try again
          </button>
        )}
      </div>
    </div>
  );
}
