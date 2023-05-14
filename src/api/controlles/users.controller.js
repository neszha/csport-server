import { UserModel } from '../../models/index.js';
import { responseHelper, jwtHelper } from '../../helpers/index.js';

const { badRequest, success } = responseHelper.api;

export default {

    /**
     * Method: GET
     */
    getSession(req, res) {
        // Send response.
        return res.json({ data: req.user });
    },

    /**
     * Method: POST
     */
    async register(req, res) {
        const {
            name, username, password, age, height, weight,
        } = req.body;

        // Validate password.
        if (!password || !name || !username || !age || !height || !weight) return badRequest(res);

        // Check username.
        const usernameCount = await UserModel.count({ username });
        if (usernameCount) return badRequest(res, 'Username telah digunakan!');

        // Generate and post user.
        const user = new UserModel(req.body);
        user.save().then(() => {
            success(res, 'Pendaftaran berhasil!');
        }).catch(() => {
            badRequest(res);
        });
        return true;
    },

    async login(req, res) {
        const { username, password } = req.body;

        // Validate body.
        if (!username || !password) return badRequest(res);

        // Get and validate account.
        const user = await UserModel.findOne({ username }, { name: 1, username: 1, password: 1 }).lean();
        if (!user || user.password !== password) return badRequest(res, 'Username atau password tidak valid!');

        // Generate token.
        const payload = {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
        };
        const token = jwtHelper.sign(payload);

        // Send response.
        return res.cookie('token', token)
            .json({ msg: 'Login berhasil.', token });
    },
    /**
     * Method: PUT
     */

    /**
     * Method: PATCH
     */
    // async updateBio(req, res) {
    //     const { _id } = req.user;
    //     const { name, gender, description } = req.body;

    //     // Validate body.
    //     if (!name || !gender) return badRequest(res);

    //     // Save body.
    //     const postBody = { name, gender, description };
    //     await UserModel.updateOne({ _id }, postBody).exec();

    //     // Send response.
    //     return res.json({ msg: 'Perubahan berhasil disimpan.' });
    // },

    /**
     * Method: DELETE
     */
    logout(req, res) {
        res.clearCookie('token').json({ msg: 'Logout berhasil.' });
    },
};
