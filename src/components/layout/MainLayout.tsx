import React, { useState } from 'react';
import Windows95MenuBar from '../common/Windows95MenuBar';
import Windows95StatusBar from '../common/Windows95StatusBar';
import Windows95Toolbar from '../common/Windows95Toolbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      label: 'File',
      submenu: [
        { label: 'New', onClick: () => console.log('New') },
        { label: 'Open', onClick: () => console.log('Open') },
        { label: 'Save', onClick: () => console.log('Save') },
        { separator: true },
        { label: 'Exit', onClick: () => console.log('Exit') }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Cut', onClick: () => console.log('Cut') },
        { label: 'Copy', onClick: () => console.log('Copy') },
        { label: 'Paste', onClick: () => console.log('Paste') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Refresh', onClick: () => console.log('Refresh') },
        { separator: true },
        { label: 'Options', onClick: () => console.log('Options') }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About', onClick: () => console.log('About') }
      ]
    }
  ];

  const toolbarItems = [
    { icon: '📄', tooltip: 'New', onClick: () => console.log('New') },
    { icon: '📁', tooltip: 'Open', onClick: () => console.log('Open') },
    { icon: '💾', tooltip: 'Save', onClick: () => console.log('Save') },
    { separator: true },
    { icon: '✂️', tooltip: 'Cut', onClick: () => console.log('Cut') },
    { icon: '📋', tooltip: 'Copy', onClick: () => console.log('Copy') },
    { icon: '📄', tooltip: 'Paste', onClick: () => console.log('Paste') },
    { separator: true },
    { icon: '🔍', tooltip: 'Search', onClick: () => console.log('Search') },
    { icon: '⚙️', tooltip: 'Settings', onClick: () => console.log('Settings') }
  ];

  const statusPanels = [
    { content: 'Ready', width: '200px' },
    { content: 'Records: 0', width: '100px' },
    { content: currentTime, width: '80px' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-200 win95-no-shadow win95-no-radius">
      {/* Menu Bar */}
      <Windows95MenuBar items={menuItems} />
      
      {/* Toolbar */}
      <Windows95Toolbar items={toolbarItems} />
      
      {/* Main Content Area */}
      <div className="flex-1 p-2 overflow-auto win95-scrollbar">
        {children}
      </div>
      
      {/* Status Bar */}
      <Windows95StatusBar panels={statusPanels} />
    </div>
  );
};

export default MainLayout;