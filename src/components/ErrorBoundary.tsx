import { Component, type ComponentChildren } from 'preact';
import styles from './ErrorBoundary.module.css';
import { reportError } from '@/utils/error-tracking';

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

  componentDidCatch(error: Error, _errorInfo: { componentStack?: string }) {
    reportError(error, 'ErrorBoundary');
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert" className={styles.errorContainer}>
          <p className={styles.errorTitle}>Something went wrong</p>
          <p className={styles.errorMessage}>Please refresh the page to try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
