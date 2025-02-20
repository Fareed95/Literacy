"use client";
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '@/app/context/Userinfo';
import { useRouter, useParams } from 'next/navigation';
import { Search, Menu, MoreVertical, MessageCircle, Send, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

const Page = () => {
  const people = [
    { name: 'John Doe', email: 'john.doe@example.com', lastMessage: 'Hey, how are you?', time: '12:30 PM' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', lastMessage: 'Meeting at 3 PM', time: '11:45 AM' },
    { name: 'Michael Johnson', email: 'michael.johnson@example.com', lastMessage: 'Thanks!', time: '10:20 AM' },
    { name: 'Emily Davis', email: 'emily.davis@example.com', lastMessage: 'See you tomorrow', time: '9:15 AM' },
    { name: 'Chris Lee', email: 'chris.lee@example.com', lastMessage: 'Got it!', time: 'Yesterday' },
    { name: 'Sarah Brown', email: 'sarah.brown@example.com', lastMessage: 'No problem', time: 'Yesterday' },
    { name: 'David Wilson', email: 'david.wilson@example.com', lastMessage: 'Sounds good', time: 'Yesterday' },
    { name: 'Laura Martinez', email: 'laura.martinez@example.com', lastMessage: 'Ok, perfect!', time: 'Yesterday' },
    { name: 'Daniel Garcia', email: 'daniel.garcia@example.com', lastMessage: 'Will do', time: 'Tuesday' },
    { name: 'Sophia Hernandez', email: 'sophia.hernandez@example.com', lastMessage: 'Great idea!', time: 'Monday' },
  ];

  // Chat room states and refs
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const webSocketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const { contextisLoggedIn, contextemail,contextSelectedPerson, contextSetSelectedPerson } = useUserContext();
  const [person1, setPerson] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const roomNamesRef = useRef('');
  const router = useRouter();

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!roomNamesRef.current) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_CHAT_APP_SERVER}/ws/chat/${roomNamesRef.current}/`);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_history') {
        setMessages(data.messages);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
  }, [roomNamesRef.current]);

  useEffect(() => {
    if (contextisLoggedIn && contextemail && person1) {
      const generateRoomNames = () => {
        const emails = [
          contextemail.replace('@', '.'),
          person1.replace('@', '.'),
        ].sort();
        roomNamesRef.current = `${emails[0]}_${emails[1]}`;
      };
      generateRoomNames();
    }
  }, [contextisLoggedIn, contextemail, person1]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && webSocketRef.current) {
      const data = {
        username: contextemail,
        message,
      };
      webSocketRef.current.send(JSON.stringify(data));
      setMessage('');
    }
  };

  if (!contextisLoggedIn || contextemail === '') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <HeroBackground />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glass p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4"
        >
          <h1 className="text-3xl font-semibold text-electric-blue mb-4">Please Login First</h1>
          <p className="text-neon-cyan mb-6">You need to be logged in to access the chat.</p>
          <Link href="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-btn w-full"
            >
              Go to Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 pt-24">
      <HeroBackground />
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex rounded-2xl overflow-hidden h-[calc(100vh-8rem)]"
        >
          {/* Left Sidebar */}
          <div className="w-96 glass border-r border-soft-purple/20 flex flex-col">
            {/* Header */}
            <div className="p-4 glass border-b border-soft-purple/20 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                  <span className="text-electric-blue text-lg font-semibold">
                    {contextemail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-electric-blue">{contextemail}</span>
                  <span className="text-xs text-neon-cyan block">Online</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-neon-cyan">
                <Menu className="w-5 h-5 cursor-pointer hover:text-electric-blue transition-colors" />
                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-electric-blue transition-colors" />
              </div>
            </div>

            {/* Search */}
            <div className="p-4 glass">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full py-2 px-4 pl-10 glass text-electric-blue rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-blue/50 placeholder-neon-cyan/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-neon-cyan absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {filteredPeople.map((person, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (contextisLoggedIn && contextemail && person.email) {
                      const generateRoomNames = () => {
                        const emails = [
                          contextemail.replace('@', '.'),
                          person.email.replace('@', '.'),
                        ].sort();
                        roomNamesRef.current = `${emails[0]}_${emails[1]}`;
                        contextSetSelectedPerson(person);
                        router.push(`/ChatRoom/${roomNamesRef.current}`);
                        setPerson('');
                      };
                      generateRoomNames();
                    } else {
                      console.log(contextemail, person);
                    }
                  }}
                  className={`p-4 border-b border-soft-purple/20 hover:bg-deep-indigo/20 cursor-pointer transition-all ${
                    selectedPerson?.email === person.email ? 'bg-deep-indigo/30' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center">
                      <span className="text-electric-blue text-lg font-semibold">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold text-electric-blue truncate">{person.name}</h3>
                        <span className="text-xs text-neon-cyan">{person.time}</span>
                      </div>
                      <p className="text-sm text-foreground/60 truncate">{person.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Chat Area */}
          <div className="flex-1 flex flex-col glass">
            {contextSelectedPerson ? (
              <>
                {/* Chat Header */}
                <div className="p-4 glass border-b border-soft-purple/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-electric-blue/20 rounded-full flex items-center justify-center">
                      <span className="text-electric-blue text-lg font-semibold">
                        {contextSelectedPerson.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-electric-blue">{contextSelectedPerson.name}</h2>
                      <p className="text-sm text-neon-cyan">{contextSelectedPerson.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href={`/VideoCall/${roomNamesRef.current}`}>
                      <Video className="w-5 h-5 text-neon-cyan hover:text-electric-blue transition-colors" />
                    </Link>
                    <MoreVertical className="w-5 h-5 text-neon-cyan hover:text-electric-blue transition-colors" />
                  </div>
                </div>

                {/* Chat Messages Area with gradient background */}
                <div className="flex-1 p-4 overflow-y-auto hide-scrollbar relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/5 via-soft-purple/5 to-electric-blue/5 pointer-events-none" />
                  <div className="relative z-10">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${
                          msg.username === contextemail ? 'justify-end' : 'justify-start'
                        } mb-4`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-xl backdrop-blur-sm ${
                            msg.username === contextemail
                              ? 'glass bg-electric-blue/10 text-electric-blue'
                              : 'glass bg-neon-cyan/10 text-neon-cyan'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">
                              {msg.username === contextemail ? 'You' : msg.username}
                            </span>
                            <span className="text-xs text-foreground/60">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm text-foreground/80">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input with floating effect */}
                <motion.form
                  onSubmit={sendMessage}
                  className="p-4 glass border-t border-soft-purple/20 flex items-center space-x-2 backdrop-blur-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow p-3 rounded-xl glass text-electric-blue placeholder-neon-cyan/50 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all duration-300 hover:bg-electric-blue/5"
                  />
                  <motion.button
                    type="submit"
                    className="neon-btn p-3 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </motion.form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-electric-blue/5 via-transparent to-transparent animate-pulse" />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center glass p-8 rounded-2xl max-w-md relative z-10 backdrop-blur-md"
                >
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-electric-blue animate-float" />
                  <h2 className="text-2xl font-bold text-electric-blue mb-2">Welcome to Chat</h2>
                  <p className="text-neon-cyan">Select a conversation to start messaging</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;