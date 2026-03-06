import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Profile = () => {

  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <div className="flex items-center justify-center px-4 py-32">

        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">

          <div className="w-24 h-24 mx-auto bg-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {username}
          </h2>

          <p className="text-gray-500 mb-6">
            Welcome to your Blood Group Detector profile.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 text-left">

            <p className="text-gray-700 mb-2">
              <strong>Username:</strong> {username}
            </p>

            <p className="text-gray-700">
              <strong>Status:</strong> Logged In
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;