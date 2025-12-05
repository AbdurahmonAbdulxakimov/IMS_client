// Utility functions for localStorage management

export const storage = {
  // Get item from localStorage with JSON parsing
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      let parsed_item = null
      try {
        parsed_item = item ? JSON.parse(item) : null;
      } catch (SyntaxError) {
        parsed_item = item;
      }
      return parsed_item;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  // Set item in localStorage with JSON stringification
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  // Clear all items from localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Check if key exists in localStorage
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'ims_user',
} as const;
