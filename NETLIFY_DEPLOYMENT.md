# 🚀 Netlify Deployment Guide for Muathaqa Connect

## 📁 Project Structure

Your project is now set up with Netlify Functions:

```
muathaqa-connect/
├── netlify/
│   ├── functions/
│   │   ├── _shared/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── Property.js    # Property model
│   │   ├── properties.js      # Properties API
│   │   ├── cities.js          # Cities API
│   │   ├── health.js          # Health check
│   │   ├── seed.js           # Database seeding
│   │   └── package.json       # Functions dependencies
├── src/
│   └── services/
│       └── api.ts            # Updated API service
├── netlify.toml              # Netlify configuration
└── .env.local                # Environment variables
```

## 🔧 Step-by-Step Deployment Instructions

### Step 1: Install Netlify CLI (Optional for local testing)

```bash
npm install -g netlify-cli
```

### Step 2: Test Locally (Optional)

```bash
# Install dependencies for functions
cd netlify/functions
npm install

# Go back to root and start local development
cd ../..
npm run dev

# In another terminal, start Netlify functions locally
netlify dev
```

### Step 3: Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

5. **Set Environment Variables** in Netlify dashboard:
   ```
   MONGODB_URI=mongodb+srv://webiqueuser:webiquepassword@cluster0.d6rpmuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

6. **Deploy** your site

#### Option B: Deploy via Netlify CLI

```bash
# Build your site
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Step 4: Seed Your Database

After deployment, call the seed function to populate your database:

```bash
# Replace YOUR_SITE_URL with your actual Netlify URL
curl -X POST https://YOUR_SITE_URL.netlify.app/api/seed
```

Or visit: `https://YOUR_SITE_URL.netlify.app/api/seed` in your browser

## 🔗 API Endpoints Available

Once deployed, your API will be available at:

- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/cities` - Get cities and districts
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database with sample data

## 🧪 Testing Your Deployment

1. **Health Check**:
   ```bash
   curl https://YOUR_SITE_URL.netlify.app/api/health
   ```

2. **Get Properties**:
   ```bash
   curl https://YOUR_SITE_URL.netlify.app/api/properties
   ```

3. **Get Cities**:
   ```bash
   curl https://YOUR_SITE_URL.netlify.app/api/cities
   ```

## 🔧 Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

- `MONGODB_URI`: Your MongoDB connection string
- `NODE_VERSION`: `18` (for functions)

## 📱 Frontend Configuration

The frontend is already configured to work with Netlify Functions:

- API calls use relative URLs (`/api/...`)
- CORS is handled by Netlify Functions
- No additional configuration needed

## 🚨 Troubleshooting

### Common Issues:

1. **Functions not working**: Check that `netlify.toml` is in the root directory
2. **Database connection issues**: Verify `MONGODB_URI` environment variable
3. **Build failures**: Ensure Node.js version is 18+

### Debug Steps:

1. Check Netlify function logs in the dashboard
2. Test functions locally with `netlify dev`
3. Verify environment variables are set correctly

## 🎯 Key Benefits of Netlify Functions

- **Serverless**: No server management needed
- **Automatic scaling**: Handles traffic spikes automatically
- **Integrated**: Functions and frontend in one deployment
- **Free tier**: Generous free usage limits
- **Fast**: Global CDN for fast loading

## 📊 Monitoring

Monitor your functions in the Netlify dashboard:
- Function invocations
- Response times
- Error rates
- Logs

Your Muathaqa Connect website is now ready for production deployment on Netlify! 🎉
