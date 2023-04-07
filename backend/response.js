const { user_roles } = require('./constants');
const log = require('./logger');

function success(res, result = 'OK', status = 200) {
	res.status(status).json({ status: status, success: true, response: result });
}

function error(res, status = 500, error = 'Some internal server error occurred') {
	res.status(status).json({ status: status, success: false, response: error });
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === user_roles.ADMIN) next();
    else return error(res, 401, 'You are not authorized');
}

function isSpaceAdmin(req, res, next) {
    if (req.user && req.user.role === user_roles.SPACE_ADMIN) next();
    else return error(res, 401, 'You are not authorized');
}

module.exports = {
    success,
    error,
    isAdmin,
    isSpaceAdmin,
}