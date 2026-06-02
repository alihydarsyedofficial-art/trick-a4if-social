import React, { useState } from 'react';
import CreatePostBox from '../../components/feed/CreatePostBox';
import CreatePostModal from '../../components/feed/CreatePostModal';
import PostCard from '../../components/feed/PostCard';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ডামি পোস্ট ডেটা (আপনার ফায়ারবেস থেকে আসা ডেটা এখানে আসবে)
  const posts = [
    { id: '1', userName: 'Arifull Islam', content: 'Welcome to TRICK A4IF Social!' }
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-[56px]">
      {/* মেইন কন্টেইনার - ফেসবুকের অরিজিনাল লেআউট */}
      <div className="max-w-[1200px] mx-auto flex justify-center lg:justify-between px-2">
        
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden xl:block w-[300px] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            <div className="p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer">Profile</div>
            <div className="p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer">Friends</div>
            <div className="p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer">Groups</div>
          </div>
        </div>

        {/* Main Feed Content (অরিজিনাল ফেসবুকের মতো ৫৯০ পিক্সেল) */}
        <div className="w-full max-w-[590px] mx-auto lg:mx-0 py-6">
          <CreatePostBox onOpenModal={() => setIsModalOpen(true)} />
          <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          
          <div className="mt-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar (Contacts) */}
        <div className="hidden lg:block w-[300px] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4">
          <h3 className="text-[#65676B] font-semibold text-[17px] mb-3 px-2">Contacts</h3>
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="font-medium text-[15px]">Friend {i}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;