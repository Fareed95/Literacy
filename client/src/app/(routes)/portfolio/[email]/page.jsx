'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useAuth } from '@/app/context/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {/* Hero Section */}
      <div className="relative pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-cyan">
            {userDetails.name || 'Portfolio'}
          </h1>
          <p className="text-2xl mt-4 text-soft-purple">{userDetails.title}</p>
          {userDetails.bio && (
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
              {userDetails.bio}
            </p>
          )}
          <div className="flex items-center justify-center space-x-6 mt-8">
            {userDetails.location && (
              <span className="text-gray-400 flex items-center">
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-cyan">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData?.toolNames?.map((toolName) => (
              <motion.div
                key={toolName.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-900/50 p-6 rounded-xl border border-gray-800 hover:border-electric-blue/50 transition-colors"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan mb-4">{toolName.name}</h3>
                <div className="space-y-3">
                  {toolName.tools?.map((tool) => (
                    <div key={tool.id} className="space-y-2">
                      <p className="text-electric-blue font-medium">{tool.name}</p>
                      {tool.components?.map((component) => (
                        <p key={component.id} className="text-gray-400 pl-4 text-sm">
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-cyan">
            Education
          </h2>
          <div className="space-y-8">
            {portfolioData?.userDetails?.education?.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-neutral-900/50 p-8 rounded-xl border border-gray-800"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-neon-cyan">{edu.degree}</h3>
                    <p className="text-electric-blue mt-2">{edu.field_of_study}</p>
                    <p className="text-gray-400 mt-1">{edu.University}</p>
                    <p className="text-gray-400">{edu.location}</p>
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-cyan">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData?.userDetails?.project?.map((proj) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-900/50 p-8 rounded-xl border border-gray-800"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan">{proj.name}</h3>
                <p className="text-gray-400 mt-4">{proj.description}</p>
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
                          className="px-4 py-2 rounded-lg bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20 transition-colors text-sm"
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-cyan">
            Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData?.userDetails?.certificate?.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-900/50 p-8 rounded-xl border border-gray-800"
              >
                <h3 className="text-2xl font-semibold text-neon-cyan">{cert.name}</h3>
                <p className="text-electric-blue mt-2">{cert.issuing_organization}</p>
                <p className="text-gray-400 mt-4">Issued: {cert.issue_date}</p>
                {cert.expiry_date && (
                  <p className="text-gray-400">Expires: {cert.expiry_date}</p>
                )}
                {cert.credential_id && (
                  <p className="text-neon-cyan mt-2">Credential ID: {cert.credential_id}</p>
                )}
                {cert.credential_url && (
                  <motion.a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 mt-4 rounded-lg bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20 transition-colors text-sm"
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

      {/* Edit Profile Button - Only visible to owner */}
      {isOwner && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(true)}
          className="fixed bottom-8 right-8 px-6 py-3 rounded-lg bg-electric-blue text-white hover:bg-neon-cyan transition-colors"
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
            className="bg-neutral-900 p-8 rounded-2xl max-w-2xl w-full mx-4 border border-gray-800"
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
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Title</label>
                  <input
                    type="text"
                    value={userDetails.title}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Bio</label>
                  <textarea
                    value={userDetails.bio}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none h-32"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Location</label>
                  <input
                    type="text"
                    value={userDetails.location}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neon-cyan block mb-2">Website</label>
                  <input
                    type="url"
                    value={userDetails.website}
                    onChange={(e) => setUserDetails(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-neutral-800 px-4 py-2 rounded-lg border border-gray-700 focus:border-electric-blue focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-electric-blue text-white hover:bg-neon-cyan transition-colors"
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