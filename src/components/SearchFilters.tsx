import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cities, purposes, propertyTypes } from '@/data/propertyData';

interface SearchFiltersProps {
  className?: string;
  variant?: 'hero' | 'page';
}

const SearchFilters = ({ className = '', variant = 'hero' }: SearchFiltersProps) => {
  const { t, isRTL } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey);
    setSelectedDistrict(''); // Reset district when city changes
  };

  const handleSearch = () => {
    const searchParams = {
      city: selectedCity,
      district: selectedDistrict,
      purpose: selectedPurpose,
      type: selectedType
    };
    console.log('Search params:', searchParams);
    // TODO: Implement search functionality
  };

  const getDistrictsForCity = () => {
    if (!selectedCity || !cities[selectedCity as keyof typeof cities]) {
      return [];
    }
    return cities[selectedCity as keyof typeof cities].districts;
  };

  const containerClasses = variant === 'hero' 
    ? `bg-background/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-medium ${className}`
    : `bg-card border border-border rounded-xl p-6 shadow-soft ${className}`;

  return (
    <div className={containerClasses}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* City Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t('search.city')}
          </label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="h-12 bg-background border-border">
              <SelectValue placeholder={t('search.placeholder.city')} />
            </SelectTrigger>
            <SelectContent>
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
            value={selectedDistrict} 
            onValueChange={setSelectedDistrict}
            disabled={!selectedCity}
          >
            <SelectTrigger className="h-12 bg-background border-border">
              <SelectValue placeholder={t('search.placeholder.district')} />
            </SelectTrigger>
            <SelectContent>
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
          <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
            <SelectTrigger className="h-12 bg-background border-border">
              <SelectValue placeholder={t('search.placeholder.purpose')} />
            </SelectTrigger>
            <SelectContent>
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
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-12 bg-background border-border">
              <SelectValue placeholder={t('search.placeholder.type')} />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.key} value={type.key}>
                  {isRTL ? type.ar : type.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="space-y-2 md:col-span-2 lg:col-span-4 xl:col-span-1">
          <label className="text-sm font-medium text-transparent">
            {/* Spacer for alignment */}
            Search
          </label>
          <Button 
            onClick={handleSearch}
            className="w-full h-12 bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium transition-smooth hover:scale-105"
          >
            <Search className="h-5 w-5 mr-2" />
            {t('search.button')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;