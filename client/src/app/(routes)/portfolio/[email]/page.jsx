'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

const Page = () => {
  const { email: authEmail } = useAuth();
  const params = useParams();
  const { portfolioData, updateUserDetails, loading, error } = usePortfolio(params.email);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    website: '',
  });
  const router = useRouter();

  useEffect(() => {
    // Fetch user details and interview slots from your API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/userdetails/${params.email}/`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (params.email) {
      fetchUserData();
    }
  }, [params.email]);

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(userDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl text-center max-w-md mx-4"
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-4">Portfolio Not Found</h2>
          <p className="text-neon-cyan mb-6">
            {params.email === authEmail 
              ? "You haven't created your portfolio yet. Would you like to create one?"
              : "This user hasn't created their portfolio yet."}
          </p>
          {params.email === authEmail && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="neon-btn"
            >
              Create Portfolio
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <>
    <HeroBackground/>
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl max-w-2xl mx-4 w-full"
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">
            {portfolioData ? 'Edit Portfolio' : 'Create Portfolio'}
          </h2>
          <form onSubmit={handleUpdateUserDetails} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-neon-cyan block mb-2">Name</label>
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  required
                />
              </div>
              <div>
                <label className="text-neon-cyan block mb-2">Title</label>
                <input
                  type="text"
                  value={userDetails.title}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  required
                />
              </div>
              <div>
                <label className="text-neon-cyan block mb-2">Bio</label>
                <textarea
                  value={userDetails.bio}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue h-32 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-neon-cyan block mb-2">Location</label>
                  <input
                    type="text"
                    value={userDetails.location}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Website</label>
                  <input
                    type="url"
                    value={userDetails.website}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                onClick={() => setIsEditing(false)}
                className="glass px-6 py-2 rounded-lg hover:bg-deep-indigo/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="neon-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {portfolioData ? 'Save Changes' : 'Create Portfolio'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl max-w-2xl mx-4 w-full"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-electric-blue">{userDetails.name}</h2>
              <p className="text-neon-cyan">{userDetails.title}</p>
            </div>
            {params.email === authEmail && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="glass px-4 py-2 rounded-lg hover:bg-deep-indigo/20"
              >
                Edit Profile
              </motion.button>
            )}
          </div>

          <div className="space-y-6">
            {userDetails.bio && (
              <div>
                <h3 className="text-lg font-semibold text-electric-blue mb-2">About</h3>
                <p className="text-neutral-300">{userDetails.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {userDetails.location && (
                <div>
                  <h3 className="text-lg font-semibold text-electric-blue mb-2">Location</h3>
                  <p className="text-neutral-300">{userDetails.location}</p>
                </div>
              )}
              {userDetails.website && (
                <div>
                  <h3 className="text-lg font-semibold text-electric-blue mb-2">Website</h3>
                  <a
                    href={userDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:underline"
                  >
                    {userDetails.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
    </>
  );
};

export default Page;