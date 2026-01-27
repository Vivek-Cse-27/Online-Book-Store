const mongoose = require('mongoose');
const User = require('./Models/user');

async function makeAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/online-bookstore');
        const email = 'subhabratapaul277@gmail.com';
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`Success! User ${email} is now an ADMIN.`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin();
