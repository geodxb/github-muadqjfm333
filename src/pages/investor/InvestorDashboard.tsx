@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useAuth } from '../../contexts/AuthContext';
 import WalletOverview from '../../components/investor/WalletOverview';
-import TransactionsTable from '../../components/investor/TransactionsTable';
-import WithdrawModal from '../../components/investor/WithdrawModal';
-import ProofOfFundsForm from '../../components/investor/ProofOfFundsForm';
-import WithdrawalRestrictionCheck from '../../components/investor/WithdrawalRestrictionCheck';
-import ShadowBanCheck from '../../components/investor/ShadowBanCheck';
-import AlertBanner from '../../components/investor/AlertBanner';
-import TradingViewChart from '../../components/common/TradingViewChart';
-import TradingViewTickerTape from '../../components/common/TradingViewTickerTape';
-import PerformanceChart from '../../components/common/PerformanceChart';
+import Card from '../../components/common/Card';
+import Button from '../../components/common/Button';
 import { FirestoreService } from '../../services/firestoreService';
-import { Wallet, TrendingUp, Download, Upload, AlertTriangle } from 'lucide-react';
+import { TrendingUp, Download } from 'lucide-react';
 
 const InvestorDashboard: React.FC = () => {
   const { user } = useAuth();
   const [investorData, setInvestorData] = useState<any>(null);
-  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
-  const [showProofOfFundsForm, setShowProofOfFundsForm] = useState(false);
   const [loading, setLoading] = useState(true);
-  const [transactions, setTransactions] = useState<any[]>([]);
 
   useEffect(() => {
     const fetchInvestorData = async () => {
@@ -26,8 +16,6 @@
         const data = await FirestoreService.getInvestor(user.uid);
         if (data) {
           setInvestorData(data);
-          const txns = await FirestoreService.getTransactions(user.uid);
-          setTransactions(txns);
         }
       } catch (error) {
         console.error('Error fetching investor data:', error);
@@ -42,12 +30,6 @@
   if (loading) {
     return (
       <div className="flex justify-center items-center min-h-screen">
-        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
-      </div>
-    );
-  }
-
-  if (!investorData) {
-    return (
-      <div className="flex justify-center items-center min-h-screen">
-        <div className="text-center">
-          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
-          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Not Found</h2>
-          <p className="text-gray-600">Your investor account could not be found. Please contact support.</p>
-        </div>
+        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
   }
@@ -55,10 +37,6 @@
   return (
     <div className="space-y-6">
-      <AlertBanner />
-      <ShadowBanCheck />
-      <WithdrawalRestrictionCheck />
-      
-      <div className="flex justify-between items-center">
+      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Investor Dashboard</h1>
-        <div className="flex space-x-3">
-          <button
-            onClick={() => setShowProofOfFundsForm(true)}
-            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
-          >
-            <Upload className="h-4 w-4 mr-2" />
-            Upload Proof of Funds
-          </button>
-          <button
-            onClick={() => setShowWithdrawModal(true)}
-            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
-          >
-            <Download className="h-4 w-4 mr-2" />
-            Request Withdrawal
-          </button>
-        </div>
+        <Button className="flex items-center">
+          <Download className="h-4 w-4 mr-2" />
+          Download Report
+        </Button>
       </div>
 
-      <TradingViewTickerTape />
-
-      <WalletOverview
-        balance={investorData?.balance || 0}
-        totalInvested={investorData?.totalInvested || 0}
-        totalReturns={investorData?.totalReturns || 0}
-        pendingWithdrawals={investorData?.pendingWithdrawals || 0}
-      />
-
-      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
-        <div className="bg-white rounded-lg shadow-md p-6">
-          <div className="flex items-center mb-4">
-            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
-            <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">Portfolio Performance</h2>
-          </div>
-          <PerformanceChart />
-        </div>
-
-        <div className="bg-white rounded-lg shadow-md p-6">
-          <div className="flex items-center mb-4">
-            <Wallet className="h-6 w-6 text-blue-600 mr-2" />
-            <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">Market Overview</h2>
-          </div>
-          <TradingViewChart symbol="NASDAQ:AAPL" />
-        </div>
-      </div>
-
-      <div className="bg-white rounded-lg shadow-md">
-        <div className="px-6 py-4 border-b border-gray-200">
-          <h2 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">Recent Transactions</h2>
-        </div>
-        <TransactionsTable transactions={transactions} />
-      </div>
-
-      {showWithdrawModal && (
-        <WithdrawModal
-          isOpen={showWithdrawModal}
-          onClose={() => setShowWithdrawModal(false)}
-          availableBalance={investorData?.balance || 0}
-        />
-      )}
-
-      {showProofOfFundsForm && (
-        <ProofOfFundsForm
-          isOpen={showProofOfFundsForm}
-          onClose={() => setShowProofOfFundsForm(false)}
-        />
-      )}
+      {investorData ? (
+        <>
+          <WalletOverview
+            balance={investorData.balance || 0}
+            totalInvested={investorData.totalInvested || 0}
+            totalReturns={investorData.totalReturns || 0}
+            pendingWithdrawals={investorData.pendingWithdrawals || 0}
+          />
+
+          <Card title="Portfolio Performance">
+            <div className="flex items-center justify-center h-64 text-gray-500">
+              <TrendingUp className="h-8 w-8 mr-2" />
+              <span>Performance chart will be displayed here</span>
+            </div>
+          </Card>
+        </>
+      ) : (
+        <Card title="Account Status">
+          <div className="text-center py-8">
+            <p className="text-gray-600">Your investor account is being processed. Please check back later.</p>
+          </div>
+        </Card>
+      )}
     </div>
   );
 };