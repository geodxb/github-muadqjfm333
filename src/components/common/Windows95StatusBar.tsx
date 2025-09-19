import React from 'react';

interface StatusPanel {
  content: React.ReactNode;
  width?: string;
}

interface Windows95StatusBarProps {
  panels: StatusPanel[];
  className?: string;
}

const Windows95StatusBar = ({ panels, className = '' }: Windows95StatusBarProps) => {
  return (
    <div className={`win95-statusbar ${className}`}>
      {panels.map((panel, index) => (
        <div
          key={index}
          className="win95-statusbar-panel"
          style={{ width: panel.width }}
        >
          <span className="win95-text">
            {panel.content}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Windows95StatusBar;