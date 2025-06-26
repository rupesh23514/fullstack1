import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div className="d-flex justify-between align-center">
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: 'white', 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaUtensils />
            FoodDelivery
          </Link>

          <div className="d-flex align-center" style={{ gap: '20px' }}>
            <Link to="/restaurants" style={{ 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: '500'
            }}>
              Restaurants
            </Link>

            {user ? (
              <>
                <Link to="/cart" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  position: 'relative'
                }}>
                  <FaShoppingCart size={20} />
                  {getCartCount() > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ff4757',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                <Link to="/orders" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Orders
                </Link>

                {user.role === 'restaurant_owner' && (
                  <Link to="/dashboard" style={{ 
                    textDecoration: 'none', 
                    color: 'white',
                    fontWeight: '500'
                  }}>
                    Dashboard
                  </Link>
                )}

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FaUser />
                    {user.name}
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 