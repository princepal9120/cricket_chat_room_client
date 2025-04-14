export interface User {
    _id: string;
    name: string;
    email: string;
    interest: 'Playing Cricket' | 'Watching Cricket' | null;
    token?: string;
  }
  
  export interface Message {
    _id: string;
    text: string;
    sender: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface SocketState {
    socket: any;
    connected: boolean;
    messages: Message[];
    typingUsers: string[];
    error: string | null;
  }