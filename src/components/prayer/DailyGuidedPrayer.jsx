import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, BookOpen, RotateCcw, RotateCw, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function DailyGuidedPrayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speechStatus, setSpeechStatus] = useState('idle'); // idle, loading, speaking
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const audioRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  const prayers = [
    {
      text: "Heavenly Father, as I come before You today, I surrender my heart, my plans, and my worries into Your loving hands. Fill me with Your peace that surpasses all understanding. Guide my thoughts, words, and actions so they may honor You. Help me to walk in Your truth and love throughout this day. In Jesus' name, Amen.",
      scripture: "Philippians 4:6-7",
      scriptureText: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
    },
    {
      text: "Lord Jesus, I thank You for this new day and the breath in my lungs. Help me to see Your goodness in every moment. Strengthen me when I feel weak, comfort me when I'm troubled, and guide me when I'm uncertain. Let Your light shine through me to touch the lives of others. May everything I do today bring glory to Your name. Amen.",
      scripture: "Psalm 118:24",
      scriptureText: "This is the day that the Lord has made; let us rejoice and be glad in it."
    },
    {
      text: "Gracious God, I come to You seeking Your presence. Clear my mind of distractions and fill my heart with Your love. Help me to trust You completely, even when I cannot see the way forward. Give me wisdom in my decisions, patience in my struggles, and compassion for those around me. I place this day in Your hands. Amen.",
      scripture: "Proverbs 3:5-6",
      scriptureText: "Trust in the Lord with all your heart and lean not on your own understanding."
    },
    {
      text: "Father, as I begin this day, I ask for Your protection over my family, my loved ones, and myself. Shield us from harm and surround us with Your angels. Grant me a heart of gratitude and eyes to see the blessings You provide. Help me to be a vessel of Your grace and mercy to everyone I encounter today. Amen.",
      scripture: "Psalm 91:11",
      scriptureText: "For he will command his angels concerning you to guard you in all your ways."
    },
    {
      text: "Lord, I surrender my fears and anxieties to You. Replace them with Your perfect peace and unwavering faith. Help me to remember that You are in control and that Your plans for me are good. Give me strength to face challenges, courage to step out in faith, and hope that anchors my soul. Thank You for Your faithfulness. Amen.",
      scripture: "Jeremiah 29:11",
      scriptureText: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
    },
    {
      text: "Heavenly Father, I praise You for who You are—my Creator, my Redeemer, my Sustainer. I confess my shortcomings and ask for Your forgiveness. Renew my spirit and restore my soul. Help me to live according to Your will and to love others as You have loved me. May Your kingdom come and Your will be done in my life today. Amen.",
      scripture: "Psalm 51:10",
      scriptureText: "Create in me a pure heart, O God, and renew a steadfast spirit within me."
    },
    {
      text: "Lord Jesus, thank You for walking with me every step of the way. As I face this day, I ask for Your wisdom, Your strength, and Your joy. Help me to be a light in the darkness and a source of encouragement to those who are hurting. Let my life be a testimony of Your goodness and grace. I trust You with everything. Amen.",
      scripture: "Matthew 5:16",
      scriptureText: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."
    }
  ];

  const dayOfWeek = new Date().getDay();
  const todaysPrayer = prayers[dayOfWeek];

  useEffect(() => {
    generateTTSAudio();
    
    // Initialize speech synthesis on component mount
    if ('speechSynthesis' in window) {
      console.log('Speech Synthesis API supported');
      console.log('Browser:', navigator.userAgent);
      
      // Load voices immediately
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.length);
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('Available voices:', voices.map(v => v.name));
        }
      };

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      }
      
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // For Edge/Chrome - trigger voices to load
      window.speechSynthesis.getVoices();
    } else {
      console.error('Speech Synthesis API not supported');
    }
  }, []);

  const generateTTSAudio = async () => {
    if (audioUrl) return;
    
    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a calm, peaceful spoken prayer using this text: "${todaysPrayer.text}". Use a warm, soothing voice.`,
      });
      
      // For now, we'll use a placeholder. In production, you'd use OpenAI's TTS API
      const ttsUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`;
      setAudioUrl(ttsUrl);
    } catch (error) {
      console.error('Failed to generate TTS:', error);
    }
    setIsGenerating(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSpeechToggle = async () => {
    console.log('handleSpeechToggle called, current status:', speechStatus);
    
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Stop if currently speaking
    if (speechStatus === 'speaking') {
      console.log('Stopping speech...');
      window.speechSynthesis.cancel();
      setSpeechStatus('idle');
      console.log('Speech stopped');
      return;
    }

    // Start speaking
    setSpeechStatus('loading');
    console.log('Status set to loading');

    // Clear any existing utterances
    window.speechSynthesis.cancel();
    console.log('Previous utterances cancelled');

    // Small delay to ensure speech synthesis is ready (especially for Edge)
    await new Promise(resolve => setTimeout(resolve, 100));

    const speakText = () => {
      console.log('speakText function called');
      
      const utterance = new SpeechSynthesisUtterance(todaysPrayer.text);
      console.log('Utterance created with text length:', todaysPrayer.text.length);
      
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
      
      // Find a suitable voice
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Zira'))
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected voice:', preferredVoice.name, preferredVoice.lang);
      } else {
        console.log('Using default voice');
      }
      
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        console.log('Speech started!');
        setSpeechStatus('speaking');
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setSpeechStatus('idle');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error occurred:', event);
        console.error('Error type:', event.error);
        console.error('Error message:', event.message);
        setSpeechStatus('idle');
      };
      
      utterance.onpause = () => {
        console.log('Speech paused');
      };
      
      utterance.onresume = () => {
        console.log('Speech resumed');
      };
      
      speechSynthesisRef.current = utterance;
      
      console.log('About to call speak()...');
      window.speechSynthesis.speak(utterance);
      console.log('speak() called');
      
      // Verify it's in the queue
      setTimeout(() => {
        console.log('Speech synthesis speaking:', window.speechSynthesis.speaking);
        console.log('Speech synthesis pending:', window.speechSynthesis.pending);
        console.log('Speech synthesis paused:', window.speechSynthesis.paused);
      }, 200);
    };

    // Ensure voices are loaded
    if (!voicesLoaded || window.speechSynthesis.getVoices().length === 0) {
      console.log('Waiting for voices to load...');
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        setVoicesLoaded(true);
        speakText();
      };
      // Trigger voice loading
      window.speechSynthesis.getVoices();
    } else {
      console.log('Voices already loaded, speaking now');
      speakText();
    }
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        console.log('Component unmounting, cancelling speech');
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getButtonText = () => {
    if (speechStatus === 'loading') return 'Loading...';
    if (speechStatus === 'speaking') return 'Stop';
    return 'Listen';
  };

  const getButtonIcon = () => {
    if (speechStatus === 'loading') return <Loader2 className="w-4 h-4 text-[#D9B878] animate-spin" />;
    if (speechStatus === 'speaking') return <VolumeX className="w-4 h-4 text-[#D9B878]" />;
    return <Volume2 className="w-4 h-4 text-[#D9B878]" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-gradient-to-br from-[#D9B878]/20 to-[#AFC7E3]/20 rounded-2xl p-6 border border-[#D9B878]/30 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#D9B878]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Daily Guided Prayer</h3>
        </div>
        <p className="text-sm text-[#0A1A2F]/70 mb-4">A fresh prayer to center your heart today</p>

        <div className="bg-white rounded-xl p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <p className="text-[#0A1A2F] font-serif leading-relaxed flex-1">
              {todaysPrayer.text}
            </p>
            <Button
              onClick={handleSpeechToggle}
              size="sm"
              variant="outline"
              className="shrink-0 border-[#D9B878] hover:bg-[#D9B878]/10 min-w-[80px]"
              title={speechStatus === 'speaking' ? "Stop reading" : "Listen to prayer"}
              disabled={speechStatus === 'loading'}
            >
              <span className="flex items-center gap-2">
                {getButtonIcon()}
                <span className="text-xs font-medium">{getButtonText()}</span>
              </span>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="mb-4">
              <p className="text-xs text-[#0A1A2F]/60 mb-1">Today's Scripture</p>
              <p className="text-sm font-semibold text-[#D9B878]">{todaysPrayer.scripture}</p>
              <p className="text-xs text-[#0A1A2F]/70 italic mt-1">"{todaysPrayer.scriptureText}"</p>
            </div>

            {/* Audio Player Controls */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <Button
                  onClick={handleRewind}
                  size="sm"
                  variant="ghost"
                  className="text-[#0A1A2F]"
                  disabled={!audioUrl || isGenerating}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F] rounded-full w-14 h-14"
                  disabled={!audioUrl || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>

                <Button
                  onClick={handleForward}
                  size="sm"
                  variant="ghost"
                  className="text-[#0A1A2F]"
                  disabled={!audioUrl || isGenerating}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              {audioUrl && (
                <>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#D9B878]"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#0A1A2F]/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </>
              )}

              {isPlaying && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-[#0A1A2F]/60 mt-2"
                >
                  🎧 Playing guided prayer...
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />
        )}
      </div>
    </motion.div>
  );
}