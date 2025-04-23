import React from 'react';
import icon from '../assets/images/icon.png';
import backGroundCloud from '../assets/images/backGroundCloud.png';
import star from '../assets/images/star.png';
import '../../src/backGround.css';
import { useNavigate } from 'react-router-dom';

const FirstPage = () => {
  const navigate = useNavigate(); 

  const submitClick = (e) => {
    e.preventDefault();
    return navigate('./login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
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

      {/* Content */}
      <img src={icon} alt="icon" className="w-64 h-64 mb-4" />
      
      <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-3xl font-medium text-purple-500 font-sans">Get Organized with ToDo</h2>
        <p className="text-base text-gray-600 mt-2 font-sans">Manage your tasks effortlessly with our intuitive ToDo app. Stay focused and organized every day!</p>
        <form onClick={submitClick}>
          <button type="submit" className="mt-4 px-5 py-2 bg-purple-500 text-white text-sm rounded-full shadow-sm hover:bg-purple-600 focus:outline-none">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstPage;
