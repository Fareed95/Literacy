"use client";

import { useEffect } from 'react';
import Herotext from '@/components/Herotext';
import HomeEventCard from '@/components/HomeEventCard';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline/next';
import { Spotlight } from "@/components/ui/Spotlight";
import { buttons } from '@/components/Buttons'; // Import the buttons array
import React from 'react';

export default function Home() {
  // Find the Playlist button from the buttons array
  const playlistButton = buttons.find((button) => button.name === "Playlist");

  return (
    <div className="min-h-screen" id="root">
      <div className='mt-[15vh]'> {/* Reduced the margin-top */}
        <Spline
          scene="https://prod.spline.design/SEtXNDI9u2wUw6jp/scene.splinecode" 
        />
      </div>

      <div>
        <div className="min-h-screen">
          <Spotlight
            className="-top-45 left-5 sm:left-60 sm:-top-20"
            fill="white"
          />
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 mt-4"> {/* Reduced margin-top */}
            <h1 className="text-6xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              GET STARTED 
            </h1>
            <div className="mt-4 max-w-4xl mx-auto px-4 text-center font-serif text-xl md:text-2xl text-neutral-200 leading-relaxed space-y-4">
              <p>🚀 <strong>Literacyy takes education to the next level</strong> by:</p>
              <ul className="list-none space-y-3 text-left mx-auto max-w-3xl">
                <li>📌 <strong>Eliminating the tedious research phase</strong> for students.</li>
                <li>📌 <strong>Providing structured roadmaps</strong> to guide learners step by step.</li>
                <li>📌 <strong>Scraping the best resources</strong> from the web to save time and enhance focus.</li>
                <li>📌 <strong>Ensuring direct access</strong> to high-quality study materials.</li>
              </ul>
              <p className="italic">🎯 Making skill acquisition <strong>seamless, efficient, and stress-free!</strong></p>
              <p className="font-bold text-neutral-100">🌟 Step into the future of learning with <strong>Literacyy</strong>—where knowledge is just a click away!</p>
            </div>

            {/* Playlist Button Right After "GET STARTED" */}
            <div className="flex justify-center items-center my-4"> {/* Adjusted the gap */}
              {playlistButton ? (
                <div>
                  <div>{React.cloneElement(playlistButton.component, { children: "Get started" })}</div>
                </div> 
              ) : (
                <p>Playlist button not found</p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Next Section - How to use Literacy */}
      <div className="mt-0"> {/* Removed margin-top completely */}
        <div className="min-h-screen">
          <Spotlight
            className="-top-45 left-5 sm:left-60 sm:-top-20"
            fill="white"
          />
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 mt-0"> {/* Removed margin-top */}
            <h1 className="text-6xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              How to use Literacy ??  
            </h1>
            <div className="mt-4 max-w-4xl mx-auto px-4 text-center font-serif text-xl md:text-2xl text-neutral-200 leading-relaxed space-y-4">
              <p>🚀 <strong>Literacyy takes education to the next level</strong> by:</p>
              <ul className="list-none space-y-3 text-left mx-auto max-w-3xl">
                <li>📌 <strong>Eliminating the tedious research phase</strong> for students.</li>
                <li>📌 <strong>Providing structured roadmaps</strong> to guide learners step by step.</li>
                <li>📌 <strong>Scraping the best resources</strong> from the web to save time and enhance focus.</li>
                <li>📌 <strong>Ensuring direct access</strong> to high-quality study materials.</li>
              </ul>
              <p className="italic">🎯 Making skill acquisition <strong>seamless, efficient, and stress-free!</strong></p>
              <p className="font-bold text-neutral-100">🌟 Step into the future of learning with <strong>Literacyy</strong>—where knowledge is just a click away!</p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
