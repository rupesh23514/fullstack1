# Food Delivery System

A full-stack food delivery application built with React, Node.js, Express, and MongoDB.

## Features

### Customer Features
- User registration and authentication
- Browse restaurants with filters (cuisine, rating, open status)
- View restaurant menus with categories
- Add items to cart
- Place orders with delivery details
- Track order status
- Rate and review orders
- View order history

### Restaurant Owner Features
- Restaurant registration and management
- Menu management (add, edit, delete items)
- Order management and status updates
- Dashboard with order analytics

### Admin Features
- User management
- Restaurant approval system
- Order monitoring

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- React Icons
- React Hot Toast for notifications
- Vite for build tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

## Project Structure

```
FD/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   └── server.js
├── src/
│   ├── component/
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RestaurantList.jsx
│   │   ├── RestaurantDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   ├── RestaurantDashboard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd FD/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your-secret-key-here
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the main project directory:
```bash
cd FD
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (protected)
- `PUT /api/restaurants/:id` - Update restaurant (protected)
- `DELETE /api/restaurants/:id` - Delete restaurant (protected)
- `GET /api/restaurants/owner/me` - Get user's restaurants (protected)

### Menu Items
- `GET /api/menu/restaurant/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Create menu item (protected)
- `PUT /api/menu/:id` - Update menu item (protected)
- `DELETE /api/menu/:id` - Delete menu item (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders/restaurant/:restaurantId` - Get restaurant orders (protected)
- `PUT /api/orders/:id/status` - Update order status (protected)
- `POST /api/orders/:id/rate` - Rate order (protected)

### User Profile
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/change-password` - Change password (protected)

## Usage

### For Customers
1. Register an account or login
2. Browse restaurants and filter by preferences
3. Select a restaurant and view their menu
4. Add items to cart
5. Proceed to checkout with delivery details
6. Track your order status
7. Rate and review after delivery

### For Restaurant Owners
1. Register as a restaurant owner
2. Create and manage your restaurant profile
3. Add menu items with categories and pricing
4. Monitor incoming orders
5. Update order status as they progress
6. View order analytics in dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 