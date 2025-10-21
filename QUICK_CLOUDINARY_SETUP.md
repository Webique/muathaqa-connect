# 🚀 QUICK CLOUDINARY SETUP - ONE STEP LEFT!

Your Cloudinary credentials have been configured in the application!

**Cloud Name**: `dral2ddhm` ✅  
**API Key**: `671474332779551` ✅  
**API Secret**: `hP5JDgRwFyD-rpHqGcgw-qGCwco` ✅

## ⚠️ ONE IMPORTANT STEP REMAINING

You need to create an **Upload Preset** in your Cloudinary account. This takes 2 minutes:

### Step-by-Step Instructions:

1. **Go to Cloudinary Console**
   - Visit: https://cloudinary.com/console
   - Log in with your Cloudinary account

2. **Navigate to Upload Settings**
   - Click the ⚙️ **Settings** icon (top right corner)
   - Click on the **Upload** tab

3. **Create Upload Preset**
   - Scroll down to **Upload presets** section
   - Click **"Add upload preset"** button

4. **Configure the Preset**
   Fill in these settings:
   
   - **Preset name**: `muathaqa_uploads`
   - **Signing Mode**: Select **"Unsigned"** ⚠️ THIS IS CRITICAL!
   - **Folder**: `muathaqa` (optional, helps organize your files)
   - **Resource Type**: Leave as **"Auto"**
   - **Allowed formats**: Leave empty (or add: `jpg,png,gif,mp4,mov,avi`)
   
   **For Video Settings** (expand "Media Analysis and AI" or "Video" section):
   - **Max video duration**: `300` (seconds = 5 minutes)
   - **Max file size**: `104857600` (bytes = 100MB)

5. **Save the Preset**
   - Click **"Save"** at the bottom

---

## ✅ That's It! You're Done!

After creating the upload preset, your application will be ready to:
- Upload images (up to 10MB)
- Upload videos (up to 100MB, up to 5 minutes long)
- Store videos on Cloudinary's CDN
- Stream videos efficiently to users

---

## 🧪 Test Your Setup

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Go to your Admin page

3. Click "Add New Property"

4. Try uploading a video file

5. You should see:
   - ✅ "Uploading [filename] to Cloudinary..."
   - ✅ "[filename] uploaded successfully!"

---

## ❌ Troubleshooting

### Error: "Please configure Cloudinary credentials"
- The upload preset name doesn't match
- Make sure you named it exactly: `muathaqa_uploads`

### Error: "Upload failed" or "401 Unauthorized"
- The upload preset is not set to **"Unsigned"** mode
- Go back to Cloudinary settings and change it to Unsigned

### Error: "Video is too long"
- Your video is over 5 minutes
- Trim the video or increase the limit in the preset settings

### Error: "Video file is too large"
- Your video is over 100MB
- Compress the video using HandBrake or similar tool

---

## 📊 Your Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month

Perfect for a real estate app with 20-50 properties with videos!

---

## 🔒 Security Note

**IMPORTANT**: Your API Secret (`hP5JDgRwFyD-rpHqGcgw-qGCwco`) should be kept private!
- Never share it publicly
- Never commit it to public repositories
- The current implementation uses **unsigned uploads** which don't require the API secret
- The API secret is only needed for server-side operations

---

## 📖 Need More Help?

- Full setup guide: See `CLOUDINARY_SETUP.md` in this directory
- Cloudinary docs: https://cloudinary.com/documentation
- Video upload guide: https://cloudinary.com/documentation/video_upload

---

**Ready to test?** 🎬 Upload your first property video!

