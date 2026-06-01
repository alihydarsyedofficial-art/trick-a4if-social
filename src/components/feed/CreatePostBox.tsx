import React, { useState } from 'react';
import { UserCircle, Video, Image as ImageIcon, Smile } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CreatePostModal from './CreatePostModal';

const CreatePostBox: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border border-gray-200" />
          ) : (
            <UserCircle size={40} className="text-gray-400" />
          )}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f0f2f5] hover:bg-[#e4e6eb] rounded-full px-4 py-2.5 w-full cursor-pointer transition-colors text-gray-500 text-[17px]"
          >
            What's on your mind, {user?.displayName?.split(' ')[0]}?
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg text-[#65676B] font-semibold text-[15px] transition-colors">
            <Video size={24} className="text-[#f3425f]" /> 
            <span className="hidden sm:block">Live video</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg text-[#65676B] font-semibold text-[15px] transition-colors">
            <ImageIcon size={24} className="text-[#45bd62]" /> 
            <span className="hidden sm:block">Photo/video</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg text-[#65676B] font-semibold text-[15px] transition-colors">
            <Smile size={24} className="text-[#f7b928]" /> 
            <span className="hidden sm:block">Feeling/activity</span>
          </button>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CreatePostBox;