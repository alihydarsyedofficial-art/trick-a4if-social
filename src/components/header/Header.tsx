import React from 'react';
import { Search, Home, Tv, Store, Users, UserCircle, Bell, MessageCircle, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/auth.service';
import { useAppDispatch } from '../../hooks/redux';
import { clearUser } from '../../store/slices/authSlice';
// ১. Link ইমপোর্ট করা হলো
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(clearUser());
    navigate('/login'); // লগআউট হলে লগইন পেজে নিয়ে যাবে
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center justify-between px-4 z-50">
      {/* Left Section - Logo & Search */}
      <div className="flex items-center gap-2 w-1/4">
        {/* TRICK A4IF Logo (হোমে যাওয়ার লিংক) */}
        <Link to="/" className="w-10 h-10 bg-facebook-blue rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer shadow-sm hover:opacity-90">
          TA
        </Link>
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-64">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search TRICK A4IF" 
            className="bg-transparent border-none outline-none ml-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Middle Section - Navigation Tabs */}
      <div className="hidden lg:flex items-center justify-center gap-2 w-2/4">
        <Link to="/" className="px-10 py-2 cursor-pointer border-b-4 border-facebook-blue text-facebook-blue rounded-md hover:bg-gray-100 transition-colors">
          <Home size={28} />
        </Link>
        <div className="px-10 py-2 cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
          <Tv size={28} />
        </div>
        <div className="px-10 py-2 cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
          <Store size={28} />
        </div>
        <div className="px-10 py-2 cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
          <Users size={28} />
        </div>
      </div>

      {/* Right Section - Profile & Actions */}
      <div className="flex items-center justify-end gap-2 w-1/4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <Menu size={20} />
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <MessageCircle size={20} />
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </div>
        
        <div className="relative group cursor-pointer ml-2">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-gray-300 object-cover" />
          ) : (
            <UserCircle size={40} className="text-gray-400" />
          )}
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-11 bg-white shadow-lg rounded-lg w-48 hidden group-hover:block border border-gray-100">
            {/* ২. প্রোফাইল পেজে যাওয়ার লিংক */}
            <Link to="/profile" className="block p-2 border-b hover:bg-gray-50 transition-colors">
              <p className="font-semibold text-gray-900">{user?.displayName}</p>
              <p className="text-xs text-blue-600 font-medium">View your profile</p>
            </Link>
            <div className="p-2">
              <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded-md text-left text-sm font-semibold text-gray-700">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;