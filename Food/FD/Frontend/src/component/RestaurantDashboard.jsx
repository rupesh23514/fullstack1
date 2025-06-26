import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaClock, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    phone: '',
    email: '',
    deliveryFee: '',
    minimumOrder: '',
    estimatedDeliveryTime: '',
    image: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const foodTypeImages = {
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    burger: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    salad: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
    sushi: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
  };
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: foodTypeImages.pizza,
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    foodType: 'pizza'
  });
  const [menuLoading, setMenuLoading] = useState(false);
  const restaurantImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836', // Italian
    'https://images.unsplash.com/photo-1550547660-d9450f859349', // Burger
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288', // Sushi
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', // Salad
    'https://images.unsplash.com/photo-1506368083636-6defb67639d8', // Indian
    'https://images.unsplash.com/photo-1506089676908-3592f7389d4d'  // Mexican
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, ordersRes] = await Promise.all([
        axios.get('/api/restaurants/owner/me'),
        axios.get('/api/orders/my-orders')
      ]);
      
      setRestaurants(restaurantsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
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

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setCreateForm(prev => ({
        ...prev,
        address: { ...prev.address, [key]: value }
      }));
    } else {
      setCreateForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const imageUrl = createForm.image || restaurantImages[Math.floor(Math.random() * restaurantImages.length)];
      await axios.post('/api/restaurants', { ...createForm, image: imageUrl }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowCreateForm(false);
      setCreateForm({
        name: '', description: '', cuisine: '', address: { street: '', city: '', state: '', zipCode: '' },
        phone: '', email: '', deliveryFee: '', minimumOrder: '', estimatedDeliveryTime: '', image: ''
      });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to create restaurant');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'foodType') {
      setMenuForm(prev => ({
        ...prev,
        foodType: value,
        image: foodTypeImages[value] || ''
      }));
    } else {
      setMenuForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    setMenuLoading(true);
    try {
      await axios.post('/api/menu', {
        ...menuForm,
        price: parseFloat(menuForm.price),
        restaurant: selectedRestaurant._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowMenuForm(false);
      setMenuForm({ name: '', description: '', price: '', category: '', image: '', isVegetarian: false, isVegan: false, isSpicy: false, foodType: 'pizza' });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to create menu item');
    } finally {
      setMenuLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Restaurant Dashboard</h1>
      {user && user.role === 'restaurant_owner' && (
        <div className="mb-4 text-center">
          <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Add New Restaurant'}
          </button>
        </div>
      )}
      {showCreateForm && (
        <div className="card mb-4">
          <h3>Add New Restaurant</h3>
          <form onSubmit={handleCreateRestaurant}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" className="form-control" value={createForm.name} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" className="form-control" value={createForm.description} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Cuisine</label>
              <input type="text" name="cuisine" className="form-control" value={createForm.cuisine} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Street</label>
              <input type="text" name="address.street" className="form-control" value={createForm.address.street} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="address.city" className="form-control" value={createForm.address.city} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="address.state" className="form-control" value={createForm.address.state} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input type="text" name="address.zipCode" className="form-control" value={createForm.address.zipCode} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" className="form-control" value={createForm.phone} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" value={createForm.email} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Delivery Fee</label>
              <input type="number" name="deliveryFee" className="form-control" value={createForm.deliveryFee} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Minimum Order</label>
              <input type="number" name="minimumOrder" className="form-control" value={createForm.minimumOrder} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Estimated Delivery Time (minutes)</label>
              <input type="number" name="estimatedDeliveryTime" className="form-control" value={createForm.estimatedDeliveryTime} onChange={handleCreateChange} required />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" name="image" className="form-control" value={createForm.image} onChange={handleCreateChange} placeholder="Restaurant Image URL" />
              {createForm.image && (
                <div className="text-center mt-2">
                  <img src={createForm.image} alt="Preview" style={{ width: '120px', borderRadius: '8px' }} />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-success" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Restaurant'}
            </button>
          </form>
        </div>
      )}
      {restaurants.length === 0 ? (
        <div className="text-center" style={{ padding: '50px' }}>
          <h3>No restaurants found</h3>
          <p>You need to create a restaurant first to access the dashboard.</p>
        </div>
      ) : (
        <div>
          {/* Restaurant Selection */}
          <div className="card mb-4">
            <h3>Select Restaurant</h3>
            <select
              className="form-control"
              value={selectedRestaurant?._id || ''}
              onChange={(e) => {
                const restaurant = restaurants.find(r => r._id === e.target.value);
                setSelectedRestaurant(restaurant);
              }}
            >
              <option value="">Choose a restaurant...</option>
              {restaurants.map(restaurant => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurant && (
            <>
              {/* Restaurant Info */}
              <div className="card mb-4">
                <h3>{selectedRestaurant.name}</h3>
                <div className="grid grid-3">
                  <div>
                    <FaStar style={{ color: '#ffc107', marginRight: '5px' }} />
                    <span>{selectedRestaurant.rating.toFixed(1)} ({selectedRestaurant.totalReviews} reviews)</span>
                  </div>
                  <div>
                    <FaClock style={{ color: '#666', marginRight: '5px' }} />
                    <span>{selectedRestaurant.estimatedDeliveryTime} min delivery</span>
                  </div>
                  <div>
                    <FaMapMarkerAlt style={{ color: '#666', marginRight: '5px' }} />
                    <span>{selectedRestaurant.address.city}, {selectedRestaurant.address.state}</span>
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <span style={{
                    background: selectedRestaurant.isOpen ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {selectedRestaurant && selectedRestaurant.image && (
                  <div className="text-center mb-3">
                    <img src={selectedRestaurant.image} alt={selectedRestaurant.name} style={{ width: '200px', borderRadius: '10px' }} />
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="card">
                <h3>Recent Orders</h3>
                {orders.filter(order => order.restaurant._id === selectedRestaurant._id).length === 0 ? (
                  <p>No orders for this restaurant yet.</p>
                ) : (
                  <div className="grid grid-1">
                    {orders
                      .filter(order => order.restaurant._id === selectedRestaurant._id)
                      .slice(0, 10)
                      .map((order) => (
                        <div key={order._id} className="card" style={{ background: '#f8f9fa' }}>
                          <div className="d-flex justify-between align-center mb-2">
                            <h4>Order #{order._id.slice(-6)}</h4>
                            <span style={{
                              background: getStatusColor(order.orderStatus),
                              color: 'white',
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontSize: '14px'
                            }}>
                              {order.orderStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-2 mb-2">
                            <div>
                              <strong>Customer:</strong> {order.customer.name}
                            </div>
                            <div>
                              <strong>Total:</strong> ${order.total.toFixed(2)}
                            </div>
                          </div>

                          <div className="mb-2">
                            <strong>Items:</strong>
                            <div style={{ marginTop: '5px' }}>
                              {order.items.map((item, index) => (
                                <div key={index} style={{ marginBottom: '2px' }}>
                                  {item.menuItem.name} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-2">
                            <strong>Delivery Address:</strong>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}
                            </div>
                          </div>

                          <div className="d-flex justify-between align-center">
                            <span style={{ fontSize: '14px', color: '#666' }}>
                              {formatDate(order.createdAt)}
                            </span>
                            
                            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                              <select
                                value={order.orderStatus}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '5px',
                                  border: '1px solid #ddd'
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="ready">Ready</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="mb-4 text-center">
                <button className="btn btn-secondary" onClick={() => setShowMenuForm(!showMenuForm)}>
                  {showMenuForm ? 'Cancel' : 'Add Menu Item'}
                </button>
              </div>
              {showMenuForm && (
                <div className="card mb-4">
                  <h3>Add Menu Item</h3>
                  <form onSubmit={handleCreateMenuItem}>
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" name="name" className="form-control" value={menuForm.name} onChange={handleMenuChange} required />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input type="text" name="description" className="form-control" value={menuForm.description} onChange={handleMenuChange} required />
                    </div>
                    <div className="form-group">
                      <label>Price</label>
                      <input type="number" name="price" className="form-control" value={menuForm.price} onChange={handleMenuChange} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" className="form-control" value={menuForm.category} onChange={handleMenuChange} required>
                        <option value="">Select Category</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="main_course">Main Course</option>
                        <option value="dessert">Dessert</option>
                        <option value="beverage">Beverage</option>
                        <option value="side_dish">Side Dish</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Food Type (auto-fills image)</label>
                      <select name="foodType" className="form-control" value={menuForm.foodType} onChange={handleMenuChange}>
                        <option value="pizza">Pizza</option>
                        <option value="burger">Burger</option>
                        <option value="salad">Salad</option>
                        <option value="sushi">Sushi</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input type="text" name="image" className="form-control" value={menuForm.image} onChange={handleMenuChange} placeholder="Menu Item Image URL" />
                      {menuForm.image && (
                        <div className="text-center mt-2">
                          <img src={menuForm.image} alt="Preview" style={{ width: '100px', borderRadius: '8px' }} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        <input type="checkbox" name="isVegetarian" checked={menuForm.isVegetarian} onChange={handleMenuChange} /> Vegetarian
                      </label>
                      <label style={{ marginLeft: '15px' }}>
                        <input type="checkbox" name="isVegan" checked={menuForm.isVegan} onChange={handleMenuChange} /> Vegan
                      </label>
                      <label style={{ marginLeft: '15px' }}>
                        <input type="checkbox" name="isSpicy" checked={menuForm.isSpicy} onChange={handleMenuChange} /> Spicy
                      </label>
                    </div>
                    <button type="submit" className="btn btn-success" disabled={menuLoading}>
                      {menuLoading ? 'Creating...' : 'Create Menu Item'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard; 