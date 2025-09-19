import React, { useState } from 'react';

interface MenuItem {
  label: string;
  onClick?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
}

interface Windows95MenuBarProps {
  items: MenuItem[];
  className?: string;
}

const Windows95MenuBar = ({ items, className = '' }: Windows95MenuBarProps) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleMenuClick = (index: number, item: MenuItem) => {
    if (item.submenu) {
      setActiveMenu(activeMenu === index ? null : index);
    } else if (item.onClick) {
      item.onClick();
      setActiveMenu(null);
    }
  };

  return (
    <div className={`win95-menubar ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="relative">
          <div
            className={`
              win95-menu-item
              ${activeMenu === index ? 'active' : ''}
              ${item.disabled ? 'win95-disabled' : ''}
            `}
            onClick={() => !item.disabled && handleMenuClick(index, item)}
          >
            {item.label}
          </div>
          
          {item.submenu && activeMenu === index && (
            <div className="absolute top-full left-0 bg-gray-200 border-2 border-gray-400 border-t-white border-l-white shadow-lg z-50 min-w-[120px]">
              {item.submenu.map((subItem, subIndex) => (
                <div key={subIndex}>
                  {subItem.separator ? (
                    <div className="win95-separator mx-2" />
                  ) : (
                    <div
                      className={`
                        px-3 py-1 win95-text cursor-pointer
                        ${subItem.disabled ? 'win95-disabled' : 'hover:bg-blue-600 hover:text-white'}
                      `}
                      onClick={() => {
                        if (!subItem.disabled && subItem.onClick) {
                          subItem.onClick();
                          setActiveMenu(null);
                        }
                      }}
                    >
                      {subItem.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Windows95MenuBar;