import morgan from 'morgan';
import process from 'process';
import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { authMiddleware } from '../middlewares/index.js';
import { usersController, friendsController, chatsController } from '../controlles/index.js';

/** Endpoint level: /api/ */
const devMode = (process.env.NODE_ENV === 'development');
const api = Router();

/** Middlewhare express in api level. */
if (devMode) api.use(morgan('tiny'));
api.use(bodyParser.json());
api.use(cookieParser());
api.use(fileUpload());

api.get('/', (req, res) => res.json({ msg: 'Api is ready!' }));

/**
 * Auth resources.
 */
api.post('/auth/login', usersController.login);
api.delete('/auth/logout', usersController.logout);

/**
 * Friends resources.
 */
api.get('/friends', authMiddleware.asUser, friendsController.getFriendsByRadius);
api.get('/friends/:userId', authMiddleware.asUser, friendsController.getFriendsById);

/**
 * Chats resources.
 */
api.get('/friends/:userId/chats', authMiddleware.asUser, chatsController.getChats);
api.post('/friends/:userId/chats', authMiddleware.asUser, chatsController.sendChatText);
api.post('/friends/:userId/chats/request', authMiddleware.asUser, chatsController.requestToChat);
api.delete('/friends/:userId/chats/:chatId', authMiddleware.asUser, chatsController.endChat);

/**
 * Me resources.
 */
api.get('/me', authMiddleware.asUser, usersController.getSession);
api.post('/me/picture', authMiddleware.asUser, usersController.updatePicture);
api.post('/me/accept-request', authMiddleware.asUser, chatsController.acceptChatRequest);
api.patch('/me/bio', authMiddleware.asUser, usersController.updateBio);
api.patch('/me/locations', authMiddleware.asUser, usersController.updateLocations);

/**
 * Users resources.
 */
api.post('/users/register', usersController.register);

/** Route 404 */
api.use((req, res) => {
    res.statusCode = 404;
    res.json({ msg: 'API tidak ditemukan!' });
});

export default api;
