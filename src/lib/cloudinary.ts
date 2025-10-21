// Cloudinary configuration and upload utilities

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  duration?: number;
}

/**
 * Generate SHA-1 signature for Cloudinary signed upload
 */
const generateSignature = async (paramsToSign: string, apiSecret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Upload a file (image or video) to Cloudinary using signed upload
 * @param file - The file to upload
 * @param cloudName - Your Cloudinary cloud name
 * @param apiKey - Your Cloudinary API key
 * @param apiSecret - Your Cloudinary API secret
 * @param folder - Optional folder name to organize uploads
 * @returns Promise with the uploaded file URL and metadata
 */
export const uploadToCloudinary = async (
  file: File,
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string = 'muathaqa'
): Promise<CloudinaryUploadResponse> => {
  const timestamp = Math.round(Date.now() / 1000);
  
  // Determine resource type
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  
  // Parameters to sign
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  
  // Generate signature
  const signature = await generateSignature(paramsToSign, apiSecret);
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Validate video file before upload
 * @param file - The video file to validate
 * @param maxDurationMinutes - Maximum allowed duration in minutes (default: 5)
 * @param maxSizeMB - Maximum file size in MB (default: 100)
 * @returns Promise that resolves if valid, rejects with error message if invalid
 */
export const validateVideoFile = async (
  file: File,
  maxDurationMinutes: number = 5,
  maxSizeMB: number = 100
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      reject(`Video file is too large (${fileSizeMB.toFixed(1)}MB). Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const durationMinutes = duration / 60;

      if (durationMinutes > maxDurationMinutes) {
        reject(`Video is too long (${durationMinutes.toFixed(1)} minutes). Maximum duration is ${maxDurationMinutes} minutes.`);
      } else {
        resolve();
      }
    };

    video.onerror = () => {
      reject('Could not load video metadata');
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Get Cloudinary video thumbnail URL
 * @param publicId - Cloudinary public ID
 * @param cloudName - Your Cloudinary cloud name
 * @returns Thumbnail URL
 */
export const getVideoThumbnail = (publicId: string, cloudName: string): string => {
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_300,h_200,c_fill/${publicId}.jpg`;
};

