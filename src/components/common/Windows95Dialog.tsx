import React from 'react';
import Windows95Button from './Windows95Button';

interface Windows95DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'question';
  className?: string;
}

const Windows95Dialog = ({
  title,
  children,
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'info',
  className = ''
}: Windows95DialogProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'question':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`win95-dialog ${className}`}>
        <div className="win95-dialog-title">
          <span>{title}</span>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-gray-300 border border-gray-600 text-[8px] flex items-center justify-center hover:bg-red-400"
          >
            ×
          </button>
        </div>
        
        <div className="win95-dialog-content">
          <div className="win95-alert">
            <div className="win95-alert-icon text-2xl">
              {getIcon()}
            </div>
            <div className="win95-alert-text">
              {children}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            {onConfirm && (
              <Windows95Button onClick={onConfirm} variant="primary">
                {confirmText}
              </Windows95Button>
            )}
            <Windows95Button onClick={onClose}>
              {cancelText}
            </Windows95Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Windows95Dialog;