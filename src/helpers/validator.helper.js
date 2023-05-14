import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default {

    isObjectId(data) {
        // Check string data.
        if (typeof data === 'string') {
            return ObjectId.isValid(data);
        }

        // Check array data.
        if (Array.isArray(data)) {
            let invalidCounter = 0;
            data.forEach((string) => {
                if (!ObjectId.isValid(string)) invalidCounter += 1;
            });
            return (invalidCounter === 0);
        }

        return false;
    },

};
