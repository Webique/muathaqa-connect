import { Button } from '@/components/ui/button';
import { Search, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchFilters from './SearchFilters';
import heroImage from '@/assets/hero-real-estate.jpg';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-fade-up">
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="btn-hero text-lg px-8 py-4 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Search className="h-5 w-5 mr-2" />
              {t('hero.cta.search')}
            </Button>
            
            <a
              href="https://wa.me/966551888193"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-secondary backdrop-blur-sm text-lg px-8 py-4 animate-scale-in"
                style={{ animationDelay: '0.4s' }}
              >
                <Phone className="h-5 w-5 mr-2" />
                {t('hero.cta.contact')}
              </Button>
            </a>
          </div>
        </div>

        {/* Search Filters */}
        <div 
          className="max-w-6xl mx-auto animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <SearchFilters variant="hero" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;