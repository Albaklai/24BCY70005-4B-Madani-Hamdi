/**
 * Simple logging utility for the application
 * Supports different log levels: info, warn, error, debug
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toLowerCase() || 'info'];

const logger = {
  debug: (message, data) => {
    if (LOG_LEVELS.debug >= currentLogLevel) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  },

  info: (message, data) => {
    if (LOG_LEVELS.info >= currentLogLevel) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
    }
  },

  warn: (message, data) => {
    if (LOG_LEVELS.warn >= currentLogLevel) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
    }
  },

  error: (message, error) => {
    if (LOG_LEVELS.error >= currentLogLevel) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error?.message || error || '');
    }
  },
};

module.exports = logger;
