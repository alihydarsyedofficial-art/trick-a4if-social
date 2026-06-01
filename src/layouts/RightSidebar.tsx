import React from 'react';
import { Search, MoreHorizontal, UserCircle } from 'lucide-react';

const RightSidebar: React.FC = () => {
  // Dummy contacts for UI layout check
  const contacts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    name: `Friend ${i + 1}`,
    isOnline: Math.random() > 0.3
  }));

  return (
    <div className="w-[360px] h-[calc(100vh-56px)] overflow-y-auto sticky top-14 right-0 p-4 hidden lg:block">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 font-semibold text-[15px]">Contacts</h3>
        <div className="flex gap-2 text-gray-500">
          <Search size={18} className="cursor-pointer hover:bg-gray-200 rounded-full p-1" />
          <MoreHorizontal size={18} className="cursor-pointer hover:bg-gray-200 rounded-full p-1" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer relative">
            <div className="relative">
              <UserCircle size={32} className="text-gray-400" />
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <span className="font-medium text-[15px]">{contact.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;