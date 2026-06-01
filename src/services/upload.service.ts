import axios from 'axios';

// সরাসরি আপনার Render ব্যাকএন্ডের লিংকটি ফিক্স করে দেওয়া হলো
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://trick-a4if-social.onrender.com';

export const uploadFileToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data.url; 
  } catch (error) {
    console.error("Upload Error Details:", error);
    throw new Error('ফাইল আপলোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
  }
};