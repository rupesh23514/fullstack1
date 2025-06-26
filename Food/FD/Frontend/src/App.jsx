import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Login from './component/Login'
import Register from './component/Register'
import RestaurantList from './component/RestaurantList'
import RestaurantDetail from './component/RestaurantDetail'
import Cart from './component/Cart'
import Orders from './component/Orders'
import Profile from './component/Profile'
import RestaurantDashboard from './component/RestaurantDashboard'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              
              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <RestaurantDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App 