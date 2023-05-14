import fs from 'file-system';
import process from 'process';

const ROOT = process.cwd();
const { BASE_URL } = process.env;

export default {

    buildUserPicture(pictureName) {
        let picturePath = null;
        if (pictureName) {
            const fullPath = `${ROOT}/storage/pictures/${pictureName}`;
            if (fs.existsSync(fullPath)) {
                picturePath = `${BASE_URL}/pictures/${pictureName}`;
            }
        }
        return picturePath;
    },

};
