/**
 * Logger Utility
 * Provides environment-aware logging to prevent information leakage in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  /**
   * Log informational messages (only in development)
   */
  info(message: string, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, metadata || '');
    }
  }

  /**
   * Log warning messages (only in development)
   */
  warn(message: string, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, metadata || '');
    }
  }

  /**
   * Log error messages (always logged, but sanitized in production)
   */
  error(message: string, error?: Error | any, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, { error, ...metadata });
    } else {
      // In production, log to error monitoring service (e.g., Sentry)
      // For now, log minimal sanitized info
      console.error(`[ERROR] ${message}`, {
        timestamp: new Date().toISOString(),
        ...(metadata || {}),
      });
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, metadata || '');
    }
  }

  /**
   * Log API request/response (only in development)
   */
  api(method: string, path: string, status: number, metadata?: LogMetadata): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${path} - ${status}`, metadata || '');
    }
  }
}

// Export singleton instance
export const logger = new Logger();
