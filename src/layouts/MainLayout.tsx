import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-facebook-bg">
            {/* ফিক্সড হেডার */}
            <Header />
            
            {/* হেডারের নিচে স্পেস দেওয়ার জন্য pt-[56px] */}
            <div className="pt-[56px] w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;