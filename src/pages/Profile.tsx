import React, { useState } from 'react';
import { Camera, LayoutDashboard, Edit2, Megaphone, ChevronDown, MapPin, Briefcase, GraduationCap, Grid, List } from 'lucide-react';
import { auth } from '../config/firebase';
import CreatePostBox from '../components/feed/CreatePostBox';
import PostCard from '../components/feed/PostCard';

const Profile = () => {
    const user = auth.currentUser;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const coverPhoto = "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop"; 
    const posts = [{ id: '1', userName: user?.displayName || 'Akhil Khan Adi', userPhoto: user?.photoURL || defaultAvatar, content: 'This is my first post on my new profile!' }];

    return (
        <div className="bg-[#f0f2f5] min-h-screen w-full">
            {/* White Header Section (Cover, Avatar, Info) */}
            <div className="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] w-full pb-4">
                <div className="max-w-[1095px] mx-auto w-full px-0 md:px-4">
                    
                    {/* Cover Photo */}
                    <div className="relative w-full h-[250px] md:h-[400px] bg-gradient-to-b from-gray-300 to-gray-500 md:rounded-b-lg overflow-hidden">
                        <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                        <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-[15px] transition-colors shadow-sm">
                            <Camera size={18}/> Add cover photo
                        </button>
                    </div>

                    {/* Profile Info Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end px-4 mt-[-60px] md:mt-[-30px] mb-4">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 w-full md:w-auto">
                            {/* Profile Picture */}
                            <div className="relative">
                                <img 
                                    src={user?.photoURL || defaultAvatar} 
                                    className="w-[168px] h-[168px] rounded-full border-4 border-white object-cover shadow-sm bg-white" 
                                    alt="Profile"
                                />
                                <button className="absolute bottom-2 right-2 w-9 h-9 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-full flex items-center justify-center shadow-sm">
                                    <Camera size={20} className="text-black"/>
                                </button>
                            </div>
                            
                            {/* Name & Stats */}
                            <div className="text-center md:text-left mb-2 md:mb-4">
                                <h1 className="text-[32px] font-bold text-[#050505] leading-tight">{user?.displayName || 'Akhil Khan Adi'}</h1>
                                <p className="text-[15px] text-[#65676B] font-semibold mt-1">113 followers • 85 following</p>
                                <p className="text-[15px] text-[#050505] mt-1">💼 Digital creator • 📍 Shinagawa-ku, Tokyo ⛩ Japan</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4 md:mt-0 md:mb-4">
                            <button className="bg-[#0866ff] hover:bg-[#075ce5] text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                <LayoutDashboard size={18}/> Dashboard
                            </button>
                            <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                <Edit2 size={18}/> Edit
                            </button>
                            <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors hidden sm:flex">
                                <Megaphone size={18}/> Advertise
                            </button>
                            <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] px-3 py-1.5 rounded-lg flex items-center justify-center transition-colors">
                                <ChevronDown size={18} className="text-black"/>
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#ced0d4] mx-4 mt-2"></div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-between items-center px-4 pt-1">
                        <div className="flex gap-1">
                            <button className="px-4 py-3.5 text-[#0866ff] font-semibold text-[15px] border-b-[3px] border-[#0866ff]">Posts</button>
                            <button className="px-4 py-3.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#f2f2f2] rounded-lg transition-colors">About</button>
                            <button className="px-4 py-3.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#f2f2f2] rounded-lg transition-colors">Reels</button>
                            <button className="px-4 py-3.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#f2f2f2] rounded-lg transition-colors">Photos</button>
                            <button className="px-4 py-3.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#f2f2f2] rounded-lg transition-colors">Friends</button>
                            <button className="px-4 py-3.5 text-[#65676B] font-semibold text-[15px] hover:bg-[#f2f2f2] rounded-lg transition-colors flex items-center gap-1">More <ChevronDown size={16}/></button>
                        </div>
                        <button className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-lg flex items-center justify-center transition-colors">
                            <MoreHorizontal size={20} className="text-black"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Content Area (2-Column Grid exactly like screenshot) */}
            <div className="max-w-[1095px] mx-auto w-full px-2 md:px-4 mt-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
                    
                    {/* Left Column (Intro / Personal Details) */}
                    <div className="flex flex-col gap-4 sticky top-[70px]">
                        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.2)] p-4 border border-gray-100">
                            <h2 className="text-[20px] font-bold text-[#050505] mb-4">Personal details</h2>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <MapPin size={24} className="text-[#8c939d]" />
                                    <span className="text-[15px] text-[#050505]">Lives in <strong>Shinagawa-ku, Tokyo, Japan</strong></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={24} className="text-[#8c939d]" />
                                    <span className="text-[15px] text-[#050505]">From <strong>Ota-ku, Tokyo, Japan</strong></span>
                                </div>
                            </div>

                            <h2 className="text-[20px] font-bold text-[#050505] mt-6 mb-4">Work</h2>
                            <div className="flex items-start gap-3">
                                <Briefcase size={24} className="text-[#8c939d] mt-1" />
                                <div>
                                    <span className="text-[15px] text-[#050505] font-semibold block">Japan</span>
                                    <span className="text-[13px] text-[#65676B]">Dec 11, 2025 - Present · 5 months</span>
                                </div>
                            </div>

                            <h2 className="text-[20px] font-bold text-[#050505] mt-6 mb-4">Education</h2>
                            <div className="flex items-start gap-3">
                                <GraduationCap size={24} className="text-[#8c939d]" />
                                <span className="text-[15px] text-[#050505] font-semibold">Studied at...</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Create Post & Feed) */}
                    <div className="flex flex-col gap-4">
                        <CreatePostBox onOpenModal={() => setIsModalOpen(true)} />
                        
                        {/* Posts Filter Bar */}
                        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.2)] p-3 border border-gray-100 flex items-center justify-between">
                            <h3 className="text-[20px] font-bold text-[#050505]">Posts</h3>
                            <div className="flex gap-2">
                                <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 14a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1zm4-11a1 1 0 0 1 1 1v10a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm5 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1zm-14 0a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1z"></path></svg> Filters
                                </button>
                                <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                    <Settings size={16}/> Manage posts
                                </button>
                            </div>
                        </div>

                        {/* List/Grid View Toggle */}
                        <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-gray-100 flex p-1">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 text-[#0866ff] font-semibold border-b-[3px] border-[#0866ff]">
                                <List size={20}/> List view
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 text-[#65676B] font-semibold hover:bg-[#f2f2f2] rounded-lg transition-colors">
                                <Grid size={20}/> Grid view
                            </button>
                        </div>

                        {/* Posts List */}
                        {posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>

                </div>
            </div>
        </div>
    );
};

// Lucide icon import needed in this file for MoreHorizontal
import { MoreHorizontal } from 'lucide-react';
export default Profile;