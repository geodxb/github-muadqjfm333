import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CryptoExchangeService } from '../../services/cryptoExchangeService';
import { CryptoWithdrawal, CreditCardWithdrawal } from '../../types/withdrawal';
import { FirestoreService } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { Investor } from '../../types/user';

interface ProWithdrawalMethodsProps {
  investor: Investor;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

type WithdrawalMethod = 'bank' | 'crypto' | 'credit_card';

const ProWithdrawalMethods = ({ investor, amount, onSuccess, onCancel }: ProWithdrawalMethodsProps) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Crypto withdrawal state
  const [selectedExchange, setSelectedExchange] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDT' | 'SOL'>('BTC');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [cryptoAmount, setCryptoAmount] = useState(0);

  // Credit card withdrawal state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState(investor.name);
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Get available exchanges for investor's country
  const availableExchanges = CryptoExchangeService.getExchangesForCountry(investor.country);
  const selectedExchangeData = availableExchanges.find(ex => ex.id === selectedExchange);
  const supportedCryptos = selectedExchangeData?.supportedCryptos || [];
  const availableNetworks = CryptoExchangeService.getNetworksForCrypto(selectedCrypto);

  // Load crypto prices
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await CryptoExchangeService.getCryptoPrices();
        setCryptoPrices(prices);
        
