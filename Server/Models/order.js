// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            bookId: { type: String, required: true },
            title: { type: String },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Shipped, Delivered
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);