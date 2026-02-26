import React, { useState, useEffect, useRef } from "react";
import { HiCog, HiLogout, HiUser, HiMenu, HiChevronDown } from "react-icons/hi";

const Header = ({ onToggleSidebar, currentPage }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          >
            <HiMenu className="text-xl text-gray-600" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800">
              {currentPage}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <HiUser className="text-white text-sm" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <HiChevronDown className="text-gray-600 hidden md:block" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <HiUser className="text-lg" />
                  <span>Profile</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <HiCog className="text-lg" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                  <HiLogout className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <h1 className="text-lg font-semibold text-gray-800">{currentPage}</h1>
      </div>
    </header>
  );
};

export default Header;
