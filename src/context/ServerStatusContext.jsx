import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabaseClient";
import { isServerDownError } from "../utils/errorHandler";

const ServerStatusContext = createContext();

const SERVER_CHECK_INTERVAL = 30000; // Check every 30 seconds
const SERVER_CHECK_TIMEOUT = 5000; // 5 second timeout for health check

export function ServerStatusProvider({ children }) {
  const [isServerDown, setIsServerDown] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const checkIntervalRef = useRef(null);
  const isCheckingRef = useRef(false);

  /**
   * Performs a lightweight server health check
   */
  const checkServerStatus = useCallback(async () => {
    // Prevent concurrent checks
    if (isCheckingRef.current) return;
    
    isCheckingRef.current = true;
    
    try {
      // Use a simple query to check server connectivity
      // Using a minimal query that should be fast
      // Even if it returns an auth/permission error, server is up
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SERVER_CHECK_TIMEOUT);

      const { error } = await supabase
        .from("agency_users")
        .select("id")
        .limit(1)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        // Check if it's a server down error (network, connection issues)
        if (isServerDownError(error)) {
          setIsServerDown(true);
        } else {
          // Other errors (like auth errors, permission errors, PGRST codes for auth)
          // These mean server responded, so it's up
          setIsServerDown(false);
        }
      } else {
        // Success - server is up
        setIsServerDown(false);
      }
      
      setLastCheckTime(Date.now());
    } catch (error) {
      // Network errors, timeouts, etc. indicate server is down
      if (error.name === 'AbortError' || isServerDownError(error)) {
        setIsServerDown(true);
      } else {
        // Unexpected errors - assume server is up if we got any response
        setIsServerDown(false);
      }
      setLastCheckTime(Date.now());
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  /**
   * Start server status monitoring
   */
  const startMonitoring = useCallback(() => {
    // Clear existing interval if any
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }

    // Check immediately
    checkServerStatus();

    // Set up interval to check periodically
    checkIntervalRef.current = setInterval(() => {
      checkServerStatus();
    }, SERVER_CHECK_INTERVAL);
  }, [checkServerStatus]);

  /**
   * Stop server status monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, []);

  /**
   * Manual refresh of server status
   */
  const refreshStatus = useCallback(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  // Start monitoring on mount
  useEffect(() => {
    startMonitoring();

    // Cleanup on unmount
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  // Also check on online/offline events
  useEffect(() => {
    const handleOnline = () => {
      // When connection is restored, check server status
      checkServerStatus();
    };

    const handleOffline = () => {
      // When connection is lost, mark server as down
      setIsServerDown(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkServerStatus]);

  return (
    <ServerStatusContext.Provider
      value={{
        isServerDown,
        lastCheckTime,
        refreshStatus,
        checkServerStatus,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
}

export function useServerStatus() {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error("useServerStatus must be used within a ServerStatusProvider");
  }
  return context;
}

