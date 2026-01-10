/**
 * Error severity levels
 */
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Error tracking configuration
 * Set SENTRY_DSN environment variable to enable Sentry integration
 */
const SENTRY_DSN = import.meta.env.PUBLIC_SENTRY_DSN;
const ENABLE_SENTRY = import.meta.env.PROD && SENTRY_DSN;

/**
 * Initialize Sentry if configured
 * To enable Sentry:
 * 1. Sign up at https://sentry.io
 * 2. Create a new project
 * 3. Set PUBLIC_SENTRY_DSN environment variable with your DSN
 * 4. Install @sentry/browser: npm install @sentry/browser
 * 5. Uncomment the Sentry.init() call below
 */
async function initializeSentry() {
  if (!ENABLE_SENTRY) return;

  try {
    // Uncomment when ready to use Sentry:
    // const Sentry = await import('@sentry/browser');
    // Sentry.init({
    //   dsn: SENTRY_DSN,
    //   environment: import.meta.env.MODE,
    //   tracesSampleRate: 1.0,
    // });
  } catch (err) {
    console.warn('Failed to initialize Sentry:', err);
  }
}

// Initialize Sentry on module load
if (typeof window !== 'undefined') {
  initializeSentry();
}

/**
 * Centralized error reporting utility
 * Handles error logging based on environment and sends to Sentry if configured
 *
 * @param error - The error to report
 * @param context - Context describing where the error occurred
 * @param severity - Error severity level (default: ERROR)
 * @param extras - Additional context data to include with the error
 *
 * @example
 * try {
 *   await fetchData();
 * } catch (error) {
 *   reportError(error as Error, 'FetchData', ErrorSeverity.ERROR, { userId: '123' });
 * }
 */
export function reportError(
  error: Error,
  context: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  extras?: Record<string, unknown>
) {
  // Create structured error object
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    severity,
    timestamp: new Date().toISOString(),
    ...extras,
  };

  if (import.meta.env.PROD) {
    // In production, send to error tracking service
    if (ENABLE_SENTRY) {
      // Uncomment when Sentry is installed:
      // import('@sentry/browser').then((Sentry) => {
      //   Sentry.captureException(error, {
      //     level: severity,
      //     tags: { context },
      //     extra: extras,
      //   });
      // });
    }

    // Log sanitized error message (without sensitive data)
    console.error(`[${severity.toUpperCase()}] ${context}: An error occurred`, {
      message: error.message,
      timestamp: errorData.timestamp,
    });

    // Could also send to custom logging endpoint:
    // sendToLoggingEndpoint(errorData);
  } else {
    // In development, log full error details with stack trace
    console.error(`[${severity.toUpperCase()}] [${context}]`, error, extras);
  }
}

/**
 * Report a handled warning (non-fatal error)
 */
export function reportWarning(message: string, context: string, extras?: Record<string, unknown>) {
  const error = new Error(message);
  error.name = 'Warning';
  reportError(error, context, ErrorSeverity.WARNING, extras);
}

/**
 * Report an info-level event
 */
export function reportInfo(message: string, context: string, extras?: Record<string, unknown>) {
  const error = new Error(message);
  error.name = 'Info';
  reportError(error, context, ErrorSeverity.INFO, extras);
}
