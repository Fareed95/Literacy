'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VoiceControls from '@/components/avatar/VoiceControls';

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

  useEffect(() => {
    // Get available voices and select a default one
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      setSelectedVoice(englishVoice || voices[0]);
    };

    // Set voice when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    setVoice();
  }, []);

  const speak = (text) => {
    if (!selectedVoice) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

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
        // Reset video to start
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
            <div className="flex justify-end mb-4 space-x-4">
              <motion.button
                onClick={() => setIsExpanded(prev => !prev)}
                className="bg-neutral-800/50 px-4 py-2 rounded-xl text-sm hover:bg-neutral-700/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isExpanded ? 'Minimize' : 'Expand'} Avatar
              </motion.button>
            </div>

            {/* Avatar Video */}
            <motion.div
              layout
              className="bg-neutral-900/30 border border-neutral-800/50 p-4 rounded-2xl backdrop-blur-sm"
              style={{ height: isExpanded ? '80vh' : '50vh' }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-xl"
                src="/avatar.mp4"
                playsInline
                muted={false}
                loop
              >
                Your browser does not support the video tag.
              </video>
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