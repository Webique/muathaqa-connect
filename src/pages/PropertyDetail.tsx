import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronLeft,
  ExternalLink, 
  ChevronRight, 
  Phone,
  Mail,
  ArrowLeft,
  Play
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading property with ID:', id);
      
      const response = await apiService.getProperty(id!);
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        setProperty(response.data);
      } else {
        setError(response.error || 'Property not found');
        setProperty(null);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Failed to load property');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || t('property.notFound')}
          </h1>
          <p className="text-muted-foreground mb-6">
            Property ID: {id}
          </p>
          <Link to="/cities" className="btn-primary">
            {t('property.backToProperties')}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const getBuildingTypeName = (type: string) => {
    const typeNames: { [key: string]: { ar: string; en: string } } = {
      'villa': { ar: 'فيلا', en: 'Villa' },
      'apartment_tower': { ar: 'شقة في برج', en: 'Apartment in Tower' },
      'apartment_building': { ar: 'شقة في مبنى', en: 'Apartment in Building' },
      'land': { ar: 'أرض', en: 'Land' },
      'building': { ar: 'مبنى', en: 'Building' },
      'townhouse': { ar: 'تاون هاوس', en: 'Townhouse' },
      'mansion': { ar: 'قصر', en: 'Mansion' },
      'farm': { ar: 'مزرعة', en: 'Farm' },
      'istraha': { ar: 'استراحة', en: 'Istraha' },
      'store': { ar: 'محل', en: 'Store' },
      'office': { ar: 'مكتب', en: 'Office' },
      'resort': { ar: 'منتجع', en: 'Resort' },
      'showroom': { ar: 'صالة عرض', en: 'Showroom' }
    };
    return typeNames[type] ? (isRTL ? typeNames[type].ar : typeNames[type].en) : type;
  };

  const getPurposeName = (purpose: string) => {
    const purposeNames: { [key: string]: { ar: string; en: string } } = {
      'sale': { ar: 'للبيع', en: 'For Sale' },
      'rent': { ar: 'للإيجار', en: 'For Rent' },
      'investment': { ar: 'للاستثمار', en: 'For Investment' }
    };
    return purposeNames[purpose] ? (isRTL ? purposeNames[purpose].ar : purposeNames[purpose].en) : purpose;
  };

  const getFeatureName = (key: string) => {
    const featureNames: { [key: string]: { ar: string; en: string } } = {
      'floors': { ar: 'عدد الأدوار', en: 'Number of Floors' },
      'guestLounge': { ar: 'المجالس', en: 'Guest Lounge' },
      'facade': { ar: 'الواجهة', en: 'Facade' },
      'streetWidthNorth': { ar: 'عرض الشارع', en: 'Street Width' },
      'dailyLivingRoom': { ar: 'الصالات', en: 'Living Rooms' },
      'diningRoom': { ar: 'غرفة الطعام', en: 'Dining Room' },
      'maidRoom': { ar: 'غرفة الخادمة', en: 'Maid Room' },
      'driverRoom': { ar: 'غرفة السائق', en: 'Driver Room' },
      'kitchen': { ar: 'المطبخ', en: 'Kitchen' },
      'storageRoom': { ar: 'غرفة التخزين', en: 'Storage Room' },
      'elevator': { ar: 'المصعد', en: 'Elevator' },
      'age': { ar: 'عمر العقار', en: 'Property Age' },
      'apartments': { ar: 'عدد الشقق', en: 'Number of Apartments' },
      'acSystem': { ar: 'نظام التكييف', en: 'AC System' },
      'category': { ar: 'الفئة', en: 'Category' },
      'planNumber': { ar: 'رقم المخطط', en: 'Plan Number' },
      'blockNumber': { ar: 'رقم البلوك', en: 'Block Number' },
      'parcelNumber': { ar: 'رقم القطعة', en: 'Parcel Number' },
      'subdivision': { ar: 'التقسيم', en: 'Subdivision' },
      'landClassification': { ar: 'تصنيف الأرض', en: 'Land Classification' },
      'pricePerSqm': { ar: 'سعر المتر', en: 'Price per sqm' },
      'allowedUsage': { ar: 'الاستعمال المسموح به', en: 'Allowed Usage' },
      'maxBuildingHeight': { ar: 'الحد الأقصى لارتفاع المبنى', en: 'Max Building Height' },
      'scale': { ar: 'الميزان', en: 'Scale' },
      'scaleArea': { ar: 'مساحة الميزان', en: 'Scale Area' },
      'shops': { ar: 'عدد المحلات', en: 'Number of Shops' },
      'meters': { ar: 'عدد العدادات', en: 'Number of Meters' }
    };
    return featureNames[key] ? (isRTL ? featureNames[key].ar : featureNames[key].en) : key.replace(/([A-Z])/g, ' $1').trim();
  };

  const getFeatureValue = (key: string, value: string | number) => {
    if (value === 0 || value === '' || value === null || value === undefined) return 'N/A';
    return value.toString();
  };

  const openGoogleMaps = () => {
    const address = encodeURIComponent(isRTL ? property.location.ar : property.location.en);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Title */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link to="/cities" className="hover:text-primary transition-colors">
                  {isRTL ? 'العقارات' : 'Properties'}
                </Link>
                <span>/</span>
                <span>{getBuildingTypeName(property.type)}</span>
                <span>/</span>
                <span>{getPurposeName(property.purpose)}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {getBuildingTypeName(property.type)} {getPurposeName(property.purpose)} - {isRTL ? property.title.ar : property.title.en}
              </h1>
            </div>

            {/* Image Gallery / Video Player */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {showVideo && property.video ? (
                    <video 
                      controls 
                      className="w-full h-full"
                      autoPlay
                    >
                      <source src={property.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[currentImageIndex].replace('/src/assets/', '/assets/')}
                      alt={isRTL ? property.title.ar : property.title.en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )}
                </div>
                
                {!showVideo && property.images && property.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {property.video && (
                  <Button
                    variant="outline"
                    size="default"
                    className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
                    onClick={() => setShowVideo(!showVideo)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {showVideo ? (isRTL ? 'عرض الصور' : 'Show Images') : (isRTL ? 'عرض الفيديو' : 'Watch Video')}
                  </Button>
                )}
              </div>

              {/* Image Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {property.images.slice(0, 4).map((image: string, index: number) => (
                    <button
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-border'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image.replace('/src/assets/', '/assets/')}
                        alt={`${isRTL ? property.title.ar : property.title.en} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Data Section - Dynamic based on property type */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 
                  `البيانات الأساسية (${getBuildingTypeName(property.type)}) ${getPurposeName(property.purpose)}` :
                  `Basic Data (${getBuildingTypeName(property.type)}) ${getPurposeName(property.purpose)}`
                }
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                  <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{isRTL ? 'السعر:' : 'Price:'}</span>
                  <span className="font-medium">{formatPrice(property.price)} SAR</span>
                </div>
                {property.bedrooms > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'غرف النوم:' : 'Bedrooms:'}</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'دورات المياه:' : 'Bathrooms:'}</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                )}
                {property.features && Object.entries(property.features).map(([key, value]) => {
                  if (value === 0 || value === '' || value === null || value === undefined) return null;
                  return (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-border/50">
                      <span className="text-muted-foreground">
                        {getFeatureName(key)}
                      </span>
                      <span className="font-medium">{getFeatureValue(key, value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 'الوصف' : 'Description'}
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                {property.description || (isRTL ? 'لا يوجد وصف متاح' : 'No description available')}
              </div>
            </div>

            {/* Features Section */}
            {property.features && Object.keys(property.features).length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t('property.features')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(property.features).map(([key, value]) => {
                    if (value === 0 || value === '' || value === null || value === undefined) return null;
                    return (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">
                          {getFeatureName(key)}
                        </span>
                        <span className="font-medium">{getFeatureValue(key, value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-lg text-muted-foreground mb-6">
                  {t('property.sellingPrice')}
                </div>
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('property.contactUs')}
                </Button>
              </div>
            </div>

            {/* Services */}
            {property.services && property.services.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t('property.services')}
                </h3>
                <div className="space-y-2">
                  {property.services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t('property.usage')}
              </h3>
              <div className="text-muted-foreground">{property.usage}</div>
            </div>

            {/* Advertiser Details */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t('property.advertiserDetails')}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('property.propertyCode')}
                  </div>
                  <div className="font-medium">{property.propertyCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('property.advertiserNumber')}
                  </div>
                  <div className="font-medium">{property.advertiser.number}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('property.licenseNumber')}
                  </div>
                  <div className="font-medium">{property.advertiser.license}</div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t('property.location')}
              </h3>
              <button 
                onClick={openGoogleMaps} 
                className="flex items-start gap-2 text-left hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors group w-full"
              >
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-muted-foreground flex-1">
                  {isRTL ? property.location.ar : property.location.en}
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
