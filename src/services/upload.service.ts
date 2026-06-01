import axios from 'axios';

export const uploadMediaToCloudinary = async (file: File): Promise<{ url: string; type: 'image' | 'video' }> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData
    );

    return {
      url: response.data.secure_url,
      type: response.data.resource_type === 'video' ? 'video' : 'image'
    };
  } catch (error: any) {
    throw new Error('মিডিয়া আপলোড ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
  }
};