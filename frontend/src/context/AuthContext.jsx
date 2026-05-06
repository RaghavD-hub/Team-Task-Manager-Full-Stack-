import { createContext, useContext, useState, useEffect } from 'react';
import apiAgent from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('site_token');
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data } = await apiAgent.get('/auth/me');
        setCurrentUser(data.user);
      } catch (err) {
        localStorage.removeItem('site_token');
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, []);

  const loginUser = async (credentials) => {
    const { data } = await apiAgent.post('/auth/login', credentials);
    localStorage.setItem('site_token', data.token);
    setCurrentUser(data.user);
  };

  const logoutUser = () => {
    localStorage.removeItem('site_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isInitializing, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
