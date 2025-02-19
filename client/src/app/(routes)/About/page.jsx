'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { FaCode, FaUsers, FaLightbulb, FaTrophy } from 'react-icons/fa';
import NitinImage from '../../../../public/Nitin.jpg';
import FareedImage from '../../../../public/Fareed.jpg';

const features = [
  { icon: FaCode, title: "Technical Excellence", description: "We strive for excellence in coding practices and technical innovation." },
  { icon: FaUsers, title: "Community Driven", description: "Building a strong community of passionate developers and learners." },
  { icon: FaLightbulb, title: "Innovation Hub", description: "Fostering creativity and innovative solutions to real-world problems." },
  { icon: FaTrophy, title: "Achievement Focused", description: "Celebrating success and recognizing outstanding contributions." }
];

const teamMembers = [
  { name: "Rehbar Khan", role: "Frontend Developer", image: "/Rehbar.jpg" },
  { name: "Nitin Gupta", role: "UI/UX Designer & Frontend Developer", image: NitinImage },
  { name: "Fareed Sayed", role: "Backend Developer & Machine Learning Engineer", image: FareedImage }
];

function Page() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center bg-black/[0.96] antialiased overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-transparent to-neon-cyan/20 opacity-30" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            About Literacy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-neutral-300 max-w-2xl mx-auto"
          >
            Literacy is an AI-driven educational platform that provides personalized learning roadmaps, AI-curated content, and mentorship opportunities. 🚀
          </motion.p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-electric-blue mb-4">What We Offer</h2>
          <p className="text-neon-cyan">Empowering students with the tools they need to succeed.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-xl hover-glow"
            >
              {React.createElement(feature.icon, { className: "text-4xl text-electric-blue mb-4" })}
              <h3 className="text-xl font-semibold text-neon-cyan mb-2">{feature.title}</h3>
              <p className="text-foreground/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-electric-blue mb-4">Our Team</h2>
          <p className="text-neon-cyan">Meet the people behind Literacy</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-xl text-center hover-glow"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100px, 128px"
                  className="hover:scale-110 transition-transform duration-300"
                  priority={index === 0}
                />
              </div>
              <h3 className="text-lg font-semibold text-electric-blue">{member.name}</h3>
              <p className="text-neon-cyan">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join Section */}
      <div className="py-20 px-4 bg-deep-indigo/10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold text-electric-blue mb-6">Join Our Community</h2>
          <p className="text-neon-cyan mb-8">Be part of something special. Join Literacy today! </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-btn"
          >
            Apply Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;
