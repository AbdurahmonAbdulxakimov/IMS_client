import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User, LoginCredentials } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = storage.get<User>(STORAGE_KEYS.USER);

    if (token && storedUser) {
      // User data exists in storage, use it immediately
      setUser(storedUser);
      setLoading(false);
    } else if (token) {
      // Token exists but no stored user, fetch from API
      authAPI.getCurrentUser()
        .then((res) => {
          const userData = res.data[0] || res.data;
          setUser(userData);
          storage.set(STORAGE_KEYS.USER, userData);
        })
        .catch(() => {
          storage.clear();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await authAPI.login(credentials);
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
    
    const userRes = await authAPI.getCurrentUser();
    const userData = userRes.data[0] || userRes.data;
    
    setUser(userData);
    storage.set(STORAGE_KEYS.USER, userData);
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
