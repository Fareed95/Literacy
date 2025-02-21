'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

const Page = () => {
  const { email } = useAuth();
  const { portfolioData, updateUserDetails, loading, error } = usePortfolio(email);
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
    if (email) {
      router.replace(`/portfolio/${encodeURIComponent(email)}`);
    }
  }, [email, router]);

  useEffect(() => {
    if (portfolioData?.userDetails) {
      setUserDetails({
        name: portfolioData.userDetails.name || '',
        title: portfolioData.userDetails.title || '',
        bio: portfolioData.userDetails.bio || '',
        location: portfolioData.userDetails.location || '',
        website: portfolioData.userDetails.website || '',
      });
    }
  }, [portfolioData]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading portfolio data</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen relative">
      <HeroBackground />
      

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 space-y-4"
        >
          <h1 className="text-6xl font-bold text-electric-blue">
            {userDetails.name || 'Your Name'}
          </h1>
          <p className="text-2xl text-neon-cyan">{userDetails.title || 'Your Title'}</p>
          {userDetails.bio && (
            <p className="text-lg text-foreground/80 mt-4 max-w-2xl mx-auto">
              {userDetails.bio}
            </p>
          )}
          <div className="flex items-center justify-center space-x-4 mt-6">
            {userDetails.location && (
              <span className="text-soft-purple flex items-center">
                <span className="mr-2">📍</span> {userDetails.location}
              </span>
            )}
            {userDetails.website && (
              <a
                href={userDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:text-neon-cyan transition-colors flex items-center"
              >
                <span className="mr-2">🔗</span> Website
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-32 pb-32">
        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent" />
          <h2 className="text-4xl font-bold text-electric-blue text-center mb-16">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData?.toolNames?.map((toolName) => (
              <motion.div
                key={toolName.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-xl hover-glow"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan mb-4">{toolName.name}</h3>
                <div className="space-y-3">
                  {toolName.tools?.map((tool) => (
                    <div key={tool.id} className="space-y-2">
                      <p className="text-electric-blue font-medium">{tool.name}</p>
                      {tool.components?.map((component) => (
                        <p key={component.id} className="text-foreground/60 pl-4 text-sm">
                          • {component.name}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent" />
          <h2 className="text-4xl font-bold text-electric-blue text-center mb-16">Education</h2>
          <div className="space-y-8">
            {portfolioData?.userDetails?.education?.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 rounded-xl hover-glow"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-neon-cyan">{edu.degree}</h3>
                    <p className="text-electric-blue mt-2">{edu.field_of_study}</p>
                    <p className="text-foreground/60 mt-1">{edu.University}</p>
                    <p className="text-foreground/60">{edu.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neon-cyan">{edu.start_date} - {edu.end_date}</p>
                    {edu.current_grade && (
                      <p className="text-electric-blue mt-2">Grade: {edu.current_grade}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent" />
          <h2 className="text-4xl font-bold text-electric-blue text-center mb-16">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData?.userDetails?.project?.map((proj) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-xl hover-glow"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan">{proj.name}</h3>
                <p className="text-foreground/80 mt-4">{proj.description}</p>
                <div className="mt-6">
                  <p className="text-electric-blue">
                    {proj.start_date} - {proj.end_date || 'Present'}
                  </p>
                  {proj.link && proj.link.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {proj.link.map((link) => (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-btn text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {link.name}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Certificates Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent" />
          <h2 className="text-4xl font-bold text-electric-blue text-center mb-16">Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData?.userDetails?.certificate?.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-xl hover-glow"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan">{cert.name}</h3>
                <p className="text-electric-blue mt-2">{cert.issuing_organization}</p>
                <p className="text-foreground/60 mt-4">Issued: {cert.issue_date}</p>
                {cert.expiry_date && (
                  <p className="text-foreground/60">Expires: {cert.expiry_date}</p>
                )}
                {cert.credential_id && (
                  <p className="text-neon-cyan mt-2">Credential ID: {cert.credential_id}</p>
                )}
                {cert.credential_url && (
                  <motion.a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neon-btn text-sm mt-4 inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Certificate
                  </motion.a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Edit Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsEditing(true)}
        className="fixed bottom-8 right-8 neon-btn"
      >
        Edit Profile
      </motion.button>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-2xl max-w-2xl w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-electric-blue mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateUserDetails} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-neon-cyan block mb-2">Name</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Title</label>
                  <input
                    type="text"
                    value={userDetails.title}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Bio</label>
                  <textarea
                    value={userDetails.bio}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue h-32"
                  />
                </div>
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
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Page;