import HeroSection from '@/components/HeroSection';
import LatestProperties from '@/components/LatestProperties';
import FeaturedCities from '@/components/FeaturedCities';
import ServicesSection from '@/components/ServicesSection';
import StatisticsSection from '@/components/StatisticsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LatestProperties />
      <FeaturedCities />
      <ServicesSection />
      <StatisticsSection />
    </div>
  );
};

export default Index;
