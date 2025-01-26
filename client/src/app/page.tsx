"use client";

import { useEffect } from 'react';
import Herotext from '@/components/Herotext';
import HomeEventCard from '@/components/HomeEventCard';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline/next'


export default function Home() {

  return (
    <div className="min-h-screen" id="root">
      
    <div className='mt-[10vh]'>
    
      <Spline
        scene="https://prod.spline.design/SEtXNDI9u2wUw6jp/scene.splinecode" 
      />
    </div>
      <HomeEventCard />
      <Footer />
    </div>
  );
  
}