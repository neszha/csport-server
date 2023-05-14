import { UserModel } from '../../models/index.js';
import { responseHelper, jwtHelper, validatorHelper } from '../../helpers/index.js';

const { isObjectId } = validatorHelper;
const { unauthorized } = responseHelper.api;

export default {

    /**
     * Level 1: For access dashboard user (verified user).
     *
     * Rule as: user
     */
    async asUser(req, res, next) {
        // Get token in cookies.
        const { token } = req.cookies;

        // Validate and decoded token.
        if (!token) return unauthorized(res);
        const payload = jwtHelper.verify(token);
        if (!payload) return unauthorized(res);

        // Get user info.
        if (!isObjectId(payload.id)) return unauthorized(res);
        const user = await UserModel.findOne({ _id: payload.id }, { password: 0 }).lean();
        if (!user) return unauthorized(res);
        req.user = user;

        // Next steps.
        req.payload = payload;
        return next();
    },

};
