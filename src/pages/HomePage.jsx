import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ChefSpecials from '../components/home/ChefSpecials';
import StorySection from '../components/home/StorySection';
import Testimonials from '../components/home/Testimonials';
import ReservationBanner from '../components/home/ReservationBanner';

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-6">
      <HeroSection
        onExploreMenu={() => onNavigate('menu')}
        onBookTable={() => onNavigate('reservations')}
      />
      <FeaturesSection />
      <ChefSpecials onExploreMenu={() => onNavigate('menu')} />
      <StorySection />
      <Testimonials />
      <ReservationBanner onBookTable={() => onNavigate('reservations')} />
    </div>
  );
}
