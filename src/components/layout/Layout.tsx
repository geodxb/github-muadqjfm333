@@ .. @@
 import React from 'react';
 import Header from './Header';
-import Sidebar from './Sidebar';
-import AnnouncementBanner from '../common/AnnouncementBanner';
 
 interface LayoutProps {
   children: React.ReactNode;
@@ -8,11 +6,8 @@
 
 const Layout: React.FC<LayoutProps> = ({ children }) => {
   return (
-    <div className="min-h-screen bg-gray-50">
+    <div className="min-h-screen bg-gray-100">
       <Header />
-      <AnnouncementBanner />
-      <div className="flex">
-        <Sidebar />
-        <main className="flex-1 p-6">
+        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           {children}
         </main>
-      </div>
     </div>
   );
 };