# Muathaqa Connect Backend API

A Node.js/Express backend API for the Muathaqa Connect real estate platform with MongoDB integration.

## Features

- **Property Management**: Full CRUD operations for properties
- **MongoDB Integration**: Connected to MongoDB Atlas
- **RESTful API**: Clean API endpoints for frontend consumption
- **CORS Support**: Configured for frontend communication
- **Data Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error handling middleware
- **Rate Limiting**: Built-in rate limiting for API protection

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filtering and pagination)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property (soft delete)
- `GET /api/properties/search/:query` - Search properties

### Cities
- `GET /api/cities` - Get all cities and districts
- `GET /api/cities/:cityKey` - Get specific city with districts

### Health Check
- `GET /health` - API health status

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://webiqueuser:webiquepassword@cluster0.d6rpmuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-here
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your environment variables
4. Start development server: `npm run dev`
5. Start production server: `npm start`

## Database Seeding

To seed the database with sample data:
```bash
node seed-data.js
```

## Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set environment variables in Render dashboard
4. Deploy!

## API Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "itemsPerPage": 10
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```
