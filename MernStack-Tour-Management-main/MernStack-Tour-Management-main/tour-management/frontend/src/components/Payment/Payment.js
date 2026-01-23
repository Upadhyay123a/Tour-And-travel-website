import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const calculateTotal = () => {
    let total = booking.totalPrice;
    if (discount > 0) {
      total -= discount;
    }
    if (useWallet && walletBalance > 0) {
      total = Math.max(0, total - walletBalance);
    }
    return total;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await fetch('/api/v1/payments/coupon/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: booking.totalPrice,
          tourId: booking.tour._id,
          category: booking.tour.category
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setDiscount(data.data.discount);
        alert(`Coupon applied! You saved $${data.data.discount}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Coupon error:', error);
      alert('Failed to apply coupon');
    }
  };

  const handleWalletToggle = () => {
    setUseWallet(!useWallet);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        if (!stripe || !elements) {
          throw new Error('Stripe has not loaded');
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        // Create payment intent
        const paymentResponse = await fetch('/api/v1/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            bookingId: booking._id,
            paymentMethod: 'credit_card',
            amount: calculateTotal()
          })
        });

        const paymentData = await paymentResponse.json();
        
        if (!paymentData.success) {
          throw new Error(paymentData.message);
        }

        // Confirm payment
        const { error: confirmError } = await stripe.confirmCardPayment(
          paymentData.data.clientSecret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }

        // Process payment
        const processResponse = await fetch('/api/v1/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            paymentId: paymentData.data.paymentId,
            paymentMethodId: paymentMethod.id,
            savePaymentMethod
          })
        });

        const processData = await processResponse.json();
        
        if (processData.success) {
          onPaymentSuccess(processData.data);
        } else {
          throw new Error(processData.message);
        }
      } else if (paymentMethod === 'wallet') {
        // Handle wallet payment
        const response = await fetch('/api/v1/payments/wallet/pay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            bookingId: booking._id,
            amount: calculateTotal()
          })
        });

        const data = await response.json();
        
        if (data.success) {
          onPaymentSuccess(data.data);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    // Fetch wallet balance
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('/api/v1/payments/wallet/balance', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setWalletBalance(data.data.balance);
        }
      } catch (error) {
        console.error('Wallet balance error:', error);
      }
    };

    // Fetch saved payment methods
    const fetchSavedPaymentMethods = async () => {
      try {
        const response = await fetch('/api/v1/payments/methods/saved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setSavedPaymentMethods(data.data);
        }
      } catch (error) {
        console.error('Saved payment methods error:', error);
      }
    };

    fetchWalletBalance();
    fetchSavedPaymentMethods();
  }, []);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Complete Your Payment</h2>
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Tour: {booking.tour.title}</p>
          <p>Date: {new Date(booking.tourDate).toLocaleDateString()}</p>
          <p>People: {booking.numberOfPeople}</p>
          <p>Subtotal: ${booking.totalPrice}</p>
          {discount > 0 && <p>Discount: -${discount}</p>}
          {useWallet && walletBalance > 0 && <p>Wallet: -${Math.min(walletBalance, calculateTotal())}</p>}
          <p className="total">Total: ${calculateTotal()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          <div className="payment-method-options">
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => handlePaymentMethodChange('card')}
              />
              <span className="payment-icon">💳</span>
              <span>Credit/Debit Card</span>
            </label>
            
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={() => handlePaymentMethodChange('wallet')}
                disabled={walletBalance === 0}
              />
              <span className="payment-icon">👛</span>
              <span>Wallet (${walletBalance})</span>
            </label>
            
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => handlePaymentMethodChange('paypal')}
              />
              <span className="payment-icon">🅿️</span>
              <span>PayPal</span>
            </label>
            
            <label className="payment-method-option">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => handlePaymentMethodChange('upi')}
              />
              <span className="payment-icon">📱</span>
              <span>UPI</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="card-payment">
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            
            <label className="save-card-checkbox">
              <input
                type="checkbox"
                checked={savePaymentMethod}
                onChange={(e) => setSavePaymentMethod(e.target.checked)}
              />
              Save card for future payments
            </label>
          </div>
        )}

        {paymentMethod === 'wallet' && (
          <div className="wallet-payment">
            <p>Your wallet balance: ${walletBalance}</p>
            {walletBalance < calculateTotal() && (
              <p className="insufficient-funds">
                Insufficient wallet balance. Please add funds or choose another payment method.
              </p>
            )}
          </div>
        )}

        <div className="coupon-section">
          <h3>Have a coupon?</h3>
          <div className="coupon-input">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" onClick={handleCouponApply}>
              Apply
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="pay-button"
          disabled={processing || (paymentMethod === 'wallet' && walletBalance < calculateTotal())}
        >
          {processing ? 'Processing...' : `Pay $${calculateTotal()}`}
        </button>
      </form>
    </div>
  );
};

const Payment = ({ booking, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        booking={booking}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default Payment;
