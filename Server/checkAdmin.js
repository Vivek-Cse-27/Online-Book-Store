const mongoose = require('mongoose');
const User = require('./Models/User');

async function checkAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/online-bookstore');
        const users = await User.find({});
        if (users.length > 0) {
            console.log('Users Found:');
            users.forEach(u => console.log(`- Email: ${u.email}, Role: ${u.role}`));
        } else {
            console.log('No users found in the database.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
