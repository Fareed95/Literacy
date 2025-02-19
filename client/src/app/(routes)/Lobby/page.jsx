"use client";
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '@/app/context/Userinfo';
import { useRouter } from 'next/navigation';
import { Search, Menu, MoreVertical, MessageCircle, UserPlus, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Page = () => {
  const people = [
    { name: 'John Doe', email: 'john.doe@example.com', lastMessage: 'Hey, how are you?', time: '12:30 PM', status: 'online', },
    { name: 'Jane Smith', email: 'jane.smith@example.com', lastMessage: 'Meeting at 3 PM', time: '11:45 AM', status: 'offline' },
    { name: 'Michael Johnson', email: 'michael.johnson@example.com', lastMessage: 'Thanks!', time: '10:20 AM', status: 'online' },
    { name: 'Emily Davis', email: 'emily.davis@example.com', lastMessage: 'See you tomorrow', time: '9:15 AM', status: 'away' },
    { name: 'Chris Lee', email: 'chris.lee@example.com', lastMessage: 'Got it!', time: 'Yesterday', status: 'online' },
    { name: 'Sarah Brown', email: 'sarah.brown@example.com', lastMessage: 'No problem', time: 'Yesterday', status: 'offline' },
    { name: 'David Wilson', email: 'david.wilson@example.com', lastMessage: 'Sounds good', time: 'Yesterday', status: 'online' },
    { name: 'Laura Martinez', email: 'laura.martinez@example.com', lastMessage: 'Ok, perfect!', time: 'Yesterday', status: 'away' },
    { name: 'Daniel Garcia', email: 'daniel.garcia@example.com', lastMessage: 'Will do', time: 'Tuesday', status: 'offline' },
    { name: 'Sophia Hernandez', email: 'sophia.hernandez@example.com', lastMessage: 'Great idea!', time: 'Monday', status: 'online' },
  ];

  const { contextisLoggedIn, contextemail, contextSelectedPerson, contextSetSelectedPerson } = useUserContext();
  const [person1, setPerson] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const roomNamesRef = useRef('');
  const router = useRouter();

  useEffect(() => {
    if (contextisLoggedIn && contextemail && person1 && contextSelectedPerson !== '') {
      const generateRoomNames = () => {
        const emails = [
          contextemail.replace('@', '.'),
          person1.replace('@', '.'),
        ].sort();
        roomNamesRef.current = `${emails[0]}_${emails[1]}`;
        router.push(`/ChatRoom/${roomNamesRef.current}`);
        setPerson('');
      };
      generateRoomNames();
    }
  }, [contextisLoggedIn, contextemail, person1, router, contextSelectedPerson]);

  if (!contextisLoggedIn || contextemail === '') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex items-center justify-center min-h-screen bg-neutral-950"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glass p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4"
        >
          <h1 className="text-3xl font-semibold text-electric-blue mb-4">Please Login First</h1>
          <p className="text-neon-cyan mb-6">You need to be logged in to access the chat lobby.</p>
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
      </motion.div>
    );
  }

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Left Sidebar */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 glass border-r border-soft-purple/20 flex flex-col"
      >
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
            <motion.button whileHover={{ scale: 1.1 }} className="hover:text-electric-blue transition-colors">
              <Bell className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="hover:text-electric-blue transition-colors">
              <Settings className="w-5 h-5" />
            </motion.button>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => {
                setPerson(person.email);
                contextSetSelectedPerson(person);
                setSelectedPerson(person);
              }}
              className={`p-4 border-b border-soft-purple/20 hover:bg-deep-indigo/20 cursor-pointer transition-all ${
                selectedPerson?.email === person.email ? 'bg-deep-indigo/30' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center">
                    <span className="text-electric-blue text-lg font-semibold">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-900 ${
                    person.status === 'online' ? 'bg-green-500' :
                    person.status === 'away' ? 'bg-yellow-500' :
                    'bg-neutral-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-electric-blue truncate">{person.name}</h3>
                    <span className="text-xs text-neon-cyan">{person.time}</span>
                  </div>
                  <p className="text-sm text-foreground/60 truncate">{person.lastMessage}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Chat Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col bg-neutral-950 relative"
      >
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center glass p-8 rounded-2xl max-w-md"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-electric-blue" />
            <h2 className="text-2xl font-bold text-electric-blue mb-2">Welcome to Chat</h2>
            <p className="text-neon-cyan mb-6">Select a conversation to start messaging</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-btn inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Start New Chat</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;