import React from 'react';

interface ToolbarItem {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface Windows95ToolbarProps {
  items: ToolbarItem[];
  className?: string;
}

const Windows95Toolbar = ({ items, className = '' }: Windows95ToolbarProps) => {
  return (
    <div className={`win95-toolbar ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.separator ? (
            <div className="win95-toolbar-separator" />
          ) : (
            <button
              className={`
                win95-toolbar-button
                ${item.disabled ? 'win95-disabled' : ''}
              `}
              onClick={item.onClick}
              disabled={item.disabled}
              title={item.tooltip}
            >
              {item.icon}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Windows95Toolbar;