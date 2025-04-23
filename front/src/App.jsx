import React from 'react';
import './index.css';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import FirstPage from './pages/FirstPage';
import HomePage from './pages/HomePage';
import TaskPage, { taskLoader } from './pages/TaskPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './pages/PrivateRoute';

const App = () => {
  const addTaskSubmit = async (newSubTask, taskId) => {
    const taskUrl = `/api/Tasks/${taskId}`;
    const res = await fetch(taskUrl);
    const task = await res.json();
    const updatedSubtasks = [...task.subtasks, newSubTask];

    const updateRes = await fetch(taskUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subtasks: updatedSubtasks, id: taskId }),
    });

    if (updateRes.ok) {
      const updatedTask = await updateRes.json();
      console.log('Subtask added:', updatedTask);
      return updatedTask;
    } else {
      const errorData = await updateRes.json();
      console.error('Error adding subtask:', errorData);
      throw new Error('Failed to add subtask');
    }
  };

  const deleteSubTaskApp = async (subtaskId, id) => {
    const taskUrl = `/api/Tasks/${id}`;
    const res = await fetch(taskUrl);
    const task = await res.json();
    const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subtaskId);

    const updateRes = await fetch(taskUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subtasks: updatedSubtasks }),
    });

    if (updateRes.ok) {
      const updatedTask = await updateRes.json();
      console.log('Subtask deleted:', updatedTask);
      return updatedTask;
    } else {
      const errorData = await updateRes.json();
      console.error('Error deleting subtask:', errorData);
      throw new Error('Failed to delete subtask');
    }
  };

  const addGlobalTaskApp = async (newTask) => {
    const res = await fetch('/api/Tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      console.log('Task added:', updatedTask);
      return updatedTask;
    } else {
      const errorData = await res.json();
      console.error('Error adding task:', errorData);
      throw new Error('Failed to add task');
    }
  };

  const deletedTaskId = async (taskId) => {
    await fetch('/api/home', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
      
        <Route path='/' element={<FirstPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

     
        <Route
          path='/home'
          element={
            <PrivateRoute>
              <HomePage addGlobalTaskApp={addGlobalTaskApp} deletedTaskId={deletedTaskId} />
            </PrivateRoute>
          }
        />
        <Route
          path='/Tasks/:id'
          element={
            <PrivateRoute>
              <TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />
            </PrivateRoute>
          }
          loader={taskLoader}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
