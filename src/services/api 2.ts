const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Property {
  _id?: string;
  title: { ar: string; en: string };
  location: { ar: string; en: string };
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: string;
  purpose?: string;
  usage?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  search?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Property CRUD operations
  async getProperties(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<Property[]>(endpoint);
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`);
  }

  async createProperty(property: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  }

  async deleteProperty(id: string): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics
  async getPropertyStats(): Promise<ApiResponse<{
    totalProperties: number;
    forSale: number;
    forRent: number;
    forInvestment: number;
    averagePrice: number;
    averageArea: number;
    typeDistribution: Array<{ _id: string; count: number }>;
  }>> {
    return this.request('/properties/stats/summary');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{
    message: string;
    timestamp: string;
    environment: string;
  }>> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService; 