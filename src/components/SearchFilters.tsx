import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { cities, purposes, propertyTypes, buildingTypes } from '@/data/propertyData';

interface SearchFiltersProps {
  className?: string;
  variant?: 'hero' | 'page';
}

const SearchFilters = ({ className = '', variant = 'hero' }: SearchFiltersProps) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { filters, updateFilter, performSearch, isSearching } = useSearch();

  const handleCityChange = (cityKey: string) => {
    updateFilter('city', cityKey);
    updateFilter('district', ''); // Reset district when city changes
  };

  const handleSearch = () => {
    performSearch();
    navigate('/cities');
  };

  const getDistrictsForCity = () => {
    if (!filters.city || !cities[filters.city as keyof typeof cities]) {
      return [];
    }
    return cities[filters.city as keyof typeof cities].districts;
  };

  const containerClasses = variant === 'hero' 
    ? `bg-background/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-medium ${className}`
    : `bg-card border border-border rounded-xl p-6 shadow-soft ${className}`;

  return (
    <div className={containerClasses}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* City Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t('search.city')}
          </label>
          <Select value={filters.city} onValueChange={handleCityChange}>
            <SelectTrigger className="h-12 bg-background border-border">
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
            <SelectTrigger className="h-12 bg-background border-border">
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
            <SelectTrigger className="h-12 bg-background border-border">
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
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger className="h-12 bg-background border-border">
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
            <SelectTrigger className="h-12 bg-background border-border">
              <SelectValue placeholder={t('search.placeholder.buildingType')} />
            </SelectTrigger>
            <SelectContent 
              className="z-50" 
              side="bottom" 
              sideOffset={4}
              position="popper"
              avoidCollisions={false}
            >
              {buildingTypes.map((buildingType) => (
                <SelectItem key={buildingType.key} value={buildingType.key}>
                  {isRTL ? buildingType.ar : buildingType.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="space-y-2 md:col-span-2 lg:col-span-3 xl:col-span-1">
          <label className="text-sm font-medium text-transparent">
            {/* Spacer for alignment */}
            Search
          </label>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full h-12 bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium transition-smooth hover:scale-105"
          >
            <Search className="h-5 w-5 mr-2" />
            {isSearching ? (isRTL ? 'جاري البحث...' : 'Searching...') : t('search.button')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;