const mongoose = require('mongoose');
const { seat_status } = require('../constants')

const seatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type: String,
            required: true,
        },
        seatStatus: {
            type: String,
            enum: [seat_status.AVAILABLE, seat_status.RESERVED, seat_status.OCCUPIED],
            default: seat_status.AVAILABLE,
            required: true,
        },
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'space',
        },
        isElectricity: {
            type: Boolean,
            default: false,
            required: true,
        },
        isComputer: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const seatModel = mongoose.model('seat', seatSchema);
module.exports = seatModel;