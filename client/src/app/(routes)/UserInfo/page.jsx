'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrevCources from '@/components/PrevCources';
const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user details from your API
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/userdetails/${email}/`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(prev => ({
            ...prev,
            name: data.name || name,
            email: data.email || email,
            role: data.role || 'Student',
            joinDate: data.created_at || new Date().toISOString(),
            lastActive: data.last_login || new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (isLoggedIn && email) {
      fetchUserDetails();
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <HeroBackground />
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-electric-blue mb-2">User Profile</h1>
          <p className="text-neon-cyan">Manage your account settings and preferences</p>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-electric-blue/20 flex items-center justify-center text-2xl">
              {userDetails.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-electric-blue">{userDetails.name}</h2>
              <p className="text-neon-cyan">{userDetails.email}</p>
              <p className="text-soft-purple mt-1">Role: {userDetails.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-electric-blue mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-neon-cyan">Member Since</p>
              <p className="text-foreground/80">{formatDate(userDetails.joinDate)}</p>
            </div>
            <div>
              <p className="text-neon-cyan">Last Active</p>
              <p className="text-foreground/80">{formatDate(userDetails.lastActive)}</p>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-electric-blue mb-4">Preferences</h3>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-cyan">Theme</p>
                <p className="text-sm text-foreground/60">Choose your preferred theme</p>
              </div>
              <button
                onClick={() => handleUpdatePreferences('theme', userDetails.preferences.theme === 'dark' ? 'light' : 'dark')}
                className="neon-btn"
              >
                {userDetails.preferences.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-cyan">Notifications</p>
                <p className="text-sm text-foreground/60">Receive email notifications</p>
              </div>
              <button
                onClick={() => handleUpdatePreferences('notifications', !userDetails.preferences.notifications)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  userDetails.preferences.notifications
                    ? 'neon-btn'
                    : 'glass hover:bg-deep-indigo/20'
                }`}
              >
                {userDetails.preferences.notifications ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-cyan">Language</p>
                <p className="text-sm text-foreground/60">Select your preferred language</p>
              </div>
              <select
                value={userDetails.preferences.language}
                onChange={(e) => handleUpdatePreferences('language', e.target.value)}
                className="glass px-4 py-2 rounded-lg bg-transparent border border-electric-blue/30 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-6 py-2 rounded-lg hover:bg-deep-indigo/20"
          >
            Reset Preferences
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-btn"
          >
            Save Changes
          </motion.button>
        </motion.div>

        <PrevCources />
      </div>
    </div>
  );
};

export default UserInfoPage;
