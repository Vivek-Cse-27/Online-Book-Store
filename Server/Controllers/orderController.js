const Order = require('../Models/order'); // Using default export from your file
const { Book } = require('../Models/book');

const placeOrder = async (req, res) => {
    const { items, totalAmount } = req.body;
    let serverTotal = 0;

    // Validate stock and price
    for (const item of items) {
        const book = await Book.findById(item.bookId);
        if (!book || book.stock < item.quantity) {
            return res.status(400).json({ error: `Not enough stock for ${book ? book.title : 'item'}` });
        }
        serverTotal += book.price * item.quantity;
    }

    if (serverTotal !== totalAmount) {
        return res.status(400).json({ error: "Price mismatch security check failed" });
    }

    // Deduct stock
    for (const item of items) {
        const book = await Book.findById(item.bookId);
        book.stock -= item.quantity;
        await book.save();
    }

    const order = new Order({ user: req.userId, items, totalAmount: serverTotal });
    await order.save();

    res.status(201).json({ message: "Order placed", orderId: order._id });
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.userId });
    res.json(orders);
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ date: -1 });
    res.json(orders);
};

module.exports = { placeOrder, getMyOrders, getAllOrders };