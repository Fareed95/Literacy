'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/app/context/AuthContext';
import SplashCursor from '@/components/SplashCursor';
import { ExternalLink, Globe } from "lucide-react";
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Vortex } from '@/components/ui/vortex';
import { InfiniteMovingText } from '@/components/ui/infinite-moving-text';
import { WavyBackground } from '@/components/ui/wavy-background';



const StatsCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="rounded-xl border border-neutral-700 p-6"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-cyan-500/10">
        <Icon className="w-6 h-6 text-cyan-500" />
      </div>
      <div>
        <p className="text-neutral-400 text-sm">{label}</p>
        <h4 className="text-2xl font-bold text-neutral-200">{value}</h4>
      </div>
    </div>
  </motion.div>
);

// Add SparklesCore component
const SparklesCore = ({ children }) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 2 + 1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-cyan-500/30 rounded-full pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      {children}
    </div>
  );
};

// Modify TextRevealCard to remove background
const TextRevealCard = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-xl"
    >
      <motion.div
        className="relative z-10"
        animate={{
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const Page = ({ params }) => {
  const { email: authEmail } = useAuth();
  const isOwner = authEmail === decodeURIComponent(params.email);
  const { portfolioData, updateUserDetails, loading, error } = usePortfolio(decodeURIComponent(params.email));
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl backdrop-blur-md text-center"
        >
          <p className="text-red-400">Error loading portfolio data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <SparklesCore>
        <SplashCursor />
        <WavyBackground>
        {/* Hero Section */}
        <div className="relative pt-32 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4"
          >
            <TextRevealCard>
              <div className="text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 mb-4"
                >
                  {userDetails.name || 'Portfolio'}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl text-neutral-400 mb-6"
                >
                  {userDetails.title}
                </motion.p>
                {userDetails.bio && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-neutral-300 max-w-2xl mx-auto mb-8"
                  >
                    {userDetails.bio}
                  </motion.p>
                )}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center space-x-6"
                >
                  {userDetails.location && (
                    <span className="text-neutral-400 flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> {userDetails.location}
                    </span>
                  )}
                  {userDetails.website && (
                    <a
                      href={userDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> Website
                    </a>
                  )}
                </motion.div>
              </div>
            </TextRevealCard>
          </motion.div>
        </div>
        </WavyBackground>
        <div className="max-w-7xl mx-auto px-4 space-y-24 pb-32">
          {/* Skills Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <TextRevealCard>
              <div>
                <h2 className="text-3xl font-bold text-neutral-200 mb-8">Skills & Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioData?.toolNames?.map((toolName) => (
                    <motion.div
                      key={toolName.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-xl border border-neutral-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-neutral-200 mb-4">{toolName.name}</h3>
                      <div className="space-y-3">
                        {toolName.tools?.map((tool) => (
                          <div key={tool.id} className="space-y-2">
                            <p className="text-blue-400 font-medium">{tool.name}</p>
                            {tool.components?.map((component) => (
                              <p key={component.id} className="text-neutral-400 pl-4 text-sm">
                                • {component.name}
                              </p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TextRevealCard>
          </motion.section>

          <InfiniteMovingText />

          {/* Education Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <TextRevealCard>
              <div>
                <h2 className="text-3xl font-bold text-neutral-200 mb-8">Education</h2>
                <div className="space-y-6">
                  {portfolioData?.userDetails?.education?.map((edu) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 rounded-xl border border-neutral-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-200">{edu.degree}</h3>
                          <p className="text-blue-400 mt-2">{edu.field_of_study}</p>
                          <p className="text-neutral-400 mt-1">{edu.University}</p>
                          <p className="text-neutral-400">{edu.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-neutral-300">{edu.start_date} - {edu.end_date}</p>
                          {edu.current_grade && (
                            <p className="text-blue-400 mt-2">Grade: {edu.current_grade}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TextRevealCard>
          </motion.section>

          {/* Projects Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <TextRevealCard>
              <div>
                <h2 className="text-3xl font-bold text-neutral-200 mb-8">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioData?.userDetails?.project?.map((proj) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-xl border border-neutral-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-neutral-200">{proj.name}</h3>
                      <p className="text-neutral-400 mt-4">{proj.description}</p>
                      <div className="mt-6">
                        <p className="text-blue-400">
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
                                className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300 text-sm"
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
              </div>
            </TextRevealCard>
          </motion.section>

          {/* Certificates Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <TextRevealCard>
              <div>
                <h2 className="text-3xl font-bold text-neutral-200 mb-8">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioData?.userDetails?.certificate?.map((cert) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-xl border border-neutral-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-neutral-200">{cert.name}</h3>
                      <p className="text-blue-400 mt-2">{cert.issuing_organization}</p>
                      <p className="text-neutral-400 mt-4">Issued: {cert.issue_date}</p>
                      {cert.expiry_date && (
                        <p className="text-neutral-400">Expires: {cert.expiry_date}</p>
                      )}
                      {cert.credential_id && (
                        <p className="text-blue-400 mt-2">Credential ID: {cert.credential_id}</p>
                      )}
                      {cert.credential_url && (
                        <motion.a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 mt-4 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Certificate
                        </motion.a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </TextRevealCard>
          </motion.section>
        </div>
      </SparklesCore>

      {/* Edit Profile Button - Only visible to owner */}
      {isOwner && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300"
        >
          Edit Profile
        </motion.button>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900/80 p-8 rounded-2xl max-w-2xl w-full mx-4 border border-neutral-800 backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold text-neutral-200 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateUserDetails} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 block mb-2">Name</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-2">Title</label>
                  <input
                    type="text"
                    value={userDetails.title}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block mb-2">Bio</label>
                <textarea
                  value={userDetails.bio}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 block mb-2">Location</label>
                  <input
                    type="text"
                    value={userDetails.location}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-2">Website</label>
                  <input
                    type="url"
                    value={userDetails.website}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300"
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