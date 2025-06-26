const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

// Get menu items by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ 
            restaurant: req.params.restaurantId,
            isAvailable: true 
        }).sort({ category: 1, name: 1 });
        
        res.json(menuItems);
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create menu item (restaurant owner only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.body.restaurant);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to add menu items to this restaurant' });
        }
        
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        
        res.status(201).json({
            message: 'Menu item created successfully',
            menuItem
        });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update menu item
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this menu item' });
        }
        
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json({
            message: 'Menu item updated successfully',
            menuItem: updatedMenuItem
        });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete menu item
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this menu item' });
        }
        
        await MenuItem.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 