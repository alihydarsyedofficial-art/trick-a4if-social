// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            <Header />
            <div className="pt-14 flex justify-center w-full max-w-[1920px] mx-auto">
                {/* Left Sidebar: Shortcuts */}
                <div className="hidden xl:block w-[300px] fixed left-0 h-screen p-4 overflow-y-auto">
                    {/* এখানে আপনার বামদিকের মেনুগুলো থাকবে */}
                </div>

                {/* Main Feed: মাঝখানের নিউজফিড */}
                <div className="w-full max-w-[600px] px-2 md:px-4 py-4 mt-4">
                    <Outlet />
                </div>

                {/* Right Sidebar: Contacts */}
                <div className="hidden lg:block w-[300px] fixed right-0 h-screen p-4 overflow-y-auto">
                    <h3 className="text-[#65676B] font-semibold text-[17px] mb-3">Contacts</h3>
                    {/* এখানে ফ্রেন্ড লিস্ট থাকবে */}
                </div>
            </div>
        </div>
    );
};
export default MainLayout;