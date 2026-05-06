import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (!formData[name].trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Please fill out this field.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTouched = { email: true, password: true };
    setTouched(newTouched);

    const newErrors = {};

    if (!formData.email.trim())
      newErrors.email = "Please fill out this field.";

    if (!formData.password.trim())
      newErrors.password = "Please fill out this field.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {

          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          
          alert("Login successful!");

          navigate("/");

        } else {
          alert(data.message || "Login Failed");
        }

      } catch (error) {
        console.error("Error:", error);
        alert("Server error. Try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />

              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password && touched.password
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />

              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-md transition-colors"
            >
              Login
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-800">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;