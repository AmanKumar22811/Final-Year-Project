import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';

const Result = () => {
  const location = useLocation();
  const data = location.state || {};

  const bloodGroup = data.prediction || 'A+';
  const confidence = data.confidence || '98%';

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Detection Complete</h1>
          {data?.fullName && (
            <p className="text-gray-600 mb-4">Result for {data.fullName}</p>
          )}

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Detected Blood Group</p>
            <p className="text-4xl font-bold text-teal-600">{bloodGroup}</p>
            <p className="text-sm text-gray-500 mt-2">Confidence: {confidence}</p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            This result is based on fingerprint analysis. Please consult a medical professional for confirmation.
          </p>

          <div className="space-y-3">
            <Link
              to="/upload"
              className="block w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-md transition-colors"
            >
              Detect Another
            </Link>
            <Link
              to="/"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
