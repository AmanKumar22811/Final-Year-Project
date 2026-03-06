import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full px-4 md:px-6 py-4 flex items-center justify-between bg-transparent absolute top-0 left-0 right-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="3" fill="currentColor" />
            <circle cx="11" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <span className="text-xl font-semibold text-gray-800">
          Bloodgroup Detector
        </span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">

        <Link
          to="/"
          className="text-teal-400 hover:text-teal-500 transition-colors"
        >
          Home
        </Link>

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-teal-400 hover:text-teal-500 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-teal-400 hover:text-teal-500 transition-colors"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-teal-400 hover:text-teal-500 transition-colors"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors text-sm md:text-base cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Get Started Button */}

      <button
        onClick={() => {
          const token = localStorage.getItem("token");

          if (token) {
            navigate("/upload");
          } else {
            navigate("/signup");
          }
        }}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base cursor-pointer"
      >
        Get Started
      </button>

    </header>
  );
};

export default Header;