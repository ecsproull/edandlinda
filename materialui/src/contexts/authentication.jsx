import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nonvalidUser, setNonvalidUser] = useState("");

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return user?.role && roles.includes(user.role);
  };

  // Check if user is not valid
  const login = (token) => {
    try {
      // Set token in cookies
      Cookies.set('token', token, { expires: 7 });
      
      // Decode token to get user info (adjust based on your token structure)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      setUser({
        name: payload.data ? payload.data.user_name : payload.user_name,
        role: payload.data ? payload.data.role : payload.role,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing token:', error);
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      login(token);
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    nonvalidUser,
    setNonvalidUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};