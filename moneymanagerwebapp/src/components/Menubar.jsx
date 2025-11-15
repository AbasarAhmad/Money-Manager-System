import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Menu, X, User, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

const Menubar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handelLogout=()=>{
        clearUser();
        localStorage.clear();
        setShowDropdown(false);
        navigate("/login")
    }

    return (
        <div className="flex items-center justify-between bg-white border-b border-gray-200/50 backdrop-blur-sm py-4 px-4 sm:px-7 sticky top-0 z-30">

            {/* Left side: Menu button */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
                >
                    {openSideMenu ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
                </button>
            </div>

            {/* Logo (NOW LEFT-ALIGNED) */}
            <div className="flex items-center gap-2 flex-1">  {/* <-- FIX: Added flex-1 */}
                <img src={logo} alt="logo" className="h-10 w-10" />
                <span className="text-lg font-semibold text-black truncate">
                    Money Manager
                </span>
            </div>

            {/* Right side: Avatar */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                    <User className="text-purple-600" />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg border border-gray-200 shadow-md py-2 z-50">

                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full">
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown options */}
                        <div className="py-1">
                            <button  onClick={handelLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                <LogOut className='w-4 h-4 text-gray-500'/>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menubar;
