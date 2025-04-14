# Cricket Chat - Frontend

This is the frontend implementation of the Cricket Chat application, a WhatsApp clone with interest-based chat access. This React application provides user authentication, interest selection, and real-time chat functionality.

## Features

- User authentication (register, login, logout)
- Interest selection (Playing Cricket or Watching Cricket)
- Real-time chat with role-based access
- Emoji support
- User typing indicators
- Online/offline status
- Responsive design

## Tech Stack

- React.js
- React Router for navigation
- Context API for state management
- Socket.io client for real-time communication
- Tailwind CSS for styling and shadcn for components
- Axios for API requests

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Backend server running

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cricket-chat.git
cd cricket-chat/frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

4. Start the development server
```bash
npm start
```

## Project Structure

```
src/
├── assets/             # Images, icons, etc.
├── components/         # Reusable UI components
│   ├── Auth/           # Authentication related components
│   ├── Chat/           # Chat related components
│   ├── common/         # Common UI components
│   └── Layout/         # Layout components
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication context
│   └── ChatContext.js  # Chat context
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── InterestSelection.js
│   └── Chat.js
├── services/           # API service interfaces
│   ├── authService.js
│   └── messageService.js
├── utils/              # Utility functions
├── App.js              # Main App component
└── index.js            # Entry point
```

## Key Components

### AuthContext

Manages user authentication state and provides authentication functions:
- `register()`: Register a new user
- `login()`: Log in an existing user
- `logout()`: Log out the current user
- `selectInterest()`: Set user's interest

### ChatContext

Manages chat state and provides chat functions:
- `sendMessage()`: Send a message to the chat
- `getMessages()`: Fetch chat history
- `startTyping()`: Indicate user is typing
- `stopTyping()`: Remove typing indicator

### Interest-Based Access Control

The interest-based access control is implemented through conditional rendering:

```jsx
// Example from Chat.js
{user.interest === "Playing Cricket" && (
  <div className="message-input">
    <input 
      type="text" 
      value={message} 
      onChange={handleMessageChange} 
      placeholder="Type a message" 
    />
    <button onClick={handleSendMessage}>Send</button>
  </div>
)}
```

## Socket Implementation

```jsx
// Excerpt from ChatContext.js
useEffect(() => {
  if (user && !socket) {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });
    
    // Listen for new messages
    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Listen for typing indicators
    newSocket.on('userTyping', (userId) => {
      setTypingUsers(prev => [...prev, userId]);
    });
    
    newSocket.on('userStoppedTyping', (userId) => {
      setTypingUsers(prev => prev.filter(id => id !== userId));
    });
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }
}, [user]);
```

## API Services

```jsx
// Example from authService.js
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.