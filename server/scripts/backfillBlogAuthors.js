import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

// Old blogs, created before author/visibility existed on the schema, have no
// `author` field and so are invisible to every author-scoped query. Assign
// them to a chosen user (defaults to the first user in the DB) and default
// their visibility to public so they show up again.
const run = async () => {
    await connectDB();

    const email = process.argv[2];
    const owner = email
        ? await User.findOne({ email: email.toLowerCase() })
        : await User.findOne().sort({ createdAt: 1 });

    if (!owner) {
        console.log('No user found to assign orphaned blogs to. Pass an email as an argument, or seed a user first.');
        await mongoose.disconnect();
        return;
    }

    const result = await Blog.updateMany(
        { author: { $exists: false } },
        { $set: { author: owner._id, authorName: owner.name, visibility: 'public' } }
    );

    console.log(`Assigned ${result.modifiedCount} orphaned blog(s) to ${owner.email}.`);
    await mongoose.disconnect();
};

run();
