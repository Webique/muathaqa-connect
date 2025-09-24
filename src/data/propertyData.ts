export const cities = {
  jubail: {
    ar: 'الجبيل',
    en: 'Jubail',
    districts: [
      { ar: 'طيبة', en: 'Taiba' },
      { ar: 'اليوموك', en: 'Al-Youmook' },
      { ar: 'الفردوس', en: 'Al-Ferdous' },
      { ar: 'الفاروق', en: 'Al-Farooq' },
      { ar: 'الفيحاء', en: 'Al-Faiha' },
      { ar: 'القدس', en: 'Al-Quds' },
      { ar: 'الاندلس', en: 'Al-Andalus' },
      { ar: 'الأحساء', en: 'Al-Ahsa' },
      { ar: 'نجد', en: 'Najd' },
      { ar: 'الحجاز', en: 'Al-Hijaz' },
      { ar: 'ينبع', en: 'Yanbu' },
      { ar: 'العلا', en: 'Al-Ula' },
      { ar: 'الرياض', en: 'Riyadh' },
      { ar: 'الطائف', en: 'Taif' },
      { ar: 'المطرفية', en: 'Al-Mutarfiya' },
      { ar: 'الحمراء', en: 'Al-Hamra' },
      { ar: 'الحويلات', en: 'Al-Huwailat' },
    ]
  },
  dhahran: {
    ar: 'الظهران',
    en: 'Dhahran',
    districts: [
      { ar: 'هجر', en: 'Hajar' },
      { ar: 'غرب الظهران', en: 'West Dhahran' },
      { ar: 'الجامعة', en: 'University' },
      { ar: 'الدانة الشمالية', en: 'North Danah' },
      { ar: 'الدانة الجنوبية', en: 'South Danah' },
      { ar: 'القصور', en: 'Al-Qusoor' },
      { ar: 'الدوحة الشمالية', en: 'North Doha' },
      { ar: 'القشلة', en: 'Al-Qashlah' },
      { ar: 'تهامة', en: 'Tihama' },
    ]
  },
  dammam: {
    ar: 'الدمام',
    en: 'Dammam',
    districts: [
      { ar: 'طيبة', en: 'Taiba' },
      { ar: 'الشعلة', en: 'Al-Sho\'la' },
      { ar: 'المنار', en: 'Al-Manar' },
      { ar: 'الفرسان', en: 'Al-Fursan' },
      { ar: 'الأمانة', en: 'Al-Amana' },
      { ar: 'العروبة', en: 'Al-Orouba' },
      { ar: 'الإسكان الجنوبي', en: 'South Housing' },
      { ar: 'الإسكان الشمالي', en: 'North Housing' },
      { ar: 'المنتزه', en: 'Al-Muntazah' },
      { ar: 'الأمل', en: 'Al-Amal' },
    ]
  },
  khobar: {
    ar: 'الخبر',
    en: 'Khobar',
    districts: [
      { ar: 'الثقبة', en: 'Al-Thuqbah' },
      { ar: 'الحمراء', en: 'Al-Hamra' },
      { ar: 'اللؤلؤ', en: 'Al-Lulu' },
      { ar: 'الشراع', en: 'Al-Shira' },
      { ar: 'الصواري', en: 'Al-Sawari' },
      { ar: 'الأمواج', en: 'Al-Amwaj' },
      { ar: 'الخبر الجنوبية', en: 'South Khobar' },
      { ar: 'الخبر الشمالية', en: 'North Khobar' },
      { ar: 'العقربية', en: 'Al-Aqrabiya' },
      { ar: 'العليا', en: 'Al-Olaya' },
      { ar: 'الكوثر', en: 'Al-Kawthar' },
      { ar: 'الجسر', en: 'Al-Jisr' },
      { ar: 'التحلية', en: 'Al-Tahliya' },
      { ar: 'الخزامى', en: 'Al-Khuzama' },
      { ar: 'البحيرة', en: 'Al-Buhaira' },
      { ar: 'العقيق', en: 'Al-Aqeeq' },
      { ar: 'الرجاء', en: 'Al-Raja' },
      { ar: 'التعاون', en: 'Al-Taawon' },
      { ar: 'صناعية الثقبة', en: 'Thuqbah Industrial' },
      { ar: 'المرجان', en: 'Al-Marjan' },
      { ar: 'الخور', en: 'Al-Khor' },
      { ar: 'المها', en: 'Al-Maha' },
      { ar: 'اشبيليا', en: 'Ishbilya' },
    ]
  },
  hofuf: {
    ar: 'الهفوف',
    en: 'Hofuf',
    districts: [
      { ar: 'المركزي', en: 'Central' },
      { ar: 'النهضة', en: 'Al-Nahda' },
      { ar: 'الصالحية', en: 'Al-Salihiya' },
    ]
  },
  mubarraz: {
    ar: 'المبرز',
    en: 'Mubarraz',
    districts: [
      { ar: 'الحزم', en: 'Al-Hazm' },
      { ar: 'الراشدية', en: 'Al-Rashidiya' },
    ]
  },
  oyoun: {
    ar: 'العيون',
    en: 'Oyoun',
    districts: [
      { ar: 'المركز', en: 'Center' },
      { ar: 'الشمالية', en: 'North' },
    ]
  }
};

