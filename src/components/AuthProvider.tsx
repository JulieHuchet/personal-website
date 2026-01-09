import React from 'react';

// Simplified AuthProvider since Cloudflare Access handles authentication
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Mock auth context for components that still reference it
export const useAuthContext = () => {
  return {
    user: { role: 'pm' }, // Default role since all users are authenticated via Cloudflare Access
    loading: false
  };
};
