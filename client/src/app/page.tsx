"use client";

import { useEffect } from 'react';
import MainInput from '@/components/MainInput';
import PrevCources from '@/components/PrevCources';
import Footer from '@/components/Footer';
import Spline from '@splinetool/react-spline';

export default function Home() {

  return (
    <div>
       <Spline className='min-h-screen'
        scene="https://prod.spline.design/wurwX4evQmLeOqP3/scene.splinecode" 
      />

    
    <div className="" id="root">
      
      <MainInput />
      <PrevCources />

      <Footer />
    </div>
    </div>
  );
  
}