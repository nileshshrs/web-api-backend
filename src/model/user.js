import mongoose from 'mongoose';
import { hash, compare } from '../utils/bcrypt.js'; // Assuming both `hash` and `compare` are utility functions you have for password hashing and comparison

// Define the User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,  // Corrected from `boolean` to `Boolean` (Mongoose type)
        default: false,
    },
    image: {
        type: [String],  // Corrected from `string` to `String` (Mongoose type)
        default: ["https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg"],
    },
    bio: {
        type: String,
        default: '',
    },

});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Skip hashing if the password field hasn't changed
    // Hash the password before saving
    this.password = await hash(this.password);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (val) {
    return compare(val, this.password);  // Assumes `compare` method from your bcrypt utility
};

// Method to omit the password field from the returned object
userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Create and export the model
export const userModel = mongoose.model('User', userSchema);
