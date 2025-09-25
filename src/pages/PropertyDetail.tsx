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
import { properties, buildingTypes, purposes } from '@/data/propertyData';
import { Button } from '@/components/ui/button';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const property = properties.find(p => p.id === parseInt(id || '0'));

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('property.notFound')}
          </h1>
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
    const buildingType = buildingTypes.find(bt => bt.key === type);
    return buildingType ? (isRTL ? buildingType.ar : buildingType.en) : type;
  };

  const getPurposeName = (purpose: string) => {
    const purposeObj = purposes.find(p => p.key === purpose);
    return purposeObj ? (isRTL ? purposeObj.ar : purposeObj.en) : purpose;
  };

  const getFeatureName = (key: string) => {
    const featureKey = `feature.${key}`;
    return t(featureKey) !== featureKey ? t(featureKey) : key.replace(/([A-Z])/g, ' $1').trim();
  };

  const getFeatureValue = (key: string, value: string | number) => {
    if (key === 'facade') {
      const valueKey = `featureValue.${value.toString().toLowerCase()}`;
      return t(valueKey) !== valueKey ? t(valueKey) : value;
    }
    return value;
  };

  const nextImage = () => {
    const totalItems = property.video ? property.images.length + 1 : property.images.length;
    setCurrentImageIndex((prev) => 
      prev === totalItems - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const totalItems = property.video ? property.images.length + 1 : property.images.length;
    setCurrentImageIndex((prev) => 
      prev === 0 ? totalItems - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openGoogleMaps = () => {
    const location = isRTL ? property.location.ar : property.location.en;
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-32 pb-8">
        <Link 
          to="/cities" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('property.backToProperties')}</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Slideshow */}
            <div className="relative bg-card rounded-2xl overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                {/* Main Image/Video Display */}
                {property.video && currentImageIndex === 0 ? (
                  <video
                    src={property.video}
                    className="w-full h-full object-cover"
                    controls
                    poster={property.images[0]}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={property.images[property.video ? currentImageIndex - 1 : currentImageIndex]}
                    alt={`${isRTL ? property.title.ar : property.title.en} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm">
                  {property.video && currentImageIndex === 0 ? 'Video' : `${currentImageIndex + 1} / ${property.video ? property.images.length + 1 : property.images.length}`}
                </div>
              </div>
              {/* Thumbnail Navigation */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {/* Video Thumbnail */}
                {property.video && (
                  <button
                    onClick={() => goToImage(0)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === 0 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                  </button>
                )}
                {/* Image Thumbnails */}
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(property.video ? index + 1 : index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      (property.video ? index + 1 : index) === currentImageIndex 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${t('image.thumbnail')} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Title and Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{isRTL ? property.location.ar : property.location.en}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {getBuildingTypeName(property.type)} {getPurposeName(property.purpose)} - {isRTL ? property.title.ar : property.title.en}
              </h1>
            </div>

            {/* Basic Data Section - Dynamic based on property type */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 
                  `البيانات الأساسية (${getBuildingTypeName(property.type)}) ${getPurposeName(property.purpose)}` :
                  `Basic Data (${getBuildingTypeName(property.type)}) ${getPurposeName(property.purpose)}`
                }
              </h2>
              
              {/* Apartment Data */}
              {property.type === 'apartment_tower' || property.type === 'apartment_building' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                    <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الدور:' : 'Floor:'}</span>
                    <span className="font-medium">{property.features.floors || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عمر العقار:' : 'Property Age:'}</span>
                    <span className="font-medium">{property.features.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'غرف النوم:' : 'Bedrooms:'}</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الصالات:' : 'Living Rooms:'}</span>
                    <span className="font-medium">{property.features.dailyLivingRoom || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'دورات المياه:' : 'Bathrooms:'}</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الواجهة:' : 'Facade:'}</span>
                    <span className="font-medium">{property.features.facade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الفئة:' : 'Category:'}</span>
                    <span className="font-medium">{property.features.category || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'نظام التكييف:' : 'AC System:'}</span>
                    <span className="font-medium">{property.features.acSystem || 'N/A'}</span>
                  </div>
                </div>
              ) : null}

              {/* Land Data */}
              {property.type === 'land' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                    <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عرض الشارع:' : 'Street Width:'}</span>
                    <span className="font-medium">{property.features.streetWidthNorth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الواجهة:' : 'Facade:'}</span>
                    <span className="font-medium">{property.features.facade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'رقم المخطط:' : 'Plan Number:'}</span>
                    <span className="font-medium">{property.features.planNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'رقم البلوك:' : 'Block Number:'}</span>
                    <span className="font-medium">{property.features.blockNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'رقم القطعة:' : 'Parcel Number:'}</span>
                    <span className="font-medium">{property.features.parcelNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'التقسيم:' : 'Subdivision:'}</span>
                    <span className="font-medium">{property.features.subdivision || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'تصنيف الأرض:' : 'Land Classification:'}</span>
                    <span className="font-medium">{property.features.landClassification || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'سعر المتر:' : 'Price per sqm:'}</span>
                    <span className="font-medium">{property.features.pricePerSqm || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الاستعمال المسموح به:' : 'Allowed Usage:'}</span>
                    <span className="font-medium">{property.features.allowedUsage || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الحد الأقصى لارتفاع المبنى:' : 'Max Building Height:'}</span>
                    <span className="font-medium">{property.features.maxBuildingHeight || 'N/A'}</span>
                  </div>
                </div>
              ) : null}

              {/* Villa Data */}
              {property.type === 'villa' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                    <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عرض الشارع:' : 'Street Width:'}</span>
                    <span className="font-medium">{property.features.streetWidthNorth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الواجهة:' : 'Facade:'}</span>
                    <span className="font-medium">{property.features.facade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد الأدوار:' : 'Number of Floors:'}</span>
                    <span className="font-medium">{property.features.floors || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد الشقق:' : 'Number of Apartments:'}</span>
                    <span className="font-medium">{property.features.apartments || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عمر العقار:' : 'Property Age:'}</span>
                    <span className="font-medium">{property.features.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'غرف النوم:' : 'Bedrooms:'}</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الصالات:' : 'Living Rooms:'}</span>
                    <span className="font-medium">{property.features.dailyLivingRoom || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المجالس:' : 'Majlis:'}</span>
                    <span className="font-medium">{property.features.guestLounge || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'دورات المياه:' : 'Bathrooms:'}</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'نظام التكييف:' : 'AC System:'}</span>
                    <span className="font-medium">{property.features.acSystem || 'N/A'}</span>
                  </div>
                </div>
              ) : null}

              {/* Store/Showroom Data */}
              {(property.type === 'store' || property.type === 'showroom') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                    <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عرض الشارع:' : 'Street Width:'}</span>
                    <span className="font-medium">{property.features.streetWidthNorth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الواجهة:' : 'Facade:'}</span>
                    <span className="font-medium">{property.features.facade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عمر العقار:' : 'Property Age:'}</span>
                    <span className="font-medium">{property.features.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'ميزان:' : 'Scale:'}</span>
                    <span className="font-medium">{property.features.scale || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'مساحة الميزان:' : 'Scale Area:'}</span>
                    <span className="font-medium">{property.features.scaleArea || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'سعر المتر:' : 'Price per sqm:'}</span>
                    <span className="font-medium">{property.features.pricePerSqm || 'N/A'}</span>
                  </div>
                </div>
              ) : null}

              {/* Building Data */}
              {property.type === 'building' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'المساحة:' : 'Area:'}</span>
                    <span className="font-medium">{property.area} {isRTL ? 'م²' : 'sqm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عرض الشارع:' : 'Street Width:'}</span>
                    <span className="font-medium">{property.features.streetWidthNorth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'الواجهة:' : 'Facade:'}</span>
                    <span className="font-medium">{property.features.facade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عمر العقار:' : 'Property Age:'}</span>
                    <span className="font-medium">{property.features.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد الأدوار:' : 'Number of Floors:'}</span>
                    <span className="font-medium">{property.features.floors || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد الشقق:' : 'Number of Apartments:'}</span>
                    <span className="font-medium">{property.features.apartments || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد المحلات:' : 'Number of Shops:'}</span>
                    <span className="font-medium">{property.features.shops || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد العدادات:' : 'Number of Meters:'}</span>
                    <span className="font-medium">{property.features.meters || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground">{isRTL ? 'عدد المصاعد:' : 'Number of Elevators:'}</span>
                    <span className="font-medium">{property.features.elevator || 'N/A'}</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Description Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isRTL ? 'الوصف' : 'Description'}
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                {isRTL ? 
                  'عقار مميز يتميز بمساحات واسعة وتصميم عصري مع جميع المرافق الحديثة والخدمات المتكاملة. موقع استراتيجي مناسب للعائلات التي تبحث عن الراحة والرفاهية. يتميز العقار بموقعه المتميز في قلب المدينة مع سهولة الوصول إلى جميع الخدمات والمرافق الحيوية.' :
                  'A distinguished property featuring spacious areas and modern design with all modern facilities and integrated services. Strategic location suitable for families looking for comfort and luxury. The property is distinguished by its prime location in the heart of the city with easy access to all vital services and facilities.'
                }
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t('property.features')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(property.features).map(([key, value]) => {
                  if (value === 0) return null;
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
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                {t('property.services')}
              </h3>
              <div className="space-y-2">
                {property.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>

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
