
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Cricket Talk Hub</h1>
        <p className="text-center text-gray-600 mb-8">Where cricket enthusiasts connect</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
