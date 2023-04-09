const express = require('express');
const jwt = require('jsonwebtoken');
var { body, validationResult } = require('express-validator');
const spaceModel = require('../models/spaceModel');
const seatModel = require('../models/seatModel');
const jwtVerify = require('../jwtVerify');
const {emitToAllClients} = require('../socket');

const { success, error, isAdmin } = require('../response.js');
const log = require('../logger');
const { user_roles } = require('../constants');
const bookingModel = require('../models/bookingModel');

var router = express.Router();

router
    .route('/')
    .post(
        [
            body('name')
                .exists({ checkFalsy: true, checkNull: true })
                .trim()
                .withMessage('Name is required to register'),
            body('isWifi')
                .exists({ checkNull: true })
                .withMessage('Wifi info is required to register')
                .isBoolean()
                .withMessage('Wifi info must be a boolean'),
            body('isComputers')
                .exists({ checkNull: true })
                .withMessage('Computers info is required to register')
                .isBoolean()
                .withMessage('Computers info must be a boolean'),
            body('isAc')
                .exists({ checkNull: true })
                .withMessage('AC info is required to register')
                .isBoolean()
                .withMessage('AC info must be a boolean'),
            body('seats')
                .exists({ checkNull: true })
                .withMessage('Seats info is required to register'),
        ],
        jwtVerify,
        isAdmin,
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    error(res, 422, errors?.array()[0]?.msg);
                } else {
                    let {
                        name,
                        isWifi,
                        isComputers,
                        isAc,
                        seats
                    } = req.body;
                    let space = await spaceModel.findOne({
                        name: { $regex: new RegExp(name, 'i') }
                    })
                    if (space) {
                        error(res, 400, 'A space with this name already exists');
                    } else {
                        if (seats.total_seats < seats.electricity_computers + seats.computers_only + seats.electricity_only) {
                            error(res, 400, 'Seats calculations are incorrect');
                        } else {
                            space = new spaceModel({
                                name,
                                isWifi,
                                isComputers,
                                isAc
                            });
                            await space.save();
                            let seatArray = [];
                            let used_seats = 0;
                            if (seats.electricity_computers > 0) {
                                for (let i = 1; i <= seats.electricity_computers; i++) {
                                    const seatName = `A${i}`;
                                    let seat = new seatModel({
                                        seatNumber: seatName,
                                        space: space._id,
                                        isElectricity: true,
                                        isComputer: true
                                    });
                                    await seat.save();
                                    seatArray.push(seat._id);
                                }
                                used_seats += seats.electricity_computers
                            }
                            if (seats.computers_only > 0) {
                                for (let i = 1; i <= seats.computers_only; i++) {
                                    const seatName = `B${i}`;
                                    let seat = new seatModel({
                                        seatNumber: seatName,
                                        space: space._id,
                                        isElectricity: false,
                                        isComputer: true
                                    });
                                    await seat.save();
                                    seatArray.push(seat._id);
                                }
                                used_seats += seats.computers_only
                            }
                            if (seats.electricity_only > 0) {
                                for (let i = 1; i <= seats.electricity_only; i++) {
                                    const seatName = `C${i}`;
                                    let seat = new seatModel({
                                        seatNumber: seatName,
                                        space: space._id,
                                        isElectricity: true,
                                        isComputer: false
                                    });
                                    await seat.save();
                                    seatArray.push(seat._id);
                                }
                                used_seats += seats.electricity_only
                            }
                            if (seats.total_seats > 0) {
                                for (let i = 1; i <= seats.total_seats - used_seats; i++) {
                                    const seatName = `D${i}`;
                                    let seat = new seatModel({
                                        seatNumber: seatName,
                                        space: space._id,
                                        isElectricity: false,
                                        isComputer: false
                                    });
                                    await seat.save();
                                    seatArray.push(seat._id);
                                }
                            }
                            space.seats = seatArray;
                            await space.save();
                            success(res, space);
                        }
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .get(
        async (req, res) => {
            try {
                let { populateSeats, includeColossus } = req.query;
                if (populateSeats === '1') {
                    if (includeColossus === '1') {
                        const spaces = await spaceModel.find({}).populate('seats');
                        success(res, spaces);
                    } else {
                        const spaces = await spaceModel.find(
                            { name: { $not: { $regex: /colossus/i } } }
                        ).populate('seats');
                        success(res, spaces);
                    }
                } else {
                    if (includeColossus === '1') {
                        const spaces = await spaceModel.find({});
                        success(res, spaces);
                    } else {
                        const spaces = await spaceModel.find(
                            { name: { $not: { $regex: /colossus/i } } }
                        );
                        success(res, spaces);
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    );

router
    .route('/:id')
    .delete(
        jwtVerify,
        isAdmin,
        async (req, res) => {
            try {
                let { id } = req.params;
                let space = await spaceModel.findById(id);
                if (!space) {
                    error(res, 404, 'Space not found');
                } else if (space.name?.toLowerCase().includes('colossus')) {
                    error(res, 400, 'Cannot delete Colossus');
                } else {
                    await spaceModel.findByIdAndDelete(id);
                    for (let i = 0; i < space.seats?.length; i++) {
                        await seatModel.findByIdAndDelete(space.seats[i]);
                    }
                    await bookingModel.deleteMany({
                        space: id
                    });
                    success(res, 'Space deleted successfully');
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .get(
        jwtVerify,
        async (req, res) => {
            try {
                let { id } = req.params;
                let { populateSeats } = req.query;
                if (populateSeats === '1') {
                    let space = await spaceModel.findById(id).populate('seats');
                    if (!space) {
                        error(res, 404, 'Space not found');
                    } else if (space.name?.toLowerCase().includes('colossus') && req.user?.role !== user_roles.ADMIN) {
                        error(res, 400, 'Only Admins can access this document');
                    } else {
                        success(res, space);
                    }
                } else {
                    let space = await spaceModel.findById(id);
                    if (!space) {
                        error(res, 404, 'Space not found');
                    } else if (space.name?.toLowerCase().includes('colossus') && req.user?.role !== user_roles.ADMIN) {
                        error(res, 400, 'Only Admins can access this document');
                    } else {
                        success(res, space);
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )



module.exports = router;