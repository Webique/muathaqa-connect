import { useState, useEffect, useRef } from 'react';
import { TrendingUp, FileText, Building, Users, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { statistics } from '@/data/propertyData';

const StatisticsSection = () => {
  const { t, isRTL } = useLanguage();
  const [counters, setCounters] = useState<number[]>(statistics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const statIcons = {
    contracts: FileText,
    real_estate: Building,
    authority: TrendingUp,
    ejar: Users,
    satisfaction: Star,
  };

  // Animate counters when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          statistics.forEach((stat, index) => {
            const increment = stat.value / 100;
            let current = 0;
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = current;
                return newCounters;
              });
            }, 20);
          });
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const formatNumber = (num: number, hasDecimal: boolean = false) => {
    if (hasDecimal) {
      return num.toFixed(1);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-secondary text-secondary-foreground relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers'}
          </h2>
          <p className={`text-lg text-white/80 max-w-2xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? 'أرقام تعكس التزامنا وثقة عملائنا بخدماتنا المتميزة'
              : 'Numbers that reflect our commitment and our clients\' trust in our exceptional services'
            }
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {statistics.map((stat, index) => {
            const IconComponent = statIcons[stat.key as keyof typeof statIcons];
            const isDecimal = stat.key === 'satisfaction';
            
            return (
              <div
                key={stat.key}
                className="text-center group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 group-hover:bg-white/20">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>

                {/* Number */}
                <div className="mb-4">
                  <span className="counter text-4xl md:text-5xl font-bold text-white block">
                    {formatNumber(counters[index], isDecimal)}
                    {stat.unit && (
                      <span className="text-primary ml-1">{stat.unit}</span>
                    )}
                    {!isDecimal && stat.value > 0 && (
                      <span className="text-primary">+</span>
                    )}
                  </span>
                </div>

                {/* Label */}
                <p className={`text-white/90 font-medium leading-relaxed ${
                  isRTL ? 'font-arabic text-sm' : 'text-base'
                }`}>
                  {isRTL ? stat.ar : stat.en}
                </p>

                {/* Decorative Line */}
                <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
            <p className={`text-lg text-white/90 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL 
                ? 'نفخر بكوننا من المؤسسات الرائدة في قطاع العقار بالمنطقة الشرقية'
                : 'We are proud to be one of the leading institutions in the real estate sector in the Eastern Province'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;