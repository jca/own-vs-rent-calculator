import { useState, useCallback } from 'react';

/**
 * Custom hook for localStorage management with error handling
 * @param {string} key - localStorage key
 * @param {any} defaultValue - default value if key doesn't exist
 * @returns {[any, function]} - [value, setValue] tuple
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      // If storage is full, try to clear old data and retry
      if (error.name === 'QuotaExceededError') {
        try {
          // Clear old scenarios if storage is full
          const scenarios = JSON.parse(window.localStorage.getItem('ownVsRentScenarios') || '{"scenarios": []}');
          if (scenarios.scenarios && scenarios.scenarios.length > 10) {
            scenarios.scenarios = scenarios.scenarios.slice(-5); // Keep only 5 most recent
            window.localStorage.setItem('ownVsRentScenarios', JSON.stringify(scenarios));
            window.localStorage.setItem(key, JSON.stringify(newValue));
            setValue(newValue);
          }
        } catch (retryError) {
          console.error('Failed to clear storage and retry:', retryError);
        }
      }
    }
  }, [key]);

  return [value, setStoredValue];
};
