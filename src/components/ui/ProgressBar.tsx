import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  className = '', 
  showLabel = true,
  variant = 'neutral'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariant = () => {
    if (variant !== 'neutral') return variant;
    if (percentage <= 85) return 'success';
    if (percentage <= 100) return 'warning';
    return 'danger';
  };
  
  const currentVariant = getVariant();
  
  const variantClasses = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    neutral: 'bg-blue-500'
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${variantClasses[currentVariant]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
