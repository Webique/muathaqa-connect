import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Phone,
  Mail,
  ArrowLeft
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
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
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
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${isRTL ? property.title.ar : property.title.en} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
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
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
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

            {/* Facts Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t('property.facts')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{property.area}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('cities.sqm')}
                  </div>
                </div>
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('common.bedrooms')}
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('common.bathrooms')}
                    </div>
                  </div>
                )}
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
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-muted-foreground">
                  {isRTL ? property.location.ar : property.location.en}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
