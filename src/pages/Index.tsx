import HeroSection from '@/components/HeroSection';
import FeaturedCities from '@/components/FeaturedCities';
import ServicesSection from '@/components/ServicesSection';
import StatisticsSection from '@/components/StatisticsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCities />
      <ServicesSection />
      <StatisticsSection />
    </div>
  );
};

export default Index;