export const purposes = [
  { key: 'sale', ar: 'للبيع', en: 'For Sale' },
  { key: 'rent', ar: 'للإيجار', en: 'For Rent' },
  { key: 'investment', ar: 'للاستثمار', en: 'For Investment' },
];

export const propertyTypes = [
  { key: 'residential', ar: 'سكني', en: 'Residential' },
  { key: 'commercial', ar: 'تجاري', en: 'Commercial' },
];

export const statistics = [
  { key: 'contracts', value: 233, ar: 'العقود الموثقة حتى الآن', en: 'Documented Contracts' },
  { key: 'real_estate', value: 916, ar: 'العقود العقارية', en: 'Real Estate Contracts' },
  { key: 'authority', value: 183, ar: 'الهيئة العامة للعقار', en: 'General Real Estate Authority' },
  { key: 'ejar', value: 460, ar: 'منصة إيجار', en: 'Ejar Platform' },
  { key: 'satisfaction', value: 4.6, ar: 'معدل رضا العملاء', en: 'Customer Satisfaction', unit: '★' },
];

export const services = [
  {
    key: 'marketing',
    ar: 'التسويق العقاري',
    en: 'Real Estate Marketing',
    description: {
      ar: 'حملات تسويقية، تصوير احترافي، إدارة حملات إعلانية، إعداد دراسات سوقية',
      en: 'Marketing campaigns, professional photography, advertising management, market studies'
    }
  },
  {
    key: 'brokerage',
    ar: 'الوساطة العقارية',
    en: 'Brokerage',
    description: {
      ar: 'ربط البائع بالمشتري/المؤجر بالمستأجر، التفاوض، العقود، الاستشارات القانونية والفنية',
      en: 'Connecting buyers with sellers/tenants with landlords, negotiation, contracts, legal and technical consulting'
    }
  },
  {
    key: 'management',
    ar: 'إدارة الأملاك',
    en: 'Property Management',
    description: {
      ar: 'تحصيل الإيجارات، متابعة المستأجرين، تقارير مالية، صيانة دورية',
      en: 'Rent collection, tenant management, financial reports, periodic maintenance'
    }
  },
  {
    key: 'documentation',
    ar: 'توثيق العقود',
    en: 'Contract Documentation',
    description: {
      ar: 'تسجيل رسمي عبر منصة إيجار الإلكترونية، تحديث/إنهاء العقود عند الحاجة، ربط العقد بالهوية الوطنية',
      en: 'Official registration via Ejar electronic platform, contract updates/termination when needed, linking contracts to national identity'
    }
  }
];