import axios from 'axios';

export const uploadFileToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Environment Variable বাদ দিয়ে সরাসরি ব্যাকএন্ড লিংকটি বসিয়ে দেওয়া হলো
    const response = await axios.post('https://trick-a4if-social.onrender.com/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data.url; 
  } catch (error) {
    console.error("Upload Error Details:", error);
    throw new Error('ফাইল আপলোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
  }
};