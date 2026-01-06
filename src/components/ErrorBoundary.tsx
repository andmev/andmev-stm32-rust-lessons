import { Component, type ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  fallback?: ComponentChildren;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for Preact
 * Catches errors in child components and displays a fallback UI
 *
 * @example
 * <ErrorBoundary>
 *   <LanguagePickerIsland />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    // Log error for debugging
    console.error('[ErrorBoundary] Component error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: '1rem',
            border: '1px solid #ef4444',
            borderRadius: '0.375rem',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>Something went wrong</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            Please refresh the page to try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
