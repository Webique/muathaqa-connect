const connectDB = require('./_shared/db');
const Property = require('./_shared/Property');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    await connectDB();

    const { httpMethod, path, queryStringParameters, body } = event;
    const pathSegments = path.split('/').filter(Boolean);
    const propertyId = pathSegments[pathSegments.length - 1];

    switch (httpMethod) {
      case 'GET':
        if (propertyId && propertyId !== 'properties') {
          // Get single property
          const property = await Property.findById(propertyId);
          if (!property) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'Property not found'
              })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: property
            })
          };
        } else {
          // Get all properties with filtering
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
          } = queryStringParameters || {};

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

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: properties,
              pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
              }
            })
          };
        }

      case 'POST':
        const newProperty = JSON.parse(body);
        // Generate property code if not provided
        if (!newProperty.propertyCode) {
          const count = await Property.countDocuments();
          newProperty.propertyCode = `MU-${String(count + 1).padStart(3, '0')}`;
        }
        const property = new Property(newProperty);
        await property.save();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: property,
            message: 'Property created successfully'
          })
        };

      case 'PUT':
        if (!propertyId || propertyId === 'properties') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Property ID is required for update'
            })
          };
        }
        const updateData = JSON.parse(body);
        const updatedProperty = await Property.findByIdAndUpdate(
          propertyId,
          updateData,
          { new: true, runValidators: true }
        );
        if (!updatedProperty) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Property not found'
            })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: updatedProperty,
            message: 'Property updated successfully'
          })
        };

      case 'DELETE':
        if (!propertyId || propertyId === 'properties') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Property ID is required for deletion'
            })
          };
        }
        const deletedProperty = await Property.findByIdAndUpdate(
          propertyId,
          { isActive: false },
          { new: true }
        );
        if (!deletedProperty) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Property not found'
            })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Property deleted successfully'
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Method not allowed'
          })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
