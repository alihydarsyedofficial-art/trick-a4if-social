import axios from 'axios';

// Vercel-এর এনভায়রনমেন্ট ভেরিয়েবল থেকে ব্যাকএন্ড URL নেওয়া হচ্ছে
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const uploadFileToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Render সার্ভারে ফাইল পাঠানো হচ্ছে
    const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    // টেলিগ্রামের file_id রিটার্ন করা হচ্ছে
    return response.data.url; 
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error('ফাইল আপলোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
  }
};