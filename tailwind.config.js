/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: {
          bg: '#f0f2f5',         // ফেসবুকের মেইন ব্যাকগ্রাউন্ড
          header: '#ffffff',     // হেডার ব্যাকগ্রাউন্ড
          text: '#050505',       // গাঢ় টেক্সট
          secondary: '#65676B',  // হালকা টেক্সট
          blue: '#0866ff',       // ফেসবুক ব্লু
          hover: '#e4e6eb',      // হোভার ইফেক্ট
          border: 'rgba(0,0,0,0.1)' // সফট বর্ডার
        }
      },
      borderRadius: {
        'fb-lg': '8px',          // কার্ডের জন্য
        'fb-full': '50px'        // বাটন বা প্রোফাইল ছবির জন্য
      }
    },
  },
  plugins: [],
}