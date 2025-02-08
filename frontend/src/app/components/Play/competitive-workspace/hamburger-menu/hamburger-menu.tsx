import React from 'react';

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
      className="relative flex items-center justify-center w-6 h-6 focus:outline-none"
      onClick={toggleSidebar}
      aria-label="Menu"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <span
          className={`absolute h-0.5 w-4 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'rotate-45 delay-200' : '-translate-y-1.5'
          }`}
        ></span>
        <span
          className={`absolute h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'
          }`}
        ></span>
        <span
          className={`absolute h-0.5 w-4 bg-white transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? '-rotate-45 delay-200' : 'translate-y-1.5'
          }`}
        ></span>
      </div>
    </button>
  );
};

export default HamburgerMenu;
