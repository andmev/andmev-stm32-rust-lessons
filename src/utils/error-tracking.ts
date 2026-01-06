/**
 * Centralized error reporting utility
 * Handles error logging based on environment
 */
export function reportError(error: Error, context: string) {
  if (import.meta.env.PROD) {
    // In production, we would send this to a service like Sentry or LogRocket
    // For now, we swallow the error to prevent console noise,
    // or we could log a sanitized message.
    // console.error(`[Error] ${context}: An unexpected error occurred.`);
  } else {
    // In development, log the full error with stack trace
    console.error(`[${context}]`, error);
  }
}
