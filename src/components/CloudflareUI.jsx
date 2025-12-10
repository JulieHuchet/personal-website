import React from 'react';

// Authentic Cloudflare Dashboard Components
// Based on actual Cloudflare dashboard patterns and design language

export const DashboardCard = ({ children, className = '', accent = false, ...props }) => (
  <div className={`
    bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200
    ${accent ? 'border-l-4 border-l-orange-500' : ''}
    ${className}
  `} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 disabled:bg-gray-300',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  const variantClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const Input = ({ className = '', error = false, ...props }) => (
  <input 
    className={`
      block w-full px-3 py-2 text-sm border rounded-md bg-white placeholder-gray-400 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      transition-colors duration-200
      ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
      ${className}
    `} 
    {...props} 
  />
);

export const Select = ({ children, className = '', error = false, ...props }) => (
  <select 
    className={`
      block w-full px-3 py-2 text-sm border rounded-md bg-white 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      transition-colors duration-200
      ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
      ${className}
    `} 
    {...props}
  >
    {children}
  </select>
);

export const CFIconBox = ({ children, variant = 'orange', size = 'md', className = '' }) => {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const variantClass = variant === 'orange' 
    ? 'bg-cf-orange-100 text-cf-orange-600' 
    : variant === 'blue'
    ? 'bg-cf-blue-100 text-cf-blue-600'
    : 'bg-cf-gray-100 text-cf-gray-600';
  
  return (
    <div className={`${sizeClass} ${variantClass} rounded-lg flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export const CFDivider = ({ className = '' }) => (
  <div className={`w-px h-6 bg-cf-gray-300 ${className}`}></div>
);

export const CFAlert = ({ children, variant = 'info', className = '', ...props }) => {
  const variantClasses = {
    info: 'bg-cf-blue-50 border-cf-blue-200 text-cf-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  
  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Common Cloudflare Icons
export const CFIcons = {
  Dashboard: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Lightning: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Link: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Upload: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Table: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  ),
  Users: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Warning: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Plus: (props) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
};

export default {
  CFCard,
  CFCardHeader,
  CFCardBody,
  CFButton,
  CFBadge,
  CFInput,
  CFSelect,
  CFIconBox,
  CFDivider,
  CFAlert,
  CFIcons,
};
