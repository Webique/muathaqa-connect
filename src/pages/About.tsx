import { Shield, Target, Users, Award, TrendingUp, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t, isRTL } = useLanguage();

  const values = [
    { 
      key: 'professionalism', 
      icon: Award, 
      ar: 'الاحترافية',
      en: 'Professionalism'
    },
    { 
      key: 'responsibility', 
      icon: Shield, 
      ar: 'المسؤولية',
      en: 'Responsibility'
    },
    { 
      key: 'trust', 
      icon: Users, 
      ar: 'الثقة',
      en: 'Trust'
    },
    { 
      key: 'transparency', 
      icon: Target, 
      ar: 'الشفافية',
      en: 'Transparency'
    },
    { 
      key: 'innovation', 
      icon: TrendingUp, 
      ar: 'الابتكار',
      en: 'Innovation'
    },
  ];

  const licenses = [
    {
      ar: 'عضوية إيجار',
      en: 'Ejar Membership',
      number: 'EJAR_37145017'
    },
    {
      ar: 'رخصة فال لإدارة الأملاك',
      en: 'Fal License for Property Management',
      number: '2200001528'
    },
    {
      ar: 'رخصة فال للوساطة والتسويق',
      en: 'Fal License for Brokerage and Marketing',
      number: '1200018592'
    }
  ];

  const achievements = [
    { label: { ar: 'العقود الموثقة', en: 'Documented Contracts' }, value: '233+' },
    { label: { ar: 'العقود العقارية', en: 'Real Estate Contracts' }, value: '916+' },
    { label: { ar: 'الهيئة العامة للعقار', en: 'General Real Estate Authority' }, value: '183+' },
    { label: { ar: 'منصة إيجار', en: 'Ejar Platform' }, value: '460+' },
    { label: { ar: 'معدل رضا العملاء', en: 'Customer Satisfaction' }, value: '4.6 ★' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL ? 'مؤسسة مواثقة العقارية' : 'Muathaqa Real Estate'}
            </h1>
            <p className={`text-xl md:text-2xl text-white/90 leading-relaxed ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {t('about.profile')}
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="card-premium">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className={`text-2xl font-bold text-secondary ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {t('about.vision')}
                </h2>
              </div>
              <p className={`text-muted-foreground leading-relaxed ${
                isRTL ? 'font-arabic' : ''
              }`}>
                {t('about.vision.text')}
              </p>
            </div>

            {/* Mission */}
            <div className="card-premium">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className={`text-2xl font-bold text-secondary ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {t('about.mission')}
                </h2>
              </div>
              <p className={`text-muted-foreground leading-relaxed ${
                isRTL ? 'font-arabic' : ''
              }`}>
                {t('about.mission.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {t('about.values')}
            </h2>
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL 
                ? 'القيم التي نؤمن بها ونسعى لتحقيقها في كل ما نقوم به'
                : 'The values we believe in and strive to achieve in everything we do'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.key}
                  className="card-feature group animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className={`text-lg font-bold text-secondary ${
                    isRTL ? 'font-arabic' : ''
                  }`}>
                    {isRTL ? value.ar : value.en}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Licenses & Certifications */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL ? 'التراخيص والاعتمادات' : 'Licenses & Certifications'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {licenses.map((license, index) => (
              <div
                key={index}
                className="card-premium text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className={`text-lg font-bold text-secondary mb-2 ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {isRTL ? license.ar : license.en}
                </h3>
                <p className="text-muted-foreground font-mono">
                  {license.number}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL ? 'الإنجازات والأرقام' : 'Achievements & Numbers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {achievement.value}
                </div>
                <p className={`text-white/80 ${
                  isRTL ? 'font-arabic text-sm' : ''
                }`}>
                  {isRTL ? achievement.label.ar : achievement.label.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {t('contact.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Phone */}
            <div className="card-premium text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className={`text-lg font-bold text-secondary mb-4 ${
                isRTL ? 'font-arabic' : ''
              }`}>
                {t('contact.phone')}
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>0553737679</p>
                <p>0551888193</p>
                <p>0507788052</p>
              </div>
            </div>

            {/* Email */}
            <div className="card-premium text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className={`text-lg font-bold text-secondary mb-4 ${
                isRTL ? 'font-arabic' : ''
              }`}>
                {t('contact.email')}
              </h3>
              <p className="text-muted-foreground">
                muathaqa@hotmail.com
              </p>
            </div>

            {/* Address */}
            <div className="card-premium text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className={`text-lg font-bold text-secondary mb-4 ${
                isRTL ? 'font-arabic' : ''
              }`}>
                {t('contact.address')}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${
                isRTL ? 'font-arabic text-sm' : ''
              }`}>
                {t('contact.location')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;