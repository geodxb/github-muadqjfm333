@@ .. @@
 import React from 'react';
 import { Link, useNavigate } from 'react-router-dom';
-import { LogOut, User, Settings, Bell } from 'lucide-react';
+import { LogOut, User } from 'lucide-react';
 import { useAuth } from '../../contexts/AuthContext';
-import NotificationBell from '../common/NotificationBell';
 
 const Header: React.FC = () => {
   const { user, logout } = useAuth();
@@ -15,7 +14,7 @@
   };
 
   return (
-    <header className="bg-white shadow-sm border-b border-gray-200">
+    <header className="bg-white border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
           <div className="flex items-center">
@@ -28,12 +27,6 @@
           
           <div className="flex items-center space-x-4">
-            <NotificationBell />
-            
-            <Link
-              to="/settings"
-              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
-            >
-              <Settings className="h-5 w-5" />
-            </Link>
-            
             <div className="flex items-center space-x-2">
               <User className="h-5 w-5 text-gray-500" />
               <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
@@ -41,7 +34,7 @@
               </span>
             </div>
             
-            <button
+            <button 
               onClick={handleLogout}
               className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
             >