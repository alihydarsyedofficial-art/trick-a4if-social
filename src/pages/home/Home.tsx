import React, { useState } from 'react';
import { Users, Tv, Bookmark, Clock, ChevronDown } from 'lucide-react';
import CreatePostBox from '../../components/feed/CreatePostBox';
import CreatePostModal from '../../components/feed/CreatePostModal';
import PostCard from '../../components/feed/PostCard';
import { auth } from '../../config/firebase';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = auth.currentUser;
  const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  
  const posts = [{ id: '1', userName: 'Arifull Islam', content: 'Welcome to TRICK A4IF Social!' }];

  return (
    <div className="w-full max-w-[1920px] mx-auto flex justify-between px-2 md:px-4 mt-4">
        
        {/* Left Sidebar (Real Icons) */}
        <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
            <div className="flex flex-col gap-2 p-2">
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <img src={user?.photoURL || defaultAvatar} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                    {user?.displayName || 'Arifull Islam'}
                </div>
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <Users size={28} className="text-[#0866ff]" /> Friends
                </div>
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <Clock size={28} className="text-[#0866ff]" /> Memories
                </div>
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <Bookmark size={28} className="text-[#b02fb3]" /> Saved
                </div>
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <Tv size={28} className="text-[#0866ff]" /> Video
                </div>
                <div className="p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer font-medium flex items-center gap-3 text-[15px]">
                    <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><ChevronDown size={20}/></div>
                    See more
                </div>
            </div>
        </div>

        {/* Main Feed */}
        <div className="w-full max-w-[590px] shrink-0 mx-auto">
            <CreatePostBox onOpenModal={() => setIsModalOpen(true)} />
            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <div className="flex flex-col gap-4 mt-4">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
        </div>

        {/* Right Sidebar (Contacts with proper avatars) */}
        <div className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
            <h3 className="text-facebook-secondary font-semibold text-[17px] mb-3 px-2">Contacts</h3>
            <div className="flex flex-col gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-facebook-hover rounded-[8px] cursor-pointer">
                        <div className="relative">
                            <img src={defaultAvatar} className="w-9 h-9 rounded-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-facebook-bg rounded-full"></div>
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