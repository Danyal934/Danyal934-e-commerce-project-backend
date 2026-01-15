const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123';

        // Check if admin exists
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin already exists');
            // Update to ensure role is admin if it exists
            userExists.role = 'admin';
            await userExists.save();
            console.log('Updated existing user to admin');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log(`Admin created: Email: ${adminEmail}, Password: ${adminPassword}`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
