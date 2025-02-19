'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AvatarComponent from '@/components/avatar/AvatarComponent';
import VoiceControls from '@/components/avatar/VoiceControls';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

const AvatarPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Handle user input (both voice and text)
  const handleUserInput = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: text }]);

    try {
      // TODO: Replace with your AI API endpoint
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
      const responseText = data.message;

      setResponse(responseText);
      setMessages(prev => [...prev, { type: 'ai', content: responseText }]);
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

  // Handle language change
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-24">
      <HeroBackground />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-electric-blue to-neon-cyan bg-clip-text text-transparent">
            AI Learning Assistant
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Your personal mentor for interactive learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Avatar Section - 3 columns */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex justify-end mb-4 space-x-4">
              <motion.button
                onClick={toggleLanguage}
                className="glass px-4 py-2 rounded-full text-sm hover:bg-electric-blue/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentLanguage === 'en' ? '🇺🇸 English' : '🌐 Español'}
              </motion.button>
              <motion.button
                onClick={() => setIsExpanded(prev => !prev)}
                className="glass px-4 py-2 rounded-full text-sm hover:bg-electric-blue/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? 'Minimize' : 'Expand'} Avatar
              </motion.button>
            </div>

            {/* Avatar */}
            <motion.div
              layout
              className="glass p-4 rounded-2xl"
              style={{ height: isExpanded ? '80vh' : '50vh' }}
            >
              <AvatarComponent
                isExpanded={isExpanded}
                isListening={isListening}
                currentLanguage={currentLanguage}
                response={response}
              />
            </motion.div>
          </div>

          {/* Chat Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat history */}
            <motion.div
              className="glass p-6 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-semibold text-electric-blue mb-4">Chat History</h2>
              <div className="h-[50vh] overflow-y-auto hide-scrollbar space-y-4">
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
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-electric-blue/20 ml-auto'
                          : message.type === 'error'
                          ? 'bg-red-500/20'
                          : 'bg-neon-cyan/20'
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
                    <div className="bg-neon-cyan/20 p-3 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Voice controls */}
            <div className="glass p-6 rounded-2xl">
              <VoiceControls
                onSpeechStart={() => setIsListening(true)}
                onSpeechEnd={() => setIsListening(false)}
                onTextInput={handleUserInput}
                isListening={isListening}
                currentLanguage={currentLanguage}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPage; 