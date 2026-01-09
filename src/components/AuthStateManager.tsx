import React from 'react';

interface AuthStateManagerProps {
  children: React.ReactNode;
}

export const AuthStateManager: React.FC<AuthStateManagerProps> = ({ children }) => {
  // Since Cloudflare Access handles authentication, just render children directly
  return <>{children}</>;
};
