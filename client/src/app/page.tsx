"use client";

import { useEffect } from 'react';

import HomeEventCard from '@/components/HomeEventCard';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline';

export default function Home() {

  return (
    <div>
       <Spline
        scene="https://prod.spline.design/wurwX4evQmLeOqP3/scene.splinecode" 
      />

    
    <div className="" id="root">
      
      
      
      <HomeEventCard />
      <Footer />
    </div>
    </div>
  );
  
}