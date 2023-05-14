import morgan from 'morgan';
import process from 'process';
import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authMiddleware } from '../middlewares/index.js';
import { usersController } from '../controlles/index.js';

/** Endpoint level: /api/ */
const devMode = (process.env.NODE_ENV === 'development');
const api = Router();

/** Middlewhare express in api level. */
if (devMode) api.use(morgan('tiny'));
api.use(bodyParser.json());
api.use(cookieParser());

api.get('/', (req, res) => res.json({ msg: 'Api is ready!' }));

/**
 * Auth resources.
 */
api.post('/auth/login', usersController.login);
api.delete('/auth/logout', usersController.logout);

/**
 * Me resources.
 */
api.get('/me', authMiddleware.asUser, usersController.getSession);
api.put('/me/location', authMiddleware.asUser, usersController.updatePosition);

/**
 * Users resources.
 */
api.get('/users', usersController.getUsers); // Register
api.post('/users', usersController.register); // Register

/** Route 404 */
api.use((req, res) => {
    res.statusCode = 404;
    res.json({ msg: 'API tidak ditemukan!' });
});

export default api;
