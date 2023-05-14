import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    username: {
        type: String, required: true, index: true, unique: true,
    },
    password: {
        type: String, required: true,
    },
    picture: {
        type: String, default: null,
    },
    name: {
        type: String, required: true,
    },
    age: {
        type: Number, required: true,
    },
    height: {
        type: Number, required: true,
    },
    weight: {
        type: Number, required: true,
    },
    time: {
        type: Number, default: 0,
    },
    distance: {
        type: Number, default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Model = mongoose.model('users', schema);

export default Model;
