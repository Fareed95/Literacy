'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/app/context/AuthContext'

const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    <div className="min-h-screen pt-24 pb-12">
      <HeroBackground />
      
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold text-electric-blue">
            {userDetails.name || 'Your Portfolio'}
          </h1>
          <p className="text-2xl text-neon-cyan">{userDetails.title || 'Your Title'}</p>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-electric-blue">About Me</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="neon-btn"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </motion.button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateUserDetails} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-neon-cyan">Name</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan">Title</label>
                  <input
                    type="text"
                    value={userDetails.title}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-neon-cyan">Bio</label>
                  <textarea
                    value={userDetails.bio}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue h-32"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan">Location</label>
                  <input
                    type="text"
                    value={userDetails.location}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan">Website</label>
                  <input
                    type="url"
                    value={userDetails.website}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-electric-blue"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="neon-btn"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-foreground/80">{userDetails.bio || 'Add your bio'}</p>
              <div className="flex items-center space-x-4">
                <span className="text-neon-cyan">📍 {userDetails.location || 'Location'}</span>
                {userDetails.website && (
                  <a href={userDetails.website} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:text-neon-cyan">
                    🔗 Website
                  </a>
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-electric-blue">Skills & Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData?.toolNames?.map((toolName) => (
              <motion.div
                key={toolName.id}
                className="glass p-4 rounded-xl hover-glow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-neon-cyan mb-3">{toolName.name}</h3>
                <div className="space-y-2">
                  {toolName.tools?.map((tool) => (
                    <div key={tool.id} className="pl-4">
                      <p className="text-electric-blue">{tool.name}</p>
                      {tool.components?.map((component) => (
                        <p key={component.id} className="text-foreground/60 pl-4">
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
          className="glass p-8 rounded-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-electric-blue">Education</h2>
          <div className="space-y-4">
            {portfolioData?.userDetails?.education?.map((edu) => (
              <motion.div
                key={edu.id}
                className="glass p-6 rounded-xl hover-glow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-neon-cyan">{edu.degree}</h3>
                <p className="text-electric-blue">{edu.field_of_study}</p>
                <p className="text-foreground/60">{edu.University}</p>
                <p className="text-foreground/60">{edu.location}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-neon-cyan">{edu.start_date} - {edu.end_date}</span>
                  {edu.current_grade && (
                    <span className="text-electric-blue">Grade: {edu.current_grade}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-electric-blue">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData?.userDetails?.project?.map((proj) => (
              <motion.div
                key={proj.id}
                className="glass p-6 rounded-xl hover-glow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-neon-cyan">{proj.name}</h3>
                <p className="text-foreground/80 mt-2">{proj.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-electric-blue">
                    {proj.start_date} - {proj.end_date || 'Present'}
                  </p>
                  {proj.link && proj.link.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.link.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-btn text-sm"
                        >
                          {link.name}
                        </a>
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
          className="glass p-8 rounded-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-electric-blue">Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData?.userDetails?.certificate?.map((cert) => (
              <motion.div
                key={cert.id}
                className="glass p-6 rounded-xl hover-glow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-neon-cyan">{cert.name}</h3>
                <p className="text-electric-blue">{cert.issuing_organization}</p>
                <p className="text-foreground/60">{cert.issue_date}</p>
                {cert.expiry_date && (
                  <p className="text-foreground/60">Expires: {cert.expiry_date}</p>
                )}
                {cert.credential_id && (
                  <p className="text-neon-cyan mt-2">Credential ID: {cert.credential_id}</p>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neon-btn text-sm mt-4 inline-block"
                  >
                    View Certificate
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Page;
