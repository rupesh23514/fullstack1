import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaClock, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import OrderReceipt from './OrderReceipt';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBill, setShowBill] = useState(false);
  const [error, setError] = useState(null);
  const [localCart, setLocalCart] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', image: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
        const menuRes = await axios.get(`/api/menu/restaurant/${id}`);
        setMenu(menuRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurant or menu.');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (item) => {
    addToCart(item, restaurant._id);
    toast.success(`${item.name} added to cart!`);
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      const found = prev.find(i => i._id === item._id);
      if (found) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(prev => prev.filter(i => i._id !== itemId));
  };

  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax + (restaurant?.deliveryFee || 0);

  const getCategories = () => {
    const categories = [...new Set(menu.map(item => item.category))];
    return categories;
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return menu;
    }
    return menu.filter(item => item.category === selectedCategory);
  };

  // Default menu items to show if menu is empty
  const defaultMenuItems = [
    {
      _id: 'default1',
      name: 'Margherita Pizza',
      description: 'Classic cheese and tomato pizza',
      price: 9.99,
      category: 'main_course',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    },
    {
      _id: 'default2',
      name: 'Cheeseburger',
      description: 'Juicy beef patty with cheese',
      price: 8.49,
      category: 'main_course',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    },
    {
      _id: 'default3',
      name: 'Caesar Salad',
      description: 'Fresh romaine, parmesan, and croutons',
      price: 7.25,
      category: 'appetizer',
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
    },
    {
      _id: 'default4',
      name: 'Sushi Platter',
      description: 'Assorted sushi rolls',
      price: 12.99,
      category: 'main_course',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    },
  ];

  // Add to local cart
  const handleAddToLocalCart = (item) => {
    setLocalCart(prev => {
      const found = prev.find(i => i._id === item._id);
      if (found) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    toast.success(`${item.name} added to bill!`);
  };

  // Remove from local cart
  const handleRemoveFromLocalCart = (itemId) => {
    setLocalCart(prev => prev.filter(i => i._id !== itemId));
  };

  // Change quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLocalCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity: newQuantity } : i));
  };

  // Bill calculation
  const billSubtotal = localCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const billTax = billSubtotal * 0.1;
  const billTotal = billSubtotal + billTax + (restaurant?.deliveryFee || 0);

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditItemId(item._id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || ''
    });
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Save edit (for default items, update local defaultMenuItems; for real items, update menu state)
  const handleEditSave = (item) => {
    if (menu.length === 0) {
      // Editing default items
      const idx = defaultMenuItems.findIndex(i => i._id === item._id);
      if (idx !== -1) {
        defaultMenuItems[idx] = { ...defaultMenuItems[idx], ...editForm };
      }
    } else {
      // Editing real items (frontend only)
      setMenu(prev => prev.map(i => i._id === item._id ? { ...i, ...editForm } : i));
    }
    setEditItemId(null);
    toast.success('Item updated!');
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditItemId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!restaurant) return <div>Restaurant not found.</div>;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-header">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'}
          alt={restaurant.name}
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <h2>{restaurant.name}</h2>
        <p>{restaurant.cuisine}</p>
        <p>{restaurant.address.city}, {restaurant.address.state}</p>
        <p>{restaurant.description}</p>
      </div>
      <h3>Menu</h3>
      <div className="menu-list">
        {(menu.length === 0 ? defaultMenuItems : menu).length === 0 ? (
          <div>No menu items available.</div>
        ) : (
          <div className="grid grid-2">
            {(menu.length === 0 ? defaultMenuItems : menu).map(item => (
              <div key={item._id} className="card">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
                  alt={item.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                />
                {editItemId === item._id ? (
                  <form onSubmit={e => { e.preventDefault(); handleEditSave(item); }} style={{ marginBottom: '10px' }}>
                    <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} placeholder="Name" className="form-control mb-2" required />
                    <input type="text" name="description" value={editForm.description} onChange={handleEditFormChange} placeholder="Description" className="form-control mb-2" required />
                    <input type="number" name="price" value={editForm.price} onChange={handleEditFormChange} placeholder="Price" className="form-control mb-2" required />
                    <input type="text" name="image" value={editForm.image} onChange={handleEditFormChange} placeholder="Image URL" className="form-control mb-2" />
                    <div className="d-flex justify-between">
                      <button type="submit" className="btn btn-success">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <button className="btn btn-primary" onClick={() => handleAddToLocalCart(item)}>
                      Add to Bill
                    </button>
                    <button className="btn btn-warning" style={{ marginLeft: '10px' }} onClick={() => handleEditClick(item)}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bill Calculator Section */}
      {localCart.length > 0 && (
        <div className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
          <h2 className="text-center mb-4">Bill Calculator</h2>
          <table style={{ width: '100%', margin: '20px 0', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {localCart.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="number" min="1" value={item.quantity} style={{ width: '50px' }} onChange={e => handleQuantityChange(item._id, parseInt(e.target.value))} />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td><button className="btn btn-danger" style={{ padding: '2px 8px', fontSize: 12 }} onClick={() => handleRemoveFromLocalCart(item._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-between mb-2"><span>Subtotal:</span><span>${billSubtotal.toFixed(2)}</span></div>
          <div className="d-flex justify-between mb-2"><span>Tax (10%):</span><span>${billTax.toFixed(2)}</span></div>
          <div className="d-flex justify-between mb-2"><span>Delivery Fee:</span><span>${(restaurant?.deliveryFee || 0).toFixed(2)}</span></div>
          <hr />
          <div className="d-flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}><span>Total:</span><span>${billTotal.toFixed(2)}</span></div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail; 