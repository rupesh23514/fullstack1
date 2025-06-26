const express = require('express');
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByOwner
} = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes
router.post('/', authMiddleware, createRestaurant);
router.put('/:id', authMiddleware, updateRestaurant);
router.delete('/:id', authMiddleware, deleteRestaurant);
router.get('/owner/me', authMiddleware, getRestaurantsByOwner);

module.exports = router; 