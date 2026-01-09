import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'info', 
  className = '' 
}) => {
  const variantConfig = {
    success: {
      classes: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    },
    warning: {
      classes: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-400'
    },
    danger: {
      classes: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
      iconColor: 'text-red-400'
    },
    info: {
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-400'
    }
  };
  
  const config = variantConfig[variant];
  const Icon = config.icon;
  
  return (
    <div className={`border rounded-md p-4 ${config.classes} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3">
          {children}
        </div>
      </div>
    </div>
  );
};
