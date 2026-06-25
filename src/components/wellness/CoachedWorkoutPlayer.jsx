/**
 * CoachedWorkoutPlayer
 *
 * Plays a workout as a "Coach Led" audio session. Coach David speaks each
 * segment (using the SAME ElevenLabs voice as the chat), then holds for a
 * timed interval while the user performs the work, then auto-advances.
 *
 * Controls: play/pause, skip, restart. A progress bar shows where you are in
 * the session. Falls back to the coachDavidTTS backend function if ElevenLabs
 * is unavailable.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Volume2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildCoachedScript, COACH_VOICES } from './coachedWorkoutScript';
import { elevenLabsSpeak } from '@/utils/elevenLabsTTS';

// Map coach name -> ElevenLabs character key (matches ChatScreen voices exactly)
const COACH_CHARACTER = {
  'Coach David': 'coach',
};

function base64ToBlobUrl(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
}

const SEGMENT_LABEL = {
  intro: 'Warm-Up',
  exercise: 'Exercise',
  rest: 'Reflection & Rest',
  reflection: 'Reflection',
  outro: 'Cool-Down',
};

export default function CoachedWorkoutPlayer({ workout, coachName = 'Coach David', onComplete }) {
  const script = useRef(buildCoachedScript(workout, coachName)).current;
  const { segments, fn } = script;

  // Resume support — persist progress to localStorage keyed by workout id.
  // On mount we check for a recent (<24h) saved index; if one exists and the
  // user is past the intro, we surface a "Resume" prompt rather than auto-
  // resuming (auto-resume is surprising and can land mid-set unexpectedly).
  const STORAGE_KEY = `coached-workout:${workout?.id || 'unknown'}`;
  const RESUME_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [holdRemaining, setHoldRemaining] = useState(0);
  const [finished, setFinished] = useState(false);
  const [resumePrompt, setResumePrompt] = useState(null); // { savedIndex, segmentLabel } | null

  const audioRef = useRef(null);
  const urlRef = useRef(null);
  const holdTimerRef = useRef(null);
  const playingRef = useRef(false);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.src = ''; } catch (_) {}
      audioRef.current = null;
    }
    if (urlRef.current) {
      try { URL.revokeObjectURL(urlRef.current); } catch (_) {}
      urlRef.current = null;
    }
  }, []);

  const clearHold = useCallback(() => {
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null; }
  }, []);

  const goToNext = useCallback(() => {
    clearHold();
    cleanupAudio();
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= segments.length) {
        setPlaying(false);
        playingRef.current = false;
        setFinished(true);
        // Clear saved progress — session is complete, nothing to resume.
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        onComplete?.();
        return prev;
      }
      return next;
    });
  }, [segments.length, clearHold, cleanupAudio, onComplete, STORAGE_KEY]);

  // Hold (rest/work interval) countdown after speech ends.
  const startHold = useCallback((segment) => {
    const total = segment.holdSeconds || 0;
    if (total <= 0) { goToNext(); return; }
    setHoldRemaining(total);
    let remaining = total;
    holdTimerRef.current = setInterval(() => {
      if (!playingRef.current) return; // paused — freeze countdown
      remaining -= 1;
      setHoldRemaining(remaining);
      if (remaining <= 0) {
        clearHold();
        goToNext();
      }
    }, 1000);
  }, [goToNext, clearHold]);

  // Speak the current segment, then start its hold.
  const speakAndHold = useCallback(async (segment) => {
    cleanupAudio();
    setLoadingVoice(true);
    let audioStarted = false;

    const character = COACH_CHARACTER[coachName] || 'coach';

    const playFromBase64 = async (b64) => {
      const url = base64ToBlobUrl(b64);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => startHold(segment);
      await audio.play();
      audioStarted = true;
    };

    // Play a permanent URL directly (no base64 conversion). Used by the
    // cached-segment path. We don't track urlRef for cleanup because these
    // URLs are remote (not blob:) and don't need URL.revokeObjectURL.
    const playFromUrl = async (url) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => startHold(segment);
      await audio.play();
      audioStarted = true;
    };

    try {
      // PRIMARY: cached segment function. Returns a permanent file URL on
      // cache hit (no ElevenLabs cost) or generates + caches + returns URL
      // on miss (cost paid ONCE per unique text+voice combo across all
      // users, ever). This is the "Item 4" caching layer that makes the
      // economics work at scale.
      let played = false;
      try {
        const cached = await base44.functions.invoke('generateCoachedSegment', {
          text: segment.text,
          segment_type: segment.type,
        });
        const audioUrl = cached?.audio_url || cached?.data?.audio_url;
        if (audioUrl) {
          await playFromUrl(audioUrl);
          played = true;
        }
      } catch (cacheErr) {
        // Cached path failed (network blip, function not deployed yet, etc).
        // Fall through to the legacy paths below — don't break the user's
        // session over a caching issue.
        // eslint-disable-next-line no-console
        console.warn('[CoachedWorkoutPlayer] cached segment fetch failed, falling back:', cacheErr?.message || cacheErr);
      }

      if (!played) {
        // FALLBACK 1: client-side ElevenLabs (same call chat uses).
        const elevenB64 = await elevenLabsSpeak(segment.text, character);
        if (elevenB64) {
          await playFromBase64(elevenB64);
        } else {
          // FALLBACK 2: the per-coach backend TTS function (e.g. coachDavidTTS).
          // The function returns Response.json({ audioContent }) at the TOP
          // level (not nested under res.data), so we read it directly. The
          // old read (res?.data?.audioContent) silently never returned audio.
          const res = await base44.functions.invoke(fn, { text: segment.text });
          const b64 = res?.audioContent || res?.data?.audioContent;
          if (b64) await playFromBase64(b64);
          else setVoiceFailed(true);
        }
      }
    } catch (e) {
      setVoiceFailed(true);
    }
    setLoadingVoice(false);

    // If audio couldn't start, still pace the session by holding directly.
    if (!audioStarted) startHold(segment);
  }, [cleanupAudio, fn, coachName, startHold]);

  // When index changes and we're playing, speak the new segment.
  useEffect(() => {
    if (!playing || finished) return;
    const segment = segments[index];
    if (!segment) return;
    speakAndHold(segment);
    return () => { clearHold(); cleanupAudio(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing]);

  // Persist progress on every index change (not on unmount — unmount handlers
  // are unreliable on mobile when the app is backgrounded). Skip persistence
  // when at index 0 (no real progress yet) or when finished (handler clears
  // explicitly via goToNext).
  useEffect(() => {
    if (finished) return;
    if (index === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index,
        timestamp: Date.now(),
      }));
    } catch (_) {
      // localStorage can throw in private-browsing modes; non-fatal.
    }
  }, [index, finished, STORAGE_KEY]);

  // On mount: check for a recent saved index and surface a resume prompt.
  // We do NOT auto-resume — landing mid-set without warning is jarring.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved.index !== 'number') return;
      // Validate: still within the resume window and pointing at a real segment
      // past the intro.
      const age = Date.now() - (saved.timestamp || 0);
      if (age > RESUME_WINDOW_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (saved.index <= 0 || saved.index >= segments.length) return;
      const segmentLabel = SEGMENT_LABEL[segments[saved.index]?.type] || 'Session';
      setResumePrompt({ savedIndex: saved.index, segmentLabel });
    } catch (_) {
      // Corrupt / unparseable — discard.
      try { localStorage.removeItem(STORAGE_KEY); } catch (__) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResume = () => {
    if (!resumePrompt) return;
    setIndex(resumePrompt.savedIndex);
    setResumePrompt(null);
    setPlaying(true);
    playingRef.current = true;
  };

  const handleStartFresh = () => {
    setResumePrompt(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    // Stay at index 0; user can press play normally.
  };

  // Cleanup on unmount
  useEffect(() => () => { clearHold(); cleanupAudio(); }, [clearHold, cleanupAudio]);

  const handlePlayPause = () => {
    if (finished) return;
    if (playing) {
      setPlaying(false);
      playingRef.current = false;
      if (audioRef.current) { try { audioRef.current.pause(); } catch (_) {} }
    } else {
      setPlaying(true);
      playingRef.current = true;
      if (audioRef.current && audioRef.current.paused && audioRef.current.src) {
        try { audioRef.current.play(); } catch (_) {}
      }
    }
  };

  const handleSkip = () => {
    if (finished) return;
    goToNext();
  };

  const handleRestart = () => {
    clearHold();
    cleanupAudio();
    setFinished(false);
    setHoldRemaining(0);
    setIndex(0);
    setPlaying(true);
    playingRef.current = true;
    // Restart implies the user wants a fresh take — clear any saved progress.
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  };

  const current = segments[index];
  const progress = Math.round(((index + (finished ? 1 : 0)) / segments.length) * 100);

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg dark:shadow-none"
      style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1e40af 100%)' }}>
      <div className="p-6">
        {/* Coach header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-widest">Coach Led</p>
            <p className="text-white font-black text-lg leading-tight truncate">{coachName}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-white/55 uppercase tracking-wide">
              {SEGMENT_LABEL[current?.type] || 'Session'} · {index + 1}/{segments.length}
            </span>
            <span className="text-[10px] font-bold text-white/55">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#FD9C2D] to-[#38BDF8]"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Current segment text */}
        <div className="min-h-[120px] mb-5">
          <AnimatePresence mode="wait">
            {resumePrompt ? (
              <motion.div key="resume" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="text-center py-2">
                <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest mb-2">Continue Session</p>
                <p className="text-white text-base leading-relaxed mb-4">
                  You stopped at <span className="font-bold">{resumePrompt.segmentLabel}</span>. Pick up from there?
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={handleStartFresh}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/85 text-sm font-bold transition-colors">
                    Start over
                  </button>
                  <button onClick={handleResume}
                    className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#FD9C2D] to-[#E89020] text-white text-sm font-black shadow-md transition-all active:scale-95">
                    Resume
                  </button>
                </div>
              </motion.div>
            ) : finished ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-4">
                <p className="text-3xl mb-2">🎉</p>
                <p className="text-white font-black text-lg">Session Complete</p>
                <p className="text-white/60 text-sm mt-1">Well done. You honored your body and your God today.</p>
              </motion.div>
            ) : (
              <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <p className="text-white/95 text-base leading-relaxed">{current?.text}</p>
                {holdRemaining > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FD9C2D] animate-pulse" />
                    <span className="text-[#FD9C2D] font-bold text-sm tabular-nums">
                      {Math.floor(holdRemaining / 60)}:{String(holdRemaining % 60).padStart(2, '0')} remaining
                    </span>
                  </div>
                )}
                {loadingVoice && (
                  <div className="mt-4 flex items-center gap-2 text-white/50 text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Coach is getting ready…
                  </div>
                )}
                {voiceFailed && (
                  <p className="mt-3 text-[11px] text-amber-300/80">
                    Audio unavailable right now — following along with the on-screen cues.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls — hidden while resume prompt is showing (prompt has its own buttons) */}
        {!resumePrompt && (
          <div className="flex items-center justify-center gap-4">
            {finished ? (
              <button onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl transition-all">
                <RotateCcw className="w-5 h-5" /> Restart
              </button>
            ) : (
              <>
                <button onClick={handleRestart}
                  aria-label="Restart"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={handlePlayPause}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#E89020] flex items-center justify-center text-white shadow-lg dark:shadow-none transition-all active:scale-95">
                  {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                </button>
                <button onClick={handleSkip}
                  aria-label="Skip"
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all">
                  <SkipForward className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
        {!playing && !finished && !resumePrompt && index === 0 && (
          <p className="text-center text-white/45 text-xs mt-4">Press play and let Coach David lead the way.</p>
        )}
      </div>
    </div>
  );
}