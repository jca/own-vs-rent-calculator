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
      const parsedValue = item ? JSON.parse(item) : defaultValue;
      console.log(`Loading localStorage key "${key}":`, parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      console.log(`Setting localStorage key "${key}" with value:`, newValue);
      // Use functional update if newValue is a function
      const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`Successfully saved to localStorage key "${key}"`);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setStoredValue];
};