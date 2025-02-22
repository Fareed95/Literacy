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
const InterviewSlot = ({ slot }) => {
  return (
    <div className="border border-neutral-700 p-4 rounded-lg bg-neutral-800">
      <div className='flex'>
        <h4 className="text-neutral-200 font-semibold">{slot.internship_name}</h4>
        <p className="text-neutral-400">{slot.company_name}</p>
        <p className="text-neutral-400">{new Date(slot.interviw_time).toLocaleString()}</p>
        <p className={`text-${slot.is_selected ? 'green' : 'red'}-500`}>
          {slot.is_selected ? 'Selected' : 'Not Selected'}
        </p>
        {slot.is_selected && (
          <div>
            <a href={`/VideoCall/${slot.company_name}`}>
              <button className='bg-green-900 p-2 m-2'>Join Meet</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
  
};

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

  const friends = [
    { id: 1, name: 'Sarah Chen', status: 'Working on Web Development', isOnline: true },
    { id: 2, name: 'Mike Johnson', status: 'Learning React', isOnline: false },
    { id: 3, name: 'Emily Davis', status: 'Studying Data Structures', isOnline: true },
    { id: 4, name: 'Alex Thompson', status: 'Practicing Algorithms', isOnline: true },
    { id: 5, name: 'Jessica Lee', status: 'Taking a break', isOnline: false },
  ];

  const interviewSlotsMock = [
    {
      id: 1,
      internship_name: 'Frontend Developer Interview',
      company_name: 'Tech Innovators',
      interviw_time: '2024-03-15T10:00:00',
      is_selected: false,
    },
    {
      id: 2,
      internship_name: 'System Design Discussion',
      company_name: 'Software Solutions',
      interviw_time: '2024-03-17T14:30:00',
      is_selected: true,
    },
    {
      id: 3,
      internship_name: 'Data Structures Practice',
      company_name: 'Data Masters',
      interviw_time: '2024-03-10T11:00:00',
      is_selected: false,
    },
    {
      id: 4,
      internship_name: 'Mock Interview Session',
      company_name: 'Interview Prep',
      interviw_time: '2024-03-08T16:00:00',
      is_selected: true,
    },
  ];

  useEffect(() => {
    setInterviewSlots(interviewSlotsMock);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-neutral-950">
      <HeroBackground />

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-neutral-200 mb-2">User Profile</h1>
          <p className="text-neutral-400">Manage your account settings and preferences</p>
        </motion.div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <PrevCources />
      </div>
    </div>
  );
};

export default UserInfoPage;
