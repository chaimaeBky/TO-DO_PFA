import React, { useState, useEffect } from 'react';
import user from '../assets/images/user2.png';
import TasksListing from '../component/TasksListing';
import { useNavigate } from 'react-router-dom'; 
import { FaPlus , FaTrash} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import backGroundCloud from '../assets/images/backGroundCloud.png';
import star from '../assets/images/star.png';

const HomePage = ({ addGlobalTaskApp, deletedTaskId }) => {
  const [tasks, setTasks] = useState([]);
  const [showZone, setShowZone] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🌟'); // Default icon
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const addGlobalTask = () => {
    setShowZone(!showZone);
  };

  const addGlobalTaskForm = async (e) => {
    e.preventDefault();

    if (!title ) {
      toast.error("Title is required!");
      return;
    }

    const newTask = {
      id: uuidv4(),
      title: title,
      description: description,
      completed: false,
      icon: icon,
      subtasks: subtasks,
      email: localStorage.getItem("userEmail"),
    };

    await addGlobalTaskApp(newTask);

    setTasks((prevTasks) => [...prevTasks, newTask]);

    setTitle('');
    setDescription('');
    setIcon('🌟');
    setSubtasks([]);

    setShowZone(false);
    toast.success('Task added successfully');
  };

  const deleteTaskId = async (taskId) => {
    const confirm = window.confirm("Are you sure you want to delete this task?");
    if (confirm) {
      await deletedTaskId(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully!');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userEmail'); 
    navigate('/login'); 
  };

  const TasksFetching = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/Tasks?email=${userEmail}`);
      const data = await res.json();
      if (data.Tasks && Array.isArray(data.Tasks)) {
        setTasks(data.Tasks);
      } else {
        toast.error("No tasks found or incorrect data structure");
      }
    } catch (error) {
      toast.error("Error fetching user tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    TasksFetching();
  }, []);

  return (
    
    <div className="min-h-screen flex justify-center p-4">
      
      <div className="cloud-background relative">
        {[...Array(15)].map((_, index) => (
          <img
            key={index}
            src={backGroundCloud}
            alt={`cloud-${index}`}
            className={`cloud cloud${index + 1} absolute`}
          />
        ))}
        {[...Array(15)].map((_, index) => (
          <img
            key={index}
            src={star}
            alt={`star-${index}`}
            className={`star star${index + 1} absolute`}
          />
        ))}
      </div>
      <div className="w-full max-w-2xl mx-auto">
      
        <div className="bg-purple-300 p-6 rounded-lg shadow-md text-white mb-6">
          <div className="mt-4">
            <img
              src={user}
              alt="Welcome"
              className="w-40 h-40 object-cover rounded-full absolute"
              style={{ top: '15px', right: '300px' }}
            />
          </div>
          <h2 className="text-5xl font-semibold">Hello, Planner !</h2>
          <p className="mt-3 text-lg">
            You have {tasks?.length ?? 0} global task{tasks?.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
    onClick={handleLogout}
    className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
  >
    Logout
  </button>
        {loading ? (
          <div className="text-center text-xl font-semibold">Loading tasks...</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-gray-100 p-6 rounded-lg shadow-md mb-4 flex justify-between items-center">
              <TasksListing task={task} deleteTask={deleteTaskId} />
              <div className="ml-4">
      <button
        className="bg-purple-300 text-white p-2 rounded-full shadow hover:bg-purple-600 flex items-center justify-center"
        onClick={() => {
          deleteTaskId(task.id);
        }}
      >
        <FaTrash className="w-5 h-5" />
      </button>
    </div>
            </div>
          ))
        )}

        {showZone && (
          <form onSubmit={addGlobalTaskForm}>
            <div className="flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-md mb-2 max-w-sm w-full">
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  >
                    <option value="🌟">🌟</option>
                    <option value="📅">📅</option>
                    <option value="⚙️">⚙️</option>
                    <option value="💡">💡</option>
                    <option value="📝">📝</option>
                  </select>
                  <button
                    className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-600"
                    type="submit"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <ToastContainer />

        <div className="container m-auto py-6 px-0 mt-1">
          <button
            className="bg-purple-300 text-white p-2 rounded-full shadow hover:bg-purple-600 flex items-center justify-center"
            onClick={addGlobalTask}
          >
            <FaPlus className="w-5 h-5" />
          </button>
          <div className="container m-auto py-6 px-0 mt-1 flex justify-end">
  
</div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
