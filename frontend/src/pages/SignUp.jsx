import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'Please fill out this field.';
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match.';
    } else if (name === 'password' && value.length < 6) {
      error = 'Password must be at least 6 characters.';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(newTouched);

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Please fill out this field.";
      else if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[key] = "Please enter a valid email address.";
      } else if (key === "confirmPassword" && value !== formData.password) {
        newErrors[key] = "Passwords do not match.";
      } else if (key === "password" && value.length < 6) {
        newErrors[key] = "Password must be at least 6 characters.";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully!");

          // optional: auto redirect to login
          window.location.href = "/login";
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error. Try again later.");
      }
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors[name] && touched[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
                {errors[name] && touched[name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-md transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-800">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
