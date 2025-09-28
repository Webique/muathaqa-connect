// API configuration for Netlify Functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Types
export interface Property {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  location: {
    ar: string;
    en: string;
  };
  propertyCode: string;
  images: string[];
  video?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  purpose: string;
  features: {
    floors: number;
    guestLounge: number;
    facade: string;
    streetWidthNorth: number;
    dailyLivingRoom: number;
    diningRoom: number;
    maidRoom: number;
    driverRoom: number;
    kitchen: number;
    storageRoom: number;
    elevator: number;
  };
  services: string[];
  usage: string;
  advertiser: {
    number: string;
    license: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface PropertyFilters {
  type?: string;
  purpose?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API service class
class ApiService {
  private baseURL: string;

  constructor() {
    // For Netlify Functions, we use relative URLs
    this.baseURL = API_BASE_URL || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Properties API
  async getProperties(filters: PropertyFilters = {}): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/api/properties?${queryString}` : '/api/properties';
    
    return this.request<Property[]>(endpoint);
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/api/properties/${id}`);
  }

  async createProperty(property: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> {
    return this.request<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  }

  async deleteProperty(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async searchProperties(query: string, page = 1, limit = 10): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>(`/api/properties/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`);
  }

  // Cities API
  async getCities(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/cities');
  }

  async getCity(cityKey: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/cities/${cityKey}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/api/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
