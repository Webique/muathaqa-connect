import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@/data/propertyData';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import khobarImage from '@/assets/city-khobar.jpg';
import dammamImage from '@/assets/city-dammam.jpg';
import dhahranImage from '@/assets/city-dhahran.jpg';
import jubailImage from '@/assets/city-jubail.jpg';

const FeaturedCities = () => {
  const { t, isRTL } = useLanguage();

  const cityImages = {
    khobar: khobarImage,
    dammam: dammamImage,
    dhahran: dhahranImage,
    jubail: jubailImage,
  };

  const featuredCities = [
    { key: 'khobar', ...cities.khobar },
    { key: 'dammam', ...cities.dammam },
    { key: 'dhahran', ...cities.dhahran },
    { key: 'jubail', ...cities.jubail },
  ];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL ? 'المدن المتاحة' : 'Featured Cities'}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? 'اكتشف أفضل العقارات في أهم مدن المنطقة الشرقية'
              : 'Discover the best properties in the Eastern Province\'s key cities'
            }
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCities.map((city, index) => (
            <div
              key={city.key}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-medium transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* City Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cityImages[city.key as keyof typeof cityImages]}
                  alt={isRTL ? city.ar : city.en}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent"></div>
                
                {/* City Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL ? 'المنطقة الشرقية' : 'Eastern Province'}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold text-white mb-2 ${
                    isRTL ? 'font-arabic' : ''
                  }`}>
                    {isRTL ? city.ar : city.en}
                  </h3>
                  <p className={`text-white/90 text-sm ${isRTL ? 'font-arabic' : ''}`}>
                    {city.districts.length} {isRTL ? 'حي متاح' : 'districts available'}
                  </p>
                </div>
              </div>

              {/* City Details */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm text-muted-foreground mb-1 ${
                      isRTL ? 'font-arabic' : ''
                    }`}>
                      {isRTL ? 'الأحياء المتاحة' : 'Available Districts'}
                    </div>
                    <div className={`font-semibold text-secondary ${
                      isRTL ? 'font-arabic' : ''
                    }`}>
                      {city.districts.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary group-hover:text-secondary transition-colors">
                    <span className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                      {isRTL ? 'استكشف' : 'Explore'}
                    </span>
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Sample Districts */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {city.districts.slice(0, 3).map((district, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground ${
                        isRTL ? 'font-arabic' : ''
                      }`}
                    >
                      {isRTL ? district.ar : district.en}
                    </span>
                  ))}
                  {city.districts.length > 3 && (
                    <span className={`px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium ${
                      isRTL ? 'font-arabic' : ''
                    }`}>
                      +{city.districts.length - 3} {isRTL ? 'المزيد' : 'more'}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/cities">
            <button className="btn-outline group whitespace-nowrap">
              <span>{isRTL ? 'عرض جميع المدن' : 'View All Cities'}</span>
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCities;