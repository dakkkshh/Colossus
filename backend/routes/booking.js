const express = require('express');
const jwt = require('jsonwebtoken');
var { body, validationResult } = require('express-validator');
const spaceModel = require('../models/spaceModel');
const seatModel = require('../models/seatModel');
const bookingModel = require('../models/bookingModel');
const jwtVerify = require('../jwtVerify');
const { emitToAllClients } = require('../socket');

const { success, error, isAdmin } = require('../response.js');
const log = require('../logger');
const { user_roles, seat_status } = require('../constants');
const { booking_status } = require('../constants');

var router = express.Router();

router
    .route('/')
    .post(
        [
            body('roll_number')
                .isString()
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Roll number is required'),
            body('email')
                .isEmail()
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Email is required'),
            body('space')
                .isMongoId()
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Space is required'),
            body('expiresAt')
                .isString()
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Expires at is required'),
            body('timeOpted')
                .isString()
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Time opted is required'),
            body('isElectricityOpted')
                .isBoolean()
                .optional(),
            body('isComputerOpted')
                .isBoolean()
                .optional(),
        ],
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    error(res, 422, errors?.array()[0]?.msg);
                } else {
                    let {
                        roll_number,
                        email,
                        space,
                        expiresAt,
                        timeOpted,
                        isElectricityOpted,
                        isComputerOpted,
                    } = req.body;

                    let booking = await bookingModel.findOne({
                        $or: [
                            { roll_number: roll_number },
                            { email: email },
                        ],
                        bookingStatus: booking_status.APPROVED,
                    });
                    if (booking) {
                        error(res, 422, 'Booking already exists');
                    } else {
                        let selectedSpace = await spaceModel.findById(space).populate('seats');
                        if (selectedSpace) {
                            if (isComputerOpted && !selectedSpace.isComputers){
                                error(res, 422, 'Computer is not available');
                            }else {
                                let selectedPriority = '';
                                let priorities = ['A', 'B', 'C', 'D'];
                                if (isElectricityOpted && isComputerOpted) selectedPriority = 'A'
                                else if (isComputerOpted) selectedPriority = 'B'
                                else if (isElectricityOpted) selectedPriority = 'C'
                                else selectedPriority = 'D'

                                let priorityIndex = priorities.indexOf(selectedPriority);
                                let selectedSeat = null;
                                for (let i = priorityIndex; i < priorities.length; i++) {
                                    selectedSeat = selectedSpace?.seats.find(seat => seat.seatNumber.charAt(0) === priorities[i] && seat.seatStatus === seat_status.AVAILABLE);
                                    if (selectedSeat) break;
                                }
                                if (!selectedSeat) {
                                    for (let i = priorityIndex - 1; i >= 0; i--) {
                                        selectedSeat = selectedSpace?.seats.find(seat => seat.seatNumber.charAt(0) === priorities[i] && seat.seatStatus === seat_status.AVAILABLE);
                                        if (selectedSeat) break;
                                    }
                                }
                                if (!selectedSeat) {
                                    for (let i = priorityIndex - 1; i >= 0; i--) {
                                        selectedSeat = selectedSpace?.seats.find(seat => seat.seatStatus === seat_status.AVAILABLE);
                                        if (selectedSeat) break;
                                    }   
                                }
                                if (!selectedSeat) {
                                    error(res, 422, 'No seat available');
                                } else {
                                    selectedSeat.seatStatus = seat_status.RESERVED;
                                    await selectedSeat.save();
                                    let booking = new bookingModel({
                                        roll_number,
                                        email,
                                        bookingStatus: booking_status.APPROVED,
                                        seat: selectedSeat._id,
                                        space,
                                        expiresAt,
                                        timeOpted,
                                        isElectricityOpted,
                                        isComputerOpted,
                                    });
                                    await booking.save();
                                    emitToAllClients('getUpdatedHomeData', selectedSpace?._id);
                                    emitToAllClients('getUpdatedBookData', selectedSpace?._id);
                                    success(res, booking);
                                }
                            }
                        } else {
                            error(res, 404, 'Space not found');
                        }
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    );
router
    .route('/confirm/:id')
        .get(
            async (req, res) => {
                try {
                    const {id} = req.params;
                    const booking = await bookingModel.findById(id).populate('seat');
                    if (booking) {
                        booking.seat.seatStatus = seat_status.OCCUPIED;
                        await booking.seat.save();
                        emitToAllClients('getUpdatedHomeData', booking?.space);
                        emitToAllClients('getUpdatedBookData', booking?.space);
                        return res.redirect(process.env.APP_HOME + '/booking-confirmed');
                    } else {
                        error(res, 404, 'Booking not found');
                    }
                } catch (err) {
                    log.error(err);
                    error(res);
                } 
            }
        );
module.exports = router;