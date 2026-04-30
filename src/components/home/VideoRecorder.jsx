/**
 * VideoRecorder — Reusable camera recording component
 *
 * Uses the browser's MediaRecorder API to capture video from the device camera.
 * Returns a Blob of the recorded video for saving/uploading.
 *
 * Props:
 *   onRecordingComplete(blob, durationSec) — called when recording finishes
 *   onTranscript(text) — called with speech-to-text transcript (optional)
 *   maxDurationSec — max recording length (default 180 = 3 min)
 *   compact — smaller UI for chat input bar
 *   onClose — called when user dismisses the recorder
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Square, Play, Trash2, Check, X, RotateCcw } from 'lucide-react';

export default function VideoRecorder({
  onRecordingComplete,
  onTranscript,
  maxDurationSec = 180,
  compact = false,
  onClose,
}) {
  const [state, setState] = useState('idle'); // idle | previewing | recording | reviewing
  const [error, setError] = useState(() => {
    // Check browser support upfront
    if (!navigator.mediaDevices?.getUserMedia) {
      // iOS Safari in iframe or older browser
      const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
      if (isIOS) return 'Camera requires the full app. Please open Prosperity Revived from your home screen.';
      return 'Your browser does not support camera access. Please use Chrome, Safari, or Firefox.';
    }
    if (typeof MediaRecorder === 'undefined') return 'Video recording is not supported on this device.';
    return null;
  });
  const [elapsed, setElapsed] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [transcript, setTranscript] = useState('');

  const videoRef = useRef(null);
  const reviewRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const blobRef = useRef(null);
  const recognitionRef = useRef(null);

  // Start camera preview
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;

      // Handle camera being revoked mid-session
      stream.getVideoTracks().forEach(track => {
        track.onended = () => {
          setError('Camera access was interrupted. Please try again.');
          setState('idle');
          clearInterval(timerRef.current);
          recognitionRef.current?.stop();
        };
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setState('previewing');
    } catch (e) {
      console.error('Camera access error:', e);
      if (e.name === 'NotAllowedError') {
        setError('Camera access denied. Please enable camera and microphone in your browser settings.');
      } else if (e.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (e.name === 'NotReadableError') {
        setError('Camera is in use by another app. Please close other apps using the camera.');
      } else {
        setError('Could not start camera. Please try again.');
      }
    }
  }, []);

  // Stop all tracks
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setTranscript('');

    // Determine best available video format
    let mimeType = 'video/mp4'; // fallback
    if (typeof MediaRecorder.isTypeSupported === 'function') {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) mimeType = 'video/webm;codecs=vp9,opus';
      else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) mimeType = 'video/webm;codecs=vp8,opus';
      else if (MediaRecorder.isTypeSupported('video/webm')) mimeType = 'video/webm';
      else if (MediaRecorder.isTypeSupported('video/mp4')) mimeType = 'video/mp4';
    }

    const recorderOptions = {};
    try {
      // Some browsers throw if you pass an unsupported mimeType
      recorderOptions.mimeType = mimeType;
    } catch (_) {}

    const recorder = new MediaRecorder(streamRef.current, recorderOptions);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setState('reviewing');
      stopCamera();
    };
    recorderRef.current = recorder;
    recorder.start(1000); // collect data every second
    setState('recording');
    setElapsed(0);

    // Timer
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= maxDurationSec) {
          stopRecording();
          return maxDurationSec;
        }
        return prev + 1;
      });
    }, 1000);

    // Speech recognition for transcript
    if (onTranscript && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';
        let fullTranscript = '';
        rec.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
              fullTranscript += ' ' + e.results[i][0].transcript.trim();
              setTranscript(fullTranscript.trim());
            }
          }
        };
        rec.onerror = () => {};
        rec.onend = () => {
          // Restart if still recording
          if (recorderRef.current?.state === 'recording') {
            try { rec.start(); } catch (_) {}
          }
        };
        rec.start();
        recognitionRef.current = rec;
      } catch (_) {}
    }
  }, [maxDurationSec, onTranscript, stopCamera]);

  // Stop recording
  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
  }, []);

  // Confirm recording
  const confirmRecording = useCallback(() => {
    if (blobRef.current && onRecordingComplete) {
      onRecordingComplete(blobRef.current, elapsed);
    }
    // Always fire onTranscript so the parent knows recording is done
    if (onTranscript) {
      onTranscript(transcript || '');
    }
    cleanup();
    onClose?.();
  }, [elapsed, transcript, onRecordingComplete, onTranscript, onClose, cleanup]);

  // Discard and retake
  const retake = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    blobRef.current = null;
    setElapsed(0);
    setTranscript('');
    startCamera();
  }, [videoUrl, startCamera]);

  // Full cleanup
  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    stopCamera();
    recognitionRef.current?.stop();
    // videoUrl cleanup handled by caller or useEffect
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      recognitionRef.current?.stop();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Auto-start camera when mounted
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${compact ? 'p-4' : 'p-8'}`}>
        <Video className="w-8 h-8 text-red-400" />
        <p className="text-sm text-red-400 text-center">{error}</p>
        <button onClick={onClose} className="text-xs text-white/50 hover:text-white">Close</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative ${compact ? 'rounded-2xl overflow-hidden' : 'rounded-3xl overflow-hidden'}`}
      style={{ background: '#0A1A2F' }}
    >
      {/* Video preview / review */}
      <div className={`relative ${compact ? 'h-48' : 'aspect-square max-h-[360px]'} w-full bg-black`}>
        {(state === 'idle' || state === 'previewing' || state === 'recording') && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
        {state === 'reviewing' && videoUrl && (
          <video
            ref={reviewRef}
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Recording indicator */}
        {state === 'recording' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-red-50 dark:bg-red-900/200"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-white text-xs font-bold">{formatTime(elapsed)}</span>
            <span className="text-white/40 text-[10px]">/ {formatTime(maxDurationSec)}</span>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => { cleanup(); onClose?.(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-4 px-4">
        {state === 'previewing' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/200 flex items-center justify-center shadow-lg dark:shadow-none shadow-red-500/30 border-4 border-white/20"
          >
            <div className="w-6 h-6 rounded-full bg-white dark:bg-white/5 dark:bg-white/5" />
          </motion.button>
        )}

        {state === 'recording' && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/200 flex items-center justify-center shadow-lg dark:shadow-none shadow-red-500/30 border-4 border-white/20"
          >
            <Square className="w-6 h-6 text-white fill-white" />
          </motion.button>
        )}

        {state === 'reviewing' && (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={retake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/15"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={confirmRecording}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FD9C2D] to-[#c9a227] text-white text-sm font-bold shadow-lg dark:shadow-none shadow-[#FD9C2D]/30"
            >
              <Check className="w-4 h-4" /> Use Video
            </motion.button>
          </>
        )}
      </div>

      {/* Transcript preview during recording */}
      {state === 'recording' && (
        <div className="px-4 pb-3">
          {transcript ? (
            <>
              <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Live Transcript</p>
              <p className="text-xs text-white/60 leading-relaxed line-clamp-2">{transcript}</p>
            </>
          ) : (
            <p className="text-[10px] text-white/20 text-center">
              {(window.SpeechRecognition || window.webkitSpeechRecognition)
                ? 'Listening for speech…'
                : 'Speech-to-text not available in this browser'}
            </p>
          )}
        </div>
      )}

      {/* Transcript preview in review */}
      {state === 'reviewing' && (
        <div className="px-4 pb-4">
          {transcript ? (
            <>
              <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Transcript</p>
              <p className="text-xs text-white/60 leading-relaxed">{transcript}</p>
            </>
          ) : (
            <div className="bg-white/5 rounded-xl px-3 py-2">
              <p className="text-[10px] text-white/30 text-center">No transcript captured. Video will be saved without text.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
