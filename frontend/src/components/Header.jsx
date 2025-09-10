import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaMapMarkerAlt,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
} from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-shadow bg-white fixed w-full z-50 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Desktop Menu */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-rose-500 font-bold text-2xl">UC</span>
              <span className="hidden md:block ml-1 font-semibold">
                UrbanCompany
              </span>
            </div>

            {/* Desktop Menu Items */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <a
                href="/"
                className="menu-item border-b-2 border-rose-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="menu-item border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Services
              </a>
              <a
                href="/beauty"
                className="menu-item border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                 Beauty
              </a>
              <a
                href="#"
                className="menu-item border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Products
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Search services"
                  className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="hidden md:block ml-4">
              <div className="flex items-center text-gray-700 hover:text-rose-500 cursor-pointer">
                <FaMapMarkerAlt className="mr-1" />
                <span>New Delhi</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center ml-4 space-x-4">
             
              <button className="text-gray-500 hover:text-rose-500">
                <FaUserCircle className="text-xl" />
              </button>
              <button className="text-gray-500 hover:text-rose-500 relative">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                ref={buttonRef}
                className="text-gray-500 hover:text-rose-500"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaBars className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="mobile-menu md:hidden bg-white border-t border-gray-200 overflow-x: hidden;"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search */}
            <div className="relative mt-3 mb-2">
              <input
                type="text"
                placeholder="Search services"
                className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaSearch className="text-gray-400" />
              </div>
            </div>

            {/* Links */}
            <a
              href="/"
              className="text-rose-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-100 hover:text-rose-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Services
            </a>
            <a
              href="/beauty"
              className="text-gray-700 hover:bg-gray-100 hover:text-rose-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Beauty
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-gray-100 hover:text-rose-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Products
            </a>

            {/* Location */}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="flex items-center px-3 py-2 text-gray-700">
                <FaMapMarkerAlt className="mr-2" />
                <span>New Delhi</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 border-t border-gray-200 flex space-x-3">
              
              <button className="text-gray-500 hover:text-rose-500 px-4 py-2 rounded-md border border-gray-300">
                <FaUserCircle className="text-xl" />
              </button>
              <button className="text-gray-500 hover:text-rose-500 px-4 py-2 rounded-md border border-gray-300 relative">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
