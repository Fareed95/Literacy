'use client'
import React, { useState } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown, FaCode, FaGraduationCap, FaAward, FaProjectDiagram, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'

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

function Portfolio() {
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

  const [showJobModal, setShowJobModal] = useState(false);
  const [jobApplication, setJobApplication] = useState({
    name: '',
    email: '',
    position: '',
    experience: '',
    portfolio: '',
    message: ''
  });

  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer"
  ];

  const handleJobApplication = (e) => {
    e.preventDefault();
    // Handle job application submission here
    console.log('Job Application:', jobApplication);
    setShowJobModal(false);
    // Reset form
    setJobApplication({
      name: '',
      email: '',
      position: '',
      experience: '',
      portfolio: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-transparent to-neon-cyan/20 opacity-30" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-7xl font-bold mb-4 bg-gradient-to-r from-electric-blue to-neon-cyan text-transparent bg-clip-text"
          >
            {personalInfo.name}
          </motion.h1>
          <motion.h2 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="text-3xl text-soft-purple mb-8"
          >
            {personalInfo.title}
          </motion.h2>
          <motion.div 
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="flex justify-center space-x-8 mb-12"
          >
            <motion.a 
              whileHover={{ scale: 1.1, y: -5 }}
              href={personalInfo.github} 
              className="text-3xl text-electric-blue hover:text-neon-cyan transition-colors"
            >
              <FaGithub />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, y: -5 }}
              href={personalInfo.linkedin} 
              className="text-3xl text-electric-blue hover:text-neon-cyan transition-colors"
            >
              <FaLinkedin />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, y: -5 }}
              href={`mailto:${personalInfo.email}`} 
              className="text-3xl text-electric-blue hover:text-neon-cyan transition-colors"
            >
              <FaEnvelope />
            </motion.a>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center"
          >
            <FaArrowDown className="w-6 h-6 text-neon-cyan" />
          </motion.div>
        </div>
      </motion.section>
      
      <div className="container mx-auto px-4 py-20">
        {/* About Section */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              variants={itemVariant}
              className="glass p-8 rounded-2xl transform md:translate-y-12"
            >
              <div className="flex items-center space-x-4 mb-6">
                <FaCode className="text-3xl text-electric-blue" />
                <h2 className="text-4xl font-bold text-electric-blue">
                  About Me
                </h2>
              </div>
              <p className="text-neon-cyan leading-relaxed text-lg">
                {personalInfo.about}
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariant}
              className="glass p-8 rounded-2xl transform md:-translate-y-12"
            >
              <div className="flex items-center space-x-4 mb-6">
                <FaGraduationCap className="text-3xl text-electric-blue" />
                <h2 className="text-4xl font-bold text-electric-blue">
                  Quick Facts
                </h2>
              </div>
              <ul className="space-y-4 text-neon-cyan">
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🌟</span>
                  <span>5+ Years Experience</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🎓</span>
                  <span>Master's in Computer Science</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <span>Remote Work Enthusiast</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">💡</span>
                  <span>Problem Solver</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-electric-blue inline-flex items-center space-x-4">
              <FaCode />
              <span>Tech Stack</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="glass p-8 rounded-2xl hover-glow"
              >
                <h3 className="text-2xl font-semibold text-electric-blue mb-6">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skillGroup.techs.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 glass rounded-full text-neon-cyan text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education & Certificates */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <FaGraduationCap className="text-3xl text-electric-blue" />
                <h2 className="text-4xl font-bold text-electric-blue">
                  Education
                </h2>
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariant}
                    className="glass p-6 rounded-2xl border-l-4 border-electric-blue hover-glow"
                  >
                    <h3 className="text-xl font-semibold text-electric-blue">
                      {edu.degree}
                    </h3>
                    <p className="text-neon-cyan mt-2">{edu.school}</p>
                    <p className="text-soft-purple mt-1">{edu.year}</p>
                    <p className="text-foreground/60 mt-2">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <FaAward className="text-3xl text-electric-blue" />
                <h2 className="text-4xl font-bold text-electric-blue">
                  Certificates
                </h2>
              </div>
              <div className="space-y-6">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariant}
                    className="glass p-6 rounded-2xl border-r-4 border-neon-cyan hover-glow"
                  >
                    <h3 className="text-xl font-semibold text-electric-blue">
                      {cert.name}
                    </h3>
                    <p className="text-neon-cyan mt-2">{cert.issuer}</p>
                    <p className="text-soft-purple mt-1">{cert.year}</p>
                    <p className="text-foreground/60 mt-2">
                      Credential: {cert.credential}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-electric-blue inline-flex items-center space-x-4">
              <FaProjectDiagram />
              <span>Projects</span>
            </h2>
          </div>
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="glass p-8 rounded-2xl hover-glow">
                  <h3 className="text-2xl font-semibold text-electric-blue">
                    {project.title}
                  </h3>
                  <p className="text-neon-cyan mt-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 glass rounded-full text-sm text-soft-purple"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`glass p-8 rounded-2xl flex justify-center items-center ${
                    index % 2 === 0 ? "md:translate-y-8" : "md:-translate-y-8"
                  }`}
                >
                  <a
                    href={project.link}
                    className="text-electric-blue hover:text-neon-cyan text-xl font-semibold transition-all group"
                  >
                    View Project 
                    <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Job Application Section */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-electric-blue inline-flex items-center space-x-4">
              <FaUsers className="mr-4" />
              <span>Work With Us</span>
            </h2>
            <p className="text-neon-cyan mt-4">Join our team and be part of something amazing</p>
          </div>

          <motion.div
            variants={itemVariant}
            className="glass p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/5 rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-electric-blue mb-4">Open Positions</h3>
                  <div className="space-y-3">
                    {positions.map((position, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-4 rounded-xl flex items-center justify-between hover-glow cursor-pointer"
                        onClick={() => {
                          setJobApplication(prev => ({ ...prev, position }));
                          setShowJobModal(true);
                        }}
                      >
                        <span className="text-neon-cyan">{position}</span>
                        <span className="text-electric-blue">→</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-electric-blue mb-4">Why Join Us?</h3>
                  <ul className="space-y-4 text-neon-cyan">
                    <li className="flex items-center space-x-3">
                      <span className="text-2xl">🚀</span>
                      <span>Exciting Projects & Innovation</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <span>Learning & Growth Opportunities</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-2xl">🌟</span>
                      <span>Competitive Benefits</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-2xl">👥</span>
                      <span>Great Team Culture</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Application Modal */}
          {showJobModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-electric-blue">Apply for {jobApplication.position}</h3>
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="text-neon-cyan hover:text-electric-blue"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleJobApplication} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-neon-cyan mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={jobApplication.name}
                        onChange={(e) => setJobApplication(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full glass p-3 rounded-xl text-electric-blue focus:ring-2 focus:ring-electric-blue/50"
                      />
                    </div>
                    <div>
                      <label className="block text-neon-cyan mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={jobApplication.email}
                        onChange={(e) => setJobApplication(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full glass p-3 rounded-xl text-electric-blue focus:ring-2 focus:ring-electric-blue/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neon-cyan mb-2">Years of Experience</label>
                    <input
                      type="text"
                      required
                      value={jobApplication.experience}
                      onChange={(e) => setJobApplication(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full glass p-3 rounded-xl text-electric-blue focus:ring-2 focus:ring-electric-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-neon-cyan mb-2">Portfolio/GitHub URL</label>
                    <input
                      type="url"
                      value={jobApplication.portfolio}
                      onChange={(e) => setJobApplication(prev => ({ ...prev, portfolio: e.target.value }))}
                      className="w-full glass p-3 rounded-xl text-electric-blue focus:ring-2 focus:ring-electric-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-neon-cyan mb-2">Why do you want to join us?</label>
                    <textarea
                      required
                      value={jobApplication.message}
                      onChange={(e) => setJobApplication(prev => ({ ...prev, message: e.target.value }))}
                      rows="4"
                      className="w-full glass p-3 rounded-xl text-electric-blue focus:ring-2 focus:ring-electric-blue/50"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="neon-btn w-full"
                  >
                    Submit Application
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* Download Resume */}
        <motion.section 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="relative glass rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-neon-cyan opacity-20" />
            <div className="relative px-8 py-16 flex flex-col items-center">
              <motion.h2
                variants={itemVariant}
                className="text-4xl font-bold text-electric-blue mb-6"
              >
                Download My Resume
              </motion.h2>
              <motion.a
                variants={itemVariant}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                download
                className="neon-btn"
              >
                Download CV
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Portfolio;
