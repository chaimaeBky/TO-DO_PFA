import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskPage from '../../src/pages/TaskPage';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// Mock navigation
const navigateFn = vi.fn();

// Mock router dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useLoaderData: () => ({
      id: '123',
      title: 'Test Task',
      subtasks: [
        { id: 1, text: 'Subtask 1', state: false },
        { id: 2, text: 'Subtask 2', state: true },
      ],
    }),
    useNavigate: () => navigateFn,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Mock toast notifications
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaArrowLeft: () => <svg data-testid="arrow-left-icon" />,
  FaPlus: () => <svg data-testid="plus-icon" />,
  FaTrash: () => <svg data-testid="trash-icon" />,
}));

// Mock components with proper handlers
vi.mock('../../src/component/SubTasksListing', () => ({
  default: ({ subtask }) => (
    <div data-testid={`subtask-${subtask.id}`}>
      <input 
        type="checkbox" 
        checked={subtask.state} 
        data-testid={`checkbox-${subtask.id}`}
        readOnly
      />
      <h3>{subtask.text}</h3>
    </div>
  ),
}));

vi.mock('../../src/component/subTasksHeader', () => ({
  default: ({ task }) => (
    <div data-testid="task-header">
      <h3>{task.title}</h3>
      <p>Total Subtasks: {task.subtasks.length}</p>
    </div>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TaskPage Component', () => {
  const addTaskSubmit = vi.fn();
  const deleteSubTaskApp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      email: 'test@example.com',
      name: 'Test User'
    }));
  });

  const renderTaskPage = () => {
    return render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={
              <TaskPage 
                addTaskSubmit={addTaskSubmit} 
                deleteSubTaskApp={deleteSubTaskApp}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders TaskPage with initial task data', () => {
    renderTaskPage();
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
    expect(screen.getByText('Total Subtasks: 2')).toBeInTheDocument();
    expect(screen.getByText(/back to your todo list/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('toggles add task form when add button is clicked', async () => {
    renderTaskPage();

    // Form should not be visible initially
    expect(screen.queryByPlaceholderText('Enter task title')).not.toBeInTheDocument();

    // Click add button (find by testid since it's the plus button)
    const addButton = screen.getByTestId('plus-icon').closest('button');
    fireEvent.click(addButton);

    // Form should now be visible
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
  });

  test('adds a new subtask successfully', async () => {
    addTaskSubmit.mockResolvedValue(true);
    renderTaskPage();

    // Open form
    const addButton = screen.getByTestId('plus-icon').closest('button');
    fireEvent.click(addButton);

    // Fill form
    const input = screen.getByPlaceholderText('Enter task title');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(addTaskSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ 
          id: 3, // Because we have 2 existing subtasks
          text: 'New Task',
          state: false
        }),
        '123'
      );
      expect(toast.success).toHaveBeenCalledWith('Task Added Successfully');
    });
  });

  test('deletes a subtask successfully', async () => {
    deleteSubTaskApp.mockResolvedValue(true);
    renderTaskPage();

    // Find all delete buttons (trash icons)
    const deleteButtons = screen.getAllByTestId('trash-icon').map(icon => icon.closest('button'));
    fireEvent.click(deleteButtons[0]); // Click first delete button

    await waitFor(() => {
      expect(deleteSubTaskApp).toHaveBeenCalledWith(1, '123');
      expect(toast.success).toHaveBeenCalledWith('Subtask deleted successfully');
    });
  });

  

  test('logs out user and redirects to login page', () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userEmail');
    expect(navigateFn).toHaveBeenCalledWith('/login');
  });
});