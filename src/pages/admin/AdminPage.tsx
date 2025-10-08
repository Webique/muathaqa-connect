import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, X, Upload, Image, Video, File } from 'lucide-react';
import { apiService, Property } from '@/services/api';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{file?: File, url: string, type: 'image' | 'video', base64?: string, isExisting?: boolean}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
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
    description: '',
    services: '',
    advertiserNumber: '',
    advertiserLicense: '',
    propertyCode: '',
    
    // Common Features
    floors: '',
    facade: '',
    streetWidth: '',
    age: '',
    apartments: '',
    elevator: '',
    acSystem: '',
    category: '',
    
    // Villa Specific
    guestLounge: '',
    dailyLivingRoom: '',
    diningRoom: '',
    maidRoom: '',
    driverRoom: '',
    kitchen: '',
    storageRoom: '',
    
    // Land Specific
    planNumber: '',
    blockNumber: '',
    parcelNumber: '',
    subdivision: '',
    landClassification: '',
    pricePerSqm: '',
    allowedUsage: '',
    maxBuildingHeight: '',
    
    // Store/Showroom Specific
    scale: '',
    scaleArea: '',
    
    // Building Specific
    shops: '',
    meters: '',
    
    // Additional Features
    balcony: '',
    garden: '',
    pool: '',
    gym: '',
    security: '',
    maintenance: '',
    parkingSpaces: '',
    buildingArea: '',
    commercialArea: '',
    residentialArea: '',
    landArea: ''
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
      } else {
        toast.error('Failed to load properties: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    console.log('Starting file upload...', files);
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const newFiles: {file: File, url: string, type: 'image' | 'video', base64?: string, isExisting?: boolean}[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Processing file:', file.name, file.type, file.size);
        
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          toast.error(`${file.name} is not a supported image or video file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        const fileUrl = URL.createObjectURL(file);
        console.log('Created file URL:', fileUrl);
        
        // Convert image to base64 for storage (simplified)
        let base64 = '';
        if (isImage) {
          console.log('Converting image to base64...');
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              console.log('Base64 conversion successful');
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              console.error('Base64 conversion failed');
              reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
          });
        }
        
        newFiles.push({
          file: file,
          url: fileUrl,
          type: isImage ? 'image' : 'video',
          base64: base64
        });
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error details:', error);
      toast.error(`Failed to upload files: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      return newFiles;
    });
  };

    const getRequiredFields = (propertyType: string) => {
    // Only require the absolute basics - title, price, area, type
    // All other fields (purpose, bedrooms, bathrooms, floors, etc.) are now optional
    return ['titleEn', 'price', 'area', 'type'];
  };

  const validateForm = () => {
    const requiredFields = getRequiredFields(formData.type);
    const errors: string[] = [];

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!value || value.toString().trim() === '') {
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        errors.push(`${fieldName} is required for ${formData.type}`);
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Handle both existing and new images/videos
      const existingImages = uploadedFiles
        .filter(item => item.type === 'image' && item.isExisting)
        .map(item => item.base64 || item.url); // Use base64 or URL for existing images
      
      const newImages = uploadedFiles
        .filter(item => item.type === 'image' && !item.isExisting && item.base64)
        .map(item => item.base64);
      
      const existingVideos = uploadedFiles
        .filter(item => item.type === 'video' && item.isExisting)
        .map(item => item.url);
      
      const newVideos = uploadedFiles
        .filter(item => item.type === 'video' && !item.isExisting)
        .map(item => item.url);
      
      // Combine existing and new images/videos
      const allImages = [...existingImages, ...newImages];
      const allVideos = [...existingVideos, ...newVideos];
      
      // Ensure we have at least one image
      if (allImages.length === 0) {
        allImages.push('/assets/hero-real-estate.jpg');
      }

      const buildFeatures = () => {
        const baseFeatures = {
          floors: parseInt(formData.floors) || 0,
          guestLounge: parseInt(formData.guestLounge) || 0,
          facade: formData.facade || 'North',
          streetWidthNorth: parseInt(formData.streetWidth) || 0,
          dailyLivingRoom: parseInt(formData.dailyLivingRoom) || 0,
          diningRoom: parseInt(formData.diningRoom) || 0,
          maidRoom: parseInt(formData.maidRoom) || 0,
          driverRoom: parseInt(formData.driverRoom) || 0,
          kitchen: parseInt(formData.kitchen) || 0,
          storageRoom: parseInt(formData.storageRoom) || 0,
          elevator: parseInt(formData.elevator) || 0,
          age: parseInt(formData.age) || 0,
          apartments: parseInt(formData.apartments) || 0,
          acSystem: formData.acSystem || '',
          category: formData.category || '',
          planNumber: formData.planNumber || '',
          blockNumber: formData.blockNumber || '',
          parcelNumber: formData.parcelNumber || '',
          subdivision: formData.subdivision || '',
          landClassification: formData.landClassification || '',
          pricePerSqm: parseInt(formData.pricePerSqm) || 0,
          allowedUsage: formData.allowedUsage || '',
          maxBuildingHeight: parseInt(formData.maxBuildingHeight) || 0,
          scale: formData.scale || '',
          scaleArea: parseInt(formData.scaleArea) || 0,
          shops: parseInt(formData.shops) || 0,
          meters: parseInt(formData.meters) || 0
        };

        return baseFeatures;
      };

      // Generate unique property code
      const propertyCode = `MU-${Date.now()}`;
      
      const propertyData = {
        title: {
          ar: formData.titleAr.trim() || formData.titleEn.trim(),
          en: formData.titleEn.trim()
        },
        location: {
          ar: formData.locationAr.trim() || formData.locationEn.trim() || 'Saudi Arabia',
          en: formData.locationEn.trim() || 'Saudi Arabia'
        },
        propertyCode: propertyCode,
        price: parseInt(formData.price) || 0,
        area: parseInt(formData.area) || 0,
        bedrooms: Math.max(0, parseInt(formData.bedrooms) || 0),
        bathrooms: Math.max(0, parseInt(formData.bathrooms) || 0),
        type: formData.type || 'villa',
        purpose: formData.purpose || 'sale',
        usage: formData.type === 'land' || formData.type === 'store' || formData.type === 'office' || formData.type === 'showroom' ? 'Commercial' : 'Residential',
        images: allImages,
        video: allVideos.length > 0 ? allVideos[0] : undefined,
        description: formData.description.trim() || undefined,
        services: formData.services ? formData.services.split(',').map(s => s.trim()).filter(Boolean) : ['Electricity', 'Water'],
        advertiser: {
          number: formData.advertiserNumber.trim() || '7200640143',
          license: formData.advertiserLicense.trim() || '1200027687'
        },
        features: buildFeatures()
      };

      console.log('Sending property data:', JSON.stringify(propertyData, null, 2));

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
      console.error('Error saving property:', error);
      toast.error('Failed to save property. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this property?')) {
      try {
        await apiService.deleteProperty(id);
        toast.success('Property deleted!');
        loadProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property. Please try again.');
      }
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    
    // Convert existing images to uploadedFiles format
    const existingFiles = property.images.map((imageUrl, index) => ({
      url: imageUrl.replace('/src/assets/', '/assets/'), // Fix path and use as URL
      type: 'image' as const,
      base64: imageUrl, // Store the base64 string
      isExisting: true, // Mark as existing image
      file: { name: `existing-image-${index + 1}.jpg` } // Add dummy file object for display
    }));
    
    // Add existing video if it exists
    if (property.video) {
      existingFiles.push({
        url: property.video.replace('/src/assets/', '/assets/'),
        type: 'video' as const,
        isExisting: true,
        file: { name: 'existing-video.mp4' } // Add dummy file object for display
      });
    }
    
    setUploadedFiles(existingFiles);
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
      description: property.description || '',
      services: property.services.join(', '),
      advertiserNumber: property.advertiser.number,
      advertiserLicense: property.advertiser.license,
      propertyCode: property.propertyCode,
      floors: property.features.floors?.toString() || '',
      facade: property.features.facade || '',
      streetWidth: property.features.streetWidthNorth?.toString() || '',
      age: property.features.age?.toString() || '',
      apartments: property.features.apartments?.toString() || '',
      elevator: property.features.elevator?.toString() || '',
      acSystem: property.features.acSystem || '',
      category: property.features.category || '',
      guestLounge: property.features.guestLounge?.toString() || '',
      dailyLivingRoom: property.features.dailyLivingRoom?.toString() || '',
      diningRoom: property.features.diningRoom?.toString() || '',
      maidRoom: property.features.maidRoom?.toString() || '',
      driverRoom: property.features.driverRoom?.toString() || '',
      kitchen: property.features.kitchen?.toString() || '',
      storageRoom: property.features.storageRoom?.toString() || '',
      planNumber: property.features.planNumber || '',
      blockNumber: property.features.blockNumber || '',
      parcelNumber: property.features.parcelNumber || '',
      subdivision: property.features.subdivision || '',
      landClassification: property.features.landClassification || '',
      pricePerSqm: property.features.pricePerSqm?.toString() || '',
      allowedUsage: property.features.allowedUsage || '',
      maxBuildingHeight: property.features.maxBuildingHeight?.toString() || '',
      scale: property.features.scale || '',
      scaleArea: property.features.scaleArea?.toString() || '',
      shops: property.features.shops?.toString() || '',
      meters: property.features.meters?.toString() || '',
      balcony: '',
      garden: '',
      pool: '',
      gym: '',
      security: '',
      maintenance: '',
      parkingSpaces: '',
      buildingArea: '',
      commercialArea: '',
      residentialArea: '',
      landArea: ''
    });
    setUploadedFiles([]);
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
      description: '',
      services: '',
      advertiserNumber: '',
      advertiserLicense: '',
      floors: '',
      facade: '',
      streetWidth: '',
      age: '',
      apartments: '',
      elevator: '',
      acSystem: '',
      category: '',
      guestLounge: '',
      dailyLivingRoom: '',
      diningRoom: '',
      maidRoom: '',
      driverRoom: '',
      kitchen: '',
      storageRoom: '',
      planNumber: '',
      blockNumber: '',
      parcelNumber: '',
      subdivision: '',
      landClassification: '',
      pricePerSqm: '',
      allowedUsage: '',
      maxBuildingHeight: '',
      scale: '',
      scaleArea: '',
      shops: '',
      meters: '',
      balcony: '',
      garden: '',
      pool: '',
      gym: '',
      security: '',
      maintenance: '',
      parkingSpaces: '',
      buildingArea: '',
      commercialArea: '',
      residentialArea: '',
      landArea: ''
    });
    uploadedFiles.forEach(file => {
    // Only revoke URL if it's not an existing image
    if (!file.isExisting) {
      URL.revokeObjectURL(file.url);
    }
  });
    setUploadedFiles([]);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Property Management</h1>
          <p className="mt-2 text-gray-600">Comprehensive property management with ALL fields for ALL property types</p>
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

        {/* Comprehensive Form */}
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Label htmlFor="area">Area (m²) *</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="600"
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
                      <Label htmlFor="type">Property Type *</Label>
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
                      <Label htmlFor="purpose">Purpose *</Label>
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
                  </div>
                  
                  {/* Advertiser Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">تفاصيل المعلن / Advertiser Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="propertyCode">كود العقار / Property Code</Label>
                        <Input
                          id="propertyCode"
                          value={formData.propertyCode}
                          onChange={(e) => handleInputChange('propertyCode', e.target.value)}
                          placeholder="MU-1759264247416"
                        />
                      </div>
                      <div>
                        <Label htmlFor="advertiserNumber">رخصة الإعلان</Label>
                        <Input
                          id="advertiserNumber"
                          value={formData.advertiserNumber}
                          onChange={(e) => handleInputChange('advertiserNumber', e.target.value)}
                          placeholder="7200640143"
                        />
                      </div>
                      <div>
                        <Label htmlFor="advertiserLicense">رخصة فال / License Number</Label>
                        <Input
                          id="advertiserLicense"
                          value={formData.advertiserLicense}
                          onChange={(e) => handleInputChange('advertiserLicense', e.target.value)}
                          placeholder="1200027687"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Description</h3>
                  <div>
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the property features, location advantages, and unique selling points..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Common Features */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Common Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <Label htmlFor="floors">Number of Floors</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={formData.floors}
                        onChange={(e) => handleInputChange('floors', e.target.value)}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facade">Facade Direction</Label>
                      <Select value={formData.facade} onValueChange={(value) => handleInputChange('facade', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="streetWidth">Street Width (m)</Label>
                      <Input
                        id="streetWidth"
                        type="number"
                        value={formData.streetWidth}
                        onChange={(e) => handleInputChange('streetWidth', e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Property Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apartments">Number of Apartments</Label>
                      <Input
                        id="apartments"
                        type="number"
                        value={formData.apartments}
                        onChange={(e) => handleInputChange('apartments', e.target.value)}
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="elevator">Number of Elevators</Label>
                      <Input
                        id="elevator"
                        type="number"
                        value={formData.elevator}
                        onChange={(e) => handleInputChange('elevator', e.target.value)}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="acSystem">AC System</Label>
                      <Input
                        id="acSystem"
                        value={formData.acSystem}
                        onChange={(e) => handleInputChange('acSystem', e.target.value)}
                        placeholder="Central AC"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Luxury"
                      />
                    </div>
                  </div>
                </div>

                {/* Villa Specific Features */}
                {(formData.type === 'villa' || formData.type === 'mansion' || formData.type === 'townhouse') && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Villa/Mansion/Townhouse Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="guestLounge">Guest Lounge (Majlis)</Label>
                        <Input
                          id="guestLounge"
                          type="number"
                          value={formData.guestLounge}
                          onChange={(e) => handleInputChange('guestLounge', e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dailyLivingRoom">Daily Living Room</Label>
                        <Input
                          id="dailyLivingRoom"
                          type="number"
                          value={formData.dailyLivingRoom}
                          onChange={(e) => handleInputChange('dailyLivingRoom', e.target.value)}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="diningRoom">Dining Room</Label>
                        <Input
                          id="diningRoom"
                          type="number"
                          value={formData.diningRoom}
                          onChange={(e) => handleInputChange('diningRoom', e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maidRoom">Maid Room</Label>
                        <Input
                          id="maidRoom"
                          type="number"
                          value={formData.maidRoom}
                          onChange={(e) => handleInputChange('maidRoom', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driverRoom">Driver Room</Label>
                        <Input
                          id="driverRoom"
                          type="number"
                          value={formData.driverRoom}
                          onChange={(e) => handleInputChange('driverRoom', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kitchen">Kitchen</Label>
                        <Input
                          id="kitchen"
                          type="number"
                          value={formData.kitchen}
                          onChange={(e) => handleInputChange('kitchen', e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="storageRoom">Storage Room</Label>
                        <Input
                          id="storageRoom"
                          type="number"
                          value={formData.storageRoom}
                          onChange={(e) => handleInputChange('storageRoom', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Land Specific Features */}
                {formData.type === 'land' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Land Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="planNumber">Plan Number</Label>
                        <Input
                          id="planNumber"
                          value={formData.planNumber}
                          onChange={(e) => handleInputChange('planNumber', e.target.value)}
                          placeholder="12345"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blockNumber">Block Number</Label>
                        <Input
                          id="blockNumber"
                          value={formData.blockNumber}
                          onChange={(e) => handleInputChange('blockNumber', e.target.value)}
                          placeholder="A-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parcelNumber">Parcel Number</Label>
                        <Input
                          id="parcelNumber"
                          value={formData.parcelNumber}
                          onChange={(e) => handleInputChange('parcelNumber', e.target.value)}
                          placeholder="456"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subdivision">Subdivision</Label>
                        <Input
                          id="subdivision"
                          value={formData.subdivision}
                          onChange={(e) => handleInputChange('subdivision', e.target.value)}
                          placeholder="Al-Malqa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="landClassification">Land Classification</Label>
                        <Input
                          id="landClassification"
                          value={formData.landClassification}
                          onChange={(e) => handleInputChange('landClassification', e.target.value)}
                          placeholder="Residential"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerSqm">Price per sqm (SAR)</Label>
                        <Input
                          id="pricePerSqm"
                          type="number"
                          value={formData.pricePerSqm}
                          onChange={(e) => handleInputChange('pricePerSqm', e.target.value)}
                          placeholder="5000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="allowedUsage">Allowed Usage</Label>
                        <Select value={formData.allowedUsage} onValueChange={(value) => handleInputChange('allowedUsage', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select usage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Mixed">Mixed</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maxBuildingHeight">Max Building Height (floors)</Label>
                        <Input
                          id="maxBuildingHeight"
                          type="number"
                          value={formData.maxBuildingHeight}
                          onChange={(e) => handleInputChange('maxBuildingHeight', e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Store/Showroom Specific Features */}
                {(formData.type === 'store' || formData.type === 'showroom') && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Store/Showroom Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="scale">Scale</Label>
                        <Input
                          id="scale"
                          value={formData.scale}
                          onChange={(e) => handleInputChange('scale', e.target.value)}
                          placeholder="Large Scale"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scaleArea">Scale Area (m²)</Label>
                        <Input
                          id="scaleArea"
                          type="number"
                          value={formData.scaleArea}
                          onChange={(e) => handleInputChange('scaleArea', e.target.value)}
                          placeholder="200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Building Specific Features */}
                {formData.type === 'building' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Building Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="shops">Number of Shops</Label>
                        <Input
                          id="shops"
                          type="number"
                          value={formData.shops}
                          onChange={(e) => handleInputChange('shops', e.target.value)}
                          placeholder="8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meters">Number of Meters</Label>
                        <Input
                          id="meters"
                          type="number"
                          value={formData.meters}
                          onChange={(e) => handleInputChange('meters', e.target.value)}
                          placeholder="24"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-lg font-semibold">Images & Videos</Label>
                    <p className="text-sm text-gray-600 mb-4">Upload multiple images and videos for your property</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-700">
                          {uploading ? 'Uploading...' : 'Click to upload images & videos'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Supports: JPG, PNG, GIF, MP4, MOV, AVI
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Maximum file size: 10MB per file
                        </p>
                      </div>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Uploaded Files ({uploadedFiles.length}) - 
                        {uploadedFiles.filter(f => f.isExisting).length} existing, 
                        {uploadedFiles.filter(f => !f.isExisting).length} new
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {uploadedFiles.map((fileItem, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              {fileItem.type === 'image' ? (
                                <img
                                  src={fileItem.url}
                                  alt={`Uploaded image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Video className="w-8 h-8 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="absolute top-1 left-1">
                              <Badge variant={fileItem.isExisting ? "default" : "secondary"} className="text-xs">
                                {fileItem.type === 'image' ? (
                                  <Image className="w-3 h-3 mr-1" />
                                ) : (
                                  <Video className="w-3 h-3 mr-1" />
                                )}
                                {fileItem.isExisting ? 'Existing' : 'New'} {fileItem.type}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeUploadedFile(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            {fileItem.file?.name && (
                              <div className="absolute bottom-1 left-1 right-1">
                                <p className="text-xs text-white bg-black bg-opacity-50 px-1 py-0.5 rounded truncate">
                                  {fileItem.file.name}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div>
                  <Label htmlFor="services">Services (comma-separated)</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    placeholder="Electricity, Water, Sewage"
                    rows={2}
                  />
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
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Images:</span>
                    <span className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {property.images.length}
                    </span>
                  </div>
                  {property.video && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Video:</span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        Yes
                      </span>
                    </div>
                  )}
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
