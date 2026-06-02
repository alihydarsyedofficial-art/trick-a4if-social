import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link ইমপোর্ট করা হলো
import CreatePostBox from '../../components/feed/CreatePostBox';
import CreatePostModal from '../../components/feed/CreatePostModal';
import PostCard from '../../components/feed/PostCard';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../config/firebase'; // auth ইমপোর্ট করা হলো

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

    // ফায়ারবেস থেকে রিয়েল-টাইমে পোস্টগুলো আনার লজিক
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        
        return () => unsubscribe();
    }, []);
    
    return (
        <div className="flex justify-center bg-[#f0f2f5] min-h-screen pt-16">
            
            {/* Left Sidebar (Desktop) */}
            <div className="hidden xl:block w-[300px] p-4 fixed left-0 top-16 overflow-y-auto h-screen">
                <div className="flex flex-col gap-1 pr-2">
                    <Link to="/profile" className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg transition">
                        <img src={auth.currentUser?.photoURL || "https://via.placeholder.com/40"} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
                        <span className="font-semibold text-[15px] text-[#050505]">{auth.currentUser?.displayName || 'User'}</span>
                    </Link>
                    <div className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer transition">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">👥</div>
                        <span className="font-semibold text-[15px] text-[#050505]">Friends</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer transition">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-[13px] font-bold">Groups</div>
                        <span className="font-semibold text-[15px] text-[#050505]">Groups</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer transition">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg">🛒</div>
                        <span className="font-semibold text-[15px] text-[#050505]">Marketplace</span>
                    </div>
                </div>
            </div>

            {/* Main Feed */}
            <div className="w-full max-w-[600px] px-2 md:px-4 mt-4 mb-10">
                <CreatePostBox onOpenModal={() => setIsModalOpen(true)} />
                <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                
                {/* পোস্ট লিস্ট এখানে রেন্ডার করা হচ্ছে */}
                <div className="mt-4">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>

            {/* Right Sidebar (Contacts) */}
            <div className="hidden lg:block w-[300px] p-4 fixed right-0 top-16 overflow-y-auto h-screen">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <h3 className="text-gray-500 font-semibold text-[15px]">Contacts</h3>
                    </div>
                    
                    {/* ডামি ফ্রেন্ড লিস্ট - ভবিষ্যতে এটি ফায়ারবেস থেকে আসবে */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#e4e6eb] rounded-lg cursor-pointer transition">
                            <div className="relative">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full object-cover" alt="Friend" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <span className="font-semibold text-[15px] text-[#050505]">Friend {i}</span>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default Home;