import { motion } from 'framer-motion';
import Card from '../common/Card';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface WalletOverviewProps {
  initialDeposit: number;
  currentBalance: number;
}

const WalletOverview = ({ initialDeposit, currentBalance }: WalletOverviewProps) => {
  const gainLoss = currentBalance - initialDeposit;
  const percentChange = initialDeposit > 0 ? (gainLoss / initialDeposit) * 100 : 0;
  const isPositive = gainLoss >= 0;
  
  return (
    <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">${currentBalance.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Invested</p>
          <p className="text-2xl font-bold text-blue-600">${initialDeposit.toLocaleString()}</p>
          <div>
              <p className="text-sm font-medium text-gray-600">Initial Deposit</p>
              <Wallet size={16} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${initialDeposit.toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Current Balance</p>
              <Wallet size={16} className="text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${currentBalance.toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">
                Total {isPositive ? 'Gain' : 'Loss'}
              </p>
              {isPositive ? 
                <TrendingUp size={16} className="text-gray-600" /> : 
                <TrendingDown size={16} className="text-gray-600" />
              }
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">
                {isPositive ? '+' : ''}${gainLoss.toLocaleString()}
              </p>
              <div className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending Withdrawals</p>
          <p className="text-2xl font-bold text-orange-600">${0}</p>
        </div>
      </div>
    </div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Returns</p>
          <p className={`text-2xl font-bold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${gainLoss.toLocaleString()}
          </p>
          {gainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600 inline ml-2" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600 inline ml-2" />
          )}
    </div>
  );
};

export default WalletOverview;