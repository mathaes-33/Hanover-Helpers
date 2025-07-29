import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders the main sections of the home page', async () => {
    render(<HomePage />);

    // Check for the main heading from GeminiQuickPost
    expect(screen.getByRole('heading', { name: /what do you need help with\?/i })).toBeInTheDocument();

    // Check for the "Filter by Category" section
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    
    // Check for the weather widget (it will be in a loading state)
    expect(screen.getByText(/weather/i)).toBeInTheDocument();

    // Because data is loaded asynchronously, we can wait for the job list to appear.
    // We expect "Recent Jobs" to be a heading once loading is complete.
    expect(await screen.findByRole('heading', { name: /recent jobs/i })).toBeInTheDocument();
  });
});
