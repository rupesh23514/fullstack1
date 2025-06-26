import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: '',
    rating: '',
    isOpen: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.isOpen !== '') params.append('isOpen', filters.isOpen);

      const response = await axios.get(`/api/restaurants?${params}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading restaurants...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Restaurants</h1>
      
      <section className="container" style={{ marginBottom: '30px' }}>
        <div className="d-flex justify-between align-center" style={{ gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Pizza" style={{ width: '120px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1550547660-d9450f859349" alt="Burger" style={{ width: '120px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc" alt="Salad" style={{ width: '120px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288" alt="Sushi" style={{ width: '120px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* Filters */}
      <div className="card mb-4">
        <h3>Filters</h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label>Cuisine</label>
            <select
              name="cuisine"
              className="form-control"
              value={filters.cuisine}
              onChange={handleFilterChange}
            >
              <option value="">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="indian">Indian</option>
              <option value="mexican">Mexican</option>
              <option value="japanese">Japanese</option>
              <option value="american">American</option>
            </select>
          </div>
          <div className="form-group">
            <label>Minimum Rating</label>
            <select
              name="rating"
              className="form-control"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="isOpen"
              className="form-control"
              value={filters.isOpen}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="true">Open Now</option>
              <option value="false">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-2">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/restaurants/${restaurant._id}`)}>
            <div style={{ position: 'relative' }}>
              <img
                src={restaurant.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591'}
                alt={restaurant.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: restaurant.isOpen ? '#28a745' : '#dc3545',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '15px',
                fontSize: '12px'
              }}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
            
            <h3>{restaurant.name}</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>{restaurant.cuisine}</p>
            
            <div style={{ marginBottom: '10px' }}>
              <FaStar style={{ color: '#ffc107', marginRight: '5px' }} />
              <span>{restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)</span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <FaClock style={{ color: '#666', marginRight: '5px' }} />
              <span>{restaurant.estimatedDeliveryTime} min delivery</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <FaMapMarkerAlt style={{ color: '#666', marginRight: '5px' }} />
              <span>{restaurant.address.city}, {restaurant.address.state}</span>
            </div>
            
            <p style={{ marginBottom: '15px' }}>{restaurant.description}</p>
            
            <div className="d-flex justify-between align-center">
              <span style={{ fontWeight: 'bold' }}>
                Delivery: ${restaurant.deliveryFee}
              </span>
              <button
                className="btn btn-primary"
                onClick={e => { e.stopPropagation(); navigate(`/restaurants/${restaurant._id}`); }}
              >
                View Menu
              </button>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center" style={{ padding: '50px' }}>
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList; 