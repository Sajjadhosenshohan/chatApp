const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true,},
    role: { type: String, enum: ['normal-user', 'admin'], default: 'normal-user' },
    avatar: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
