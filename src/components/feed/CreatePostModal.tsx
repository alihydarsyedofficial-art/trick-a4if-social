import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCreatePost } from '../../hooks/usePosts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) return;
    
    try {
      await createPost({ content, mediaFile });
      setContent('');
      removeMedia();
      onClose();
    } catch (error) {
      console.error(error);
      alert('পোস্ট তৈরি করতে সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[500px] rounded-xl shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b relative">
          <h2 className="text-xl font-bold w-full text-center">Create post</h2>
          <button onClick={onClose} className="absolute right-4 bg-gray-200 text-gray-600 hover:bg-gray-300 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
            ) : (
              <UserCircle size={40} className="text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-[15px]">{user?.displayName}</p>
              <div className="bg-gray-200 text-[13px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 cursor-pointer">
                Public ▾
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea 
            placeholder={`What's on your mind, ${user?.displayName?.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xl outline-none resize-none min-h-[100px]"
            maxLength={1000}
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative mt-2 mb-4 border rounded-lg p-2">
              <button onClick={removeMedia} className="absolute top-4 right-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 p-1.5 rounded-full z-10 shadow-sm">
                <X size={20} />
              </button>
              <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[300px] object-contain rounded-md" />
            </div>
          )}

          {/* Add to your post Box */}
          <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between mt-4 shadow-sm">
            <span className="font-semibold text-[15px] text-[#1c1e21]">Add to your post</span>
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-green-500">
                <ImageIcon size={24} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={(!content.trim() && !mediaFile) || isPending}
            className={`w-full mt-4 py-2.5 rounded-md font-bold text-[15px] transition-colors ${
              (!content.trim() && !mediaFile) || isPending 
                ? 'bg-[#e4e6eb] text-[#bcc0c4] cursor-not-allowed' 
                : 'bg-facebook-blue text-white hover:bg-blue-600'
            }`}
          >
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;