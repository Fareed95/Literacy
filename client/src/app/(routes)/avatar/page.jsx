'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VoiceControls from '@/components/avatar/VoiceControls';
import { Volume2, VolumeX, Settings } from 'lucide-react';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

const AvatarPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);

  useEffect(() => {
    // Get available voices and select a default female voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a female English voice
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('female') || voice.name.includes('Female') || voice.name.includes('Samantha'))
      );
      setSelectedVoice(femaleVoice || voices[0]);
    };

    // Set voice when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    setVoice();
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const speak = (text) => {
    if (!selectedVoice) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = volume;

    // Start video when speaking starts
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    };

    // Stop video when speaking ends
    utterance.onend = () => {
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle user input (both voice and text)
  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: text }]);

    try {
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          message: text,
          language: currentLanguage,
        }),
      });

      const data = await aiResponse.json();
      const responseText = data.message || text; // Fallback to input text for testing

      setResponse(responseText);
      setMessages(prev => [...prev, { type: 'ai', content: responseText }]);
      
      // Speak the response
      speak(responseText);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden pt-24">
      <HeroBackground />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-100">
            AI Learning Assistant
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Your personal mentor for interactive learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Avatar Section - 3 columns */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMute}
                  className="bg-neutral-800/50 p-2 rounded-xl hover:bg-neutral-700/50 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-32">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="bg-neutral-800/50 p-2 rounded-xl hover:bg-neutral-700/50 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <motion.button
                onClick={() => setIsExpanded(prev => !prev)}
                className="bg-neutral-800/50 px-4 py-2 rounded-xl text-sm hover:bg-neutral-700/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isExpanded ? 'Minimize' : 'Expand'} Avatar
              </motion.button>
            </div>

            {/* Voice Settings Panel */}
            {showVoiceSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-800/90 p-4 rounded-xl mb-4 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Speech Rate</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-neutral-500 mt-1">{speechRate}x</div>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Pitch</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-neutral-500 mt-1">{speechPitch}x</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Avatar Video */}
            <motion.div
              layout
              className="relative bg-neutral-900/30 border border-neutral-800/50 rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ height: isExpanded ? '80vh' : '50vh' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/avatar.mp4"
                playsInline
                muted={isMuted}
                loop
                style={{ objectPosition: '50% 15%' }} // Position focus on face
              >
                Your browser does not support the video tag.
              </video>
              {isSpeaking && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Chat Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat history */}
            <motion.div
              className="bg-neutral-900/30 border border-neutral-800/50 p-6 rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-neutral-200 mb-4">Chat History</h2>
              <div className="h-[50vh] overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-blue-500/20 ml-auto'
                          : message.type === 'error'
                          ? 'bg-red-500/20'
                          : 'bg-neutral-800/50'
                      }`}
                    >
                      <p className="text-sm md:text-base">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-neutral-800/50 p-4 rounded-xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Voice controls */}
            <div className="bg-neutral-900/30 border border-neutral-800/50 p-6 rounded-2xl backdrop-blur-sm">
              <VoiceControls
                onSpeechStart={() => setIsListening(true)}
                onSpeechEnd={() => setIsListening(false)}
                onTextInput={handleUserInput}
                isListening={isListening}
                currentLanguage={currentLanguage}
                disabled={isLoading || isSpeaking}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPage; 