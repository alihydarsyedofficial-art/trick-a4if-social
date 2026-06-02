import React, { useState } from 'react';
import { Search, Home, Tv, Store, Users, Menu, MessageCircle, Bell, LogOut, Settings, HelpCircle, AlertCircle, Moon, ChevronRight, RefreshCcw, Grid } from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
    const user = auth.currentUser;
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="bg-white h-[56px] w-full fixed top-0 z-50 shadow-sm flex items-center justify-between px-4">
            {/* Left side */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0866ff] hover:bg-[#075ce5] transition-colors rounded-full text-white flex items-center justify-center font-bold text-2xl cursor-pointer">
                    f
                </div>
                <div className="flex items-center bg-[#f0f2f5] rounded-full px-3 py-2 cursor-text">
                    <Search size={20} className="text-[#65676b]" />
                    <input 
                        type="text" 
                        placeholder="Search Facebook" 
                        className="bg-transparent border-none outline-none ml-2 hidden md:block w-[200px] text-[15px]"
                    />
                </div>
            </div>

            {/* Middle side (Navigation) */}
            <div className="hidden md:flex items-center justify-center gap-1 flex-1 max-w-[680px]">
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer border-b-[3px] border-[#0866ff] text-[#0866ff]">
                    <Home size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-[#f0f2f5] rounded-lg text-[#65676b] transition-colors">
                    <Tv size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-[#f0f2f5] rounded-lg text-[#65676b] transition-colors">
                    <Store size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-[#f0f2f5] rounded-lg text-[#65676b] transition-colors">
                    <Users size={28} />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 relative">
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] transition-colors rounded-full flex items-center justify-center cursor-pointer text-black">
                    <Grid size={20} fill="currentColor" />
                </div>
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] transition-colors rounded-full flex items-center justify-center cursor-pointer text-black">
                    <MessageCircle size={20} fill="currentColor" />
                </div>
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] transition-colors rounded-full flex items-center justify-center cursor-pointer text-black">
                    <Bell size={20} fill="currentColor" />
                </div>
                
                {/* Profile Avatar */}
                <img 
                    src={user?.photoURL || defaultAvatar} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full cursor-pointer object-cover hover:brightness-95 transition-all border border-gray-200"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />

                {/* Picture-Perfect Dropdown Menu */}
                {showProfileMenu && (
                    <div className="absolute top-[52px] right-0 w-[360px] bg-white rounded-xl shadow-[0_12px_28px_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] p-4 z-50 border border-gray-100">
                        
                        {/* Profile Switcher Card */}
                        <div className="p-1 shadow-[0_2px_12px_rgba(0,0,0,0.1)] rounded-xl mb-4 border border-gray-200">
                            <div className="flex items-center gap-3 p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <img src={user?.photoURL || defaultAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                <span className="font-semibold text-[17px] text-[#050505]">{user?.displayName || 'Akhil Khan Adi'}</span>
                            </div>
                            <hr className="mx-2 my-1 border-[#ced0d4]" />
                            <div className="flex items-center gap-3 p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <RefreshCcw size={20} className="text-[#65676B] ml-2" />
                                <span className="font-medium text-[15px] text-[#050505]">TRICK A4IF</span>
                            </div>
                            <div className="p-2">
                                <button className="w-full bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] font-semibold py-1.5 rounded-lg transition-colors text-[15px]">
                                    See all profiles
                                </button>
                            </div>
                        </div>

                        {/* Menu Options */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><Settings size={20} className="text-black"/></div>
                                    <span className="font-semibold text-[15px] text-[#050505]">Settings & privacy</span>
                                </div>
                                <ChevronRight size={24} className="text-[#65676B]" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><HelpCircle size={20} className="text-black"/></div>
                                    <span className="font-semibold text-[15px] text-[#050505]">Help & support</span>
                                </div>
                                <ChevronRight size={24} className="text-[#65676B]" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><AlertCircle size={20} className="text-black"/></div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-[15px] text-[#050505]">Report a problem</span>
                                        <span className="text-[12px] text-[#65676B]">CTRL B</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><Moon size={20} className="text-black"/></div>
                                    <span className="font-semibold text-[15px] text-[#050505]">Display & accessibility</span>
                                </div>
                                <ChevronRight size={24} className="text-[#65676B]" />
                            </div>
                            
                            <div onClick={handleLogout} className="flex items-center gap-3 p-2 hover:bg-[#f2f2f2] rounded-lg cursor-pointer transition-colors mt-1">
                                <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center"><LogOut size={20} className="text-black"/></div>
                                <span className="font-semibold text-[15px] text-[#050505]">Log out</span>
                            </div>
                        </div>
                        
                        {/* Footer links */}
                        <div className="mt-3 text-[12px] text-[#65676B] px-2 leading-tight">
                            Privacy · Terms · Advertising · Ad Choices · Cookies · More
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;