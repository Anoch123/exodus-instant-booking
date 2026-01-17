/**
 * Error handling utility for Supabase and network errors
 */

export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Checks if error is a network/server down error
 */
export const isServerDownError = (error) => {
  if (!error) return false;
  
  // Network errors
  if (error.message?.includes('fetch') || 
      error.message?.includes('network') ||
      error.message?.includes('Failed to fetch')) {
    return true;
  }
  
  // Supabase specific errors
  if (error.code === 'PGRST301' || // Service unavailable
      error.code === 'PGRST302' || // Service timeout
      error.message?.includes('connection') ||
      error.message?.includes('timeout') ||
      error.message?.includes('ECONNREFUSED') ||
      error.message?.includes('ENOTFOUND')) {
    return true;
  }
  
  // HTTP status codes
  if (error.status === 503 || // Service Unavailable
      error.status === 504 || // Gateway Timeout
      error.status === 502 || // Bad Gateway
      error.status === 500) { // Internal Server Error (might be server down)
    return true;
  }
  
  return false;
};

/**
 * Formats error message for display
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) return defaultMessage;
  
  if (isServerDownError(error)) {
    return 'Server is currently unavailable. Please check your internet connection and try again later.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

/**
 * Gets error type for categorization
 */
export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN_ERROR;
  
  if (isServerDownError(error)) {
    return ErrorTypes.SERVER_ERROR;
  }
  
  if (error.message?.includes('auth') || error.message?.includes('unauthorized')) {
    return ErrorTypes.AUTH_ERROR;
  }
  
  if (error.message?.includes('validation') || error.message?.includes('invalid')) {
    return ErrorTypes.VALIDATION_ERROR;
  }
  
  return ErrorTypes.UNKNOWN_ERROR;
};

/**
 * Handles Supabase query errors
 */
export const handleSupabaseError = (error, defaultMessage = 'An error occurred') => {
  console.error('Supabase error:', error);
  
  const errorType = getErrorType(error);
  const message = getErrorMessage(error, defaultMessage);
  
  return {
    error,
    errorType,
    message,
    isServerDown: isServerDownError(error),
  };
};