        // Calculate crypto amount
        if (prices[selectedCrypto]) {
          const cryptoAmt = await CryptoExchangeService.calculateCryptoAmount(amount, selectedCrypto);
          setCryptoAmount(cryptoAmt);
        }
      } catch (error) {
        console.error('Error loading crypto prices:', error);
      }
    };

    loadPrices();
  }, [amount, selectedCrypto]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const validateCryptoForm = () => {
    if (!selectedExchange) {
      setError('Please select a crypto exchange');
      return false;
    }
    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return false;
    }
    if (availableNetworks.length > 1 && !selectedNetwork) {
      setError('Please select a network');
      return false;
    }
    if (!walletAddress) {
      setError('Please enter wallet address');
      return false;
    }
    if (!CryptoExchangeService.validateWalletAddress(walletAddress, selectedCrypto, selectedNetwork)) {
      setError('Invalid wallet address format');
      return false;
    }
    return true;
  };

  const validateCreditCardForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      setError('Please enter a valid card number');
      return false;
    }
    if (!cardHolderName.trim()) {
      setError('Please enter card holder name');
      return false;
    }
    if (!expiryMonth || !expiryYear) {
      setError('Please enter expiry date');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      setError('Please enter CVV');
      return false;
    }
    if (cardHolderName.toLowerCase() !== investor.name.toLowerCase()) {
      setError('Card holder name must match your registered name');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    
    if (selectedMethod === 'crypto' && !validateCryptoForm()) return;
    if (selectedMethod === 'credit_card' && !validateCreditCardForm()) return;

    setIsLoading(true);

    try {
      let withdrawalData: any = {
        investorId: investor.id,
        investorName: investor.name,
        amount: amount,
        method: selectedMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      if (selectedMethod === 'crypto') {
        const verificationHash = CryptoExchangeService.generateVerificationHash();
        const cryptoData: CryptoWithdrawal = {
          exchange: selectedExchange,
          cryptocurrency: selectedCrypto,
          network: selectedNetwork || availableNetworks[0],
          walletAddress: walletAddress,
          amount: amount,
          exchangeRate: cryptoPrices[selectedCrypto] || 1,
          cryptoAmount: cryptoAmount,
          verificationHash: verificationHash
        };
        
        withdrawalData.cryptoDetails = cryptoData;
        withdrawalData.description = `Crypto withdrawal to ${selectedCrypto} wallet via ${selectedExchangeData?.name}`;
      } else if (selectedMethod === 'credit_card') {
        const processingFee = amount * 0.035; // 3.5% processing fee
        const cardData: CreditCardWithdrawal = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardHolderName: cardHolderName,
          expiryMonth: expiryMonth,
          expiryYear: expiryYear,
          cvv: cvv,
          amount: amount,
          processingFee: processingFee,
          estimatedArrival: '3-5 business days'
        };
        
        withdrawalData.creditCardDetails = cardData;
        withdrawalData.description = `Credit card withdrawal to card ending in ${cardNumber.slice(-4)}`;
      }

      // Update investor balance
      const newBalance = investor.currentBalance - amount;
      await FirestoreService.updateInvestorBalance(investor.id, newBalance);

      // Add withdrawal request
      await FirestoreService.addWithdrawalRequest(
        investor.id,
        investor.name,
        amount
      );

      // Add transaction record
      await FirestoreService.addTransaction({
        investorId: investor.id,
        type: 'Withdrawal',
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: withdrawalData.description
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setError('Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCryptoForm = () => (
    <div className="space-y-6">
      {/* Exchange Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
          SELECT CRYPTO EXCHANGE
        </label>
        <select
          value={selectedExchange}
          onChange={(e) => setSelectedExchange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
          required
        >
          <option value="">Choose exchange...</option>
          {availableExchanges.map((exchange) => (
            <option key={exchange.id} value={exchange.id}>
              {exchange.name}
            </option>
          ))}
        </select>
        {availableExchanges.length === 0 && (
          <p className="text-sm text-red-600 mt-1 uppercase tracking-wide">
            No crypto exchanges available for {investor.country}
          </p>
        )}
      </div>

      {/* Cryptocurrency Selection */}
      {selectedExchange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            SELECT CRYPTOCURRENCY
          </label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value as 'BTC' | 'ETH' | 'USDT' | 'SOL')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            required
          >
            {supportedCryptos.map((crypto) => (
              <option key={crypto} value={crypto}>
                {crypto} - ${cryptoPrices[crypto]?.toLocaleString() || 'Loading...'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Network Selection */}
      {selectedCrypto && availableNetworks.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            SELECT NETWORK
          </label>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            required
          >
            <option value="">Choose network...</option>
            {availableNetworks.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Wallet Address */}
      {selectedCrypto && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            WALLET ADDRESS
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder={`Enter your ${selectedCrypto} wallet address`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            required
          />
        </div>
      )}

      {/* Conversion Summary */}
      {selectedCrypto && cryptoPrices[selectedCrypto] && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2 uppercase tracking-wide">CONVERSION SUMMARY</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>USD Amount:</span>
              <span className="font-medium">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{selectedCrypto} Price:</span>
              <span className="font-medium">${cryptoPrices[selectedCrypto].toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Exchange Fee:</span>
              <span className="font-medium">{selectedExchangeData?.fees[selectedCrypto]} {selectedCrypto}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-medium">
              <span>You'll receive:</span>
              <span>{(cryptoAmount - (selectedExchangeData?.fees[selectedCrypto] || 0)).toFixed(8)} {selectedCrypto}</span>
            </div>
          </div>
        </div>
      )}

      {/* Processing Info */}
      {selectedExchangeData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 uppercase tracking-wide">PROCESSING INFORMATION</h4>
          <p className="text-sm text-blue-800">
            Processing time: {selectedExchangeData.processingTime}
          </p>
          <p className="text-sm text-blue-800 mt-1">
            A verification hash will be generated for blockchain verification once the transaction is submitted.
          </p>
        </div>
      )}
    </div>
  );

  const renderCreditCardForm = () => (
    <div className="space-y-6">
      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2 uppercase tracking-wide">IMPORTANT NOTICE</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Credit card withdrawals are processed within 3-5 business days</li>
          <li>• A processing fee of 3.5% will be deducted from your withdrawal</li>
          <li>• Card holder name must match your registered account name</li>
          <li>• Only cards in your name are accepted for security purposes</li>
          <li>• Additional verification may be required for large amounts</li>
        </ul>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
          CARD NUMBER
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
          maxLength={19}
          required
        />
      </div>

      {/* Card Holder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
          CARD HOLDER NAME
        </label>
        <input
          type="text"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
          required
        />
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
          Must match your registered account name
        </p>
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            MONTH
          </label>
          <select
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            required
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month.toString().padStart(2, '0')}>
                {month.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            YEAR
          </label>
          <select
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            required
          >
            <option value="">YYYY</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
            CVV
          </label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 font-medium"
            maxLength={4}
            required
          />
        </div>
      </div>

      {/* Fee Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2 uppercase tracking-wide">FEE SUMMARY</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Withdrawal Amount:</span>
            <span className="font-medium">${amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee (3.5%):</span>
            <span className="font-medium">${(amount * 0.035).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-medium">
            <span>Total Deducted:</span>
            <span>${(amount + amount * 0.035).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Amount to Card:</span>
            <span className="font-medium">${amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 uppercase tracking-wide">PROCESSING TIMELINE</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
            <span>Request submitted - Immediate</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Verification & processing - 1-2 business days</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
            <span>Funds available on card - 3-5 business days</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              PRO WITHDRAWAL METHODS
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              SELECT WITHDRAWAL METHOD
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedMethod('bank')}
                className={`p-3 border rounded-lg text-center font-medium uppercase tracking-wide transition-colors ${
                  selectedMethod === 'bank'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                BANK TRANSFER
              </button>
              <button
                onClick={() => setSelectedMethod('crypto')}
                className={`p-3 border rounded-lg text-center font-medium uppercase tracking-wide transition-colors ${
                  selectedMethod === 'crypto'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                CRYPTOCURRENCY
              </button>
              <button
                onClick={() => setSelectedMethod('credit_card')}
                className={`p-3 border rounded-lg text-center font-medium uppercase tracking-wide transition-colors ${
                  selectedMethod === 'credit_card'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                CREDIT CARD
              </button>
            </div>
          </div>

          {/* Method-specific forms */}
          {selectedMethod === 'bank' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium uppercase tracking-wide">
                Standard bank transfer withdrawal will be processed using your registered bank account details.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Processing time: 1-3 business days
              </p>
            </div>
          )}

          {selectedMethod === 'crypto' && renderCryptoForm()}
          {selectedMethod === 'credit_card' && renderCreditCardForm()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium uppercase tracking-wide">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wide"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 uppercase tracking-wide"
            >
              {isLoading ? 'PROCESSING...' : 'SUBMIT WITHDRAWAL'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProWithdrawalMethods;