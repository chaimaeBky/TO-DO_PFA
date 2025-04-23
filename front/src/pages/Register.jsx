import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import user from '../assets/images/user2.png';
import backGroundCloud from '../assets/images/backGroundCloud.png';
import star from '../assets/images/star.png';
import { Navigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!username || !email || password.length < 6) {
      toast.error('Please fill all fields and use a strong password');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {  // Check if response is successful
        toast.success(data.message || "Registration successful!");
        onRegister?.(); 
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    }
  };
  
  
  return (
    <div className="min-h-screen flex justify-center items-center relative bg-gray-100 overflow-hidden px-4">
      {/* Cloud Background */}
      <div className="cloud-background absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <img
            key={index}
            src={backGroundCloud}
            alt={`cloud-${index}`}
            className={`cloud cloud${index + 1}`}
          />
        ))}
        {[...Array(10)].map((_, index) => (
          <img
            key={index}
            src={star}
            alt={`star-${index}`}
            className={`star star${index + 1}`}
          />
        ))}
      </div>

      {/* Registration Box */}
      <form
        onSubmit={handleRegister}
        className="z-10 bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative"
      >
        <div className="flex justify-center mb-4">
          <img
            src={user}
            alt="User Avatar"
            className="w-24 h-24 object-cover rounded-full shadow border-4 border-purple-300"
          />
        </div>
        <h2 className="text-3xl font-semibold text-center text-purple-500 mb-6">
          Create your account 💫
        </h2>

        <label className="block text-sm font-medium mb-1 text-purple-600">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block text-sm font-medium mb-1 text-purple-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <label className="block text-sm font-medium mb-1 text-purple-600">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <button
          type="submit"
          className="bg-purple-300 w-full text-white py-2 rounded hover:bg-purple-600 transition"
        >
          Register
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Register;
