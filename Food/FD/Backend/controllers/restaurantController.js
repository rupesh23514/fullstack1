const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const { cuisine, rating, isOpen } = req.query;
        let filter = { isActive: true };

        if (cuisine) filter.cuisine = cuisine;
        if (rating) filter.rating = { $gte: parseFloat(rating) };
        if (isOpen !== undefined) filter.isOpen = isOpen === 'true';

        const restaurants = await Restaurant.find(filter)
            .populate('owner', 'name email')
            .sort({ rating: -1, name: 1 });

        res.json(restaurants);
    } catch (error) {
        console.error('Get restaurants error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate('owner', 'name email phone')
            .populate({
                path: 'menuItems',
                model: 'MenuItem',
                match: { isAvailable: true }
            });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        console.error('Get restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create restaurant
const createRestaurant = async (req, res) => {
    try {
        const {
            name,
            description,
            cuisine,
            address,
            phone,
            email,
            deliveryFee,
            minimumOrder,
            estimatedDeliveryTime,
            operatingHours
        } = req.body;

        // Check if user is restaurant owner
        const user = await User.findById(req.userId);
        if (user.role !== 'restaurant_owner') {
            return res.status(403).json({ message: 'Only restaurant owners can create restaurants' });
        }

        const restaurant = new Restaurant({
            name,
            description,
            cuisine,
            address,
            phone,
            email,
            owner: req.userId,
            deliveryFee,
            minimumOrder,
            estimatedDeliveryTime,
            operatingHours
        });

        await restaurant.save();

        res.status(201).json({
            message: 'Restaurant created successfully',
            restaurant
        });
    } catch (error) {
        console.error('Create restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user owns the restaurant
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Restaurant updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        console.error('Update restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check if user owns the restaurant
        if (restaurant.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
        }

        await Restaurant.findByIdAndDelete(req.params.id);

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Delete restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get restaurants by owner
const getRestaurantsByOwner = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ owner: req.userId })
            .sort({ createdAt: -1 });

        res.json(restaurants);
    } catch (error) {
        console.error('Get owner restaurants error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByOwner
}; 