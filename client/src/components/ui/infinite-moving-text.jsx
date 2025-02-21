'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const InfiniteMovingText = ({
  items = ["Nitin", "Rehbar", "Fareed"],
  direction = "left",
  speed = "fast",
  className = "",
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clone items multiple times for smoother infinite scroll
      const scrollerContent = Array.from(scrollerRef.current.children);
      for (let i = 0; i < 3; i++) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          scrollerRef.current.appendChild(duplicatedItem);
        });
      }
      setStart(true);
    }
  }

  const speedValue = {
    fast: 8, // Increased speed
    normal: 15,
    slow: 25,
  };

  const textItems = items.map((item, idx) => (
    <div
      key={idx}
      className="group relative px-6 py-3 mx-4"
    >
      <div className="relative z-10">
        <span className="text-3xl md:text-4xl font-bold text-white">
          {item}
        </span>
      </div>
      <div className="absolute inset-0 border-2 border-white/20 rounded-lg group-hover:border-white/40 transition-all duration-200" />
    </div>
  ));

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${className}`}
    >
      <motion.div
        ref={scrollerRef}
        className="flex whitespace-nowrap py-8"
        animate={start ? {
          x: direction === "left" ? [0, -50 * items.length * 20] : [50 * items.length * 20, 0],
        } : {}}
        transition={{
          duration: speedValue[speed] * items.length,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {textItems}
      </motion.div>
    </div>
  );
};

// Example usage:
// <InfiniteMovingText 
//   items={["Nitin", "Rehbar", "Fareed"]} 
//   direction="left" 
//   speed="fast" 
//   className="my-8"
// /> 