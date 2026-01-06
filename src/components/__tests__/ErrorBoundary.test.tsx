import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { ErrorBoundary } from '../ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    // Prevent console.error from cluttering output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
