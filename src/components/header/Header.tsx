// src/components/layout/Header.tsx
import React from 'react';
import { Search, Home, Tv, Store, Users, MessageCircle, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="fixed top-0 z-50 w-full h-14 bg-white border-b border-gray-300 flex items-center justify-between px-4 shadow-sm">
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0866ff] rounded-full flex items-center justify-center text-white font-bold text-xl">f</div>
                <div className="bg-[#f0f2f5] rounded-full px-4 py-2 flex items-center gap-2 w-60 text-gray-500">
                    <Search size={18} />
                    <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm" />
                </div>
            </div>

            {/* Middle: Icons */}
            <nav className="flex gap-10">
                <Link to="/" className="text-[#0866ff] border-b-4 border-[#0866ff] h-14 flex items-center px-4"><Home size={26} /></Link>
                <Link to="/video" className="text-gray-500 hover:bg-gray-100 h-14 flex items-center px-4 rounded-lg"><Tv size={26} /></Link>
                <Link to="/marketplace" className="text-gray-500 hover:bg-gray-100 h-14 flex items-center px-4 rounded-lg"><Store size={26} /></Link>
            </nav>

            {/* Right: User */}
            <div className="flex items-center gap-2">
                <button className="bg-[#e4e6eb] p-2 rounded-full"><Menu size={20} /></button>
                <button className="bg-[#e4e6eb] p-2 rounded-full"><MessageCircle size={20} /></button>
                <button className="bg-[#e4e6eb] p-2 rounded-full"><Bell size={20} /></button>
            </div>
        </header>
    );
};
export default Header;