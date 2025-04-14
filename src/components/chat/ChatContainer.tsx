import React, { useContext, useEffect, useRef, useState } from 'react';
import SocketContext from '@/context/SocketContext';
import AuthContext from '@/context/AuthContext';
import { Message as MessageType } from '@/types';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SendIcon, AlertCircleIcon, LogOutIcon } from 'lucide-react';

const Message: React.FC<{ message: MessageType; isCurrentUser: boolean }> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`${
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        } rounded-lg px-4 py-2 max-w-[80%]`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-xs">
            {isCurrentUser ? 'You' : message.sender.name}
          </span>
          <span className="text-xs ml-2">
            {formatDistance(new Date(message.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm break-words">{message.text}</p>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{ typingUsers: string[] }> = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;
  return (
    <div className="italic text-sm text-muted-foreground p-2">
      {typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.join(', ')} are typing...`}
    </div>
  );
};

const ChatContainer: React.FC = () => {
  const { state: socketState, sendMessage, setTyping, clearError } = useContext(SocketContext);
  const { state: authState, logout } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [canSend, setCanSend] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanSend(authState.user?.interest === 'Playing Cricket');
  }, [authState.user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socketState.messages]);

  const handleTyping = () => {
    if (canSend) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '' && canSend) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-secondary p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Cricket Chat</h2>
            <p className="text-sm text-muted-foreground">
              Connect with other cricket enthusiasts
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {socketState.error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            {socketState.error}
            <Button variant="link" onClick={clearError} className="p-0 ml-2 h-auto">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {socketState.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          socketState.messages.map((msg) => (
            <Message key={msg._id} message={msg} isCurrentUser={msg.sender._id === authState.user?._id} />
          ))
        )}
        <TypingIndicator typingUsers={socketState.typingUsers} />
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 bg-background">
        {!canSend && (
          <Alert className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              Only users with the "Playing Cricket" interest can send messages.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder={canSend ? "Type a message..." : "You can only view messages"}
            disabled={!canSend}
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim() || !canSend}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
