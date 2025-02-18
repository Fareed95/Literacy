'use client'
import React, { useState } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa'
import { motion } from 'framer-motion'

// Variant for fade-in and slide-up animations
const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

function Portfolio() {
  // Personal information and sample data (can be replaced with API calls)
  const [personalInfo] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    about: "Passionate developer with 5+ years of experience in building scalable web applications. Always eager to learn new technologies and solve complex problems.",
    email: "john@example.com",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  })

  const [skills] = useState([
    { category: "Frontend", techs: ["React", "Next.js", "Tailwind CSS", "JavaScript", "TypeScript"] },
    { category: "Backend", techs: ["Node.js", "Python", "Django", "PostgreSQL", "MongoDB"] },
    { category: "Tools", techs: ["Git", "Docker", "AWS", "Firebase", "Vercel"] }
  ])

  const [education] = useState([
    {
      degree: "Master of Computer Science",
      school: "Tech University",
      year: "2020-2022",
      description: "Specialized in Artificial Intelligence and Web Technologies"
    },
    {
      degree: "Bachelor of Engineering",
      school: "Engineering College",
      year: "2016-2020",
      description: "Major in Computer Science"
    }
  ])

  const [certificates] = useState([
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023",
      credential: "XXXX-XXXX-XXXX"
    },
    {
      name: "Google Cloud Professional",
      issuer: "Google",
      year: "2022",
      credential: "YYYY-YYYY-YYYY"
    }
  ])

  const [projects] = useState([
    {
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with Next.js and Node.js",
      tech: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      link: "https://project1.com"
    },
    {
      title: "AI Image Generator",
      description: "Created an AI-powered image generation tool using DALL-E API",
      tech: ["React", "Python", "OpenAI", "AWS"],
      link: "https://project2.com"
    }
  ])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative overflow-hidden"
      >
        <div className="container mx-auto px-4 py-32 relative z-10 text-center">
          <motion.h1 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          >
            {personalInfo.name}
          </motion.h1>
          <motion.h2 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-3xl text-blue-200 mb-8"
          >
            {personalInfo.title}
          </motion.h2>
          <motion.div 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="flex justify-center space-x-8 mb-12"
          >
            <a href={personalInfo.github} className="text-3xl text-cyan-400 hover:text-blue-400 transition-transform hover:scale-110">
              <FaGithub />
            </a>
            <a href={personalInfo.linkedin} className="text-3xl text-cyan-400 hover:text-blue-400 transition-transform hover:scale-110">
              <FaLinkedin />
            </a>
            <a href={`mailto:${personalInfo.email}`} className="text-3xl text-cyan-400 hover:text-blue-400 transition-transform hover:scale-110">
              <FaEnvelope />
            </a>
          </motion.div>
          <motion.div 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <FaArrowDown className="w-6 h-6 text-blue-200 animate-bounce" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-blue-900 transform -skew-y-6"></div>
      </motion.section>
      
      <div className="container mx-auto px-4">
    {/* About Section – Offset Grid */}
    <section className="my-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-[#02577a] p-8 rounded-lg transform md:translate-y-12">
          <h2 className="text-4xl font-bold mb-6 text-[#02a9f7]">
            About Me
          </h2>
          <p className="text-white leading-relaxed text-lg">
            {personalInfo.about}
          </p>
        </div>
        <div className="bg-[#02577a] p-8 rounded-lg transform md:-translate-y-12">
          <h2 className="text-4xl font-bold mb-6 text-[#02a9f7]">
            Quick Facts
          </h2>
          <ul className="space-y-4 text-white">
            <li>🌟 5+ Years Experience</li>
            <li>🎓 Master's in Computer Science</li>
            <li>🌍 Remote Work Enthusiast</li>
            <li>💡 Problem Solver</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Skills Section – Hexagonal-like Grid */}
    <section className="my-32">
      <h2 className="text-4xl font-bold text-center mb-16 text-[#02a9f7]">
        Tech Stack
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skills.map((skillGroup, index) => (
          <div
            key={index}
            className="bg-[#02577a] p-8 rounded-lg transform hover:scale-105 transition-transform"
          >
            <h3 className="text-2xl font-semibold mb-6 text-[#89d6fb]">
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skillGroup.techs.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-black/30 rounded-full text-white text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Education & Certificates – Split Layout */}
    <section className="my-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-bold mb-8 text-[#02a9f7]">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-[#02577a] p-6 rounded-lg border-l-4 border-[#89d6fb]"
              >
                <h3 className="text-xl font-semibold text-[#89d6fb]">
                  {edu.degree}
                </h3>
                <p className="text-[#d4f0fc] mt-2">{edu.school}</p>
                <p className="text-white mt-1">{edu.year}</p>
                <p className="text-white/80 mt-2">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-8 text-[#02a9f7]">
            Certificates
          </h2>
          <div className="space-y-6">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-[#02577a] p-6 rounded-lg border-r-4 border-[#89d6fb]"
              >
                <h3 className="text-xl font-semibold text-[#89d6fb]">
                  {cert.name}
                </h3>
                <p className="text-[#d4f0fc] mt-2">{cert.issuer}</p>
                <p className="text-white mt-1">{cert.year}</p>
                <p className="text-white/80 mt-2">
                  Credential: {cert.credential}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Projects – Alternating Layout */}
    <section className="my-32">
      <h2 className="text-4xl font-bold text-center mb-16 text-[#02a9f7]">
        Projects
      </h2>
      <div className="space-y-12">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
              index % 2 === 0 ? "" : "md:flex-row-reverse"
            }`}
          >
            <div className="bg-[#02577a] p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-[#89d6fb]">
                {project.title}
              </h3>
              <p className="text-white mt-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-black/30 rounded-full text-sm text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div
              className={`bg-[#02577a]/50 p-8 rounded-lg flex justify-center items-center ${
                index % 2 === 0 ? "md:translate-y-8" : "md:-translate-y-8"
              }`}
            >
              <a
                href={project.link}
                className="text-[#89d6fb] hover:text-[#02a9f7] text-xl font-semibold transition-all hover:scale-105"
              >
                View Project →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Download Resume Section – Unique Skewed Gradient Card */}
    <section className="my-32">
      <div className="relative bg-[#02577a] rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#89d6fb] to-[#02a9f7] opacity-50 transform -skew-y-3"></div>
        <div className="relative px-8 py-16 flex flex-col items-center">
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#02a9f7] drop-shadow-lg mb-6"
          >
            Download My Resume
          </motion.h2>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="/resume.pdf"
            download
            className="bg-[#89d6fb] text-black font-semibold px-8 py-4 rounded-full shadow-lg transition-all hover:shadow-2xl"
          >
            Click Here to Download
          </motion.a>
        </div>
      </div>
    </section>
  </div>
</div>

    
  )
}

export default Portfolio;
