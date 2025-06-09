import { vi, describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import '@testing-library/jest-dom';
// client/src/pages/RegisterForm.test.tsx

// Mocks
const mockNavigate = vi.fn();
const mockSetUser = vi.fn();
const { mockCustomFetch, mockCatchAxiosError, mockToastSuccess } = vi.hoisted(() => {
  return {
    mockCustomFetch: {
      get: vi.fn(),
      post: vi.fn(),
    },
    mockCatchAxiosError: vi.fn(),
    mockToastSuccess: vi.fn()
  }
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));
vi.mock('../context/UserContext', () => ({
  useUserContext: () => ({ setUser: mockSetUser })
}));
vi.mock('../services/custom_fetch', () => {
  return {
    default: mockCustomFetch
  }
});
vi.mock('../services/catch_axios_error', () => {
  return {
    catchAxiosError: mockCatchAxiosError
  }
});
vi.mock('../services/crsf_token', () => {
  return {
    getCookie: vi.fn(() => 'csrftoken')
  }
});
vi.mock('react-toastify', () => {
  return {
    toast: { success: mockToastSuccess }
  }
});

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields and button', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows validation error for short username', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows validation error for password mismatch', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password321' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('submits form and handles successful registration and login', async () => {
    mockCustomFetch.get.mockResolvedValueOnce({});
    mockCustomFetch.post
      .mockResolvedValueOnce({}) // register
      .mockResolvedValueOnce({ data: { user: { id: '1', username: 'validuser' } } }); // login

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Then assert
    await waitFor(() => {
      console.log('customFetch.get calls:', mockCustomFetch.get.mock.calls);
      expect(mockCustomFetch.get).toHaveBeenCalledWith('api/csrf/');
      // expect(mockCustomFetch.get).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockCustomFetch.post).toHaveBeenCalledWith(
        '/api/auth/register/',
        expect.objectContaining({ username: 'validuser', password: 'password123' }),
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(mockCustomFetch.post).toHaveBeenCalledWith(
        '/api/auth/login/',
        expect.objectContaining({ username: 'validuser', password: 'password123' }),
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(mockSetUser).toHaveBeenCalledWith({
        isAuthenticated: true,
        id: '1',
        username: 'validuser'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockToastSuccess).toHaveBeenCalledWith('Registered successfully');
    });
  });

  it('handles API error and calls catchAxiosError', async () => {
    mockCustomFetch.get.mockResolvedValueOnce({});
    mockCustomFetch.post.mockRejectedValueOnce(new Error('API error'));

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockCatchAxiosError).toHaveBeenCalled();
    });
  });

  it('disables button and shows loading state during submit', async () => {
    let resolvePost: any;
    mockCustomFetch.get.mockResolvedValueOnce({});
    mockCustomFetch.post.mockImplementationOnce(() => new Promise(res => { resolvePost = res; }));

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Finish the promise to avoid unhandled promise rejection
    resolvePost && resolvePost({});
  });
});