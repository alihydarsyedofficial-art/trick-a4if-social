import React from 'react';
import { Users, Bookmark, Clock, MonitorPlay, ChevronDown, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LeftSidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: <Users className="text-blue-500" size={24} />, label: 'Friends' },
    { icon: <Clock className="text-blue-500" size={24} />, label: 'Memories' },
    { icon: <Bookmark className="text-purple-500" size={24} />, label: 'Saved' },
    { icon: <Users className="text-blue-500" size={24} />, label: 'Groups' },
    { icon: <MonitorPlay className="text-blue-500" size={24} />, label: 'Video' },
  ];

  return (
    <div className="w-[360px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 left-0 p-4 hidden lg:block hover:overflow-y-auto">
      <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer mb-2">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full" />
        ) : (
          <UserCircle size={36} className="text-gray-400" />
        )}
        <span className="font-semibold text-[15px]">{user?.displayName}</span>
      </div>

      {menuItems.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
          {item.icon}
          <span className="font-medium text-[15px]">{item.label}</span>
        </div>
      ))}
      
      <div className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer mt-2">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <ChevronDown size={20} />
        </div>
        <span className="font-medium text-[15px]">See more</span>
      </div>

      <div className="border-b border-gray-300 my-2"></div>
      
      <h3 className="text-gray-500 font-semibold px-2 mb-2">Your shortcuts</h3>
      {/* Shortcuts will go here in future */}
    </div>
  );
};

export default LeftSidebar;