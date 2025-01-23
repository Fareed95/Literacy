"use client";

import { useEffect } from 'react';
import Herotext from '@/components/Herotext';
import HomeEventCard from '@/components/HomeEventCard';
import Footer from '@/components/Footer';



export default function Home() {

  return (
    <div className="min-h-screen" id="root">
      <Herotext />
      <HomeEventCard />
      <Footer />
    </div>
  );
  
}