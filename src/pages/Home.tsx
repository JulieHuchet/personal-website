import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Layout } from '../components/Layout';

export const Home: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Section with Plan My Quarter and Check Availability cards */}
        <HeroSection />
      </div>
    </Layout>
  );
};
