import React, { useState } from 'react';
import { Search, Home, Tv, Store, Users, Menu, MessageCircle, Bell, LogOut } from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
    const user = auth.currentUser;
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    return (
        <div className="bg-white h-[56px] w-full fixed top-0 z-50 shadow-sm flex items-center justify-between px-4">
            {/* Left side */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-facebook-blue rounded-full text-white flex items-center justify-center font-bold text-xl cursor-pointer">
                    f
                </div>
                <div className="flex items-center bg-[#f0f2f5] rounded-full px-3 py-2">
                    <Search size={20} className="text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search Facebook" 
                        className="bg-transparent border-none outline-none ml-2 hidden md:block w-[200px]"
                    />
                </div>
            </div>

            {/* Middle side (Navigation) */}
            <div className="hidden md:flex items-center justify-center gap-2 flex-1 max-w-[600px]">
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer border-b-4 border-facebook-blue text-facebook-blue">
                    <Home size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-facebook-hover rounded-lg text-gray-500">
                    <Tv size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-facebook-hover rounded-lg text-gray-500">
                    <Store size={28} />
                </div>
                <div className="w-full max-w-[110px] h-[48px] flex justify-center items-center cursor-pointer hover:bg-facebook-hover rounded-lg text-gray-500">
                    <Users size={28} />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 relative">
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-full flex items-center justify-center cursor-pointer text-black">
                    <Menu size={20} />
                </div>
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-full flex items-center justify-center cursor-pointer text-black">
                    <MessageCircle size={20} />
                </div>
                <div className="w-10 h-10 bg-[#e4e6eb] hover:bg-[#d8dadf] rounded-full flex items-center justify-center cursor-pointer text-black">
                    <Bell size={20} />
                </div>
                
                {/* Profile & Logout Menu */}
                <img 
                    src={user?.photoURL || defaultAvatar} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full cursor-pointer border border-gray-200 object-cover"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />

                {showProfileMenu && (
                    <div className="absolute top-12 right-0 w-[300px] bg-white rounded-xl shadow-xl border border-gray-200 p-2">
                        <div className="flex items-center gap-3 p-2 hover:bg-facebook-hover rounded-lg cursor-pointer mb-2">
                            <img src={user?.photoURL || defaultAvatar} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-bold text-[17px]">{user?.displayName || 'User'}</span>
                        </div>
                        <hr className="mb-2" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 p-2 hover:bg-facebook-hover rounded-lg font-semibold text-black"
                        >
                            <div className="w-9 h-9 bg-[#e4e6eb] rounded-full flex items-center justify-center">
                                <LogOut size={20} />
                            </div>
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;