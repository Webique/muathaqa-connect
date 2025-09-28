const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// Static cities data
const cities = {
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
      { ar: 'حي الهدى', en: 'Al-Huda District' },
      { ar: 'حي جنوب الهفوف', en: 'South Hofuf District' },
      { ar: 'حي جنوب منسوبي التعليم', en: 'South Education Staff District' },
      { ar: 'حي السلمانية الجنوبية', en: 'South Salmaniya District' },
      { ar: 'حي الطرف', en: 'Al-Taraf District' },
      { ar: 'حي الرابية', en: 'Al-Rabiya District' },
      { ar: 'حي الواحة', en: 'Al-Waha District' },
      { ar: 'حي الرقيقة', en: 'Al-Raqiqa District' },
      { ar: 'حي النايفية', en: 'Al-Naifiya District' },
      { ar: 'حي الراشدية', en: 'Al-Rashidiya District' },
      { ar: 'حي الورود', en: 'Al-Wurud District' },
      { ar: 'حي محاسن البلدية', en: 'Municipal Virtues District' },
      { ar: 'حي البندرية', en: 'Al-Bandariya District' },
      { ar: 'حي العويمرية', en: 'Al-Awaimiriya District' },
      { ar: 'حي السلمانية الشمالية', en: 'North Salmaniya District' },
      { ar: 'حي الجامعيين', en: 'University Graduates District' },
      { ar: 'حي القادسية', en: 'Al-Qadisiyah District' },
      { ar: 'حي مخطط علي الخرس و أحمد الشهاب', en: 'Ali Al-Khars and Ahmed Al-Shahab Plan District' },
      { ar: 'حي وسط المدينة', en: 'City Center District' },
      { ar: 'حي الجشة', en: 'Al-Jashah District' },
      { ar: 'حي المحمدية', en: 'Al-Mohammadiya District' },
      { ar: 'حي المطيرفي', en: 'Al-Mutairfi District' },
      { ar: 'حي العزيزية', en: 'Al-Aziziyah District' },
      { ar: 'حي البصيرة', en: 'Al-Basira District' },
    ]
  }
};

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    const cityKey = pathSegments[pathSegments.length - 1];

    if (httpMethod === 'GET') {
      if (cityKey && cityKey !== 'cities') {
        // Get specific city
        if (!cities[cityKey]) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'City not found'
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: cities[cityKey]
          })
        };
      } else {
        // Get all cities
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: cities
          })
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
