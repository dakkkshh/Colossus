let io;

const initSocket = (socketIO) => {
    io = socketIO;
};

const emitToAllClients = (event, data) => {
    io.emit(event, data);
};

module.exports = { initSocket, emitToAllClients };