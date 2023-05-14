import process from 'process';
import { UserModel } from '../../models/index.js';
import { userService } from '../services/index.js';
import { responseHelper, jwtHelper, fileHelper } from '../../helpers/index.js';

const ROOT = process.cwd();
const { badRequest, success } = responseHelper.api;

export default {

    /**
     * Method: GET
     */
    getSession(req, res) {
        const userData = req.user;

        // FIlter profile piecute.
        userData.picture = userService.buildUserPicture(userData.picture);

        // Send response.
        return res.json({ data: req.user });
    },

    /**
     * Method: POST
     */
    async register(req, res) {
        const { body } = req;

        // Validate password.
        if (!body.password) return badRequest(res);
        if (body.password !== body.passwordRepeat) return badRequest(res, 'Password tidak sama!');

        // Check username.
        const usernameCount = await UserModel.count({ username: body.username });
        if (usernameCount) return badRequest(res, 'Username telah digunakan!');

        // Generate and post user.
        const user = new UserModel(body);
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

    async updatePicture(req, res) {
        const { _id } = req.user;
        const picture = (req.files) ? req.files.picture : null;
        const dirPictures = `${ROOT}/storage/pictures/`;

        // Remove picture.
        if (!picture) {
            if (req.user.picture) {
                const oldPicturePath = dirPictures + req.user.picture;
                fileHelper.destroy(oldPicturePath);
            }
            await UserModel.updateOne({ _id }, { picture: null }).exec();
            return success(res, 'Foto profil terhapus!');
        }

        // Save picture data.
        const fileName = `${_id.toString()}.png`;
        const filePath = `${dirPictures}${fileName}`;
        fileHelper.saveFile(filePath, picture.data);

        // Save picture path.
        await UserModel.updateOne({ _id }, { picture: fileName }).exec();

        // Send response.
        return success(res, 'Foto profil terupdate!');
    },

    /**
     * Method: PUT
     */

    /**
     * Method: PATCH
     */
    async updateBio(req, res) {
        const { _id } = req.user;
        const { name, gender, description } = req.body;

        // Validate body.
        if (!name || !gender) return badRequest(res);

        // Save body.
        const postBody = { name, gender, description };
        await UserModel.updateOne({ _id }, postBody).exec();

        // Send response.
        return res.json({ msg: 'Perubahan berhasil disimpan.' });
    },

    async updateLocations(req, res) {
        const { _id } = req.user;
        const { coords } = req.body;

        // Validate body.
        if (!coords) return badRequest(res);

        // Save new location.
        const postBody = { locations: coords };
        await UserModel.updateOne({ _id }, postBody).exec();

        // Send response.
        return res.json({ msg: 'Perubahan berhasil disimpan.' });
    },

    /**
     * Method: DELETE
     */
    logout(req, res) {
        res.clearCookie('token').json({ msg: 'Logout berhasil.' });
    },
};
