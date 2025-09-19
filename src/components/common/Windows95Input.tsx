import React from 'react';

interface Windows95InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Windows95Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}: Windows95InputProps) => {
  return (
    <div className="win95-form-row">
      {label && (
        <label className="win95-form-label">
          {label}:
        </label>
      )}
      <div className="win95-form-control">
        <input
          className={`
            win95-input win95-no-radius win95-no-shadow
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="win95-text text-red-600 text-[9px] mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Windows95Input;