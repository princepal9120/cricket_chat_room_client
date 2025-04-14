
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import ChatContainer from '@/components/chat/ChatContainer';


const ChatPage: React.FC = () => {
  const { state: authState } = useContext(AuthContext);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.loading) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.loading, navigate]);
  
  if (authState.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!authState.isAuthenticated) {
    return null; 
  }
  
  return (
    <div className="h-screen bg-background">
      <SocketProvider>
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <header className="bg-primary text-primary-foreground p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Cricket Chat App</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  Logged in as: <strong>{authState.user?.name}</strong>
                </span>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary-foreground text-primary">
                  {authState.user?.interest || 'No interest'}
                </span>
              </div>
            </div>
          </header>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatContainer />
          </div>
        </div>
      </SocketProvider>
    </div>
  );
};

export default ChatPage;