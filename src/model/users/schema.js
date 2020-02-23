const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'user' },
    email: { type: String, requitrd: true },
    token: { type: String, required: true },
    dob: { type: Date, required: true },
    status: { type: String, default: 'active' },
    password: { type: String, required: true },
    attempts: { type: Number, default: 0 }
});

/**
 * to save date and time
 */
userSchema.pre('save', function(next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
