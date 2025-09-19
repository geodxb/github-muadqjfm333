import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WalletOverview from '../../components/investor/WalletOverview';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FirestoreService } from '../../services/firestoreService';
import { TrendingUp, Download } from 'lucide-react';

const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [investorData, setInvestorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorData = async () => {
      if (!user) return;
      
      try {
        const data = await FirestoreService.getInvestor(user.uid);
        if (data) {
          setInvestorData(data);
        }
      } catch (error) {
        console.error('Error fetching investor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Investor Dashboard</h1>
        <Button className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {investorData ? (
        <>
          <WalletOverview
            balance={investorData.balance || 0}
            totalInvested={investorData.totalInvested || 0}
            totalReturns={investorData.totalReturns || 0}
            pendingWithdrawals={investorData.pendingWithdrawals || 0}
          />

          <Card title="Portfolio Performance">
            <div className="flex items-center justify-center h-64 text-gray-500">
              <TrendingUp className="h-8 w-8 mr-2" />
              <span>Performance chart will be displayed here</span>
            </div>
          </Card>
        </>
      ) : (
        <Card title="Account Status">
          <div className="text-center py-8">
            <p className="text-gray-600">Your investor account is being processed. Please check back later.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvestorDashboard;