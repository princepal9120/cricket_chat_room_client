import React, { createContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { authService, userService } from '@/services/api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOADED'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType {
  state: AuthState;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectInterest: (interest: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  selectInterest: async () => {},
  clearError: () => {},
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token || '');
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'AUTH_ERROR', payload: 'No token found' });
        return;
      }

      try {
        const userData = await authService.getProfile();
        dispatch({ type: 'AUTH_LOADED', payload: userData });
      } catch {
        dispatch({ type: 'AUTH_ERROR', payload: 'Authentication failed' });
      }
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const userData = await authService.register({ name, email, password });
      dispatch({ type: 'REGISTER_SUCCESS', payload: userData });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login({ email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const selectInterest = async (interest: string) => {
    try {
      const userData = await userService.updateInterest(interest);
      dispatch({ type: 'UPDATE_USER', payload: userData });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update interest';
      dispatch({ type: 'AUTH_ERROR', payload: message });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        register,
        login,
        logout,
        selectInterest,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
