import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketState, Message } from '@/types';
import AuthContext from './AuthContext';
import { messageService } from '@/services/api';

const initialState: SocketState = {
  socket: null,
  connected: false,
  messages: [],
  typingUsers: [],
  error: null,
};

type SocketAction =
  | { type: 'SOCKET_CONNECTED'; payload: Socket }
  | { type: 'SOCKET_DISCONNECTED' }
  | { type: 'MESSAGES_LOADED'; payload: Message[] }
  | { type: 'NEW_MESSAGE'; payload: Message }
  | { type: 'TYPING_USERS'; payload: string[] }
  | { type: 'SOCKET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

export interface SocketContextType {
  state: SocketState;
  sendMessage: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
  clearError: () => void;
}

const SocketContext = createContext<SocketContextType>({
  state: initialState,
  sendMessage: () => {},
  setTyping: () => {},
  clearError: () => {},
});

const socketReducer = (state: SocketState, action: SocketAction): SocketState => {
  switch (action.type) {
    case 'SOCKET_CONNECTED':
      return {
        ...state,
        socket: action.payload,
        connected: true,
        error: null,
      };
    case 'SOCKET_DISCONNECTED':
      return {
        ...state,
        socket: null,
        connected: false,
      };
    case 'MESSAGES_LOADED':
      return {
        ...state,
        messages: action.payload,
      };
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'TYPING_USERS':
      return {
        ...state,
        typingUsers: action.payload,
      };
    case 'SOCKET_ERROR':
      return {
        ...state,
        error: action.payload,
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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const { state: authState } = useContext(AuthContext);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.interest) {
      const SOCKET_URL = 'https://cricket-chat-room-server.onrender.com';
      const socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token')
        },
      });

      socket.on('connect', () => {
        dispatch({ type: 'SOCKET_CONNECTED', payload: socket });
        loadMessages();
      });

      socket.on('disconnect', () => {
        dispatch({ type: 'SOCKET_DISCONNECTED' });
      });

      socket.on('connect_error', (err) => {
        dispatch({ type: 'SOCKET_ERROR', payload: err.message });
      });

      socket.on('new_message', (message: Message) => {
        dispatch({ type: 'NEW_MESSAGE', payload: message });
      });

      socket.on('typing_users', (users: string[]) => {
        dispatch({ type: 'TYPING_USERS', payload: users });
      });

      socket.on('error', (error: { message: string }) => {
        dispatch({ type: 'SOCKET_ERROR', payload: error.message });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [authState.isAuthenticated, authState.user?.interest]);

  const loadMessages = async () => {
    try {
      const messages = await messageService.getMessages();
      dispatch({ type: 'MESSAGES_LOADED', payload: messages });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to load messages';
      dispatch({ type: 'SOCKET_ERROR', payload: message });
    }
  };

  const sendMessage = (text: string) => {
    if (state.socket && text.trim() !== '') {
      state.socket.emit('send_message', { text });
    }
  };

  const setTyping = (isTyping: boolean) => {
    if (state.socket) {
      state.socket.emit('typing', isTyping);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <SocketContext.Provider
      value={{
        state,
        sendMessage,
        setTyping,
        clearError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
