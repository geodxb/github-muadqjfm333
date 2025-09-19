import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Windows95Window from './components/common/Windows95Window';
import Windows95Button from './components/common/Windows95Button';
import Windows95Input from './components/common/Windows95Input';
import Windows95Select from './components/common/Windows95Select';
import Windows95Table from './components/common/Windows95Table';
import Windows95Tabs from './components/common/Windows95Tabs';
import Windows95Dialog from './components/common/Windows95Dialog';
import './styles/windows95.css';

function App() {
  const [selectedTab, setSelectedTab] = useState('users');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  // Sample data for demonstration
  const userData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-15' }
  ];

  const userColumns = [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'name', title: 'Name', width: '150px' },
    { key: 'email', title: 'Email', width: '200px' },
    { key: 'role', title: 'Role', width: '100px' },
    { key: 'status', title: 'Status', width: '80px' },
    { key: 'lastLogin', title: 'Last Login', width: '120px' }
  ];

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    setShowDialog(true);
  };

  const tabs = [
    {
      key: 'users',
      label: 'User Management',
      content: (
        <div className="space-y-4">
          <div className="win95-flex win95-flex-between win95-gap-4">
            <div className="win95-flex win95-gap-2">
              <Windows95Button>Add User</Windows95Button>
              <Windows95Button disabled={selectedRow === null}>Edit User</Windows95Button>
              <Windows95Button variant="danger" disabled={selectedRow === null}>Delete User</Windows95Button>
            </div>
            <div className="win95-flex win95-gap-2">
              <Windows95Input placeholder="Search users..." className="w-48" />
              <Windows95Button>Search</Windows95Button>
            </div>
          </div>
          
          <Windows95Table
            columns={userColumns}
            data={userData}
            selectedRowIndex={selectedRow}
            onRowClick={(record, index) => setSelectedRow(index)}
            className="h-64"
          />
        </div>
      )
    },
    {
      key: 'settings',
      label: 'Settings',
      content: (
        <div className="space-y-4">
          <div className="win95-groupbox">
            <div className="win95-groupbox-title">User Information</div>
            <div className="space-y-2">
              <Windows95Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
              />
              <Windows95Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
              <Windows95Select
                label="Role"
                options={roleOptions}
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              />
              <Windows95Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              />
            </div>
          </div>
          
          <div className="win95-flex win95-gap-2">
            <Windows95Button variant="primary" onClick={handleSave}>
              Save Changes
            </Windows95Button>
            <Windows95Button>
              Cancel
            </Windows95Button>
            <Windows95Button>
              Reset
            </Windows95Button>
          </div>
        </div>
      )
    },
    {
      key: 'reports',
      label: 'Reports',
      content: (
        <div className="space-y-4">
          <div className="win95-panel-raised p-4">
            <h3 className="win95-text win95-text-bold mb-2">System Reports</h3>
            <div className="space-y-2">
              <div className="win95-flex win95-flex-between">
                <span className="win95-text">Total Users:</span>
                <span className="win95-text win95-text-bold">{userData.length}</span>
              </div>
              <div className="win95-flex win95-flex-between">
                <span className="win95-text">Active Users:</span>
                <span className="win95-text win95-text-bold">
                  {userData.filter(u => u.status === 'Active').length}
                </span>
              </div>
              <div className="win95-flex win95-flex-between">
                <span className="win95-text">Inactive Users:</span>
                <span className="win95-text win95-text-bold">
                  {userData.filter(u => u.status === 'Inactive').length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="win95-flex win95-gap-2">
            <Windows95Button>Generate Report</Windows95Button>
            <Windows95Button>Export Data</Windows95Button>
            <Windows95Button>Print</Windows95Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <Windows95Window 
        title="Management System v1.0"
        className="h-full"
      >
        <Windows95Tabs
          tabs={tabs}
          activeTab={selectedTab}
          onTabChange={setSelectedTab}
          className="h-full"
        />
      </Windows95Window>

      <Windows95Dialog
        title="Information"
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        type="info"
      >
        <p className="win95-text">
          Your changes have been saved successfully!
        </p>
      </Windows95Dialog>
    </MainLayout>
  );
}

export default App;