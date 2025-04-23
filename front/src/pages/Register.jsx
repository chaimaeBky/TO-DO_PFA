import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import user from '../assets/images/user2.png';
import backGroundCloud from '../assets/images/backGroundCloud.png';
import star from '../assets/images/star.png';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        navigate('/home');
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center p-4 relative">
      {/* Background Clouds */}
      <div className="cloud-background">
        {[...Array(15)].map((_, index) => (
          <img
            key={index}
            src={backGroundCloud}
            alt={`cloud-${index}`}
            className={`cloud cloud${index + 1}`}
          />
        ))}

        {/* Stars */}
        {[...Array(15)].map((_, index) => (
          <img
            key={index}
            src={star}
            alt={`star-${index}`}
            className={`star star${index + 1}`}
          />
        ))}
      </div>

      {/* Registration Box */}
      <div className="w-full max-w-2xl flex justify-center">
        <div className="bg-white p-6 pt-20 rounded-lg shadow-md mb-2 max-w-sm w-full relative">
          {/* Centered User Image */}
          <img
            src={user}
            alt="User"
            className="w-24 h-24 rounded-full absolute -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg bg-white"
          />
          
          {/* Form Content */}
          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
            
            <button
              type="submit"
              className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Register
            </button>
          </form>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Register;
