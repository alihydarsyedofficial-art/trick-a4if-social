// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#f0f2f5]"> {/* ফেসবুকের সিগনেচার ব্যাকগ্রাউন্ড */}
            <Header />
            <div className="pt-14 flex justify-center w-full">
                {/* Left Sidebar (Desktop Only) */}
                <div className="hidden xl:block w-[300px] fixed left-0 h-screen p-4 overflow-y-auto">
                    {/* এখানে শর্টকাট বা প্রোফাইল লিংক রাখুন */}
                </div>

                {/* Main Feed Content */}
                <div className="w-full max-w-[600px] px-2 md:px-4 py-4">
                    <Outlet /> 
                </div>

                {/* Right Sidebar (Contacts) */}
                <div className="hidden lg:block w-[300px] fixed right-0 h-screen p-4 overflow-y-auto">
                    {/* এখানে ফ্রেন্ড লিস্ট রাখুন */}
                </div>
            </div>
        </div>
    );
};
export default MainLayout;