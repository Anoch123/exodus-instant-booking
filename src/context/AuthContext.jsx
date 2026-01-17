import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEYS, TOKEN_CHECK_INTERVAL, DEFAULT_SESSION_TIMEOUT } from "../config/constants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [agencyUser, setAgencyUser] = useState(null);
  const [customerUser, setCustomerUser] = useState(null);
  const [agencyDetails, setAgencyDetails] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);
  
  // Refs to store interval IDs for cleanup
  const tokenCheckIntervalRef = useRef(null);
  const subscriptionCheckIntervalRef = useRef(null);

  // 🔹 Initialize from localStorage ONCE
  useEffect(() => {
    try {
      const agencyToken = localStorage.getItem(STORAGE_KEYS.AGENCY_TOKEN);
      const customerToken = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);

      const agencyUserData = localStorage.getItem(STORAGE_KEYS.AGENCY_USER);
      const customerUserData = localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
      const agencyData = localStorage.getItem(STORAGE_KEYS.AGENCY);
      const storedExpiry = localStorage.getItem(STORAGE_KEYS.AGENCY_SESSION_EXPIRY);

      if (agencyToken && agencyUserData) {
        setAgencyUser(JSON.parse(agencyUserData));
      }

      if (customerToken && customerUserData) {
        setCustomerUser(JSON.parse(customerUserData));
      }

      if (agencyData) {
        setAgencyDetails(JSON.parse(agencyData));
      }

      if (storedExpiry) {
        setSessionExpiry(parseInt(storedExpiry, 10));
      }
    } catch (err) {
      console.error("Auth init error:", err);
    }
  }, []);

  // 🔹 LOGOUT (defined early to avoid circular dependency)
  const logoutAgencyInternal = useCallback(() => {
    setAgencyUser(null);
    setAgencyDetails(null);
    setSessionExpiry(null);
    setIsSessionExpired(false);
    setIsSubscriptionExpired(false);
    
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }

    if (subscriptionCheckIntervalRef.current) {
      clearInterval(subscriptionCheckIntervalRef.current);
      subscriptionCheckIntervalRef.current = null;
    }

    localStorage.removeItem(STORAGE_KEYS.AGENCY_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AGENCY_USER);
    localStorage.removeItem(STORAGE_KEYS.AGENCY_ROLE);
    localStorage.removeItem(STORAGE_KEYS.AGENCY);
    localStorage.removeItem(STORAGE_KEYS.AGENCY_SESSION_EXPIRY);
  }, []);

  // 🔹 Public logout function
  const logoutAgency = logoutAgencyInternal;

  // 🔹 Stop token expiry checker (defined early)
  const stopTokenChecker = useCallback(() => {
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = null;
    }
  }, []);

  // 🔹 Stop subscription expiry checker
  const stopSubscriptionChecker = useCallback(() => {
    if (subscriptionCheckIntervalRef.current) {
      clearInterval(subscriptionCheckIntervalRef.current);
      subscriptionCheckIntervalRef.current = null;
    }
  }, []);

  // 🔹 Check if session is expired
  const checkSessionExpiry = useCallback(() => {
    if (!sessionExpiry) {
      setIsSessionExpired(false);
      return false;
    }

    const now = Date.now();
    const expired = now >= sessionExpiry;
    
    setIsSessionExpired(expired);
    
    if (expired) {
      // Session expired, logout user
      logoutAgencyInternal();
      return true;
    }
    
    return false;
  }, [sessionExpiry, logoutAgencyInternal]);

  // 🔹 Check if subscription is expired
  const checkSubscriptionExpiry = useCallback(() => {
    if (!agencyDetails?.subscription_expires_at) {
      setIsSubscriptionExpired(false);
      return false;
    }

    const subscriptionExpiryDate = new Date(agencyDetails.subscription_expires_at);
    const now = new Date();
    const expired = now >= subscriptionExpiryDate;
    
    setIsSubscriptionExpired(expired);
    return expired;
  }, [agencyDetails]);

  // 🔹 Start subscription expiry checker
  const startSubscriptionChecker = useCallback(() => {
    // Clear existing interval if any
    if (subscriptionCheckIntervalRef.current) {
      clearInterval(subscriptionCheckIntervalRef.current);
    }

    // Check immediately
    checkSubscriptionExpiry();

    // Set up interval to check every 10 seconds (TOKEN_CHECK_INTERVAL)
    subscriptionCheckIntervalRef.current = setInterval(() => {
      checkSubscriptionExpiry();
    }, TOKEN_CHECK_INTERVAL);
  }, [checkSubscriptionExpiry]);

  // 🔹 Start token expiry checker
  const startTokenChecker = useCallback(() => {
    // Clear existing interval if any
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
    }

    // Check immediately
    checkSessionExpiry();

    // Set up interval to check every 10 seconds
    tokenCheckIntervalRef.current = setInterval(() => {
      checkSessionExpiry();
    }, TOKEN_CHECK_INTERVAL);
  }, [checkSessionExpiry]);

  // 🔹 Set session expiry time
  const setSessionExpiryTime = useCallback((expiresInSeconds) => {
    // expiresInSeconds is typically from JWT (e.g., 3600 for 1 hour)
    // Calculate expiry timestamp
    const expiryTime = Date.now() + (expiresInSeconds * 1000);
    setSessionExpiry(expiryTime);
    localStorage.setItem(STORAGE_KEYS.AGENCY_SESSION_EXPIRY, expiryTime.toString());
  }, []);

  // 🔹 Start/stop token checker based on authentication state
  useEffect(() => {
    if (agencyUser && sessionExpiry) {
      startTokenChecker();
    } else {
      stopTokenChecker();
      setIsSessionExpired(false);
    }

    // Cleanup on unmount
    return () => {
      stopTokenChecker();
    };
  }, [agencyUser, sessionExpiry, startTokenChecker, stopTokenChecker]);

  // 🔹 Start/stop subscription checker based on agency details
  useEffect(() => {
    if (agencyDetails?.subscription_expires_at) {
      startSubscriptionChecker();
    } else {
      stopSubscriptionChecker();
      setIsSubscriptionExpired(false);
    }

    // Cleanup on unmount
    return () => {
      stopSubscriptionChecker();
    };
  }, [agencyDetails, startSubscriptionChecker, stopSubscriptionChecker]);

  // 🔹 LOGIN
  const loginAgency = useCallback((userData, token, role, agency, expiresIn = DEFAULT_SESSION_TIMEOUT / 1000) => {
    setAgencyUser(userData);
    setAgencyDetails(agency);

    localStorage.setItem(STORAGE_KEYS.AGENCY_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AGENCY_USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.AGENCY_ROLE, role);
    localStorage.setItem(STORAGE_KEYS.AGENCY, JSON.stringify(agency));
    
    // Set session expiry (expiresIn is in seconds, default to 1 hour)
    setSessionExpiryTime(expiresIn);
  }, [setSessionExpiryTime]);

  const loginCustomer = useCallback((userData, token, expiresIn = DEFAULT_SESSION_TIMEOUT / 1000) => {
    setCustomerUser(userData);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(userData));
    
    // Set customer session expiry
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_SESSION_EXPIRY, expiryTime.toString());
  }, []);


  const logoutCustomer = useCallback(() => {
    setCustomerUser(null);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_USER);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_SESSION_EXPIRY);
  }, []);

  const logout = useCallback(() => {
    logoutAgency();
    logoutCustomer();
  }, [logoutAgency, logoutCustomer]);

  // 🔹 UPDATE USER
  const updateAgencyUser = useCallback((updatedData) => {
    setAgencyUser(updatedData);
    localStorage.setItem(STORAGE_KEYS.AGENCY_USER, JSON.stringify(updatedData));
  }, []);

  // 🔹 AUTH HELPERS
  const isAgencyAuthenticated = useCallback(() => {
    return !!agencyUser && !!localStorage.getItem(STORAGE_KEYS.AGENCY_TOKEN) && !isSessionExpired;
  }, [agencyUser, isSessionExpired]);

  const isCustomerAuthenticated = useCallback(() => {
    return !!customerUser && !!localStorage.getItem(STORAGE_KEYS.CUSTOMER_TOKEN);
  }, [customerUser]);

  const getAgencyRole = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.AGENCY_ROLE);
  }, []);

  // 🔹 Get time until session expires (in milliseconds)
  const getTimeUntilExpiry = useCallback(() => {
    if (!sessionExpiry) return null;
    const now = Date.now();
    return Math.max(0, sessionExpiry - now);
  }, [sessionExpiry]);

  // 🔹 Check if session is about to expire (within warning time)
  const isSessionExpiringSoon = useCallback(() => {
    if (!sessionExpiry) return false;
    const timeUntilExpiry = getTimeUntilExpiry();
    return timeUntilExpiry > 0 && timeUntilExpiry <= 5 * 60 * 1000; // 5 minutes
  }, [sessionExpiry, getTimeUntilExpiry]);

  // 🔹 Get time until subscription expires (in milliseconds)
  const getTimeUntilSubscriptionExpiry = useCallback(() => {
    if (!agencyDetails?.subscription_expires_at) return null;
    const subscriptionExpiryDate = new Date(agencyDetails.subscription_expires_at);
    const now = new Date();
    return Math.max(0, subscriptionExpiryDate.getTime() - now.getTime());
  }, [agencyDetails]);

  // 🔹 Check if subscription is about to expire (within warning time)
  const isSubscriptionExpiringSoon = useCallback(() => {
    if (!agencyDetails?.subscription_expires_at) return false;
    const timeUntilExpiry = getTimeUntilSubscriptionExpiry();
    return timeUntilExpiry > 0 && timeUntilExpiry <= 30 * 24 * 60 * 60 * 1000; // 30 days
  }, [agencyDetails, getTimeUntilSubscriptionExpiry]);
  
  return (
    <AuthContext.Provider
      value={{
        // State
        agencyUser,
        customerUser,
        agencyDetails,
        sessionExpiry,
        isSessionExpired,
        isSubscriptionExpired,
        // Actions
        loginAgency,
        loginCustomer,
        logoutAgency,
        logoutCustomer,
        logout,
        updateAgencyUser,
        // Helpers
        isAgencyAuthenticated,
        isCustomerAuthenticated,
        getAgencyRole,
        getTimeUntilExpiry,
        isSessionExpiringSoon,
        getTimeUntilSubscriptionExpiry,
        isSubscriptionExpiringSoon,
        // Session management
        checkSessionExpiry,
        setSessionExpiryTime,
        checkSubscriptionExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
