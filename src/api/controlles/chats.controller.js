import randomstring from 'randomstring';
import { UserModel, ChatModel } from '../../models/index.js';
import { responseHelper, validatorHelper } from '../../helpers/index.js';

const { isObjectId } = validatorHelper;
const { badRequest, notFound, methodNotAllowed } = responseHelper.api;

export default {

    /**
     * Method: GET
     */
    async getChats(req, res) {
        const { user } = req;
        const { chatId } = user;
        const { userId } = req.params;

        // Validate id and body.
        if (!isObjectId(userId)) return badRequest(res);

        // Get chat data.
        const chat = await ChatModel.findOne(
            { _id: chatId, $or: [{ myId: userId }, { friendId: userId }] },
            { message: 0, approved: 0 },
        ).populate({
            path: 'myId',
            select: 'name username',
        }).populate({
            path: 'friendId',
            select: 'name username',
        }).lean();
        if (!chat) return notFound(res);

        // Rebuild chat data.
        chat.users = {};
        chat.users[chat.myId._id] = chat.myId;
        chat.users[chat.friendId._id] = chat.friendId;
        delete chat.myId; delete chat.friendId;

        // Send response.
        return res.json({ data: chat });
    },

    /**
     * Method: POST
     */
    async requestToChat(req, res) {
        const { user } = req;
        const { userId } = req.params;
        const { message } = req.body;

        // Validate id and body.
        if (!isObjectId(userId)) return badRequest(res);
        if (!message) return badRequest(res);

        // Get friend.
        const friend = await UserModel.findOne({ _id: userId }, { name: 1, gender: 1 }).lean();
        if (!friend) return notFound(res);

        // Create chat session.
        const chatToken = randomstring.generate(52);
        const chat = new ChatModel({
            token: chatToken,
            myId: user._id,
            friendId: friend._id,
            message,
        });
        await chat.save();

        // Send request data to friend via socket.
        if (global.io) {
            const emiterKey = `chat-request:${userId}`;
            const data = { user, message };
            global.io.to('room:socket').emit(emiterKey, data);
        }

        // Send response.
        return res.json({ data: chat });
    },

    async acceptChatRequest(req, res) {
        const { user } = req;
        const { accept, chatId } = req.body;

        // Validate id.
        if (!isObjectId(chatId)) return badRequest(res);

        // Get chat data.
        const chat = await ChatModel.findOne({ _id: chatId }, { contents: 0 }).lean();
        if (!chat) return notFound(res);

        // Handdle accept status request.
        const userIds = [user._id, chat.friendId, chat.myId];
        if (accept) {
            // Update apporved status.
            await ChatModel.updateOne({ _id: chatId }, { approved: true }).exec();

            // Connect chatId to each users.
            await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: chat._id }).exec();

            // Send accept info via socket.
            if (global.io) {
                const emiterKey = `accept-chat:${chatId}`;
                const data = { accept };
                global.io.to('room:socket').emit(emiterKey, data);
            }
        } else {
            // End the chat session. (remove chat record)
            await ChatModel.deleteOne({ _id: chatId }).exec();

            // Disconnect chatid in each users.
            await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: null }).exec();

            // Send denial info via socket.
            if (global.io) {
                const emiterKey = `accept-chat:${chatId}`;
                const data = { accept };
                global.io.to('room:socket').emit(emiterKey, data);
            }
        }

        // Send response.
        return res.json({ data: { accept } });
    },

    async sendChatText(req, res) {
        const { user } = req;
        const { userId } = req.params;
        const { content } = req.body;

        // Validate id and body.
        if (!isObjectId(userId) || !content) return badRequest(res);

        // Get chat data.
        const { chatId } = user;
        const chat = await ChatModel.findOne({ _id: chatId });
        if (!chat) return methodNotAllowed(res);
        const contentBody = {
            userId: user._id.toString(),
            content,
            time: new Date().getTime(),
        };
        chat.contents.push(contentBody);
        await chat.save();

        // Send info via socker.
        //

        // Send response.
        return res.json({ msg: 'success', content });
    },

    async endChat(req, res) {
        const { user } = req;
        const { userId, chatId } = req.params;

        // Validate id.
        if (!isObjectId([userId, chatId])) return badRequest(res);

        // Get chat data.
        const userIds = [userId, user._id];
        const chat = await ChatModel.findOne({
            _id: chatId,
            $or: [
                { myId: { $in: userIds } },
                { friendId: { $in: userIds } },
            ],
        }, { contents: 0 }).lean();
        if (!chat) return notFound(res);

        // Disconnect chatId in each users.
        await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: null }).exec();

        // Delete chat records.
        await ChatModel.deleteOne({ _id: chatId }).exec();

        // Send info via socker.
        //

        // Send response.
        return res.json({ data: chat });
    },

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
