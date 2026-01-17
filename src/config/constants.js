/**
 * Application-wide constants
 */

// Token expiry check interval (milliseconds)
export const TOKEN_CHECK_INTERVAL = 10000; // 10 seconds

// Default session timeout warning (milliseconds before expiry to show warning)
export const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

// Default session timeout (milliseconds) - used as fallback
export const DEFAULT_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour default

// Storage keys
export const STORAGE_KEYS = {
  AGENCY_TOKEN: 'agency_token',
  AGENCY_USER: 'agencyUser',
  AGENCY_ROLE: 'agency_role',
  AGENCY: 'agency',
  AGENCY_SESSION_EXPIRY: 'agency_session_expiry',
  CUSTOMER_TOKEN: 'customer_token',
  CUSTOMER_USER: 'customerUser',
  CUSTOMER_SESSION_EXPIRY: 'customer_session_expiry',
};

// Developer company information
export const DEVELOPER_COMPANY = {
  name: '9X Solutions',
  website: 'https://9xsolutions.com',
  twitter: 'https://twitter.com/9xsolutions/',
  facebook: 'https://facebook.com/9xsolutions/',
  instagram: 'https://instagram.com/9xsolutions/',
  displayText: '9X Solutions',
  attributionText: 'Designed & Developed by',
  systemAttributionText: 'System Designed and Developed By',
};

// System information
export const SYSTEM_INFORMATION = {
  name: 'Exodus Travel',
  title: "Exodus Travel Agency",
  website: 'https://exodustravel.com',
  facebook: 'https://facebook.com/exodustravel/',
  instagram: 'https://instagram.com/exodustravel/',
  twitter: 'https://twitter.com/exodustravel/',
  displayText: 'Exodus Travel',
  attributionText: 'Powered by',
  systemAttributionText: 'System Powered by',
  address: 'Maggona Kaluthara South, Sri Lanka',
  contactEmail: 'contact@exodustravels.com',
  phone: '+76 344 3826 | +94 76 344 3826',
};

