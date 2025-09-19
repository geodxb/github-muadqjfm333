import React from 'react';

interface Windows95ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'small' | 'default' | 'large';
  pressed?: boolean;
}

const Windows95Button = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  pressed = false,
  className = '', 
  disabled = false,
  ...props 
}: Windows95ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'win95-button font-bold';
      case 'danger':
        return 'win95-button';
      default:
        return 'win95-button';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-[9px] px-1 py-0 min-h-[18px]';
      case 'large':
        return 'text-[13px] px-3 py-1 min-h-[28px]';
      default:
        return 'text-[11px] px-2 py-0 min-h-[23px]';
    }
  };

  return (
    <button
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${pressed ? 'pressed' : ''}
        ${disabled ? 'win95-disabled' : ''}
        ${className}
        win95-no-shadow win95-no-radius win95-no-transition
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Windows95Button;