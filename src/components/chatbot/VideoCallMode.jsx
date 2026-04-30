/**
 * VideoCallMode — Full-screen FaceTime-style turn-based video call with an AI avatar.
 * v1.0.1 — resync trigger (Base44)
 *
 * Design:
 *   ┌────────────────────────────┐
 *   │ [X]          Name          │  ← header (minimal, backdrop blur)
 *   │                            │
 *   │     [Animated Avatar]      │  ← top 50% — avatar with speaking/listening animations
 *   │                            │
 *   │════════════════════════════│
 *   │     [Live user camera]     │  ← bottom 50% — mirrored front camera
 *   │                            │
 *   │      [📷]      [🎤]        │  ← two pill controls (floating over camera)
 *   └────────────────────────────┘
 *
 * Behavior (turn-based, zero new API cost):
 *   1. On open → request camera + mic permission, start persistent camera stream
 *   2. Avatar speaks the most recent AI message (if any) via existing TTS
 *   3. When TTS finishes → 500ms pause → auto-activate mic (speech recognition)
 *   4. User speaks → transcript → onSendTranscript(text) → AI responds
 *   5. New AI message → speak it → auto-listen again → repeat
 *   6. User can tap mic to interrupt/toggle, camera button to blank video,
 *      or X to end the call
 *   7. Swipe up to reveal transcript overlay; swipe down to hide
 *
 * Cleanup: Stops all tracks on unmount, on close, and on visibility change.
 *
 * Permission handling: Shows a clear error state if camera/mic is denied,
 * with instructions to enable in browser/device settings.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Video, VideoOff, ChevronUp, Loader2, AlertCircle } from 'lucide-react';

export default function VideoCallMode({
  // Identity / theming
  cfg,                    // bot config (name, subtitle, gradFrom, gradMid, gradTo, bgDark, micActive, character, icon)

  // Avatar rendering (pass the already-configured avatar element from parent)
  avatarNode,             // React node: <CloudAvatarSafe character={cfg.character} isSpeaking isListening isThinking color />

  // Avatar state (read-only, for UI labels & badges)
  isSpeaking = false,
  isListening = false,
  isThinking = false,

  // State changes from parent
  onClose,

  // Turn-based loop callbacks
  onStartListening,       // () => void — parent should call speech recognition start
  onStopListening,        // () => void — parent should call speech recognition stop
  onInterruptSpeech,      // () => void — stop any current TTS playback
  onSpeakLatestReply,     // () => void — speak the most recent assistant message

  // Data
  messages = [],
  botLatestResponseIdx,   // index of the latest assistant message to auto-speak
  currentInput = '',      // live speech-to-text transcript (drives silence detection)

  // Feature flags
  autoListenAfterReply = true,  // after avatar finishes speaking, auto-start mic
  autoSpeakNewReplies  = true,  // when a new assistant message arrives, auto-speak it
  silenceTimeoutMs     = 1500,  // stop listening after this many ms of no transcript change
  isOpen = false,
}) {
  // ── Media state ──────────────────────────────────────────────────────────
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [permissionState, setPermissionState] = useState('requesting'); // 'requesting' | 'granted' | 'denied' | 'unsupported'
  const [permissionError, setPermissionError] = useState(null);

  // ── Transcript overlay (swipe up) ────────────────────────────────────────
  const [showTranscript, setShowTranscript] = useState(false);
  const touchStartY = useRef(null);

  // ── Auto-loop tracking ───────────────────────────────────────────────────
  const lastSpokenIdxRef = useRef(null);
  const wasSpeakingRef = useRef(false);
  const hasAutoSpokenInitialRef = useRef(false);

  // ─────────────────────────────────────────────────────────────────────────
  // CAMERA LIFECYCLE — request on open, stop on close/unmount
  //
  // IMPORTANT: We can't set videoRef.current.srcObject directly inside
  // startCamera() because the <video> element is now always rendered but
  // may not be in the DOM yet on first open (React hasn't committed).
  // Instead we keep the stream in state and assign it to the video element
  // in a dedicated effect — guaranteed to run after the <video> mounts.
  // ─────────────────────────────────────────────────────────────────────────
  const [activeStream, setActiveStream] = useState(null);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported');
      setPermissionError('Your browser does not support video calls. Try Safari, Chrome, or Firefox.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false, // We use the existing SpeechRecognition API separately — no audio track here
      });
      streamRef.current = stream;
      setActiveStream(stream);
      setPermissionState('granted');
      setPermissionError(null);
    } catch (err) {
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
      setPermissionState(denied ? 'denied' : 'unsupported');
      setPermissionError(
        denied
          ? 'Camera access was denied. Please enable camera permissions in your device or browser settings and reopen the call.'
          : 'Unable to access your camera. Please check your device and try again.'
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
    } catch (_) {}
    streamRef.current = null;
    setActiveStream(null);
    if (videoRef.current) {
      try { videoRef.current.srcObject = null; } catch (_) {}
    }
  }, []);

  // Attach the stream to the <video> element whenever either changes.
  // This guarantees the srcObject is set even if the <video> was not
  // mounted when startCamera() resolved.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeStream) return;
    if (v.srcObject !== activeStream) {
      v.srcObject = activeStream;
    }
    // iOS Safari requires an explicit play() call, even with autoPlay + muted
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* autoplay can be rejected; UI still renders */ });
    }
  }, [activeStream, permissionState, cameraOn]);

  // Start camera when mode opens
  useEffect(() => {
    if (!isOpen) return;
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Pause camera track visibility when user toggles cameraOn
  useEffect(() => {
    const tracks = streamRef.current?.getVideoTracks() || [];
    tracks.forEach(t => { t.enabled = cameraOn; });
  }, [cameraOn]);

  // Stop everything if the tab/app backgrounds (iOS Safari mem pressure)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Pause tracks but keep stream so resume is smooth
        const tracks = streamRef.current?.getVideoTracks() || [];
        tracks.forEach(t => { t.enabled = false; });
        onStopListening?.();
        onInterruptSpeech?.();
      } else {
        const tracks = streamRef.current?.getVideoTracks() || [];
        tracks.forEach(t => { t.enabled = cameraOn; });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cameraOn, onStopListening, onInterruptSpeech]);

  // ─────────────────────────────────────────────────────────────────────────
  // TURN-BASED LOOP
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      hasAutoSpokenInitialRef.current = false;
      lastSpokenIdxRef.current = null;
    }
  }, [isOpen]);

  // When a new assistant message arrives → speak it (if autoSpeakNewReplies)
  useEffect(() => {
    if (!isOpen || !autoSpeakNewReplies) return;
    if (botLatestResponseIdx == null || botLatestResponseIdx < 0) return;

    const latestMessage = messages[botLatestResponseIdx];
    const isInitialWelcome = botLatestResponseIdx === 0 && latestMessage?.role === 'assistant';

    if (isInitialWelcome && hasAutoSpokenInitialRef.current) return;
    if (!isInitialWelcome && lastSpokenIdxRef.current === botLatestResponseIdx) return;
    if (isSpeaking) return;

    if (isInitialWelcome) {
      hasAutoSpokenInitialRef.current = true;
    }
    lastSpokenIdxRef.current = botLatestResponseIdx;

    const t = setTimeout(() => { onSpeakLatestReply?.(); }, 200);
    return () => clearTimeout(t);
  }, [botLatestResponseIdx, isOpen, autoSpeakNewReplies, isSpeaking, onSpeakLatestReply, messages]);

  // When avatar finishes speaking (speaking → not speaking) → auto-listen
  useEffect(() => {
    if (!isOpen || !autoListenAfterReply) return;
    const wasSpeaking = wasSpeakingRef.current;
    wasSpeakingRef.current = isSpeaking;

    // speaking edge: true → false means TTS just ended
    if (wasSpeaking && !isSpeaking && !isListening && !isThinking) {
      const t = setTimeout(() => {
        // Only auto-listen if call is still open and permission is granted
        if (permissionState === 'granted' || permissionState === 'requesting') {
          onStartListening?.();
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isSpeaking, isListening, isThinking, isOpen, autoListenAfterReply, permissionState, onStartListening]);

  // SILENCE DETECTOR — auto-stop listening when the user stops speaking.
  //
  // The underlying SpeechRecognition API keeps itself alive (ChatScreen's
  // rec.onend restarts it on a 150ms timer as long as isListeningRef is true),
  // which means transcription never stops on its own. In a turn-based video
  // call we need to detect when the user has stopped speaking so we can fire
  // the "send" path (which in the parent happens when stopListening() is
  // called with a non-empty final transcript).
  //
  // Approach: watch currentInput. Whenever it changes, reset a 1.5s timer.
  // If it stays unchanged for silenceTimeoutMs, fire onStopListening which
  // triggers ChatScreen's pendingSendRef path and sends the message.
  useEffect(() => {
    if (!isOpen || !isListening) return;
    // Only start the silence countdown once we have at least some input.
    // Without this, the countdown would fire right after mic activation and
    // stop before the user has a chance to say anything.
    if (!currentInput || !currentInput.trim()) return;

    const t = setTimeout(() => {
      onStopListening?.();
    }, silenceTimeoutMs);
    return () => clearTimeout(t);
  }, [currentInput, isListening, isOpen, silenceTimeoutMs, onStopListening]);

  // ─────────────────────────────────────────────────────────────────────────
  // GESTURE — swipe up to reveal transcript
  // ─────────────────────────────────────────────────────────────────────────
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => {
    if (touchStartY.current == null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy < -50) { setShowTranscript(true); touchStartY.current = null; }
    if (dy > 50)  { setShowTranscript(false); touchStartY.current = null; }
  };
  const handleTouchEnd = () => { touchStartY.current = null; };

  // ─────────────────────────────────────────────────────────────────────────
  // CONTROL HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  const toggleMic = () => {
    if (isListening) onStopListening?.();
    else onStartListening?.();
  };

  const toggleCamera = () => {
    setCameraOn(prev => !prev);
  };

  const handleEndCall = () => {
    onStopListening?.();
    onInterruptSpeech?.();
    stopCamera();
    onClose?.();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  const statusLabel = isSpeaking ? 'Speaking' : isListening ? 'Listening' : isThinking ? 'Thinking' : 'Connected';
  const statusDotColor = isSpeaking ? cfg.gradTo : isListening ? cfg.micActive : isThinking ? '#F59E0B' : '#10B981';

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[250] flex flex-col overflow-hidden"
      style={{ background: cfg.bgDark || '#0a1220' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ══════════════════════════════════════════════════════════════
           TOP HALF — Avatar zone
         ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          height: '50%',
          background: `linear-gradient(160deg, ${cfg.bgDark || '#0a1220'} 0%, ${cfg.gradMid || cfg.gradTo}22 50%, ${cfg.bgDark || '#0a1220'} 100%)`,
        }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 500, height: 500, top: -100, left: '50%', transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${cfg.gradTo}30 0%, transparent 70%)`,
          }}
          animate={{
            scale:   isSpeaking ? [1, 1.08, 1] : [1, 1.03, 1],
            opacity: isSpeaking ? [0.7, 1, 0.7] : [0.35, 0.5, 0.35],
          }}
          transition={{ duration: isSpeaking ? 1.2 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Header bar */}
        <div
          className="relative z-10 flex items-center justify-between px-4"
          style={{
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            paddingBottom: 10,
          }}
        >
          {/* End call (X) */}
          <button
            onClick={handleEndCall}
            aria-label="End call"
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: 38, height: 38,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.16)',
            }}
          >
            <X className="w-5 h-5 text-white/90" />
          </button>

          {/* Bot name centered */}
          <div className="text-center flex-1 pointer-events-none">
            <p className="text-white font-bold text-sm leading-tight">{cfg.name}</p>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: statusDotColor }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="text-white/55 text-[10px]" aria-live="polite">{statusLabel}</span>
            </div>
          </div>

          {/* Spacer to balance layout */}
          <div style={{ width: 38, height: 38 }} />
        </div>

        {/* Avatar — centered, fills remaining space */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: 40 }}>
          <div className="relative" style={{ width: '100%', maxWidth: 360, aspectRatio: '6 / 7' }}>
            {avatarNode}
          </div>
        </div>

        {/* Permission error banner (if camera denied — overlays avatar) */}
        {permissionState === 'denied' && (
          <div className="absolute inset-x-0 bottom-4 px-4 z-20">
            <div className="rounded-2xl p-3 flex items-start gap-2"
              style={{ background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.35)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-300 mt-0.5" />
              <p className="text-[11px] text-red-100 leading-snug">{permissionError}</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
           BOTTOM HALF — Live camera + controls
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {/* User camera feed (mirrored, like a selfie).
            ALWAYS rendered so the ref exists for srcObject assignment,
            even before permission resolves. Visibility toggled via opacity. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: 'scaleX(-1)', // mirror for selfie feel
            opacity: permissionState === 'granted' && cameraOn ? 1 : 0,
            pointerEvents: 'none',
          }}
        />

        {/* Permission requesting state */}
        {permissionState === 'requesting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
            <p className="text-white/60 text-xs">Requesting camera access…</p>
          </div>
        )}

        {/* Permission denied / unsupported state */}
        {(permissionState === 'denied' || permissionState === 'unsupported') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <VideoOff className="w-6 h-6 text-white/50" />
            </div>
            <p className="text-white/70 text-sm font-medium">Camera unavailable</p>
            <p className="text-white/45 text-[11px] leading-snug max-w-xs">
              {permissionError}
            </p>
            <button
              onClick={startCamera}
              className="mt-2 px-4 py-2 rounded-full text-xs font-medium text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${cfg.gradMid || cfg.gradTo}, ${cfg.gradTo})`,
                boxShadow: `0 2px 12px ${cfg.gradTo}40`,
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Camera off (user toggled) state */}
        {permissionState === 'granted' && !cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <VideoOff className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-white/50 text-xs">Camera off</p>
          </div>
        )}

        {/* Gradient overlay at top of camera for legibility where it meets avatar */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 60,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
          }}
        />

        {/* Swipe-up affordance */}
        {!showTranscript && (
          <motion.button
            onClick={() => setShowTranscript(true)}
            className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            aria-label="Show transcript"
          >
            <ChevronUp className="w-3 h-3 text-white/70" />
            <span className="text-[10px] text-white/70">Swipe for transcript</span>
          </motion.button>
        )}

        {/* Control row — floating pills */}
        <div
          className="absolute inset-x-0 flex items-center justify-center gap-4 z-10"
          style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
        >
          {/* Camera toggle */}
          <motion.button
            onClick={toggleCamera}
            whileTap={{ scale: 0.92 }}
            aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: 72, height: 48,
              background: cameraOn ? 'rgba(255,255,255,0.18)' : '#ef4444',
              backdropFilter: cameraOn ? 'blur(16px)' : 'none',
              border: cameraOn ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(239, 68, 68, 0.6)',
              boxShadow: cameraOn ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.45)',
            }}
          >
            {cameraOn
              ? <Video className="w-5 h-5 text-white" />
              : <VideoOff className="w-5 h-5 text-white" />}
          </motion.button>

          {/* Mic toggle */}
          <motion.button
            onClick={toggleMic}
            disabled={permissionState !== 'granted' && permissionState !== 'requesting'}
            whileTap={{ scale: 0.92 }}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: 72, height: 48,
              background: isListening
                ? `linear-gradient(135deg, ${cfg.micActive}, ${cfg.gradTo})`
                : 'rgba(255,255,255,0.18)',
              backdropFilter: isListening ? 'none' : 'blur(16px)',
              border: isListening ? `1px solid ${cfg.gradTo}70` : '1px solid rgba(255,255,255,0.22)',
              boxShadow: isListening ? `0 4px 18px ${cfg.gradTo}55` : 'none',
            }}
          >
            {isListening
              ? <Mic className="w-5 h-5 text-white" />
              : <MicOff className="w-5 h-5 text-white/80" />}
          </motion.button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
           SWIPE-UP TRANSCRIPT OVERLAY
         ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-0 z-30 flex flex-col"
            style={{
              background: 'rgba(10, 18, 32, 0.94)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-4"
              style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: 12 }}>
              <button
                onClick={() => setShowTranscript(false)}
                aria-label="Hide transcript"
                className="text-white/60 text-xs"
              >
                Close
              </button>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-10 h-1 rounded-full bg-white/20" />
                <p className="text-white/65 text-xs mt-2">Transcript</p>
              </div>
              <div style={{ width: 40 }} />
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              {messages.length === 0 ? (
                <p className="text-center text-white/40 text-xs mt-8">Your conversation will appear here.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-sm text-white'
                          : 'rounded-bl-sm text-white/90 bg-white/10 border border-white/10'
                      }`}
                      style={msg.role === 'user' ? {
                        background: `linear-gradient(135deg, ${cfg.gradMid || cfg.gradTo}, ${cfg.gradTo})`,
                      } : undefined}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}