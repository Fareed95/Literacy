'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrevCources from '@/components/PrevCources';
import { Calendar, Users, Clock, Video } from 'lucide-react';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

const FriendCard = ({ friend }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl flex items-center space-x-4 hover:bg-neutral-800/50 transition-colors backdrop-blur-sm"
  >
    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-200">
      {friend.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1">
      <h4 className="text-neutral-200 font-medium">{friend.name}</h4>
      <p className="text-sm text-neutral-400">{friend.status}</p>
    </div>
    <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-neutral-200' : 'bg-neutral-600'
      }`} />
  </motion.div>
);

const InterviewSlot = ({ slot }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl space-y-3 hover:bg-neutral-800/50 transition-colors backdrop-blur-sm"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-neutral-200 font-medium">{slot.internship_name}</h4>
      <span className="px-2 py-1 rounded-full text-xs bg-neutral-700 text-neutral-200">
        {slot.is_selected ? 'Selected' : 'Pending'}
      </span>
    </div>
    <div className="flex items-center space-x-2 text-sm text-neutral-400">
      <Users className="w-4 h-4" />
      <span>{slot.company_name}</span>
    </div>
    <div className="flex items-center space-x-2 text-sm text-neutral-400">
      <Calendar className="w-4 h-4" />
      <span>{new Date(slot.interviw_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</span>
    </div>
    <div className="flex items-center space-x-2 text-sm text-neutral-400">
      <Clock className="w-4 h-4" />
      <span>{new Date(slot.interviw_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
    </div>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg flex items-center justify-center space-x-2 transition-colors"
    >
      <Video className="w-4 h-4" />
      <span>Join Interview</span>
    </motion.button>
  </motion.div>
);

const UserInfoPage = () => {
  const { email, name, isLoggedIn } = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    role: '',
    joinDate: '',
    lastActive: '',
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    }
  });
  const [interviewSlots, setInterviewSlots] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user details and interview slots from your API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(prev => ({
            ...prev,
            name: data.name || name,
            email: data.email || email,
            role: data.is_company ? 'Company' : 'Student',
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
          }));
          setInterviewSlots(data.interview_selected || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [email, isLoggedIn, name]);

  const handleUpdatePreferences = async (key, value) => {
    setUserDetails(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
    // Add API call to update preferences here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for friends
  const friends = [
    { id: 1, name: 'Sarah Chen', status: 'Working on Web Development', isOnline: true },
    { id: 2, name: 'Mike Johnson', status: 'Learning React', isOnline: false },
    { id: 3, name: 'Emily Davis', status: 'Studying Data Structures', isOnline: true },
    { id: 4, name: 'Alex Thompson', status: 'Practicing Algorithms', isOnline: true },
    { id: 5, name: 'Jessica Lee', status: 'Taking a break', isOnline: false },
  ];

  // Mock data for interview slots
  const interviewSlotsMock = [
    {
      id: 1,
      title: 'Frontend Developer Interview',
      date: 'March 15, 2024',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'System Design Discussion',
      date: 'March 17, 2024',
      time: '2:30 PM',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Data Structures Practice',
      date: 'March 10, 2024',
      time: '11:00 AM',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Mock Interview Session',
      date: 'March 8, 2024',
      time: '4:00 PM',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-neutral-950">
      <HeroBackground />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-neutral-200 mb-2">User Profile</h1>
          <p className="text-neutral-400">Manage your account settings and preferences</p>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-2xl text-neutral-200">
                {userDetails.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-200">{userDetails.name}</h2>
                <p className="text-neutral-400">{userDetails.email}</p>
                <p className="text-neutral-500 mt-1">Role: {userDetails.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">      
              <h1 className="text-neutral-200">Points: 100</h1>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Friends List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-neutral-200" />
                <h3 className="text-xl font-semibold text-neutral-200">Friends</h3>
              </div>
              <span className="text-neutral-400">{friends.length} friends</span>
            </div>
            <div className="space-y-4">
              {friends.map((friend, index) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                />
              ))}
            </div>
          </motion.div>

          {/* Interview Slots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-neutral-200" />
                <h3 className="text-xl font-semibold text-neutral-200">Interview Slots</h3>
              </div>
            </div>
            <div className="space-y-4">
              {interviewSlots.length > 0 ? (
                interviewSlots.map((slot) => (
                  <InterviewSlot
                    key={slot.id}
                    slot={slot}
                  />
                ))
              ) : (
                <p className="text-neutral-400 text-center py-4">No interview slots scheduled</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Keep PrevCources at the bottom */}
        <PrevCources />
      </div>
    </div>
  );
};

export default UserInfoPage;
