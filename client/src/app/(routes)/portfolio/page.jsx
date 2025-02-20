'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePortfolio } from '@/hooks/usePortfolio'

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
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone_number: '',
    about: '',
  });

  const { portfolioData, loading, error, updateUserDetails } = usePortfolio(session?.user?.email);

  useEffect(() => {
    if (portfolioData.userDetails) {
      console.log('Portfolio Data:', portfolioData);
      setUserDetails({
        name: portfolioData.userDetails.name || '',
        email: portfolioData.userDetails.email || '',
        phone_number: portfolioData.userDetails.phone_number || '',
        about: portfolioData.userDetails.about || '',
      });
    }
  }, [portfolioData.userDetails]);

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(userDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user details:', error);
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
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="glass p-4 rounded-xl mb-6">
          <nav className="flex flex-wrap gap-4">
            {['about', 'tools', 'education', 'certificates', 'projects'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeSection === section
                    ? "neon-btn"
                    : "hover:bg-deep-indigo/20"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="glass p-6 rounded-xl">
          <div className="space-y-6">
            {/* About Section */}
            {activeSection === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-electric-blue">About Me</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="neon-btn"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateUserDetails} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neon-cyan mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={userDetails.name}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full glass px-4 py-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neon-cyan mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userDetails.email}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full glass px-4 py-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neon-cyan mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userDetails.phone_number || ''}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, phone_number: e.target.value }))}
                          className="w-full glass px-4 py-2 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neon-cyan mb-1">
                        About
                      </label>
                      <textarea
                        value={userDetails.about || ''}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, about: e.target.value }))}
                        rows={4}
                        className="w-full glass px-4 py-2 rounded-lg"
                      />
                    </div>
                    <button type="submit" className="neon-btn">
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-neon-cyan">Name</p>
                        <p className="text-electric-blue text-lg">{userDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-neon-cyan">Email</p>
                        <p className="text-electric-blue text-lg">{userDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-neon-cyan">Phone Number</p>
                        <p className="text-electric-blue text-lg">{userDetails.phone_number || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-neon-cyan">About</p>
                      <p className="text-electric-blue">{userDetails.about || 'No description provided'}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tools Section */}
            {activeSection === 'tools' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-electric-blue">Skills & Tools</h2>
                </div>

                <div className="space-y-6">
                  {portfolioData.userDetails?.toolname.map((toolName) => (
                    <div key={toolName.id} className="glass p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-neon-cyan mb-4">{toolName.name}</h3>
                      {toolName.tools.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {toolName.tools.map((tool) => (
                            <div key={tool.id} className="glass p-4 rounded-lg">
                              <h4 className="text-lg font-medium text-electric-blue">{tool.name}</h4>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-foreground/60">No tools added yet</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-electric-blue">Education</h2>
                </div>

                <div className="space-y-6">
                  {portfolioData.userDetails?.education.map((edu) => (
                    <div key={edu.id} className="glass p-6 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-electric-blue">{edu.degree}</h3>
                          <p className="text-neon-cyan mt-1">{edu.field_of_study}</p>
                          <p className="text-soft-purple mt-1">{edu.University}</p>
                          <p className="text-foreground/60 mt-1">{edu.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-cyan">
                            {new Date(edu.start_date).toLocaleDateString()} - {' '}
                            {new Date(edu.end_date).toLocaleDateString()}
                          </p>
                          {edu.current_grade && (
                            <p className="text-electric-blue mt-1">Grade: {edu.current_grade}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certificates Section */}
            {activeSection === 'certificates' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-electric-blue">Certificates</h2>
                </div>

                <div className="space-y-6">
                  {portfolioData.userDetails?.certificate.map((cert) => (
                    <div key={cert.id} className="glass p-6 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-electric-blue">{cert.name}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-neon-cyan">
                              Test Series Attempted: {cert.additionol_testseries_attempted}
                            </p>
                            <p className="text-neon-cyan">
                              Competitions: {cert.competition_battled} battled, {cert.competition_won} won
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-soft-purple">
                            {new Date(cert.started_at).toLocaleDateString()} - {' '}
                            {new Date(cert.ended_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-electric-blue">Projects</h2>
                </div>

                <div className="space-y-6">
                  {portfolioData.userDetails?.project.map((proj) => (
                    <div key={proj.id} className="glass p-6 rounded-xl">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-electric-blue">{proj.name}</h3>
                          <p className="text-neon-cyan mt-2">{proj.description}</p>
                        </div>

                        {proj.link && proj.link.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-soft-purple">Project Links</h4>
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
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
