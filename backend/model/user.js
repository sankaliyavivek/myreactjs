const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },  googleAccessToken: { type: String }, // Store Google access token
    googleRefreshToken: { type: String },// Store refresh token
    googleCalendarEnabled: { type: Boolean, default: false } 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;