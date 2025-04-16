
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { loginUser, registerUser, getCurrentUser, updateUserIncome } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateIncome: (income: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const user = await getCurrentUser(userId);
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
          });
        } catch (error) {
          localStorage.removeItem('userId');
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = await loginUser(email, password);
      localStorage.setItem('userId', user.id);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = await registerUser({ username, email, password });
      localStorage.setItem('userId', user.id);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const updateIncome = async (income: number) => {
    if (!authState.user) return;
    
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const updatedUser = await updateUserIncome(authState.user.id, income);
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update income',
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateIncome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
