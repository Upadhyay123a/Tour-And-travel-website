import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ cart, setCart, onCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (tourId) => {
    setCart(cart.filter(item => item._id !== tourId));
  };

  const updateQuantity = (tourId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(tourId);
      return;
    }
    setCart(cart.map(item => 
      item._id === tourId ? { ...item, quantity } : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const applyPromoCode = () => {
    if (promoCode === 'TOURHUB10') {
      setDiscount(calculateSubtotal() * 0.1);
    } else if (promoCode === 'TOURHUB20') {
      setDiscount(calculateSubtotal() * 0.2);
    } else {
      alert('Invalid promo code. Try TOURHUB10 or TOURHUB20');
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPromoCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="cart cart--empty">
        <div className="cart__empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Start adding amazing tours to your cart!</p>
        <button className="cart__continue-btn" onClick={() => window.history.back()}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Shopping Cart ({cart.length} items)</h1>
        <button className="cart__clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart__content">
        <div className="cart__items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item__image">
                <img src={`/images/${item.photo}`} alt={item.title} />
              </div>
              
              <div className="cart-item__details">
                <h3 className="cart-item__title">{item.title}</h3>
                <p className="cart-item__location">📍 {item.city}</p>
                <p className="cart-item__duration">🕒 5 days</p>
                <p className="cart-item__group">👥 Up to {item.maxGroupSize} people</p>
              </div>

              <div className="cart-item__price">
                <p className="cart-item__price-label">Price per person</p>
                <p className="cart-item__price-value">${item.price}</p>
              </div>

              <div className="cart-item__quantity">
                <p className="cart-item__quantity-label">People</p>
                <div className="cart-item__quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="cart-item__quantity-btn"
                  >
                    -
                  </button>
                  <span className="cart-item__quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="cart-item__quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item__total">
                <p className="cart-item__total-label">Total</p>
                <p className="cart-item__total-value">${item.price * item.quantity}</p>
              </div>

              <button 
                className="cart-item__remove"
                onClick={() => removeFromCart(item._id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart__summary">
          <div className="cart__summary-card">
            <h2>Order Summary</h2>
            
            <div className="cart__summary-row">
              <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} people)</span>
              <span>${calculateSubtotal()}</span>
            </div>

            <div className="cart__summary-row">
              <span>Service Fee</span>
              <span>$25</span>
            </div>

            <div className="cart__summary-row">
              <span>Taxes</span>
              <span>${Math.round(calculateSubtotal() * 0.08)}</span>
            </div>

            {discount > 0 && (
              <div className="cart__summary-row cart__summary-row--discount">
                <span>Discount</span>
                <span>-${discount}</span>
              </div>
            )}

            <div className="cart__summary-row cart__summary-row--total">
              <span>Total</span>
              <span>${calculateTotal() + 25 + Math.round(calculateSubtotal() * 0.08)}</span>
            </div>

            <div className="cart__promo">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="cart__promo-input"
              />
              <button onClick={applyPromoCode} className="cart__promo-btn">
                Apply
              </button>
            </div>

            <button className="cart__checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>

            <div className="cart__security">
              <span>🔒 Secure Checkout</span>
              <span>💳 Multiple Payment Options</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
