import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, Property, PropertyFilters } from '@/services/api';
import { cities, purposes, propertyTypes, buildingTypes } from '@/data/propertyData';

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
  searchResults: Property[];
  isSearching: boolean;
  performSearch: () => Promise<void>;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  loadMore: () => Promise<void>;
  error: string | null;
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
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  const performSearch = async (page = 1, append = false) => {
    setIsSearching(true);
    setError(null);

    try {
      // Convert filters to API format
      const apiFilters: PropertyFilters = {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      // Map frontend filters to API filters
      if (filters.purpose) apiFilters.purpose = filters.purpose;
      if (filters.buildingType && filters.buildingType !== 'all') apiFilters.type = filters.buildingType;
      if (filters.type) apiFilters.type = filters.type;
      if (filters.minPrice) apiFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) apiFilters.maxPrice = filters.maxPrice;
      if (filters.minArea) apiFilters.minArea = filters.minArea;
      if (filters.maxArea) apiFilters.maxArea = filters.maxArea;
      if (filters.bedrooms) apiFilters.bedrooms = filters.bedrooms;
      if (filters.bathrooms) apiFilters.bathrooms = filters.bathrooms;
      if (filters.city) apiFilters.city = filters.city;

      const response = await apiService.getProperties(apiFilters);

      if (response.success) {
        if (append) {
          setSearchResults(prev => [...prev, ...response.data]);
        } else {
          setSearchResults(response.data);
        }
        
        if (response.pagination) {
          setTotalResults(response.pagination.totalItems);
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.currentPage);
        }
      } else {
        setError('Failed to fetch properties');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  const loadMore = async () => {
    if (currentPage < totalPages && !isSearching) {
      await performSearch(currentPage + 1, true);
    }
  };

  // Load initial data
  useEffect(() => {
    performSearch();
  }, []);

  // Perform search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const value = {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    searchResults,
    isSearching,
    performSearch: () => performSearch(),
    totalResults,
    currentPage,
    totalPages,
    loadMore,
    error
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
