import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
   const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 pt-32 md:pt-24 pb-12">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 text-center mb-4 px-4">
        Welcome to{' '}
        <span className="text-teal-500">Bloodgroup Detector</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl md:text-2xl text-gray-600 text-center mb-8 max-w-2xl px-4">
        New way of Detecting Blood Group with Fingerprint
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link
          to="/upload"
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2 justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Fingerprint
        </Link>
        <button
          onClick={() => {
            const token = localStorage.getItem("token");

            if (token) {
              navigate("/upload");
            } else {
              navigate("/signup");
            }
          }}
          className="border-2 border-teal-500 hover:bg-teal-50 text-teal-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          Get Started
        </button>

      </div>
    </section>
  );
};

export default Hero;
