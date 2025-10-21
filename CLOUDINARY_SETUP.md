# Cloudinary Setup Guide for Video Uploads

This guide will help you set up Cloudinary to enable video uploads (up to 5 minutes long) in your Muathaqa Connect application.

## What is Cloudinary?

Cloudinary is a cloud-based media management platform that handles image and video uploads, storage, optimization, and delivery. It's perfect for handling large video files that would be too big to store as base64 in your database.

## Why Cloudinary?

- **Free tier**: 25 GB storage, 25 GB bandwidth per month
- **Video optimization**: Automatic transcoding and streaming
- **Fast delivery**: Global CDN
- **Easy integration**: Simple API

## Setup Steps

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **free account**
3. Verify your email address
4. Log in to your Cloudinary console

### Step 2: Get Your Credentials

1. After logging in, you'll be on your **Dashboard**
2. You'll see three important credentials:
   - **Cloud Name** (e.g., `dmxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (keep this private!)

3. **Note down your Cloud Name** - you'll need it!

### Step 3: Create an Upload Preset

Upload presets allow unsigned uploads (uploads without authentication from the frontend).

1. In your Cloudinary console, go to **Settings** (gear icon in top right)
2. Click on **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `muathaqa_uploads` (or any name you like)
   - **Signing Mode**: Select **Unsigned** (very important!)
   - **Folder**: (optional) `muathaqa` (keeps your uploads organized)
   - **Resource Type**: Leave as **Auto**
   - **Allowed formats**: Leave empty or add `jpg,png,gif,mp4,mov,avi`
   - **Video Settings**:
     - Max video duration: `300` seconds (5 minutes)
     - Max file size: `104857600` bytes (100 MB)
6. Click **Save**

### Step 4: Configure Your Application

1. Open `/src/pages/admin/AdminPage.tsx`
2. Find these lines near the top of the file (around lines 15-17):

```typescript
// IMPORTANT: Replace these with your actual Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; // Replace with your unsigned upload preset
```

3. Replace them with your actual values:

```typescript
const CLOUDINARY_CLOUD_NAME = 'dmxyz1234'; // Your actual cloud name from Step 2
const CLOUDINARY_UPLOAD_PRESET = 'muathaqa_uploads'; // Your preset name from Step 3
```

### Step 5: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Admin page
3. Try uploading a short video file
4. You should see:
   - "Uploading [filename] to Cloudinary..." message
   - "[filename] uploaded successfully!" on completion
5. The video URL will be stored in your database as a Cloudinary URL (e.g., `https://res.cloudinary.com/your_cloud_name/video/upload/...`)

## Video Specifications

### Supported Formats
- MP4 (recommended)
- MOV
- AVI
- WebM

### Limitations
- **Max Duration**: 5 minutes (300 seconds)
- **Max File Size**: 100 MB
- **Recommended**: 720p or 1080p resolution for best quality/size balance

### Tips for Best Results
1. **Compress videos before upload**: Use tools like HandBrake to reduce file size
2. **Use MP4 with H.264 codec**: Best browser compatibility
3. **Recommended settings**:
   - Resolution: 1280x720 (720p)
   - Bitrate: 2-5 Mbps
   - Frame rate: 24-30 fps

## Troubleshooting

### Error: "Please configure Cloudinary credentials"
- Make sure you've replaced `'your_cloud_name'` and `'your_upload_preset'` with actual values

### Error: "Upload failed"
- Check your upload preset is set to **Unsigned** mode
- Verify your cloud name is correct
- Check your internet connection

### Error: "Video is too long"
- The video exceeds 5 minutes
- Trim the video or increase the limit in the upload preset settings

### Error: "Video file is too large"
- The video exceeds 100 MB
- Compress the video using a tool like HandBrake
- Or increase the limit in the upload preset settings (Cloudinary free tier has monthly bandwidth limits)

## Free Tier Limits

Cloudinary's free tier includes:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month

For a real estate app with ~20-30 properties with videos, this should be sufficient. If you need more, you can upgrade later.

## Displaying Videos

Videos uploaded to Cloudinary can be displayed using a standard HTML5 video tag:

```html
<video controls>
  <source src="https://res.cloudinary.com/your_cloud_name/video/upload/..." type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

The application automatically handles this for you!

## Security Notes

1. **Never commit your API Secret** to version control
2. **Upload presets must be Unsigned** for frontend uploads
3. **Consider adding restrictions** in production:
   - IP address restrictions
   - Domain restrictions
   - File size limits

## Need Help?

- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Cloudinary Support: [https://support.cloudinary.com](https://support.cloudinary.com)

---

**You're all set!** Your application now supports video uploads up to 5 minutes long. 🎉

