import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, X } from 'lucide-react';
import { apiService, Property } from '@/services/api';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    locationEn: '',
    locationAr: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    type: '',
    purpose: '',
    images: '',
    services: '',
    advertiserNumber: '',
    advertiserLicense: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProperties();
      if (response.success) {
        setProperties(response.data);
      }
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const propertyData = {
        title: {
          ar: formData.titleAr || formData.titleEn,
          en: formData.titleEn
        },
        location: {
          ar: formData.locationAr || formData.locationEn,
          en: formData.locationEn || 'Saudi Arabia'
        },
        price: parseInt(formData.price),
        area: parseInt(formData.area) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        type: formData.type || 'villa',
        purpose: formData.purpose || 'sale',
        usage: 'Residential',
        images: formData.images ? formData.images.split(',').map(img => img.trim()).filter(Boolean) : ['/src/assets/hero-real-estate.jpg'],
        services: formData.services ? formData.services.split(',').map(s => s.trim()).filter(Boolean) : ['Electricity', 'Water'],
        advertiser: {
          number: formData.advertiserNumber || '7200640143',
          license: formData.advertiserLicense || '1200027687'
        },
        features: {
          floors: 1,
          guestLounge: 0,
          facade: 'North',
          streetWidthNorth: 10,
          dailyLivingRoom: 1,
          diningRoom: 1,
          maidRoom: 0,
          driverRoom: 0,
          kitchen: 1,
          storageRoom: 0,
          elevator: 0
        }
      };

      if (editingProperty) {
        await apiService.updateProperty(editingProperty._id, propertyData);
        toast.success('Property updated successfully!');
      } else {
        await apiService.createProperty(propertyData);
        toast.success('Property added successfully!');
      }

      setShowForm(false);
      setEditingProperty(null);
      resetForm();
      loadProperties();
    } catch (error) {
      toast.error('Failed to save property');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this property?')) {
      try {
        await apiService.deleteProperty(id);
        toast.success('Property deleted!');
        loadProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      titleEn: property.title.en,
      titleAr: property.title.ar,
      locationEn: property.location.en,
      locationAr: property.location.ar,
      price: property.price.toString(),
      area: property.area.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      type: property.type,
      purpose: property.purpose,
      images: property.images.join(', '),
      services: property.services.join(', '),
      advertiserNumber: property.advertiser.number,
      advertiserLicense: property.advertiser.license
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleAr: '',
      locationEn: '',
      locationAr: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      type: '',
      purpose: '',
      images: '',
      services: '',
      advertiserNumber: '',
      advertiserLicense: ''
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="mt-2 text-gray-600">Simple property management</p>
        </div>

        {/* Add Property Button */}
        <div className="mb-6">
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingProperty(null);
              resetForm();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? 'Cancel' : 'Add New Property'}
          </Button>
        </div>

        {/* Simple Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                    resetForm();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Required Fields */}
                  <div>
                    <Label htmlFor="titleEn">Property Name (English) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      placeholder="e.g., Villa in Al Malqa"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleAr">Property Name (Arabic)</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr}
                      onChange={(e) => handleInputChange('titleAr', e.target.value)}
                      placeholder="مثال: فيلا في الملقا"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (SAR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="8000000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationEn">Location (English)</Label>
                    <Input
                      id="locationEn"
                      value={formData.locationEn}
                      onChange={(e) => handleInputChange('locationEn', e.target.value)}
                      placeholder="e.g., Riyadh, Saudi Arabia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationAr">Location (Arabic)</Label>
                    <Input
                      id="locationAr"
                      value={formData.locationAr}
                      onChange={(e) => handleInputChange('locationAr', e.target.value)}
                      placeholder="مثال: الرياض، المملكة العربية السعودية"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      placeholder="6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Property Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="investment">For Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="images">Images (comma-separated URLs)</Label>
                    <Textarea
                      id="images"
                      value={formData.images}
                      onChange={(e) => handleInputChange('images', e.target.value)}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Textarea
                      id="services"
                      value={formData.services}
                      onChange={(e) => handleInputChange('services', e.target.value)}
                      placeholder="Electricity, Water, Sewage"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                    {editingProperty ? 'Update Property' : 'Add Property'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{property.title.en}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{property.location.en}</p>
                  </div>
                  <Badge variant="secondary">{property.propertyCode}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Area:</span>
                    <span>{property.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bathrooms:</span>
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="capitalize">{property.type.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(property)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(property._id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 mt-2">Click "Add New Property" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
