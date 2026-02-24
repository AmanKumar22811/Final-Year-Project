import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Illustration from '../components/Illustration';
import Footer from '../components/Footer';
import '../App.css';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with wave patterns and illustration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[90%] max-w-2xl lg:max-w-3xl ml-auto opacity-80">
          <Illustration />
        </div>
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path d="M0,200 Q300,150 600,200 T1200,200 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.6" />
          <path d="M0,300 Q400,250 800,300 T1200,300 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.4" />
          <path d="M0,400 Q350,350 700,400 T1200,400 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.3" />
        </svg>
      </div>
      <div className="relative z-10">
        <Header />
        <Hero />
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Home;
