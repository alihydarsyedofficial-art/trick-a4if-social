import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Props { isOpen: boolean; onClose: () => void; }

const CreatePostModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const selected = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selected]);
        setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeMedia = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;
    setIsPending(true);
    
    try {
        let mediaUrls: string[] = [];
        if (files.length > 0) {
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));
            const res = await fetch('https://trick-a4if-social.onrender.com/upload', { method: 'POST', body: formData });
            const data = await res.json();
            mediaUrls = data.fileIds;
        }

        // এখানে আপনার বর্তমান createPost ফাংশনটি কল করুন যা firestore-এ ডাটা পাঠায়
        // await createPost({ content, mediaUrls }); 
        
        setContent(''); setFiles([]); setPreviews([]);
        onClose();
    } catch (error) {
      alert('পোস্ট তৈরি করতে সমস্যা হয়েছে!');
    } finally { setIsPending(false); }
  };

  return (
    <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[500px] rounded-xl shadow-2xl border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create post</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <textarea className="w-full text-xl outline-none min-h-[100px]" value={content} onChange={(e) => setContent(e.target.value)} />
        
        {/* গ্রিড প্রিভিউ */}
        <div className="grid grid-cols-2 gap-2 mt-2">
            {previews.map((url, i) => (
                <div key={i} className="relative"><img src={url} className="w-full h-24 object-cover rounded-md" />
                <button onClick={() => removeMedia(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X size={14}/></button>
                </div>
            ))}
        </div>

        <div className="border rounded-lg p-3 flex justify-between items-center mt-4">
            <span>Add to your post</span>
            <button onClick={() => fileInputRef.current?.click()} className="text-green-500"><ImageIcon size={24} /></button>
            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        <button onClick={handleSubmit} disabled={isPending} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md">
            {isPending ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};
export default CreatePostModal;