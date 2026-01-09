import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'medium' 
}) => {
  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};
