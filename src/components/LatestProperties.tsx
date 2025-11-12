import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ArrowRight, ArrowLeft } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/data/propertyData';
import { Button } from '@/components/ui/button';

const LatestProperties = () => {
  const { isRTL } = useLanguage();

  const latestProperties = useMemo(() => {
    return [...properties]
      .sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, []);

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

  const buildingTypeNames: Record<
    string,
    { ar: string; en: string }
  > = {
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

  const purposeNames: Record<
    string,
    { ar: string; en: string }
  > = {
    sale: { ar: 'للبيع', en: 'For Sale' },
    rent: { ar: 'للإيجار', en: 'For Rent' },
    investment: { ar: 'للاستثمار', en: 'For Investment' },
  };

  if (latestProperties.length === 0) {
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
            const imageSrc = resolveImage(property.images?.[0]);
            const title = isRTL ? property.title.ar : property.title.en;
            const location = isRTL
              ? property.location.ar
              : property.location.en;
            const buildingType = buildingTypeNames[property.type]
              ? buildingTypeNames[property.type][isRTL ? 'ar' : 'en']
              : property.type;
            const purpose = purposeNames[property.purpose]
              ? purposeNames[property.purpose][isRTL ? 'ar' : 'en']
              : property.purpose;

            return (
              <div
                key={property.id}
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
                  <div className="absolute bottom-4 left-0 right-0 px-5">
                    <div
                      className={`text-xs uppercase tracking-widest text-white/80 mb-1 ${
                        isRTL ? 'font-arabic' : ''
                      }`}
                    >
                      {buildingType} • {purpose}
                    </div>
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
                        {isRTL ? 'ريال سعودي' : 'SAR'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className={isRTL ? 'font-arabic text-sm' : 'text-sm'}>
                      {location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4 text-primary" />
                      <span className={isRTL ? 'font-arabic' : ''}>
                        {property.area} {isRTL ? 'م²' : 'sqm'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-primary" />
                      <span className={isRTL ? 'font-arabic' : ''}>
                        {property.bedrooms > 0
                          ? property.bedrooms
                          : isRTL
                          ? '—'
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-primary" />
                      <span className={isRTL ? 'font-arabic' : ''}>
                        {property.bathrooms > 0
                          ? property.bathrooms
                          : isRTL
                          ? '—'
                          : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {isRTL ? 'رمز العقار' : 'Property Code'}: {property.propertyCode}
                    </div>
                    <Button variant="link" className="px-0 text-primary" asChild>
                      <Link
                        to={`/property/${property.id}`}
                        className="inline-flex items-center gap-2"
                      >
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestProperties;

