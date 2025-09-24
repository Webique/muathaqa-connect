import React, { createContext, useContext, useState, useMemo } from 'react';
import { properties, cities, purposes, propertyTypes, buildingTypes } from '@/data/propertyData';

interface SearchFilters {
  city: string;
  district: string;
  purpose: string;
  type: string;
  buildingType: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: string | number | undefined) => void;
  clearFilters: () => void;
  searchResults: typeof properties;
  isSearching: boolean;
  performSearch: () => void;
  totalResults: number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    district: '',
    purpose: '',
    type: '',
    buildingType: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      district: '',
      purpose: '',
      type: '',
      buildingType: ''
    });
  };

  const searchResults = useMemo(() => {
    return properties.filter(property => {
      // City filter
      if (filters.city && property.location.en.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // District filter (this would need to be expanded with actual district data)
      if (filters.district && property.location.en.toLowerCase() !== filters.district.toLowerCase()) {
        return false;
      }

      // Purpose filter
      if (filters.purpose && property.purpose !== filters.purpose) {
        return false;
      }

      // Property type filter (residential/commercial)
      if (filters.type && property.usage.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }

      // Building type filter
      if (filters.buildingType && filters.buildingType !== 'all' && property.type !== filters.buildingType) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }

      // Area range filter
      if (filters.minArea && property.area < filters.minArea) {
        return false;
      }
      if (filters.maxArea && property.area > filters.maxArea) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        return false;
      }

      // Bathrooms filter
      if (filters.bathrooms && property.bathrooms < filters.bathrooms) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const performSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const totalResults = searchResults.length;

  const value = {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    searchResults,
    isSearching,
    performSearch,
    totalResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
