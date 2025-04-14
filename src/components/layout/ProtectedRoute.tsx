
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireInterest?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireInterest = false }) => {

  return <>{children}</>;
};

export default ProtectedRoute;
