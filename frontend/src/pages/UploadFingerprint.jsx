import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const UploadFingerprint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    phone: '',
  });
  const [fingerprintFile, setFingerprintFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFingerprintFile(file || null);
    if (errors.fingerprint) setErrors((prev) => ({ ...prev, fingerprint: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Please fill out this field.";

    if (!formData.email.trim())
      newErrors.email = "Please fill out this field.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!fingerprintFile)
      newErrors.fingerprint = "Please upload your fingerprint.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const formDataToSend = new FormData();

        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("fingerprint", fingerprintFile);

        const response = await fetch(
          "http://localhost:5000/api/predict",
          {
            method: "POST",

            body: formDataToSend,
          }
        );

        const data = await response.json();

        if (response.ok) {
          navigate("/result", {
            state: {
              fullName: formData.fullName,
              email: formData.email,
              prediction: data.prediction,
              confidence: data.confidence,
            },
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Detect Blood Group</h1>
          <p className="text-gray-600 text-center text-sm mb-6">Fill in your details and upload your fingerprint</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-800 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="fingerprint" className="block text-sm font-medium text-gray-800 mb-1">
                Upload Fingerprint
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-teal-500 transition-colors">
                <input
                  id="fingerprint"
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fingerprint" className="cursor-pointer block">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mt-2 block text-sm text-gray-600">
                    {fingerprintFile ? fingerprintFile.name : 'Click to upload fingerprint image'}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">PNG, JPG up to 10MB</span>
                </label>
              </div>
              {errors.fingerprint && <p className="mt-1 text-sm text-red-500">{errors.fingerprint}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-md transition-colors"
            >
              Detect Blood Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadFingerprint;
