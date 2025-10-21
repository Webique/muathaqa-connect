const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// GET /api/properties - Get all properties with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      purpose, 
      minPrice, 
      maxPrice, 
      minArea, 
      maxArea, 
      bedrooms, 
      bathrooms,
      city,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };
    if (city) filter['location.en'] = { $regex: city, $options: 'i' };
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Area range filter
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      data: properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
      message: error.message
    });
  }
});

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property',
      message: error.message
    });
  }
});

// POST /api/properties - Create new property
router.post('/', async (req, res) => {
  try {
    // Generate sequential property code automatically
    // Find all properties with new format codes (MU-XXXX with 4 digits only)
    const allProperties = await Property.find({
      propertyCode: /^MU-\d{4}$/  // Match only MU-0001, MU-0002, etc. (exactly 4 digits)
    }).select('propertyCode');
    
    let nextNumber = 1;
    
    if (allProperties.length > 0) {
      // Find the highest number from existing new-format codes
      const numbers = allProperties.map(p => {
        const match = p.propertyCode.match(/^MU-(\d{4})$/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxNumber = Math.max(...numbers);
      nextNumber = maxNumber + 1;
    }
    
    // Generate code with 4 digits (MU-0001, MU-0002, etc.)
    req.body.propertyCode = `MU-${String(nextNumber).padStart(4, '0')}`;

    const property = new Property(req.body);
    await property.save();

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Property code already exists',
        message: 'A property with this code already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Failed to create property',
      message: error.message
    });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    // Prevent propertyCode from being updated
    delete req.body.propertyCode;
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update property',
      message: error.message
    });
  }
});

// DELETE /api/properties/:id - Delete property (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete property',
      message: error.message
    });
  }
});

// GET /api/properties/search/:query - Search properties
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const searchFilter = {
      isActive: true,
      $or: [
        { 'title.en': { $regex: query, $options: 'i' } },
        { 'title.ar': { $regex: query, $options: 'i' } },
        { 'location.en': { $regex: query, $options: 'i' } },
        { 'location.ar': { $regex: query, $options: 'i' } },
        { propertyCode: { $regex: query, $options: 'i' } }
      ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(searchFilter);

    res.json({
      success: true,
      data: properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search properties',
      message: error.message
    });
  }
});

module.exports = router;
