import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const SubTasksListing = ({ subtask }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="  flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg  mb-2 max-w-sm w-full">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={toggleCheck}
            className="w-5 h-5"
          />
          <h3 className={`text-xl font-semibold ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {subtask.text}
          </h3>
       

        </div>

      </div>
      
      </div>



  );
};

export default SubTasksListing;
