const connectDB = require('./_shared/db');
const Property = require('./_shared/Property');

const sampleProperties = [
  {
    title: {
      ar: 'فيلا في حي الملقا',
      en: 'Villa in Al Malqa Dist.'
    },
    location: {
      ar: 'الرياض، المملكة العربية السعودية',
      en: 'Riyadh, Saudi Arabia'
    },
    propertyCode: 'MU-001',
    images: [
      '/src/assets/hero-real-estate.jpg',
      '/src/assets/city-dammam.jpg',
      '/src/assets/city-dhahran.jpg'
    ],
    price: 8000000,
    area: 600,
    bedrooms: 6,
    bathrooms: 3,
    type: 'villa',
    purpose: 'sale',
    features: {
      floors: 3,
      guestLounge: 2,
      facade: 'North',
      streetWidthNorth: 15,
      dailyLivingRoom: 3,
      diningRoom: 3,
      maidRoom: 1,
      driverRoom: 1,
      kitchen: 3,
      storageRoom: 1,
      elevator: 1
    },
    services: ['Electricity', 'Water', 'Sewage'],
    usage: 'Residential',
    advertiser: {
      number: '7200640143',
      license: '1200027687'
    }
  },
  {
    title: {
      ar: 'شقة في برج الفردوس',
      en: 'Apartment in Al Ferdous Tower'
    },
    location: {
      ar: 'الخبر، المملكة العربية السعودية',
      en: 'Khobar, Saudi Arabia'
    },
    propertyCode: 'MU-002',
    images: [
      '/src/assets/city-khobar.jpg',
      '/src/assets/city-khobar.jpg'
    ],
    price: 2500000,
    area: 180,
    bedrooms: 3,
    bathrooms: 2,
    type: 'apartment_tower',
    purpose: 'sale',
    features: {
      floors: 1,
      guestLounge: 1,
      facade: 'East',
      streetWidthNorth: 12,
      dailyLivingRoom: 1,
      diningRoom: 1,
      maidRoom: 0,
      driverRoom: 0,
      kitchen: 1,
      storageRoom: 1,
      elevator: 1
    },
    services: ['Electricity', 'Water', 'Sewage', 'Gas'],
    usage: 'Residential',
    advertiser: {
      number: '7200640143',
      license: '1200027687'
    }
  },
  {
    title: {
      ar: 'أرض سكنية في حي النهضة',
      en: 'Residential Land in Al Nahda Dist.'
    },
    location: {
      ar: 'الدمام، المملكة العربية السعودية',
      en: 'Dammam, Saudi Arabia'
    },
    propertyCode: 'MU-003',
    images: [
      '/src/assets/city-dammam.jpg'
    ],
    price: 1200000,
    area: 800,
    bedrooms: 0,
    bathrooms: 0,
    type: 'land',
    purpose: 'sale',
    features: {
      floors: 0,
      guestLounge: 0,
      facade: 'South',
      streetWidthNorth: 20,
      dailyLivingRoom: 0,
      diningRoom: 0,
      maidRoom: 0,
      driverRoom: 0,
      kitchen: 0,
      storageRoom: 0,
      elevator: 0
    },
    services: ['Electricity', 'Water', 'Sewage'],
    usage: 'Residential',
    advertiser: {
      number: '7200640143',
      license: '1200027687'
    }
  }
];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    await connectDB();

    // Clear existing properties
    await Property.deleteMany({});

    // Insert sample properties
    const insertedProperties = await Property.insertMany(sampleProperties);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Database seeded with ${insertedProperties.length} properties`,
        data: insertedProperties
      })
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to seed database',
        message: error.message
      })
    };
  }
};
