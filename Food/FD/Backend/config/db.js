const mongoose = require('mongoose')
const LINK = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery'

const connectDB = async () => {
    try {
        await mongoose.connect(LINK);
        console.log("Successfully connected to MongoDB")
    }
    catch (err) {
        console.log("Database connection error:", err)
        process.exit(1)
    }
}

module.exports = connectDB 