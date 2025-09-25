import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { cities, purposes, propertyTypes, buildingTypes } from '@/data/propertyData';

const PropertyFilters = () => {
  const { t, isRTL } = useLanguage();
  const { filters, updateFilter, clearFilters } = useSearch();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCityChange = (cityKey: string) => {
    updateFilter('city', cityKey);
    updateFilter('district', ''); // Reset district when city changes
  };

  const getDistrictsForCity = () => {
    if (!filters.city || !cities[filters.city as keyof typeof cities]) {
      return [];
    }
    return cities[filters.city as keyof typeof cities].districts;
  };

  // Add helper function to get filtered building types
  const getFilteredBuildingTypes = () => {
    if (filters.type === 'commercial') {
      // For commercial properties, only show land and building
      return buildingTypes.filter(type => 
        type.key === 'all' || type.key === 'land' || type.key === 'building'
      );
    }
    // For residential or no selection, show all building types
    return buildingTypes;
  };

  const handleTypeChange = (typeKey: string) => {
    updateFilter('type', typeKey);
    
    // Reset building type if it's not available for the new property type
    if (typeKey === 'commercial' && filters.buildingType && 
        !['all', 'land', 'building'].includes(filters.buildingType)) {
      updateFilter('buildingType', '');
    }
  };

  const hasActiveFilters = filters.city || filters.district || filters.purpose || filters.type || filters.buildingType || filters.minPrice || filters.maxPrice || filters.minArea || filters.maxArea || filters.bedrooms || filters.bathrooms;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {t('filters.title')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {t('filters.clearAll')}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('filters.hideFilters') : t('filters.showFilters')}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('search.city')}
            </label>
            <Select value={filters.city} onValueChange={handleCityChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('search.placeholder.city')} />
              </SelectTrigger>
              <SelectContent className="z-50" side="bottom">
                {Object.entries(cities).map(([key, city]) => (
                  <SelectItem key={key} value={key}>
                    {isRTL ? city.ar : city.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('search.district')}
            </label>
            <Select 
              value={filters.district} 
              onValueChange={(value) => updateFilter('district', value)}
              disabled={!filters.city}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('search.placeholder.district')} />
              </SelectTrigger>
              <SelectContent className="z-50" side="bottom">
                {getDistrictsForCity().map((district, index) => (
                  <SelectItem key={index} value={isRTL ? district.ar : district.en}>
                    {isRTL ? district.ar : district.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purpose Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('search.purpose')}
            </label>
            <Select value={filters.purpose} onValueChange={(value) => updateFilter('purpose', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('search.placeholder.purpose')} />
              </SelectTrigger>
              <SelectContent className="z-50" side="bottom">
                {purposes.map((purpose) => (
                  <SelectItem key={purpose.key} value={purpose.key}>
                    {isRTL ? purpose.ar : purpose.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('search.type')}
            </label>
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('search.placeholder.type')} />
              </SelectTrigger>
              <SelectContent className="z-50" side="bottom">
                {propertyTypes.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    {isRTL ? type.ar : type.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Building Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('search.buildingType')}
            </label>
            <Select value={filters.buildingType} onValueChange={(value) => updateFilter('buildingType', value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t('search.placeholder.buildingType')} />
              </SelectTrigger>
              <SelectContent className="z-50" side="bottom">
                {getFilteredBuildingTypes().map((buildingType) => (
                  <SelectItem key={buildingType.key} value={buildingType.key}>
                    {isRTL ? buildingType.ar : buildingType.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.minPrice')}
            </label>
            <Input
              type="number"
              placeholder={t('filters.minPrice')}
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.maxPrice')}
            </label>
            <Input
              type="number"
              placeholder={t('filters.maxPrice')}
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>

          {/* Area Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.minArea')}
            </label>
            <Input
              type="number"
              placeholder="m²"
              value={filters.minArea || ''}
              onChange={(e) => updateFilter('minArea', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.maxArea')}
            </label>
            <Input
              type="number"
              placeholder="m²"
              value={filters.maxArea || ''}
              onChange={(e) => updateFilter('maxArea', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.bedrooms')}
            </label>
            <Input
              type="number"
              placeholder={t('filters.bedroomsPlaceholder')}
              value={filters.bedrooms || ''}
              onChange={(e) => updateFilter('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('filters.bathrooms')}
            </label>
            <Input
              type="number"
              placeholder={t('filters.bathroomsPlaceholder')}
              value={filters.bathrooms || ''}
              onChange={(e) => updateFilter('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="h-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
