import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    name: {
        type: String, required: true,
    },
    picture: {
        type: String, default: null,
    },
    gender: {
        type: String,
        required: true,
        enum: ['man', 'woman', 'anonym'],
        default: 'anonym',
    },
    description: {
        type: String, default: null,
    },
    username: {
        type: String, required: true, index: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    locations: {
        accuracy: {
            type: Number, default: 0,
        },
        altitude: {
            type: Number, default: 0,
        },
        altitudeAccuracy: {
            type: Number, default: 0,
        },
        heading: {
            type: Number, default: 0,
        },
        latitude: {
            type: Number, index: true, default: 0,
        },
        longitude: {
            type: Number, index: true, default: 0,
        },
        speed: {
            type: Number, default: 0,
        },
    },
    isOnline: {
        type: Boolean, required: true, default: false,
    },
    forTest: {
        type: Boolean, default: false,
    },
    chatId: {
        type: Schema.Types.ObjectId, index: true, ref: 'chats', default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('users', schema);

export default Model;
