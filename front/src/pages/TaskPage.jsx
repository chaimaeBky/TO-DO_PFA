import React, { useState } from 'react'
import { useLoaderData , useParams ,Link } from 'react-router-dom'
import SubTasksListing from '../component/SubTasksListing';
import SubTasksHeader from '../component/SubTasksHeader';
import { FaArrowLeft , FaPlus , FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backGroundCloud from '../assets/images/backGroundCloud.png';
import star from '../assets/images/star.png';
import { useNavigate } from 'react-router-dom';

const TaskPage = ({addTaskSubmit  , deleteSubTaskApp} ) => {
    const {id} = useParams();
    const initialTask = useLoaderData();
    const [task, setTask] = useState(initialTask);
    const [showZone , setShowZone] = useState(false);
    const [newTaskText , setNewTaskText] = useState('');
    const [newTaskState , setNewTaskState] = useState(false);
    const navigate = useNavigate();

    const deleteSubTask = async (subtaskId) => {
        // Call the delete function from App.jsx
        await deleteSubTaskApp(subtaskId, id);
        
        // Update the task state by removing the deleted subtask
        setTask((prevTask) => ({
            ...prevTask,
            subtasks: prevTask.subtasks.filter((subtask) => subtask.id !== subtaskId),
        }));

        toast.success('Subtask deleted successfully');
    };

    const addTask =  () => {
       setShowZone(!showZone);
    }
    const addTaskData = async (e) => {
        e.preventDefault();
        
     const newTaskId = task.subtasks.length + 1;     
     const newTask = {
        id: newTaskId, 
        text: newTaskText, 
        state: newTaskState,
        };
    
        await addTaskSubmit(newTask, id);
    
        // Update the task's subtasks in local state
        setTask((prevTask) => ({
            ...prevTask,
            subtasks: [...prevTask.subtasks, newTask],
          }));
    
        setShowZone(false);
        setNewTaskText(''); // Clear the input field
        toast.success('Task Added Successfully');
      };
      const handleLogout = () => {
        localStorage.removeItem('userEmail'); 
        navigate('/login'); 
      };
    
  return (
     <div className=" min-h-screen ">
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
        <div className='container m-auto py-6 px-40 mb-2'>
          <Link
            to='/Home'
            className='text-gray-500  hover:text-purple-300 flex items-center'
          >
            <FaArrowLeft className='mr-2' /> Back to your ToDo List
          </Link>
        </div>
        <button
    onClick={handleLogout}
    className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
  >
    Logout
  </button>

        <SubTasksHeader task ={task}/> 
        {task.subtasks && task.subtasks.map((subtask) => (
        <div key={subtask.id || subtask.newTaskId} className="container m-auto py-2 px-60">
       <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-md mb-1">
              <SubTasksListing subtask={subtask} />
          <button
              className="bg-purple-300 text-white p-2 rounded-full shadow hover:bg-purple-700"
                onClick={() => deleteSubTask(subtask.id)} // Pass the subtask ID
                        >
                            <FaTrash className="w-5 h-5" />
                        </button>

    </div>
  </div>
))}

     
       {showZone && (   <form onSubmit={addTaskData}>
        <div className="  flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-md mb-2 max-w-sm w-full">
        <div className="flex items-center space-x-4">
       

        <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter task title"
            className="w-full p-2 border rounded mb-2"
          />
           <button
            className="bg-purple-300 text-white px-4 py-2 rounded hover:bg-purple-600"
            type='submit'
          >
            Save 
          </button>

          
         
        </div>
      </div>
      </div>
                </form>

        )
       }
       <div className='container m-auto py-6 px-80  mt-1'>
       <button 
            className="bg-purple-300 text-white p-2  rounded-full shadow hover:bg-purple-600 flex items-center justify-center" 
            onClick={addTask}
       >
        <FaPlus className="w-5 h-5 " /> {/* Adjust the size as needed */}
       </button>
       </div>

      <ToastContainer/>
      </div>
  )
}

const taskLoader = async ({ params }) => {
  try {
    const res = await fetch(`/api/Tasks/${params.id}`);
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    console.log('Fetched Task:', data);  // Log the fetched data
    return data;
  } catch (error) {
    console.error('Failed to fetch task:', error);
    return null;
  }
};


export { TaskPage as default , taskLoader }