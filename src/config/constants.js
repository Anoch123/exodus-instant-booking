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

// Common amenity definitions used across the app
export const AMENITIES = [
  { label: 'WiFi', field: 'is_wifi', displayText: 'WiFi Available', icon: '/icons/wi-fi.png' },
  { label: 'Balcony', field: 'is_balcony', displayText: 'Balcony Rooms', icon: '/icons/balcony.png' },
  { label: 'Spa', field: 'is_spa', displayText: 'Spa Services', icon: '/icons/lotus.png' },
  { label: 'Room Service', field: 'is_room_service', displayText: 'Room Service', icon: '/icons/hotel-service.png' },
  { label: 'Swimming Pool', field: 'is_swimming_pool', displayText: 'Swimming Pool', icon: '/icons/swimmer.png' },
  { label: 'Air Conditioned', field: 'is_air_conditioned', displayText: 'Air Conditioned', icon: '/icons/air-conditioning.png' },
  { label: 'Family Rooms', field: 'is_family_rooms', displayText: 'Family Rooms', icon: '/icons/home-sharing.png' },
  { label: 'Gym', field: 'is_gym', displayText: 'Gym Facilities', icon: '/icons/weightlifting.png' },
];

