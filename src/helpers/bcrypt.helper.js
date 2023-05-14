import bcrypt from 'bcrypt';

export default {

    hash(password) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(password, salt);
        return passwordHash;
    },

    compare(password, hashed) {
        return bcrypt.compareSync(password, hashed);
    },

};
