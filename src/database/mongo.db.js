import dotenv from 'dotenv';
import process from 'process';
import mongoose from 'mongoose';
import events from '../events.js';

/** Create connections to MongoDB. */
dotenv.config();
const connection = process.env.MONGO_CONNECTION;
mongoose.set('runValidators', true);
mongoose.set('strictQuery', true);

events.on('server-ready', (options = {}) => {
    mongoose.connect(connection).then(() => {
        events.emit('mongodb-connected');
        if (!options.quiet) console.log('Connected to MongoDB Server.');
    }).catch((err) => {
        console.log(err);
        process.exit();
    });
});
