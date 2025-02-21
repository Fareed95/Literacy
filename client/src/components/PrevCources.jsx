"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useUserContext } from '@/app/context/Userinfo';
import { motion } from 'framer-motion';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

function PrevCources() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const { contextemail } = useUserContext();

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  useEffect(() => {
    if (contextemail && MODEL_API_SERVER) {
      fetch(`${MODEL_API_SERVER}/user-roadmaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contextemail }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch roadmaps');
          }
          return response.json();
        })
        .then((data) => {
          setRoadmaps(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [contextemail, MODEL_API_SERVER]);

  const handleCardClick = (roadmap) => {
    setRoadmap({ roadmap_id: roadmap.id });
    router.push('/Learning');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="relative min-h-screen py-12 px-4 md:px-8">
      <HeroBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-electric-blue">Your Learning Journey</h2>
          <p className="text-neon-cyan text-lg">Continue where you left off or start something new</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl overflow-hidden hover-glow cursor-pointer transform transition-all duration-300"
              onClick={() => handleCardClick(roadmap)}
            >
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-electric-blue">{roadmap.name}</h3>
                  <div className="h-1 w-24 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full" />
                </div>

                {roadmap.roadmap_json?.roadmap_components?.length > 0 ? (
                  <div className="space-y-4">
                    {roadmap.roadmap_json.roadmap_components.map((component, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-4 rounded-xl backdrop-blur-sm"
                      >
                        <h4 className="text-lg font-semibold text-neon-cyan mb-2">
                          {component.name}
                        </h4>
                        <p className="text-foreground/80 text-sm line-clamp-2">
                          {component.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="glass p-4 rounded-xl text-center">
                    <p className="text-foreground/60">No components available yet</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-soft-purple">Progress</span>
                    <div className="h-2 w-24 bg-deep-indigo/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-electric-blue to-neon-cyan"
                        style={{ width: `${(roadmap.roadmap_json?.roadmap_components?.length || 0) * 20}%` }}
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="neon-btn text-sm"
                  >
                    Continue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {roadmaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-foreground/60">No roadmaps available. Start your learning journey today!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-btn mt-4"
              onClick={() => router.push('/')}
            >
              Create New Roadmap
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default PrevCources;
