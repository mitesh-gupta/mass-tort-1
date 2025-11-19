'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import InfoBoxes from '@/components/info-boxes';
import StepsSection from '@/components/steps-section';
import ApplicationForm from '@/components/application-form';
import Footer from '@/components/footer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && (
        <>
          <HeroSection setCurrentPage={setCurrentPage} />
          <InfoBoxes />
          <StepsSection />
        </>
      )}
      
      {currentPage === 'form' && (
        <ApplicationForm setCurrentPage={setCurrentPage} />
      )}
      
      <Footer />
    </div>
  );
}
