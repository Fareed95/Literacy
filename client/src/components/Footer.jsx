import React from 'react';
import Map from './Map';
import Image from 'next/image';
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { LinkPreview } from "@/components/ui/link-preview";

function Footer() {
  const people = [
    {
      id: 1,
      name: "Fareed Sayyed",
      designation: "ML and Backend Developer",
      image: "https://avatars.githubusercontent.com/u/143815597?v=4",
      github: "https://github.com/Fareed95",
    },
    {
      id: 2,
      name: "Rehbar Khan",
      designation: "Frontend Developer",
      image: "https://avatars.githubusercontent.com/u/136853370?v=4",
      github: "https://github.com/thisisarsh1",
    }
  ];

  return (
    <div className='flex flex-col'>
      <footer className={cn("py-6 glass")}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 glass p-6 rounded-xl hover-glow">
              <h4 className="text-lg font-semibold text-electric-blue">About Us</h4>
              <p className="text-foreground/80">
                CodeCell at Rizvi College of Engineering fosters a vibrant tech culture, uniting passionate students to learn, collaborate, and innovate. Our mission is to create a supportive community through workshops, hackathons, and competitions, enabling members to experiment, connect, and excel while contributing to shared growth and achievement. Join us!
              </p>
            </div>

            <div className="space-y-4 glass p-6 rounded-xl hover-glow">
              <h4 className="text-lg font-semibold text-neon-cyan">Contributors</h4>
              <div className="flex flex-row items-center justify-center mb-10 w-full">
                {people.map((person) => (
                  <Link 
                    key={person.id} 
                    href={person.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="transform transition-transform hover:scale-105"
                  >
                    <div className="cursor-pointer floating">
                      <AnimatedTooltip items={[person]} />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="flex items-center space-x-2">
                  <span className="text-electric-blue">Email:</span>
                  <span>codecell@eng.rizvi.edu.in</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-electric-blue">Address:</span>
                  <span>Rizvi Educational Complex Off Carter Road, Sherly Rajan Rd, Bandra West, Mumbai, Maharashtra 400050</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-soft-purple pt-4 text-center glass p-4 rounded-xl">
            <p className="text-neon-cyan">&copy; 2024 Code Cell RCOE. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <LinkPreview 
                url="https://www.instagram.com/cc_rcoe/profilecard/?igsh=MW54bHhrdDJjcXFuaw==" 
                className="neon-btn inline-block"
              >
                Instagram
              </LinkPreview>
              <LinkPreview 
                url="https://www.linkedin.com/company/code-cell-rcoe/" 
                className="neon-btn inline-block"
              >
                LinkedIn
              </LinkPreview>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;