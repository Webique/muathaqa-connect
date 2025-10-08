import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Filter, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const Cities = () => {
  const { t, isRTL } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search filters
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    purpose: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProperties();
      if (response.success) {
        setProperties(response.data);
        setSearchResults(response.data);
      } else {
        console.error('Failed to load properties:', response.error);
        setProperties([]);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    let filtered = [...properties];

    // Apply filters
    if (filters.city) {
      filtered = filtered.filter(property => 
        property.location.en.toLowerCase().includes(filters.city.toLowerCase()) ||
        property.location.ar.includes(filters.city)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.purpose) {
      filtered = filtered.filter(property => property.purpose === filters.purpose);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    if (filters.minArea) {
      filtered = filtered.filter(property => property.area >= parseInt(filters.minArea));
    }

    if (filters.maxArea) {
      filtered = filtered.filter(property => property.area <= parseInt(filters.maxArea));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.bathrooms));
    }

    setSearchResults(filtered);
    setIsSearching(false);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      purpose: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchResults(properties);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('cities.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('cities.subtitle')}
          </p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {t('filters.title')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.city')}
                </label>
                <Input
                  placeholder={t('filters.cityPlaceholder')}
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.type')}
                </label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment_tower">Apartment in Tower</SelectItem>
                    <SelectItem value="apartment_building">Apartment in Building</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="mansion">Mansion</SelectItem>
                    <SelectItem value="farm">Farm</SelectItem>
                    <SelectItem value="istraha">Istraha</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="showroom">Showroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.purpose')}
                </label>
                <Select value={filters.purpose} onValueChange={(value) => setFilters(prev => ({ ...prev, purpose: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.purposePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="investment">For Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.minPrice')}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.maxPrice')}
                </label>
                <Input
                  type="number"
                  placeholder="10000000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.minArea')}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minArea}
                  onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.maxArea')}
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filters.maxArea}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('filters.bedrooms')}
                </label>
                <Input
                  type="number"
                  placeholder={t('filters.bedroomsPlaceholder')}
                  value={filters.bedrooms}
                  onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                {t('filters.search')}
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                {t('filters.clearAll')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 pb-12">
        {searchResults.length === 0 && !isSearching ? (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('cities.noResults')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('cities.noResultsDescription')}
            </p>
            <Button onClick={clearFilters}>
              {t('cities.clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((property) => (
              <Link
                key={property._id}
                to={`/property/${property._id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images && property.images.length > 0 ? 
    property.images[0].replace('/src/assets/', '/assets/') : 
    '/assets/hero-real-estate.jpg'}
                    alt={isRTL ? property.title.ar : property.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {getPurposeName(property.purpose)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {getBuildingTypeName(property.type)}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {isRTL ? property.title.ar : property.title.en}
                      </h3>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {isRTL ? property.location.ar : property.location.en}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('cities.currency')}
                      </div>
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
                  
                  {/* Advertiser Details */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">
                      {isRTL ? 'تفاصيل المعلن' : 'Advertiser Details'}
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {isRTL ? 'كود العقار' : 'Property Code'}
                        </span>
                        <span className="font-medium">{property.propertyCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {isRTL ? 'رخصة الإعلان' : 'Advertisement License'}
                        </span>
                        <span className="font-medium">{property.advertiser.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {isRTL ? 'رخصة فال' : 'License Number'}
                        </span>
                        <span className="font-medium">{property.advertiser.license}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cities;
