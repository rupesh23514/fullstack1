const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

// Create order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;
        
        // Calculate totals
        let subtotal = 0;
        const orderItems = [];
        
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem || !menuItem.isAvailable) {
                return res.status(400).json({ message: `Menu item ${item.menuItemId} is not available` });
            }
            
            const itemTotal = menuItem.price * item.quantity;
            subtotal += itemTotal;
            
            orderItems.push({
                menuItem: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price,
                specialInstructions: item.specialInstructions || ''
            });
        }
        
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        const deliveryFee = restaurant.deliveryFee;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + deliveryFee + tax;
        
        const order = new Order({
            customer: req.userId,
            restaurant: restaurantId,
            items: orderItems,
            subtotal,
            deliveryFee,
            tax,
            total,
            deliveryAddress,
            paymentMethod,
            specialInstructions,
            estimatedDeliveryTime: new Date(Date.now() + restaurant.estimatedDeliveryTime * 60000)
        });
        
        await order.save();
        
        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.userId })
            .populate('restaurant', 'name')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get restaurant orders (for restaurant owners)
router.get('/restaurant/:restaurantId', authMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to view this restaurant\'s orders' });
        }
        
        const orders = await Order.find({ restaurant: req.params.restaurantId })
            .populate('customer', 'name phone')
            .populate('items.menuItem', 'name')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error('Get restaurant orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (restaurant owners only)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        const restaurant = await Restaurant.findById(order.restaurant);
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }
        
        order.orderStatus = orderStatus;
        if (orderStatus === 'delivered') {
            order.actualDeliveryTime = new Date();
        }
        
        await order.save();
        
        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rate order
router.post('/:id/rate', authMiddleware, async (req, res) => {
    try {
        const { rating, review } = req.body;
        
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (order.customer.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to rate this order' });
        }
        
        if (order.orderStatus !== 'delivered') {
            return res.status(400).json({ message: 'Can only rate delivered orders' });
        }
        
        order.rating = rating;
        order.review = review;
        await order.save();
        
        res.json({
            message: 'Order rated successfully',
            order
        });
    } catch (error) {
        console.error('Rate order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 