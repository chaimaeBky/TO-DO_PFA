import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ⬅️ Added Link
import backGroundCloud from '../assets/images/backGroundCloud.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import star from '../assets/images/star.png';
import user from '../assets/images/user2.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginForm = async (e) => {
    e.preventDefault();
  
    const email = e.target[0].value;
    const password = e.target[1].value;
  
    try {
      const res = await fetch("/api/Users");
      const users = await res.json();
  
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
  
      if (user) {
        localStorage.setItem('userEmail', user.email);

        return navigate('/home');
      } else {
        toast.error('Invalid email or password!');
      }
      
    } catch (err) {
      console.error("Login error:", err);
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

      {/* Login Container */}
      <div className="w-full max-w-2xl flex justify-center">
        <div className="bg-white p-6 pt-20 rounded-lg shadow-md mb-2 max-w-sm w-full relative">
          {/* Centered User Image */}
          <img
            src={user}
            alt="User"
            className="w-24 h-24 rounded-full absolute -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg bg-white"
          />

          {/* Form Content */}
          <form onSubmit={loginForm} className="flex flex-col space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
            
            <button
              type="submit"
              className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Login
            </button>
          </form>

          {/* Registration Link */}
          <p className="mt-4 text-sm text-center">
            Don’t have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:underline">
              Register here
            </Link>
          </p>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
