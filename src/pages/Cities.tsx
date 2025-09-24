import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Filter, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { buildingTypes, purposes } from '@/data/propertyData';
import { Button } from '@/components/ui/button';
import PropertyFilters from '@/components/PropertyFilters';

const Cities = () => {
  const { t, isRTL } = useLanguage();
  const { searchResults, totalResults, clearFilters, filters, isSearching } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('cities.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('cities.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 pt-8">
        <PropertyFilters />
      </div>

      {/* Results Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('cities.results')}
            </h2>
            <p className="text-muted-foreground">
              {isSearching 
                ? t('cities.searching')
                : `${totalResults} ${t('cities.propertiesFound')}`
              }
            </p>
          </div>
          {(filters.city || filters.purpose || filters.type || filters.buildingType) && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('cities.clearFilters')}
              </Button>
          )}
        </div>
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
                key={property.id}
                to={`/property/${property.id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.images[0]}
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
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{isRTL ? property.location.ar : property.location.en}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2">
                    {isRTL ? property.title.ar : property.title.en}
                  </h3>

                  {/* Property Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span className="text-sm">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Bath className="h-4 w-4" />
                        <span className="text-sm">{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Square className="h-4 w-4" />
                      <span className="text-sm">{property.area} {t('cities.sqm')}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t('cities.currency')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {searchResults.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn-outline group">
              <span>{t('cities.loadMore')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cities;