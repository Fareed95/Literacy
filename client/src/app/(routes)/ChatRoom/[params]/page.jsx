"use client";
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '@/app/context/Userinfo';
import { useRouter, useParams } from 'next/navigation';
import { Search, Menu, MoreVertical, MessageCircle, Send, Video, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

const Message = ({ content, sender, timestamp, isCurrentUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
      <div className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-200">
          {sender[0].toUpperCase()}
        </div>
        <div className={`px-4 py-2 rounded-xl ${
          isCurrentUser 
            ? 'bg-neutral-800 text-neutral-200' 
            : 'bg-neutral-900/50 text-neutral-300'
        }`}>
          <p className="text-sm">{content}</p>
          <p className="text-xs text-neutral-500 mt-1">{timestamp}</p>
        </div>
      </div>
    </div>
  </motion.div>
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
    <div className="min-h-screen bg-neutral-950 relative">
      <HeroBackground />
      
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900/50 border-b border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/Lobby">
                <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-neutral-400" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-neutral-200">Java Beginners</h1>
                <div className="flex items-center text-neutral-400 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>24 participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-neutral-900/50 border-t border-neutral-800 p-4">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;