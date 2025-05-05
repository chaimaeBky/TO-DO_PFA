// First, set up all mocks before any imports
// Mock the entire react-router-dom module
vi.mock('react-router-dom', () => {
  const Link = ({ to, children, className }) => (
    <a href={to} className={className} data-testid="mock-link">
      {children}
    </a>
  );
  
  return {
    useNavigate: () => navigate,
    Link,
    BrowserRouter: ({ children }) => <div>{children}</div>
  };
});

// Mock images to avoid errors
vi.mock('../src/assets/images/backGroundCloud.png', () => ({ default: 'mock-cloud-image' }));
vi.mock('../src/assets/images/star.png', () => ({ default: 'mock-star-image' }));
vi.mock('../src/assets/images/user2.png', () => ({ default: 'mock-user-image' }));

// Then import React and other dependencies
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../src/pages/Login";

// Define navigate mock outside the vi.mock to avoid hoisting issues
const navigate = vi.fn();

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Now, the tests
describe('Login Component', () => {
  beforeEach(() => {
    // Reset all mocks between tests
    vi.clearAllMocks();
    
    // Default successful fetch mock
    global.fetch = vi.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve([{ email: 'test@example.com', password: 'password123' }]),
        ok: true
      })
    );
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    // Check that form fields are present
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('successfully logs in with valid credentials', async () => {
    render(<Login />);
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check that navigation was called
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error message with invalid credentials', async () => {
    // Mock fetch to simulate authentication failure
    global.fetch = vi.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve([{ email: 'other@example.com', password: 'other123' }]),
        ok: true
      })
    );

    render(<Login />);
    
    // Fill the form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password!')).toBeInTheDocument();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it('allows navigation to registration page', () => {
    render(<Login />);
    
    // Find and click on the registration link
    const registerLink = screen.getByText('Register here');
    expect(registerLink).toBeInTheDocument();
    
    // Ensure the link points to the register page
    expect(screen.getByTestId('mock-link')).toHaveAttribute('href', '/register');
  });
});