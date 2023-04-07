const mongoose = require('mongoose');
const { user_roles } = require('../constants')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [user_roles.ADMIN, user_roles.SPACE_ADMIN, user_roles.USER],
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'space',
        required: true,
    }
},
{
    timestamps: true,
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;