import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Profile = () => {

  const [user, setUser] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {

        const res = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();
        setUser(data);

      } catch (error) {
        console.error("Profile error:", error);
      }
    };

    const fetchHistory = async () => {
      try {

        const res = await fetch("http://localhost:5000/api/history", {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();
        setHistory(data);

      } catch (error) {
        console.error("History error:", error);
      }
    };

    fetchProfile();
    fetchHistory();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      <div className="max-w-4xl mx-auto px-4 pt-32">

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-10">

          <div className="w-24 h-24 mx-auto bg-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.username}
          </h2>

          <p className="text-gray-500 mb-6">
            Welcome to your Blood Group Detector profile.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 text-left">

            <p className="text-gray-700 mb-2">
              <strong>Full Name:</strong> {user.fullName}
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {user.email}
            </p>

            <p className="text-gray-700">
              <strong>Status:</strong> Logged In
            </p>

          </div>

        </div>

        {/* Prediction History */}
        <div className="bg-white rounded-lg shadow-lg p-8">

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Prediction History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-500">
              No predictions yet.
            </p>
          ) : (
            <div className="space-y-4">

              {history.map((item) => (

                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.prediction}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-teal-600 font-bold">
                      {item.confidence}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Confidence
                    </p>
                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;