import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-facebook-light">
      <Header />
      
      <div className="flex justify-between w-full pt-14">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Content (Feed / Pages) */}
        <main className="flex-1 w-full max-w-[680px] mx-auto min-h-screen flex justify-center">
          <Outlet /> {/* Child Routes (e.g., Home) will render here */}
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;