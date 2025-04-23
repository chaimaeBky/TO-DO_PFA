import React from 'react';
import { useNavigate } from 'react-router-dom';

const TasksListing = ({ task, deleteTask }) => {
  const navigate = useNavigate();

  // Navigate to task details page
  const taskClick = () => {
    return navigate(`/Tasks/${task.id}`);
  };

  
  return (
    <div onClick={taskClick} className="">
      
      {/* Title and Trash Icon */}
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex items-center space-x-4">
          <p className="text-7xl">{task.icon}</p> {/* Icon */}
          <h3 className="text-3xl font-semibold">{task.title}</h3> {/* Title */}
        </div>
        </div>
        
      

      {/* Description */}
      <p className="text-gray-600 text-xl">{task.description}</p> {/* Description */}

      {/* Subtasks Count */}
      <div>
        <span className="text-sm text-gray-500">
          {task.subtasks ? task.subtasks.length : 0} tasks
        </span> {/* Total subtasks */}
      </div>

    </div>
  );
};

export default TasksListing;
