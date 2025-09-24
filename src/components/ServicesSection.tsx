import { TrendingUp, Handshake, Building, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/propertyData';

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();

  const serviceIcons = {
    marketing: TrendingUp,
    brokerage: Handshake,
    management: Building,
    documentation: FileCheck,
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {t('services.title')}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? 'نقدم مجموعة شاملة من الخدمات العقارية المتخصصة'
              : 'We provide a comprehensive range of specialized real estate services'
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.key as keyof typeof serviceIcons];
            
            return (
              <div
                key={service.key}
                className="card-feature animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Service Title */}
                <h3 className={`text-xl font-bold text-secondary mb-4 ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {isRTL ? service.ar : service.en}
                </h3>

                {/* Service Description */}
                <p className={`text-muted-foreground text-sm leading-relaxed mb-6 ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {isRTL ? service.description.ar : service.description.en}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center justify-center gap-2 text-primary group-hover:text-secondary transition-colors cursor-pointer">
                  <span className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'اعرف المزيد' : 'Learn More'}
                  </span>
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`bg-gradient-card rounded-2xl p-8 max-w-4xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            <h3 className={`text-2xl font-bold text-secondary mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL ? 'هل تحتاج استشارة عقارية؟' : 'Need Real Estate Consultation?'}
            </h3>
            <p className={`text-muted-foreground mb-6 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL 
                ? 'تواصل معنا للحصول على استشارة مجانية من خبرائنا المعتمدين'
                : 'Contact us for a free consultation from our certified experts'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                {isRTL ? 'احجز استشارة' : 'Book Consultation'}
              </button>
              <button className="btn-outline">
                {isRTL ? 'تواصل واتساب' : 'WhatsApp Contact'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;