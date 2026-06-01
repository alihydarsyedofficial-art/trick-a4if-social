import React, { useState } from 'react';
// ফায়ারবেস পাথ ঠিক করা হয়েছে (config ফোল্ডার অনুযায়ী)
import { auth, db } from '../../config/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadFileToBackend } from '../../services/upload.service';

const CreatePostBox = () => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // ছবি বা ফাইল সিলেক্ট করার ফাংশন
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // পোস্ট সাবমিট করার মূল ফাংশন
    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() && !file) return; 

        const user = auth.currentUser;
        if (!user) {
            alert("পোস্ট করার জন্য আপনাকে আগে লগইন করতে হবে!");
            return;
        }

        setIsUploading(true);
        let fileId = "";

        try {
            // ১. ছবি থাকলে Render ব্যাকএন্ডের মাধ্যমে আপলোড
            if (file) {
                fileId = await uploadFileToBackend(file);
            }

            // ২. ফায়ারস্টোর ডাটাবেসে পোস্ট সেভ করা
            await addDoc(collection(db, "posts"), {
                userId: user.uid,
                userName: user.displayName || "Unknown User",
                userPhoto: user.photoURL || "",
                content: content,
                imageFileId: fileId,
                createdAt: serverTimestamp(),
                likes: [],
                commentsCount: 0
            });

            // ৩. পোস্ট সফল হলে ফর্ম রিসেট
            setContent('');
            setFile(null);
            setPreview(null);
            alert("আপনার পোস্ট সফলভাবে পাবলিশ হয়েছে!");

        } catch (error) {
            console.error("Post Creation Error:", error);
            alert("পোস্ট আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsUploading(false);
        }
    };

    // প্রিভিউ রিমুভ ফাংশন
    const removePreview = () => {
        setFile(null);
        setPreview(null);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">নতুন পোস্ট তৈরি করুন</h2>
            
            <form onSubmit={handlePostSubmit}>
                {/* টেক্সট এরিয়া */}
                <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
                    rows={3}
                    placeholder="আপনার মনে কী চলছে?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isUploading}
                />

                {/* ছবি প্রিভিউ */}
                {preview && (
                    <div className="relative mb-3">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full max-h-72 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={removePreview}
                            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                            disabled={isUploading}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* সাবমিট ও ফাইল আপলোড সেকশন */}
                <div className="flex items-center justify-between mt-2">
                    <label className="cursor-pointer text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>ছবি যুক্ত করুন</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isUploading || (!content.trim() && !file)}
                        className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                            isUploading || (!content.trim() && !file)
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        {isUploading ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostBox;