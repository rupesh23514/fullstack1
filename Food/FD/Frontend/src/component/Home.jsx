import { Link } from 'react-router-dom';
import { FaUtensils, FaTruck, FaStar, FaClock } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
            Delicious Food Delivered to Your Door
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            Order from your favorite restaurants and get food delivered in minutes
          </p>
          <Link to="/restaurants" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
            Order Now
          </Link>
        </div>
      </section>

      {/* Food Image Gallery */}
      <section className="container" style={{ marginBottom: '40px' }}>
        <div className="d-flex justify-between align-center" style={{ gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Pizza" style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1550547660-d9450f859349" alt="Burger" style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc" alt="Salad" style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288" alt="Sushi" style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <h2 className="text-center mb-4" style={{ fontSize: '2.5rem', color: '#333' }}>
          Why Choose Us?
        </h2>
        <div className="grid grid-3">
          <div className="card text-center">
            <FaUtensils size={50} style={{ color: '#667eea', marginBottom: '20px' }} />
            <h3>Best Restaurants</h3>
            <p>Partner with the finest restaurants in your area for quality food</p>
          </div>
          <div className="card text-center">
            <FaTruck size={50} style={{ color: '#667eea', marginBottom: '20px' }} />
            <h3>Fast Delivery</h3>
            <p>Get your food delivered within 30 minutes or less</p>
          </div>
          <div className="card text-center">
            <FaStar size={50} style={{ color: '#667eea', marginBottom: '20px' }} />
            <h3>Quality Guaranteed</h3>
            <p>We ensure the highest quality standards for all our partners</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
        <div className="container">
          <h2 className="text-center mb-4" style={{ fontSize: '2.5rem', color: '#333' }}>
            How It Works
          </h2>
          <div className="grid grid-4">
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: '#667eea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <h3>Choose Restaurant</h3>
              <p>Browse through our curated list of restaurants</p>
            </div>
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: '#667eea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <h3>Select Food</h3>
              <p>Choose from a variety of delicious menu items</p>
            </div>
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: '#667eea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                3
              </div>
              <h3>Place Order</h3>
              <p>Complete your order with secure payment</p>
            </div>
            <div className="text-center">
              <div style={{
                width: '80px',
                height: '80px',
                background: '#667eea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                4
              </div>
              <h3>Enjoy Food</h3>
              <p>Get your food delivered hot and fresh</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
          Ready to Order?
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>
          Join thousands of satisfied customers who trust us for their food delivery needs
        </p>
        <Link to="/restaurants" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
          Start Ordering
        </Link>
      </section>
    </div>
  );
};

export default Home; 