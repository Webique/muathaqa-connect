import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, Eye } from 'lucide-react';
import { apiService, Property } from '@/services/api';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    locationAr: '',
    locationEn: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    type: '',
    purpose: '',
    usage: '',
    images: '',
    services: '',
    advertiserNumber: '',
    advertiserLicense: '',
    floors: '',
    guestLounge: '',
    facade: '',
    streetWidthNorth: '',
    dailyLivingRoom: '',
    diningRoom: '',
    maidRoom: '',
    driverRoom: '',
    kitchen: '',
    storageRoom: '',
    elevator: ''
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
          ar: formData.titleAr,
          en: formData.titleEn
        },
        location: {
          ar: formData.locationAr,
          en: formData.locationEn
        },
        price: parseInt(formData.price),
        area: parseInt(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        type: formData.type,
        purpose: formData.purpose,
        usage: formData.usage,
        images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
        services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
        advertiser: {
          number: formData.advertiserNumber,
          license: formData.advertiserLicense
        },
        features: {
          floors: parseInt(formData.floors) || 0,
          guestLounge: parseInt(formData.guestLounge) || 0,
          facade: formData.facade,
          streetWidthNorth: parseInt(formData.streetWidthNorth) || 0,
          dailyLivingRoom: parseInt(formData.dailyLivingRoom) || 0,
          diningRoom: parseInt(formData.diningRoom) || 0,
          maidRoom: parseInt(formData.maidRoom) || 0,
          driverRoom: parseInt(formData.driverRoom) || 0,
          kitchen: parseInt(formData.kitchen) || 0,
          storageRoom: parseInt(formData.storageRoom) || 0,
          elevator: parseInt(formData.elevator) || 0
        }
      };

      if (editingProperty) {
        await apiService.updateProperty(editingProperty._id, propertyData);
        toast.success('Property updated successfully');
      } else {
        await apiService.createProperty(propertyData);
        toast.success('Property created successfully');
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
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await apiService.deleteProperty(id);
        toast.success('Property deleted successfully');
        loadProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      titleAr: property.title.ar,
      titleEn: property.title.en,
      locationAr: property.location.ar,
      locationEn: property.location.en,
      price: property.price.toString(),
      area: property.area.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      type: property.type,
      purpose: property.purpose,
      usage: property.usage,
      images: property.images.join(', '),
      services: property.services.join(', '),
      advertiserNumber: property.advertiser.number,
      advertiserLicense: property.advertiser.license,
      floors: property.features.floors.toString(),
      guestLounge: property.features.guestLounge.toString(),
      facade: property.features.facade,
      streetWidthNorth: property.features.streetWidthNorth.toString(),
      dailyLivingRoom: property.features.dailyLivingRoom.toString(),
      diningRoom: property.features.diningRoom.toString(),
      maidRoom: property.features.maidRoom.toString(),
      driverRoom: property.features.driverRoom.toString(),
      kitchen: property.features.kitchen.toString(),
      storageRoom: property.features.storageRoom.toString(),
      elevator: property.features.elevator.toString()
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      locationAr: '',
      locationEn: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      type: '',
      purpose: '',
      usage: '',
      images: '',
      services: '',
      advertiserNumber: '',
      advertiserLicense: '',
      floors: '',
      guestLounge: '',
      facade: '',
      streetWidthNorth: '',
      dailyLivingRoom: '',
      diningRoom: '',
      maidRoom: '',
      driverRoom: '',
      kitchen: '',
      storageRoom: '',
      elevator: ''
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="mt-2 text-gray-600">Manage your property listings</p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingProperty(null);
              resetForm();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Cancel' : 'Add New Property'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="titleAr">Title (Arabic)</Label>
                    <Input
                      id="titleAr"
                      value={formData.titleAr}
                      onChange={(e) => handleInputChange('titleAr', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Title (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationAr">Location (Arabic)</Label>
                    <Input
                      id="locationAr"
                      value={formData.locationAr}
                      onChange={(e) => handleInputChange('locationAr', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationEn">Location (English)</Label>
                    <Input
                      id="locationEn"
                      value={formData.locationEn}
                      onChange={(e) => handleInputChange('locationEn', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (SAR)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      required
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
                  <div>
                    <Label htmlFor="usage">Usage</Label>
                    <Select value={formData.usage} onValueChange={(value) => handleInputChange('usage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select usage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="images">Images (comma-separated URLs)</Label>
                    <Textarea
                      id="images"
                      value={formData.images}
                      onChange={(e) => handleInputChange('images', e.target.value)}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="services">Services (comma-separated)</Label>
                    <Textarea
                      id="services"
                      value={formData.services}
                      onChange={(e) => handleInputChange('services', e.target.value)}
                      placeholder="Electricity, Water, Sewage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="advertiserNumber">Advertiser Number</Label>
                    <Input
                      id="advertiserNumber"
                      value={formData.advertiserNumber}
                      onChange={(e) => handleInputChange('advertiserNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="advertiserLicense">Advertiser License</Label>
                    <Input
                      id="advertiserLicense"
                      value={formData.advertiserLicense}
                      onChange={(e) => handleInputChange('advertiserLicense', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingProperty ? 'Update Property' : 'Create Property'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

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
                <div className="space-y-2">
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
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purpose:</span>
                    <Badge variant="outline" className="capitalize">{property.purpose}</Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
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
