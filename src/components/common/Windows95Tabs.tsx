import React from 'react';

interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface Windows95TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

const Windows95Tabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '' 
}: Windows95TabsProps) => {
  return (
    <div className={`${className}`}>
      <div className="win95-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`
              win95-tab
              ${activeTab === tab.key ? 'active' : ''}
              ${tab.disabled ? 'win95-disabled' : ''}
            `}
            onClick={() => !tab.disabled && onTabChange(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      
      <div className="win95-panel-sunken p-2 bg-white">
        {tabs.find(tab => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};

export default Windows95Tabs;