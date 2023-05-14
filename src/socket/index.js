import process from 'process';
import { UserModel } from '../models/index.js';

const devMode = (process.env.NODE_ENV === 'development');

const init = (io) => {
    // Register io to global io state.
    global.io = io;

    // Watch client connection.
    io.on('connection', (socket) => {
        if (devMode) console.log(`==> ${socket.id}`);

        // Set online user.
        const { userId } = socket.handshake.auth;
        if (userId) UserModel.updateOne({ _id: userId }, { isOnline: true }).exec();

        // Register to room.
        if (userId) socket.join('room:socket');

        // Disconnecting client handdle.
        socket.on('disconnect', () => {
            if (devMode) console.log(`<== ${socket.id}`);

            // Set offline user.
            if (userId) {
                UserModel.updateOne({ _id: userId }, { isOnline: false }).exec();
            }
        });
    });
};

export default { init };
