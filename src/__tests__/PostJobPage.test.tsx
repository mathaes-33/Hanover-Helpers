import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import PostJobPage from '../pages/PostJobPage';
import { useAuth } from '../contexts/AuthContext';

// Mock the useAuth hook
vi.mock('../contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../contexts/AuthContext')>('../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe('PostJobPage', () => {
  it('shows validation errors when submitting an empty form', async () => {
    // Mock that the user is logged in
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'test-user' } as any,
      login: vi.fn(),
      logout: vi.fn(),
      isInitialized: true,
    });
    
    render(<PostJobPage />);

    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: /post job/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    expect(await screen.findByText('Job title is required.')).toBeInTheDocument();
    expect(await screen.findByText('Job description is required.')).toBeInTheDocument();
    expect(await screen.findByText('Please select a job category.')).toBeInTheDocument();
    expect(await screen.findByText('Please enter a valid, positive amount.')).toBeInTheDocument();
    expect(await screen.findByText('Date is required.')).toBeInTheDocument();
  });

  it('shows a login prompt if the user is not authenticated', () => {
     // Mock that the user is logged out
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isInitialized: true,
    });

    render(<PostJobPage />);

    expect(screen.getByRole('heading', { name: /post a job/i })).toBeInTheDocument();
    expect(screen.getByText(/you need to be logged in to post a new job opening/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login to post/i })).toBeInTheDocument();
  });
});