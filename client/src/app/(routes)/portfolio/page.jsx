'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import SplashCursor from '@/components/SplashCursor'
import { 
  ExternalLink,
  Github,
  Code,
} from "lucide-react";

const InfiniteMovingCards = ({ items, direction = "left", speed = "fast" }) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current.appendChild(duplicatedItem);
      });

      setStart(true);
    }
  }

  const speedValue = {
    fast: 25,
    normal: 35,
    slow: 45,
  };

  return (
    <div
      ref={containerRef}
      className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
    >
      <motion.div
        ref={scrollerRef}
        className="flex min-w-full shrink-0 gap-4 py-4"
        animate={start ? {
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        } : {}}
        transition={{
          duration: speedValue[speed],
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items}
      </motion.div>
    </div>
  );
};

const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-neutral-900" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
  </div>
);

const SkillCard = ({ skill, tools }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group relative overflow-hidden rounded-xl bg-neutral-900/50 border border-neutral-800 p-6 backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <h3 className="text-xl font-semibold text-neutral-200 mb-4">{skill}</h3>
    <div className="space-y-2">
      {tools.map((tool, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-cyan-500" />
          <span className="text-neutral-400">{tool}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const ProjectCard = ({ project }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="group relative bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-neutral-200">{project.name}</h3>
        <div className="flex space-x-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-cyan-500 transition-colors">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      <p className="text-neutral-400 text-sm mb-4">{project.description}</p>
      <div className="flex gap-2 flex-wrap">
        {project.tech_stack?.map((tech, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

// const StatsCard = ({ icon: Icon, label, value }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 backdrop-blur-sm"
//   >
//     <div className="flex items-center gap-4">
//       <div className="p-3 rounded-lg bg-cyan-500/10">
//         <Icon className="w-6 h-6 text-cyan-500" />
//       </div>
//       <div>
//         <p className="text-neutral-400 text-sm">{label}</p>
//         <h4 className="text-2xl font-bold text-neutral-200">{value}</h4>
//       </div>
//     </div>
//   </motion.div>
// );

const ContainerScroll = ({ children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        scale,
      }}
      className="h-full w-full"
    >
      <motion.div
        style={{
          translateY: translate,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const Card3D = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className="relative preserve-3d"
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

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
  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    // Your existing fetch logic here
  }, []);

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
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading portfolio data</p>
      </div>
    );
  }

  const projectCards = projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ));

  return (
    <div className="min-h-screen relative text-center">
      <BackgroundGradient />
      <SplashCursor />
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold text-white'>Portfolio</h1>
        <div className='flex flex-col items-center justify-center'>
        <p className='text-neutral-400 text-sm'>Portfolio is under construction</p>
        </div>
      </div>
    </div>
  );
};

export default Page;