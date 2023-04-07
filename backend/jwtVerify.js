const { error } = require('./response');

function jwtVerify(req, res, next) {
	if (req.user && req.user._id) next();
	else return error(res, 401, 'You are not authorized');
}

module.exports = jwtVerify;
