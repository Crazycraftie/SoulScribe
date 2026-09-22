import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../configs/db.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const run = async () => {
    await connectDB();

    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set, nothing to seed.');
        await mongoose.disconnect();
        return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
        console.log(`User ${email} already exists, skipping.`);
        await mongoose.disconnect();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name: 'Admin', email, password: hashedPassword });
    console.log(`Seeded admin user ${email}.`);
    await mongoose.disconnect();
};

run();
