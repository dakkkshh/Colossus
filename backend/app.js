var express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
var mongoose = require('mongoose');
require('dotenv').config();

const { error } = require('./response');
const log = require('./logger');

var app = express();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    log.info('Connected to DB!');
})
.catch (err => {
    log.error(`DB Connection Error: ${err.message}`);
});


mongoose.connection.on('reconnect', () => {
	log.info('Reconnected to DB!');
});

mongoose.connection.on('disconnected', () => {
	log.error(`DB disconnected ${new Date()}`);
});


app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(logger('dev'));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: false }));
app.use(cookieParser());

//Maintain Verified User
app.use((req, res, next) => {
	if (req.cookies['jwt']) {
		jwt.verify(
			req.cookies['jwt'],
			process.env.JWT_SECRET,
			async (err, decoded) => {
				if (err) {
					res.clearCookie('jwt');
					return error(res, 401, 'Unauthorized');
				}
				try {
					return next();
				} catch (err) {
					log.error(err);
					res.clearCookie('jwt');
					error(res, 500, 'Internal server error');
				}
			}
		);
	} else {
        next();
	}
});

module.exports = app;