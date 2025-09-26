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
    'search.buildingType': 'نوع البناء',
    'search.button': 'بحث',
    'search.placeholder.city': 'اختر المدينة',
    'search.placeholder.district': 'اختر الحي',
    'search.placeholder.purpose': 'اختر الغرض',
    'search.placeholder.type': 'اختر النوع',
    'search.placeholder.buildingType': 'اختر نوع البناء',
    
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

    // Cities Page
    'cities.title': 'جميع العقارات',
    'cities.subtitle': 'اكتشف مجموعة واسعة من العقارات السكنية والتجارية في المنطقة الشرقية',
    'cities.results': 'نتائج البحث',
    'cities.searching': 'جاري البحث...',
    'cities.propertiesFound': 'عقار متاح',
    'cities.clearFilters': 'مسح الفلاتر',
    'cities.noResults': 'لا توجد نتائج',
    'cities.noResultsDescription': 'جرب تعديل فلاتر البحث أو مسحها للعثور على المزيد من العقارات',
    'cities.loadMore': 'تحميل المزيد',
    'cities.sqm': 'م²',
    'cities.currency': 'ريال سعودي',

    // Property Detail Page
    'property.backToProperties': 'العودة للعقارات',
    'property.notFound': 'العقار غير موجود',
    'property.sellingPrice': 'سعر البيع',
    'property.facts': 'البيانات الأساسية',
    'property.features': 'المميزات',
    'property.description': 'الوصف',
    'property.services': 'الخدمات',
    'property.usage': 'الاستخدام',
    'property.advertiserDetails': 'تفاصيل المعلن',
    'property.propertyCode': 'كود العقار',
    'property.advertiserNumber': 'رقم المعلن',
    'property.licenseNumber': 'رخصة فال',
    'property.location': 'الموقع',
    'property.contactUs': 'تواصل معنا',

    // Property Filters
    'filters.title': 'فلاتر البحث',
    'filters.showFilters': 'إظهار الفلاتر',
    'filters.hideFilters': 'إخفاء الفلاتر',
    'filters.clearAll': 'مسح الكل',
    'filters.minPrice': 'السعر الأدنى',
    'filters.maxPrice': 'السعر الأعلى',
    'filters.minArea': 'المساحة الأدنى',
    'filters.maxArea': 'المساحة الأعلى',
    'filters.bedrooms': 'غرف النوم',
    'filters.bathrooms': 'الحمامات',
    'filters.bedroomsPlaceholder': 'عدد الغرف',
    'filters.bathroomsPlaceholder': 'عدد الحمامات',

    // Common
    'common.bedrooms': 'غرف نوم',
    'common.bathrooms': 'حمامات',
    'common.area': 'المساحة',
    'common.price': 'السعر',

    // Property Features
    'feature.floors': 'الطوابق',
    'feature.guestLounge': 'صالة الضيوف',
    'feature.facade': 'الواجهة',
    'feature.streetWidthNorth': 'عرض الشارع الشمالي',
    'feature.dailyLivingRoom': 'غرفة المعيشة اليومية',
    'feature.diningRoom': 'غرفة الطعام',
    'feature.maidRoom': 'غرفة الخادمة',
    'feature.driverRoom': 'غرفة السائق',
    'feature.kitchen': 'المطبخ',
    'feature.storageRoom': 'غرفة التخزين',
    'feature.elevator': 'المصعد',

    // Property Features Values
    'featureValue.north': 'شمال',
    'featureValue.south': 'جنوب',
    'featureValue.east': 'شرق',
    'featureValue.west': 'غرب',

    // Image Navigation
    'image.thumbnail': 'صورة مصغرة',
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
    'search.buildingType': 'Building Type',
    'search.button': 'Search',
    'search.placeholder.city': 'Select City',
    'search.placeholder.district': 'Select District',
    'search.placeholder.purpose': 'Select Purpose',
    'search.placeholder.type': 'Select Type',
    'search.placeholder.buildingType': 'Select Building Type',
    
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

    // Cities Page
    'cities.title': 'All Properties',
    'cities.subtitle': 'Discover a wide range of residential and commercial properties in the Eastern Province',
    'cities.results': 'Search Results',
    'cities.searching': 'Searching...',
    'cities.propertiesFound': 'properties found',
    'cities.clearFilters': 'Clear Filters',
    'cities.noResults': 'No Results Found',
    'cities.noResultsDescription': 'Try adjusting your search filters or clearing them to find more properties',
    'cities.loadMore': 'Load More',
    'cities.sqm': 'Sq m',
    'cities.currency': 'SAR',

    // Property Detail Page
    'property.backToProperties': 'Back to Properties',
    'property.notFound': 'Property Not Found',
    'property.sellingPrice': 'Selling Price',
    'property.facts': 'Facts',
    'property.features': 'Features',
    'property.description': 'Description',
    'property.services': 'Services',
    'property.usage': 'Usage',
    'property.advertiserDetails': 'Advertiser Details',
    'property.propertyCode': 'Property Code',
    'property.advertiserNumber': 'Advertiser Number',
    'property.licenseNumber': 'License Number',
    'property.location': 'Location',
    'property.contactUs': 'Contact Us',

    // Property Filters
    'filters.title': 'Search Filters',
    'filters.showFilters': 'Show Filters',
    'filters.hideFilters': 'Hide Filters',
    'filters.clearAll': 'Clear All',
    'filters.minPrice': 'Min Price',
    'filters.maxPrice': 'Max Price',
    'filters.minArea': 'Min Area',
    'filters.maxArea': 'Max Area',
    'filters.bedrooms': 'Bedrooms',
    'filters.bathrooms': 'Bathrooms',
    'filters.bedroomsPlaceholder': 'Number of rooms',
    'filters.bathroomsPlaceholder': 'Number of bathrooms',

    // Common
    'common.bedrooms': 'Bedrooms',
    'common.bathrooms': 'Bathrooms',
    'common.area': 'Area',
    'common.price': 'Price',

    // Property Features
    'feature.floors': 'Floors',
    'feature.guestLounge': 'Guest Lounge',
    'feature.facade': 'Facade',
    'feature.streetWidthNorth': 'Street Width North',
    'feature.dailyLivingRoom': 'Daily Living Room',
    'feature.diningRoom': 'Dining Room',
    'feature.maidRoom': 'Maid Room',
    'feature.driverRoom': 'Driver Room',
    'feature.kitchen': 'Kitchen',
    'feature.storageRoom': 'Storage Room',
    'feature.elevator': 'Elevator',

    // Property Features Values
    'featureValue.north': 'North',
    'featureValue.south': 'South',
    'featureValue.east': 'East',
    'featureValue.west': 'West',

    // Image Navigation
    'image.thumbnail': 'Thumbnail',
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