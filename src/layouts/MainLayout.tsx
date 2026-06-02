import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header'; // পাথ ঠিক করা হয়েছে

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#f0f2f5]"> 
            <Header />
            <div className="pt-14 flex justify-center w-full">
                {/* Left Sidebar */}
                <div className="hidden xl:block w-[300px] fixed left-0 h-screen p-4 overflow-y-auto">
                    {/* শর্টকাট লিংকগুলো এখানে থাকবে */}
                </div>

                {/* Main Feed Content */}
                <div className="w-full max-w-[600px] px-2 md:px-4 py-4">
                    <Outlet /> 
                </div>

                {/* Right Sidebar */}
                <div className="hidden lg:block w-[300px] fixed right-0 h-screen p-4 overflow-y-auto">
                    {/* ফ্রেন্ড লিস্ট এখানে থাকবে */}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;