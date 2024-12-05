"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isSettingShow =
    pathname === "/auth/signin" ||
    pathname === "/auth/signup" ||
    pathname === "/" ||
    pathname === "/auth/verify-request";
   
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


const handleLogout = async () => {
  const response = NextResponse.json({ message: 'Logged out' });

  // Deleting the cookie when logging out
  response.cookies.delete('userId');

    await signOut({ redirect: true, callbackUrl: "/" }); // Logs out and redirects to home
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className=" mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-white" href={"/"} />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">
                URL Shortener
              </span>
            </div>
          </div>
          {isSettingShow && (
            <div className="flex items-center space-x-4 relative">
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 font-medium"
                onClick={() => router.push("/auth/signin")}
              >
                SignIn
              </button>
            </div>
          )}
          {!isSettingShow && (
            <div className="flex ">
              <div className="mx-4 cursor-pointer">
                <span
                  className="ml-2 text-xl font-bold text-gray-800"
                  onClick={() => {}}
                >
                  Analytics
                </span>
              </div>

              <button
                className="flex  items-center space-x-2 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                
              >
                <span className="flex justify-center items-center w-8 h-8 rounded-full bg-black text-white">
                  N
                </span>

                <svg
                  className={`w-4 h-4 text-gray-800 transition-transform duration-200 ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-12 right-0 mt-2 w-48 bg-white shadow-2xl shadow-black rounded-md">
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
