import mongoose, { Schema } from 'mongoose';

const contentSchema = new Schema({
    _id: { auto: false },
    userId: {
        type: String, required: true,
    },
    content: {
        type: String, required: true,
    },
    time: {
        type: Number, default: 0,
    },
}, {
    timestamps: false,
});

const schema = new Schema({
    token: {
        type: String, required: true, index: true, // _id + random string.
    },
    myId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'users',
    },
    friendId: {
        type: Schema.Types.ObjectId, required: true, index: true, ref: 'users',
    },
    message: {
        type: String, required: true,
    },
    approved: {
        type: Boolean, required: true, default: false,
    },
    contents: [{ type: contentSchema }],
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('chats', schema);

export default Model;
