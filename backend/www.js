require('dotenv').config();
var app = require('./app');
var log = require('./logger');
var http = require('http');
const socketIO = require('socket.io');
const spaceModel = require('./models/spaceModel');
const bookingModel = require('./models/bookingModel');
const {initSocket} = require('./socket');
const { booking_status } = require('./constants');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: `${process.env.APP_HOME}`,
		methods: ['GET', 'POST'],
	}
});
initSocket(io);

io.on('connection', (socket) => {
	// log.info('A client connected');
	socket.on('getInitialHomeData', async (id) => {
		try {
			let space = await spaceModel.findById(id).populate('seats');
			if (!space){
				log.error('Space not found');
			} else {
				socket.emit('initialHomeData', space);
			}
		} catch (error) {
			log.error('Failed to fetch data:', error);
		}
	});
	socket.on('fetchUpdatedHomeData', async (id) => {
		try {
			let space = await spaceModel.findById(id).populate('seats');
			if (!space){
				log.error('Space not found');
			} else {
				socket.emit('updatedHomeData', space);
			}
		} catch (error) {
			log.error('Failed to fetch data:', error);
		}	
	});
	socket.on('getInitialBookinData', async (id) => {
		try {
			let approvedBookings = await bookingModel.find({
				space: id,
				bookingStatus: booking_status.APPROVED,
			}).sort({createdAt: -1}).populate('seat');

			let pastBookings = await bookingModel.find({
				space: id,
				bookingStatus: booking_status.COMPLETED,
			}).sort({createdAt: -1}).populate('seat');

			if (approvedBookings && pastBookings) {
				socket.emit('initialBookingData', {
					approvedBookings,
					pastBookings,
					space_id: id,
				});
			} else {
				log.error('Booking not found');
			}
		} catch (error) {
			log.error('Failed to fetch data:', error);
		}	
	});
	socket.on('fetchUpdatedBookData', async (id) => {
		try {
			let approvedBookings = await bookingModel.find({
				space: id,
				bookingStatus: booking_status.APPROVED,
			}).sort({createdAt: -1}).populate('seat');

			let pastBookings = await bookingModel.find({
				space: id,
				bookingStatus: booking_status.COMPLETED,
			}).sort({createdAt: -1}).populate('seat');

			if (approvedBookings && pastBookings) {
				socket.emit('updatedBookData', {
					approvedBookings,
					pastBookings,
					space_id: id,
				});
			} else {
				log.error('Booking not found');
			}
		} catch (error) {
			log.error('Failed to fetch data:', error);
		}		
	});
	socket.on('disconnect', () => {
		// log.info('A client disconnected');
	});
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	log.debug('Listening on ' + bind);
}
