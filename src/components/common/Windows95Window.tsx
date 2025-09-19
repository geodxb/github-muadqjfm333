import React from 'react';

interface Windows95WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  minimizable?: boolean;
  maximizable?: boolean;
  resizable?: boolean;
}

const Windows95Window = ({
  title,
  children,
  className = '',
  onClose,
  minimizable = false,
  maximizable = false,
  resizable = false
}: Windows95WindowProps) => {
  return (
    <div className={`win95-window ${className} win95-no-shadow win95-no-radius`}>
      <div className="win95-window-title">
        <span className="win95-text win95-text-bold text-white">{title}</span>
        <div className="flex gap-1">
          {minimizable && (
            <button className="w-4 h-4 bg-gray-300 border border-gray-600 text-[8px] flex items-center justify-center">
              _
            </button>
          )}
          {maximizable && (
            <button className="w-4 h-4 bg-gray-300 border border-gray-600 text-[8px] flex items-center justify-center">
              □
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose}
              className="w-4 h-4 bg-gray-300 border border-gray-600 text-[8px] flex items-center justify-center hover:bg-red-400"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="win95-window-content">
        {children}
      </div>
    </div>
  );
};

export default Windows95Window;