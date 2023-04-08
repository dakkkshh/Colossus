const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        isWifi: {
            type: Boolean,
            default: false,
            required: true,
        },
        isComputers: {
            type: Boolean,
            default: false,
            required: true,
        },
        isAc: {
            type: Boolean,
            default: false,
            required: true,
        },
        seats: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'seat',
            default: [],
        },
        isPaid: {
            type: Boolean,
            default: false,
            required: true,
        },
        prices: {
            type: [Number],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

const spaceModel = mongoose.model('space', spaceSchema);
module.exports = spaceModel;