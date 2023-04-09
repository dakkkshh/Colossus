const mongoose = require('mongoose');
const { booking_status } = require('../constants')

const bookingSchema = new mongoose.Schema(
    {
        roll_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        bookingStatus: {
            type: String,
            enum: [booking_status.PENDING, booking_status.APPROVED, booking_status.CANCELLED, booking_status.COMPLETED],
            default: booking_status.PENDING,
        },
        seat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'seat',
            default: null,
        },
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'space',
        },
        expiresAt: {
            type: String,
            required: true,
        },
        timeOpted: {
            type: String,
            required: true,
        },
        isElectricityOpted: {
            type: Boolean,
            default: false,
        },
        isComputerOpted: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            default: 0
        },
        isEmailSent: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const bookingModel = mongoose.model('booking', bookingSchema);
module.exports = bookingModel;