const express = require('express');
const jwt = require('jsonwebtoken');
var { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwtVerify = require('../jwtVerify');

const { success, error, isAdmin } = require('../response.js');
const log = require('../logger');
const { user_roles } = require('../constants');
const saltRounds = 10;
var router = express.Router();

router
    .route('/')
    .post(
        [
            body('name')
                .exists({ checkFalsy: true, checkNull: true })
                .trim()
                .withMessage('Name is required to register'),
            body('email')
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Email is required to register')
                .trim()
                .isEmail()
                .withMessage('Email must be valid to register')
                .normalizeEmail(),
            body('password')
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Password is required to register'),
            body('role')
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Role is required to register'),
            body('organization')
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage('Space is required to register')
                .isMongoId()
                .withMessage('Space must be a valid Mongo ID'),
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
                        email,
                        password,
                        role,
                        organization
                    } = req.body;
                    if (password) password = password.trim();

                    let user = await userModel.findOne({ email: email });
                    if (user) {
                        error(res, 400, 'An account with this email already exists');
                    } else {
                        bcrypt.hash(password, saltRounds, async (err, hash) => {
                            if (err) {
                                log.error(err);
                                error(res);
                            } else {
                                let user = new userModel({
                                    name,
                                    email,
                                    password: hash,
                                    role,
                                    organization
                                });
                                await user.save();
                                success(res, 'User added successfully');
                            }
                        })
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .get(
        jwtVerify,
        isAdmin,
        async (req, res) => {
            try {
                let users = await userModel.find({}).populate('organization', 'name');;
                success(res, users);
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    );

router
    .route('/login')
    .post(
        [
            body('email').trim().isEmail().notEmpty().withMessage('Email is required'),
            body('password').isString().notEmpty().withMessage('Password is required'),
        ],
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    error(res, 422, errors?.array()[0]?.msg);
                } else {
                    let { email, password } = req.body;
                    let user = await userModel.findOne({ email: email }).populate('organization', 'name');;
                    if (!user) {
                        error(res, 404, 'User not found, please check the email');
                    } else {
                        bcrypt.compare(
                            password,
                            user.password,
                            async (err, result) => {
                                if (err) {
                                    log.error(err);
                                    return error(res);
                                }

                                if (!result) return error(res, 400, 'Incorrect Password');

                                let payload = { id: user._id };
                                let options = {
                                    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_IN_DAYS}d`,
                                };
                                const token = jwt.sign(
                                    payload,
                                    process.env.JWT_SECRET,
                                    options
                                );
                                res.cookie('jwt', token, {
                                    maxAge: process.env.ACCESS_TOKEN_COOKIE_EXPIRY_IN_MILLISECONDS,
                                    httpOnly: JSON.parse(process.env.COOKIE_HTTP_ONLY),
                                    secure: JSON.parse(process.env.COOKIE_SECURE),
                                    sameSite: "none"
                                });
                                success(res, {
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    organization: user.organization
                                });
                            }
                        )
                    }
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .delete(
        jwtVerify,
        async (req, res) => {
            try {
                res.clearCookie('jwt');
                success(res, 'Logged out successfully');
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    );

router
    .route('/:id')
    .get(
        jwtVerify,
        async (req, res) => {
            try {
                let { id } = req.params;
                let user = await userModel.findOne({
                    _id: id
                }).populate('organization', 'name');
                if (!user) {
                    error(res, 404, 'User not found, please check the id');
                } else {
                    success(res, {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        organization: user.organization
                    });
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .delete(
        jwtVerify,
        isAdmin,
        async (req, res) => {
            try {
                let { id } = req.params;
                let user = await userModel.findOne({
                    _id: id
                });
                if (!user) {
                    error(res, 404, 'User not found, please check the id');
                } else if(id === req.user?.id){
                    error(res, 400, 'Cannot delete yourself');
                } else {
                    await userModel.deleteOne({
                        _id: id
                    });
                    success(res, 'User deleted successfully');
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )
    .patch(
        jwtVerify,
        async (req, res) => {
            try {
                let { id } = req.params;
                const user = await userModel.findById(id).populate('organization', 'name');
                if (!user) {
                    error(res, 404, 'User not found, please check the id');
                } else {
                    const { name, password } = req.body;
                    if (!name && !password) {
                        error(res, 400, 'Name or password is required.');
                    }
                    if (password && req.user?.role !== user_roles.ADMIN) {
                        error(res, 401, 'Only admins can update password.');
                    }
                    if (name) {
                        user.name = name;
                        await user.save();
                    }
                    if (password) {
                        bcrypt.hash(password, saltRounds, async (err, hash) => {
                            if (err) {
                                log.error(err);
                                return error(res);
                            } else {
                                user.password = hash;
                                await user.save();
                            }
                        })
                    }
                    success(res, {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        organization: user.organization
                    });
                }
            } catch (err) {
                log.error(err);
                error(res);
            }
        }
    )

module.exports = router;

