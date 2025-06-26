import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import OrderReceipt from './OrderReceipt';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, restaurantId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    paymentMethod: 'cash',
    specialInstructions: ''
  });
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate delivery address
    const { street, city, state, zipCode } = orderData.deliveryAddress;
    if (!street || !city || !state || !zipCode) {
      toast.error('Please fill in complete delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        restaurantId,
        items: cart.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
          specialInstructions: ''
        })),
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.specialInstructions
      };

      const response = await axios.post('/api/orders', orderPayload);
      toast.success('Order placed successfully!');
      setPlacedOrder(response.data.order);
      clearCart();
      // navigate('/orders'); // Comment out to show bill instead of redirect
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div>
        <OrderReceipt order={placedOrder} />
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => window.print()}>Print Bill</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
        <p>Add some delicious food to get started!</p>
        <button 
          onClick={() => navigate('/restaurants')} 
          className="btn btn-primary"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Your Cart</h1>
      
      <div className="grid grid-2" style={{ gap: '30px' }}>
        {/* Cart Items */}
        <div>
          <h3>Order Items</h3>
          {cart.map((item) => (
            <div key={item._id} className="card mb-3">
              <div className="d-flex justify-between align-center">
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#666' }}>{item.description}</p>
                  <p style={{ fontWeight: 'bold', color: '#28a745' }}>
                    ${item.price}
                  </p>
                </div>
                <div className="d-flex align-center" style={{ gap: '10px' }}>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px' }}
                  >
                    <FaMinus />
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px' }}
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-danger"
                    style={{ padding: '5px 10px' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="card">
            <h4>Order Summary</h4>
            <div className="d-flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-between mb-2">
              <span>Delivery Fee:</span>
              <span>$2.00</span>
            </div>
            <div className="d-flex justify-between mb-2">
              <span>Tax:</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>${(getCartTotal() + 2 + getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h3>Delivery Details</h3>
          <div className="card">
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="deliveryAddress.street"
                className="form-control"
                value={orderData.deliveryAddress.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="deliveryAddress.city"
                className="form-control"
                value={orderData.deliveryAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="deliveryAddress.state"
                className="form-control"
                value={orderData.deliveryAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="deliveryAddress.zipCode"
                className="form-control"
                value={orderData.deliveryAddress.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                className="form-control"
                value={orderData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="digital_wallet">Digital Wallet</option>
              </select>
            </div>
            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                name="specialInstructions"
                className="form-control"
                value={orderData.specialInstructions}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special instructions for delivery..."
              />
            </div>
            <button
              onClick={handlePlaceOrder}
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 