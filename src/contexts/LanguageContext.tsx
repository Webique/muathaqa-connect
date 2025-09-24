import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'خدماتنا',
    'nav.contact': 'تواصل معنا',
    
    // Hero
    'hero.title': 'ثقتك أساس تعاملنا',
    'hero.subtitle': 'حلول عقارية متكاملة وموثوقة',
    'hero.cta.search': 'ابحث عن عقارك',
    'hero.cta.contact': 'تواصل معنا',
    
    // Search
    'search.city': 'المدينة',
    'search.district': 'الحي',
    'search.purpose': 'الغرض',
    'search.type': 'نوع العقار',
    'search.button': 'بحث',
    'search.placeholder.city': 'اختر المدينة',
    'search.placeholder.district': 'اختر الحي',
    'search.placeholder.purpose': 'اختر الغرض',
    'search.placeholder.type': 'اختر النوع',
    
    // Purposes
    'purpose.sale': 'للبيع',
    'purpose.rent': 'للإيجار',
    'purpose.investment': 'للاستثمار',
    
    // Property Types
    'type.residential': 'سكني',
    'type.commercial': 'تجاري',
    
    // Cities
    'city.khobar': 'الخبر',
    'city.dammam': 'الدمام',
    'city.dhahran': 'الظهران',
    'city.jubail': 'الجبيل',
    'city.hofuf': 'الهفوف',
    'city.mubarraz': 'المبرز',
    'city.oyoun': 'العيون',
    
    // Services
    'services.title': 'خدماتنا',
    'services.marketing': 'التسويق العقاري',
    'services.brokerage': 'الوساطة العقارية',
    'services.management': 'إدارة الأملاك',
    'services.documentation': 'توثيق العقود',
    
    // Stats
    'stats.contracts': 'العقود الموثقة',
    'stats.real_estate': 'العقود العقارية',
    'stats.authority': 'الهيئة العامة للعقار',
    'stats.ejar': 'منصة إيجار',
    'stats.satisfaction': 'معدل رضا العملاء',
    
    // About
    'about.title': 'من نحن',
    'about.vision': 'رؤيتنا',
    'about.mission': 'رسالتنا',
    'about.values': 'قيمنا',
    'about.profile': 'تأسست في 1 مارس 2023 كمؤسسة وطنية متخصصة في إدارة وتسويق العقارات السكنية والتجارية.',
    'about.vision.text': 'أن نكون من الجهات الرائدة في قطاع العقار بالمملكة من خلال الثقة، الشفافية، وجودة الأداء.',
    'about.mission.text': 'تقديم خدمات عقارية متكاملة بمهنية وموثوقية، ورفع معايير القطاع وتعزيز الثقة.',
    
    // Values
    'value.professionalism': 'الاحترافية',
    'value.responsibility': 'المسؤولية',
    'value.trust': 'الثقة',
    'value.transparency': 'الشفافية',
    'value.innovation': 'الابتكار',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.address': 'العنوان',
    'contact.location': 'المنطقة الشرقية - محافظة الخبر - حي الشراع - شارع ربيعة بن السكن',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Your Trust is the Foundation of Our Dealings',
    'hero.subtitle': 'Integrated, reliable real estate solutions',
    'hero.cta.search': 'Find Your Property',
    'hero.cta.contact': 'Contact Us',
    
    // Search
    'search.city': 'City',
    'search.district': 'District',
    'search.purpose': 'Purpose',
    'search.type': 'Property Type',
    'search.button': 'Search',
    'search.placeholder.city': 'Select City',
    'search.placeholder.district': 'Select District',
    'search.placeholder.purpose': 'Select Purpose',
    'search.placeholder.type': 'Select Type',
    
    // Purposes
    'purpose.sale': 'For Sale',
    'purpose.rent': 'For Rent',
    'purpose.investment': 'For Investment',
    
    // Property Types
    'type.residential': 'Residential',
    'type.commercial': 'Commercial',
    
    // Cities
    'city.khobar': 'Khobar',
    'city.dammam': 'Dammam',
    'city.dhahran': 'Dhahran',
    'city.jubail': 'Jubail',
    'city.hofuf': 'Hofuf',
    'city.mubarraz': 'Mubarraz',
    'city.oyoun': 'Oyoun',
    
    // Services
    'services.title': 'Our Services',
    'services.marketing': 'Real Estate Marketing',
    'services.brokerage': 'Brokerage',
    'services.management': 'Property Management',
    'services.documentation': 'Contract Documentation',
    
    // Stats
    'stats.contracts': 'Documented Contracts',
    'stats.real_estate': 'Real Estate Contracts',
    'stats.authority': 'General Real Estate Authority',
    'stats.ejar': 'Ejar Platform',
    'stats.satisfaction': 'Customer Satisfaction',
    
    // About
    'about.title': 'About Us',
    'about.vision': 'Our Vision',
    'about.mission': 'Our Mission',
    'about.values': 'Our Values',
    'about.profile': 'Founded on March 1, 2023 as a national institution specialized in managing and marketing residential and commercial real estate.',
    'about.vision.text': 'To be one of the leading entities in the real estate sector in the Kingdom through trust, transparency, and quality performance.',
    'about.mission.text': 'Deliver integrated real estate services with professionalism and reliability, raising sector standards and enhancing trust.',
    
    // Values
    'value.professionalism': 'Professionalism',
    'value.responsibility': 'Responsibility',
    'value.trust': 'Trust',
    'value.transparency': 'Transparency',
    'value.innovation': 'Innovation',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.location': 'Eastern Province - Khobar Governorate - Al-Shira District - Rabia bin Al-Sakan Street',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};