import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi, beforeEach, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import '@testing-library/jest-dom'
import { toast } from 'react-toastify'

// Mock de react-toastify - utiliser directement l'import
vi.mock('react-toastify', () => {
  return {
    toast: {
      error: vi.fn(),
      success: vi.fn()
    },
    ToastContainer: () => <div data-testid="toast-container" />
  }
})

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

// Variables globales
beforeEach(() => {
  // Réinitialisation avant chaque test
  vi.clearAllMocks()
  
  // Mock de fetch pour chaque test
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { email: 'test@example.com', password: 'password123' }
      ])
    })
  )

  // Mock de localStorage
  global.localStorage = {
    store: {},
    setItem: vi.fn((key, value) => {
      global.localStorage.store[key] = value
    }),
    getItem: vi.fn((key) => global.localStorage.store[key]),
    clear: vi.fn()
  }
})

test('Connexion réussie', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
    target: { value: 'test@example.com' }
  })
  fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
    target: { value: 'password123' }
  })
  fireEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => {
    expect(localStorage.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com')
  })
})

test('Échec de connexion', async () => {
  // Mock fetch pour retourner un utilisateur différent
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { email: 'other@example.com', password: 'wrongpass' }
      ])
    })
  )

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
    target: { value: 'wrong@example.com' }
  })
  fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
    target: { value: 'wrongpassword' }
  })
  fireEvent.click(screen.getByRole('button', { name: /login/i }))

  // Attendre de manière plus insistante que toast.error soit appelé
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Invalid email or password!')
  }, { timeout: 3000 })
})