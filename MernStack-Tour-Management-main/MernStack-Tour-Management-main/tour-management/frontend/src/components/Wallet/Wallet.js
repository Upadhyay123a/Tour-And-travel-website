import React, { useState, useEffect } from 'react';
import './Wallet.css';

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet balance
      const balanceResponse = await fetch('/api/v1/payments/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const balanceData = await balanceResponse.json();
      if (balanceData.success) {
        setWalletBalance(balanceData.data.balance);
      }

      // Fetch transactions
      const transactionsResponse = await fetch('/api/v1/payments/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const transactionsData = await transactionsResponse.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.data.transactions);
      }
    } catch (error) {
      console.error('Wallet data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Create payment intent for wallet recharge
      const response = await fetch('/api/v1/payments/wallet/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(addAmount),
          paymentMethod
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // In a real app, you would redirect to Stripe checkout
        alert('Payment initiated. Please complete the payment to add funds to your wallet.');
        setShowAddMoney(false);
        setAddAmount('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Add money error:', error);
      alert('Failed to add money to wallet');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
        return '💰';
      case 'debit':
        return '💸';
      case 'refund':
        return '↩️';
      case 'bonus':
        return '🎁';
      case 'penalty':
        return '⚠️';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'credit':
      case 'refund':
      case 'bonus':
        return '#28a745';
      case 'debit':
      case 'penalty':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="wallet-container">
        <div className="loading">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>My Wallet</h2>
        <div className="wallet-balance">
          <div className="balance-amount">${walletBalance.toFixed(2)}</div>
          <div className="balance-label">Available Balance</div>
        </div>
      </div>

      <div className="wallet-actions">
        <button 
          className="add-money-btn"
          onClick={() => setShowAddMoney(true)}
        >
          + Add Money
        </button>
        <button 
          className="refresh-btn"
          onClick={fetchWalletData}
        >
          🔄 Refresh
        </button>
      </div>

      {showAddMoney && (
        <div className="add-money-modal">
          <div className="modal-content">
            <h3>Add Money to Wallet</h3>
            <div className="amount-input">
              <label>Amount ($)</label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
              />
            </div>
            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddMoney(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleAddMoney}
              >
                Add ${addAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="wallet-transactions">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-icon">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">
                    {transaction.description}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>
                <div 
                  className="transaction-amount"
                  style={{ color: getTransactionColor(transaction.type) }}
                >
                  {transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'bonus' ? '+' : '-'}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
