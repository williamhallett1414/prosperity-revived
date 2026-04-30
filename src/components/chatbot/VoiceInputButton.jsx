import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

/**
 * VoiceInputButton — Speech-to-Text for chatbot input areas.
 *
 * Props:
 *   onTranscript(text)   — called with the final confirmed transcript
 *   onInterim(text)      — called with live interim results (optional)
 *   disabled             — disables the button (e.g. while AI is loading)
 *   accentColor          — Tailwind bg class for the active pulse ring, e.g. 'bg-[#AFC7E3]'
 *   activeColor          — Tailwind bg class for the mic button when active
 *   className            — extra classes on the wrapper
 */
export default function VoiceInputButton({
  onTranscript,
  onInterim,
  onListeningChange,
  disabled = false,
  accentColor = 'bg-blue-400',
  activeColor = 'bg-red-50 dark:bg-red-900/200',
  className = '',
}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [supported, setSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef(null);
  const restartTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isListeningRef = useRef(false);

  // Detect browser support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    onListeningChange?.(false);
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    finalTranscriptRef.current = '';

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setPermissionDenied(false);
      onListeningChange?.(true);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += (final ? ' ' : '') + transcript.trim();
          finalTranscriptRef.current = final;
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim);
      onInterim?.(final + (interim ? ' ' + interim : ''));
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setPermissionDenied(true);
        toast.error('Microphone access denied. Please allow microphone in your browser settings.');
      } else if (event.error === 'network') {
        toast.error('Network error — speech recognition requires an internet connection.');
      } else if (event.error === 'no-speech') {
        // Silently restart — user just hasn't spoken yet
      } else if (event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      // If still supposed to be listening (no-speech timeout), restart
      if (recognitionRef.current && isListeningRef.current) {
        restartTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (_) {}
          }
        }, 200);
      } else {
        setIsListening(false);
        setInterimText('');
        // Deliver final transcript on stop
        const final = finalTranscriptRef.current.trim();
        if (final) {
          onTranscript(final);
          finalTranscriptRef.current = '';
        }
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
      setIsListening(false);
    }
  }, [onTranscript, onInterim]);

  const handleToggle = () => {
    if (disabled) return;

    if (isListening) {
      // Stop and deliver transcript
      const final = finalTranscriptRef.current.trim();
      isListeningRef.current = false;  // signal onend not to restart
      recognitionRef.current = null;
      stopListening();
      if (final) onTranscript(final);
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  if (!supported) return null;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Pulsing ring when active */}
      <AnimatePresence>
        {isListening && (
          <>
            <motion.span
              key="ring1"
              className={`absolute rounded-full ${accentColor} opacity-30`}
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: 44, height: 44 }}
            />
            <motion.span
              key="ring2"
              className={`absolute rounded-full ${accentColor} opacity-20`}
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              style={{ width: 44, height: 44 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Mic button */}
      <motion.button
        onClick={handleToggle}
        disabled={disabled || permissionDenied}
        whileTap={{ scale: 0.92 }}
        title={
          permissionDenied
            ? 'Microphone permission denied'
            : isListening
            ? 'Tap to stop recording'
            : 'Tap to speak'
        }
        className={`
          relative z-10 flex items-center justify-center
          w-11 h-11 rounded-full transition-all duration-200 shadow-sm dark:shadow-none
          ${isListening
            ? `${activeColor} text-white shadow-md dark:shadow-none`
            : permissionDenied
            ? 'bg-gray-200 text-gray-400 dark:text-gray-300 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:text-gray-200'
          }
          ${disabled && !isListening ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {permissionDenied ? (
          <MicOff className="w-4 h-4" />
        ) : isListening ? (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Mic className="w-4 h-4" />
          </motion.div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </motion.button>

      {/* Live interim transcript tooltip */}
      <AnimatePresence>
        {isListening && interimText && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute bottom-[calc(100%+8px)] right-0 z-50 max-w-[220px] min-w-[100px] bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl leading-relaxed"
          >
            <span className="opacity-60 italic">{interimText}</span>
            <div className="absolute bottom-[-5px] right-4 w-2.5 h-2.5 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
