import React from 'react';

interface Windows95SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Windows95Select = ({ 
  label, 
  options, 
  error, 
  className = '', 
  ...props 
}: Windows95SelectProps) => {
  return (
    <div className="win95-form-row">
      {label && (
        <label className="win95-form-label">
          {label}:
        </label>
      )}
      <div className="win95-form-control">
        <select
          className={`
            win95-select win95-no-radius win95-no-shadow
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="win95-text text-red-600 text-[9px] mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Windows95Select;