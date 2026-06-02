import React, { useState } from 'react';
import { Image, Smile, Video } from 'lucide-react';
import { auth } from '../../config/firebase';

const CreatePostBox = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const user = auth.currentUser;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
            <div className="flex gap-2 items-center mb-4">
                <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" />
                <div 
                    onClick={onOpenModal} 
                    className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6eb] cursor-pointer rounded-full px-4 py-2.5 text-gray-500 transition"
                >
                    What's on your mind, {user?.displayName?.split(' ')[0]}?
                </div>
            </div>
            <div className="border-t pt-3 flex justify-around">
                <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-500">
                    <Video size={24} className="text-red-500"/> Live Video
                </button>
                <button onClick={onOpenModal} className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-500">
                    <Image size={24} className="text-green-500"/> Photo/video
                </button>
                <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-500">
                    <Smile size={24} className="text-yellow-500"/> Feeling/activity
                </button>
            </div>
        </div>
    );
};
export default CreatePostBox;