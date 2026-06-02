import React, { useState } from 'react';
import CreatePostBox from '../../components/feed/CreatePostBox';
import CreatePostModal from '../../components/feed/CreatePostModal';
import PostCard from '../../components/feed/PostCard';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const posts = [{ id: '1', userName: 'Arifull Islam', content: 'Welcome to TRICK A4IF Social!' }];

  return (
    <div className="w-full max-w-[1920px] mx-auto flex justify-between px-2 md:px-4 mt-4">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
            <div className="flex flex-col gap-2">
                <div className="p-3 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-semibold flex items-center gap-3 text-[15px]">
                    <div className="w-9 h-9 rounded-full bg-blue-500"></div> Profile
                </div>
                <div className="p-3 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-semibold flex items-center gap-3 text-[15px]">
                    <div className="w-9 h-9 rounded-full bg-green-500"></div> Friends
                </div>
                <div className="p-3 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-semibold flex items-center gap-3 text-[15px]">
                    <div className="w-9 h-9 rounded-full bg-purple-500"></div> Groups
                </div>
            </div>
        </div>

        {/* Main Feed (মাঝখানের কন্টেন্ট - ঠিক ৫৯০ পিক্সেল) */}
        <div className="w-full max-w-[590px] shrink-0 mx-auto">
            <CreatePostBox onOpenModal={() => setIsModalOpen(true)} />
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <div className="flex flex-col gap-4 mt-4">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
            <h3 className="text-facebook-secondary font-semibold text-[17px] mb-3 px-2">Contacts</h3>
            <div className="flex flex-col gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer">
                        <div className="w-9 h-9 bg-gray-300 rounded-full relative">
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-facebook-bg rounded-full"></div>
                        </div>
                        <span className="font-medium text-[15px]">Friend {i}</span>
                    </div>
                ))}
            </div>
        </div>

    </div>
  );
};

export default Home;