/**
 * Error Tracking Utility
 *
 * This module provides a centralized interface for error reporting and logging.
 * It integrates with Sentry when configured (via sentry.client.config.js).
 *
 * Sentry is initialized in sentry.client.config.js with GDPR-compliant settings.
 * This module provides convenience functions for reporting errors with context.
 */

import * as Sentry from '@sentry/astro';

/**
 * Error severity levels matching Sentry's severity levels
 * @see https://docs.sentry.io/platforms/javascript/enriching-events/scopes/#severity
 */
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Centralized error reporting utility
 *
 * Reports errors to Sentry (if configured) and logs them to console.
 * Automatically captures stack traces and additional context.
 *
 * @param error - The error to report
 * @param context - Context describing where the error occurred (used as tag)
 * @param severity - Error severity level (default: ERROR)
 * @param extras - Additional context data to include with the error
 *
 * @example
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (error) {
 *   reportError(error as Error, 'DataFetch', ErrorSeverity.ERROR, {
 *     endpoint: '/api/data',
 *     userId: '123'
 *   });
 * }
 * ```
 */
export function reportError(
  error: Error,
  context: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  extras?: Record<string, unknown>
): void {
  // Report to Sentry if configured
  if (import.meta.env.PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      level: severity as Sentry.SeverityLevel,
      tags: { context },
      extra: extras,
    });
  }

  // Log to console in development only
  // In production, Sentry already has the full error details, so console logging is unnecessary
  if (!import.meta.env.PROD) {
    // In development, log full error details with stack trace
    console.error(`[${severity.toUpperCase()}] [${context}]`, error, extras);
  }
}

/**
 * Report a handled warning (non-fatal error)
 *
 * @param message - Warning message
 * @param context - Context describing where the warning occurred
 * @param extras - Additional context data
 *
 * @example
 * ```typescript
 * reportWarning('API rate limit approaching', 'APIClient', {
 *   remainingRequests: 5
 * });
 * ```
 */
export function reportWarning(
  message: string,
  context: string,
  extras?: Record<string, unknown>
): void {
  const error = new Error(message);
  error.name = 'Warning';
  reportError(error, context, ErrorSeverity.WARNING, extras);
}

/**
 * Report an info-level event
 *
 * Use this for non-error events that you want to track in Sentry,
 * such as important user actions or system state changes.
 *
 * @param message - Info message
 * @param context - Context describing the event
 * @param extras - Additional context data
 *
 * @example
 * ```typescript
 * reportInfo('User completed onboarding', 'Onboarding', {
 *   userId: '123',
 *   stepsCompleted: 5
 * });
 * ```
 */
export function reportInfo(
  message: string,
  context: string,
  extras?: Record<string, unknown>
): void {
  const error = new Error(message);
  error.name = 'Info';
  reportError(error, context, ErrorSeverity.INFO, extras);
}

/**
 * Manually add a breadcrumb for debugging context
 *
 * Breadcrumbs are automatically captured by Sentry, but you can manually add
 * custom breadcrumbs for important application events.
 *
 * @param message - Breadcrumb message
 * @param category - Category for filtering (e.g., 'navigation', 'api', 'user')
 * @param level - Severity level
 * @param data - Additional structured data
 *
 * @example
 * ```typescript
 * addBreadcrumb('User clicked checkout', 'user-action', ErrorSeverity.INFO, {
 *   cartTotal: 99.99,
 *   itemCount: 3
 * });
 * ```
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: ErrorSeverity = ErrorSeverity.INFO,
  data?: Record<string, unknown>
): void {
  if (import.meta.env.PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      level: level as Sentry.SeverityLevel,
      data,
      timestamp: Date.now() / 1000,
    });
  }

  // In development, also log to console
  if (!import.meta.env.PROD) {
    console.log(`[BREADCRUMB] [${category}] ${message}`, data);
  }
}
