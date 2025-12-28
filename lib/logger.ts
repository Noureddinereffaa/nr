
/**
 * Centralized Logger Service
 * Handles console logging with standardized formatting and levels.
 * Can be extended to send logs to external services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private static isDev = import.meta.env.DEV;

    private static formatMessage(level: LogLevel, message: string, context?: any) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }

    static info(message: string, context?: any) {
        if (this.isDev) {
            console.log(`%c INFO `, 'background: #22c55e; color: #fff', message, context || '');
        }
    }

    static warn(message: string, context?: any) {
        console.warn(`%c WARN `, 'background: #f59e0b; color: #fff', message, context || '');
    }

    static error(message: string, error?: any) {
        console.error(`%c ERROR `, 'background: #ef4444; color: #fff', message, error || '');
    }

    static debug(message: string, context?: any) {
        if (this.isDev) {
            console.debug(`%c DEBUG `, 'background: #3b82f6; color: #fff', message, context || '');
        }
    }
}

export default Logger;
