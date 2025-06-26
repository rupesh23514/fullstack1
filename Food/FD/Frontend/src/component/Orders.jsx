import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'preparing': return '#fd7e14';
      case 'ready': return '#28a745';
      case 'out_for_delivery': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '50px' }}>
          <h3>No orders yet</h3>
          <p>Start ordering delicious food to see your order history here!</p>
        </div>
      ) : (
        <div className="grid grid-1">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="d-flex justify-between align-center mb-3">
                <h3>{order.restaurant.name}</h3>
                <span style={{
                  background: getStatusColor(order.orderStatus),
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {order.orderStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-2 mb-3">
                <div>
                  <strong>Order Date:</strong> {formatDate(order.createdAt)}
                </div>
                <div>
                  <strong>Order Total:</strong> ${order.total.toFixed(2)}
                </div>
              </div>

              <div className="mb-3">
                <strong>Items:</strong>
                <div style={{ marginTop: '10px' }}>
                  {order.items.map((item, index) => (
                    <div key={index} className="d-flex justify-between" style={{ marginBottom: '5px' }}>
                      <span>{item.menuItem.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-2 mb-3">
                <div>
                  <strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </div>
                <div>
                  <strong>Payment Status:</strong> {order.paymentStatus.toUpperCase()}
                </div>
              </div>

              <div className="mb-3">
                <strong>Delivery Address:</strong>
                <div style={{ marginTop: '5px', color: '#666' }}>
                  <FaMapMarkerAlt style={{ marginRight: '5px' }} />
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </div>
              </div>

              {order.estimatedDeliveryTime && (
                <div className="mb-3">
                  <strong>Estimated Delivery:</strong>
                  <div style={{ marginTop: '5px', color: '#666' }}>
                    <FaClock style={{ marginRight: '5px' }} />
                    {formatDate(order.estimatedDeliveryTime)}
                  </div>
                </div>
              )}

              {order.specialInstructions && (
                <div className="mb-3">
                  <strong>Special Instructions:</strong>
                  <p style={{ marginTop: '5px', color: '#666' }}>{order.specialInstructions}</p>
                </div>
              )}

              {order.orderStatus === 'delivered' && !order.rating && (
                <div className="card" style={{ background: '#f8f9fa' }}>
                  <h4>Rate Your Order</h4>
                  <p>How was your experience? Leave a rating and review!</p>
                  <button className="btn btn-primary">
                    Rate Order
                  </button>
                </div>
              )}

              {order.rating && (
                <div className="mb-3">
                  <strong>Your Rating:</strong>
                  <div style={{ marginTop: '5px' }}>
                    <FaStar style={{ color: '#ffc107', marginRight: '5px' }} />
                    {order.rating}/5
                    {order.review && (
                      <p style={{ marginTop: '5px', color: '#666' }}>"{order.review}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 