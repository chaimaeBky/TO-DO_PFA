import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskPage from '../../src/pages/TaskPage';
import { toast } from 'react-toastify';

// Mock des dépendances
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
    useNavigate: () => navigateFn, // Utilise une référence à une variable externe
  };
});

// Define navigate mock function outside that we can reference and update
const navigateFn = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock des composants importés
vi.mock('../component/SubTasksListing', () => ({
  default: ({ subtask }) => (
    <div>
      <input type="checkbox" checked={subtask.state} />
      <h3>{subtask.text}</h3>
    </div>
  ),
}));

vi.mock('../component/subTasksHeader', () => ({
  default: ({ task }) => (
    <div>
      <h3>{task.title}</h3>
      <p>Total Subtasks: {task.subtasks.length}</p>
    </div>
  ),
}));

// Mock pour localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TaskPage Component', () => {
  const addTaskSubmit = vi.fn().mockResolvedValue(true);
  const deleteSubTaskApp = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the navigate mock function
    navigateFn.mockClear();
  });

  test('renders TaskPage with initial task data', () => {
    render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={<TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Vérifier que les éléments essentiels sont affichés
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Subtask 1')).toBeInTheDocument();
    expect(screen.getByText('Subtask 2')).toBeInTheDocument();
    expect(screen.getByText('Total Subtasks: 2')).toBeInTheDocument();
    expect(screen.getByText('Back to your ToDo List')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('toggles add task form when add button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={<TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Le formulaire d'ajout ne devrait pas être visible initialement
    expect(screen.queryByPlaceholderText('Enter task title')).not.toBeInTheDocument();

    // Trouver le bouton d'ajout (dans le conteneur avec classe spécifique)
    const addButtonContainer = screen.getByTestId('toast-container').parentElement.querySelector('.container.m-auto.py-6.px-80.mt-1');
    const addButton = addButtonContainer.querySelector('button');
    fireEvent.click(addButton);

    // Le formulaire devrait maintenant être visible
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
  });

  test('adds a new subtask successfully', async () => {
    render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={<TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Ouvrir le formulaire d'ajout
    const addButtonContainer = screen.getByTestId('toast-container').parentElement.querySelector('.container.m-auto.py-6.px-80.mt-1');
    const addButton = addButtonContainer.querySelector('button');
    fireEvent.click(addButton);

    // Remplir le formulaire
    const taskInput = screen.getByPlaceholderText('Enter task title');
    fireEvent.change(taskInput, { target: { value: 'New Subtask' } });

    // Soumettre le formulaire
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Vérifier que addTaskSubmit a été appelé avec les bons arguments
    await waitFor(() => {
      expect(addTaskSubmit).toHaveBeenCalledWith(
        { id: 3, text: 'New Subtask', state: false },
        '123'
      );
    });

    // Vérifier que le toast de succès est affiché
    expect(toast.success).toHaveBeenCalledWith('Task Added Successfully');

    // Vérifier que la nouvelle tâche est dans le DOM
    expect(screen.getByText('New Subtask')).toBeInTheDocument();
  });

  test('deletes a subtask successfully', async () => {
    render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={<TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Trouver les boutons de suppression (ceux avec classe bg-purple-300 et un SVG)
    const deleteButtons = screen.getAllByRole('button').filter(button =>
      button.querySelector('svg') && button.classList.contains('bg-purple-300')
    );
    fireEvent.click(deleteButtons[0]);

    // Vérifier que deleteSubTaskApp a été appelé avec les bons arguments
    await waitFor(() => {
      expect(deleteSubTaskApp).toHaveBeenCalledWith(1, '123');
    });

    // Vérifier que le toast de succès est affiché
    expect(toast.success).toHaveBeenCalledWith('Subtask deleted successfully');

    // Vérifier que la tâche a été supprimée du DOM
    expect(screen.queryByText('Subtask 1')).not.toBeInTheDocument();
  });

  test('logs out user and redirects to login page', () => {
    render(
      <MemoryRouter initialEntries={['/task/123']}>
        <Routes>
          <Route
            path="/task/:id"
            element={<TaskPage addTaskSubmit={addTaskSubmit} deleteSubTaskApp={deleteSubTaskApp} />}
          />
        </Routes>
      </MemoryRouter>
    );

    // Trouver le bouton de déconnexion
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    // Vérifier que localStorage.removeItem a été appelé
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userEmail');

    // Vérifier que navigate a été appelé avec le bon argument
    expect(navigateFn).toHaveBeenCalledWith('/login');
  });
});