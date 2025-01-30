import React, { useState } from 'react';

type HamburgerMenuProps = {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
};
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
    isSidebarOpen,
    toggleSidebar,
}) => {

  return (
    <button
      className="relative w-8 h-8 focus:outline-none"
      onClick={toggleSidebar}
      aria-label="Menu"
    >
      <div className="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
        <span
          className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'rotate-45 delay-200' : '-translate-y-2'
          }`}
        ></span>
        <span
          className={`absolute h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
          }`}
        ></span>
        <span
          className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? '-rotate-45 delay-200' : 'translate-y-2'
          }`}
        ></span>
      </div>
    </button>
  );
};

export default HamburgerMenu;