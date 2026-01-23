const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// routes import
const authRoutes = require('./Routes/authRoutes');
const bookRoutes = require('./Routes/bookRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const cartRoutes = require('./Routes/cartRoutes');

// Middleware import
const { auth, admin } = require('./Middleware/authMiddleware');
const errorMiddleware = require('./Middleware/errorMiddleware');

const app = express();

// global Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Replace with your URI if using Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/online-bookstore')
  .then(() => console.log("Database Connected"))
  .catch(err => console.log("Database Error: ", err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Error Handling Middleware (should be the last middleware)
app.use(errorMiddleware);

const PORT = 5006;

// Change app.listen to use '0.0.0.0'
// This tells the server: "Listen to requests from ANY network interface, not just localhost"
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local Access: http://localhost:${PORT}`);
    // console.log(`Network Access: http://192.168.29.43:${PORT}`);
});
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const apiRoutes = require('./routes/api');
// app.use('/api', apiRoutes);