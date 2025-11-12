import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ArrowRight, ArrowLeft } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

const LatestProperties = () => {
  const { isRTL, t } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProperties();
        if (response.success) {
          setProperties(response.data ?? []);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error('Error loading latest properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const latestProperties = useMemo(() => {
    if (!properties.length) return [];

    const sorted = [...properties].sort((a, b) => {
      const getTimestamp = (prop: any) => {
        if (prop.createdAt) return new Date(prop.createdAt).getTime();
        if (prop.updatedAt) return new Date(prop.updatedAt).getTime();
        return 0;
      };

      return getTimestamp(b) - getTimestamp(a);
    });

    return sorted.slice(0, 4);
  }, [properties]);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      maximumFractionDigits: 0,
    }).format(price);

  const resolveImage = (src?: string) => {
    if (!src) return '';
    if (src.startsWith('/src/assets/')) {
      return src.replace('/src/assets/', '/assets/');
    }
    return src;
  };

  const getBuildingTypeName = (type: string) => {
    const typeNames: Record<string, { ar: string; en: string }> = {
      villa: { ar: 'فيلا', en: 'Villa' },
      apartment_tower: { ar: 'شقة في برج', en: 'Apartment in Tower' },
      apartment_building: { ar: 'شقة في مبنى', en: 'Apartment in Building' },
      land: { ar: 'أرض', en: 'Land' },
      building: { ar: 'مبنى', en: 'Building' },
      townhouse: { ar: 'تاون هاوس', en: 'Townhouse' },
      mansion: { ar: 'قصر', en: 'Mansion' },
      farm: { ar: 'مزرعة', en: 'Farm' },
      istraha: { ar: 'استراحة', en: 'Istraha' },
      store: { ar: 'محل', en: 'Store' },
      office: { ar: 'مكتب', en: 'Office' },
      resort: { ar: 'منتجع', en: 'Resort' },
      showroom: { ar: 'صالة عرض', en: 'Showroom' },
    };

    return typeNames[type] ? typeNames[type][isRTL ? 'ar' : 'en'] : type;
  };

  const getPurposeName = (purpose: string) => {
    const purposeNames: Record<string, { ar: string; en: string }> = {
      sale: { ar: 'للبيع', en: 'For Sale' },
      rent: { ar: 'للإيجار', en: 'For Rent' },
      investment: { ar: 'للاستثمار', en: 'For Investment' },
    };

    return purposeNames[purpose]
      ? purposeNames[purpose][isRTL ? 'ar' : 'en']
      : purpose;
  };

  if (loading || latestProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <h2
              className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
                isRTL ? 'font-arabic' : ''
              }`}
            >
              {isRTL ? 'أحدث العقارات المضافة' : 'Recently Added Properties'}
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl ${
                isRTL ? 'font-arabic' : ''
              }`}
            >
              {isRTL
                ? 'اطّلع على أحدث العقارات التي تم إضافتها إلى منصتنا بعناية لتناسب تطلعاتك العقارية.'
                : 'Explore the newest properties carefully curated to match your real estate aspirations.'}
            </p>
          </div>

          <Button asChild variant="outline" className="whitespace-nowrap">
            <Link to="/cities">
              {isRTL ? 'عرض جميع العقارات' : 'View All Properties'}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {latestProperties.map((property) => {
            const imageSrc = resolveImage(
              property.images && property.images.length > 0
                ? property.images[0]
                : '',
            );
            const title = isRTL ? property.title?.ar : property.title?.en;
            const location = isRTL
              ? property.location?.ar
              : property.location?.en;
            const buildingType = getBuildingTypeName(property.type);
            const purpose = getPurposeName(property.purpose);

            return (
              <Link
                key={property._id || property.id}
                to={`/property/${property._id || property.id}`}
                className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-medium transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      {isRTL ? 'لا توجد صورة' : 'No image available'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {purpose}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {buildingType}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 px-5">
                    <h3
                      className={`text-2xl font-semibold text-white leading-snug ${
                        isRTL ? 'font-arabic' : ''
                      }`}
                    >
                      {title}
                    </h3>
                    <div className="text-lg font-semibold text-primary mt-2">
                      {formatPrice(property.price)}{' '}
                      <span className="text-sm text-white/80">
                        {t('cities.currency')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1 break-words">
                      {formatPrice(property.price)} {t('cities.currency')}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {title}
                    </h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-primary" />
                      <span className="text-sm truncate">
                        {location}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Square className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {t('cities.sqm')}
                        </span>
                      </div>
                      <div className="font-semibold text-foreground">
                        {property.area}
                      </div>
                    </div>
                    {property.bedrooms > 0 && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Bed className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm text-muted-foreground">
                            {t('common.bedrooms')}
                          </span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {property.bedrooms}
                        </div>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Bath className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm text-muted-foreground">
                            {t('common.bathrooms')}
                          </span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {property.bathrooms}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                      {isRTL ? 'تفاصيل المعلن' : 'Advertiser Details'}
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground flex-shrink-0">
                          {isRTL ? 'كود العقار' : 'Property Code'}
                        </span>
                        <span className="font-medium text-right break-all">{property.propertyCode}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground flex-shrink-0">
                          {isRTL ? 'رخصة الإعلان' : 'Advertisement License'}
                        </span>
                        <span className="font-medium text-right break-all">{property.advertiser?.number}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-muted-foreground flex-shrink-0">
                          {isRTL ? 'رخصة فال' : 'License Number'}
                        </span>
                        <span className="font-medium text-right break-all">{property.advertiser?.license}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-medium">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestProperties;

