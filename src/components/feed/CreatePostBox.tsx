import React from 'react';
import { Image, Video, Smile } from 'lucide-react';
import { auth } from '../../config/firebase';

const CreatePostBox = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const user = auth.currentUser;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[rgba(0,0,0,0.1)] mb-4">
            <div className="flex gap-2 items-center mb-4">
                <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
                <div 
                    onClick={onOpenModal} 
                    className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6eb] cursor-pointer rounded-full px-4 py-2.5 text-[#65676B] text-[17px] transition"
                >
                    What's on your mind, {user?.displayName?.split(' ')[0]}?
                </div>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-around">
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg font-semibold text-[#65676B]">
                    <Video size={28} className="text-red-500"/> Live Video
                </button>
                <button onClick={onOpenModal} className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg font-semibold text-[#65676B]">
                    <Image size={28} className="text-green-500"/> Photo/video
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-2 rounded-lg font-semibold text-[#65676B]">
                    <Smile size={28} className="text-yellow-500"/> Feeling/activity
                </button>
            </div>
        </div>
    );
};
export default CreatePostBox;