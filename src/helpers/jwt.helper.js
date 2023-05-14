import dotenv from 'dotenv';
import process from 'process';
import jwt from 'jsonwebtoken';

dotenv.config();
const key = process.env.JWT_SECRET_KEY;

export default {

    verify(token) {
        let payload = null;
        jwt.verify(token, key, (err, decoded) => {
            if (!err) payload = decoded;
        });
        return payload;
    },

    sign(payload) {
        const body = payload;
        body.createdAt = new Date().getTime();
        return jwt.sign(body, key);
    },

};
