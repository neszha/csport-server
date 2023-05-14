import geolib from 'geolib';
import { UserModel } from '../../models/index.js';
import { userService } from '../services/index.js';
import { responseHelper, validatorHelper } from '../../helpers/index.js';

const { isObjectId } = validatorHelper;
const { badRequest, notFound } = responseHelper.api;

export default {

    /**
     * Method: GET
     */
    async getFriendsByRadius(req, res) {
        const { _id } = req.user;
        const radius = Number(req.query.radius) || 1;
        const myLocation = req.user.locations;

        // Get friends.
        const friends = await UserModel.find({ isOnline: true, _id: { $ne: _id } }, {
            password: 0, createdAt: 0, updatedAt: 0, forTest: 0,
        }).lean();
        friends.forEach((friend) => {
            const { latitude, longitude } = friend.locations;
            const distance = geolib.getDistance(
                { latitude: myLocation.latitude, longitude: myLocation.longitude },
                { latitude, longitude },
            ); // M
            friend.locations = { latitude, longitude };
            friend.distance = distance / 1000 || 0; // KM
            friend.picture = userService.buildUserPicture(friend.picture);
        });

        // Filter friends base on radius.
        const friends1 = friends.filter((item) => item.distance <= radius);

        // Sort friends base on distance.
        const friends2 = friends1.sort((a, b) => a.distance - b.distance);

        // Send respnse.
        return res.json({ radius, friends: friends2 });
    },

    async getFriendsById(req, res) {
        const { userId } = req.params;
        const myLocation = req.user.locations;

        // Validate id.
        if (!isObjectId(userId)) return badRequest(res);

        // Get friend data.
        const friend = await UserModel.findOne({ _id: userId }, { password: 0, forTest: 0 }).lean();
        if (!friend) return notFound(res);
        friend.picture = userService.buildUserPicture(friend.picture);
        const { latitude, longitude } = friend.locations;
        friend.locations = { latitude, longitude };

        // Calculate distance.
        const distance = geolib.getDistance(
            { latitude: myLocation.latitude, longitude: myLocation.longitude },
            { latitude, longitude },
        ); // M
        friend.distance = distance / 1000 || 0; // KM

        // Send respnse.
        return res.json({ data: friend });
    },

    /**
     * Method: POST
     */

    /**
     * Method: PUT
     */

    /**
     * Method: PATCH
     */

    /**
     * Method: DELETE
     */
};
