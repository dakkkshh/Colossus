const express = require('express');
const jwt = require('jsonwebtoken');
var { body, validationResult } = require('express-validator');
const spaceModel = require('../models/spaceModel');
const seatModel = require('../models/seatModel');
const bookingModel = require('../models/bookingModel');
const jwtVerify = require('../jwtVerify');
const {emitToAllClients} = require('../socket');

const { success, error, isAdmin } = require('../response.js');
const log = require('../logger');
const { user_roles } = require('../constants');

var router = express.Router();

router
    .route('/')
    .post(
        [
            
        ]
    )


module.exports = router;