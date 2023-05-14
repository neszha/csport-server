import fs from 'file-system';

export default {

    readFile(path) {
        if (fs.existsSync(path)) return fs.readFileSync(path);
        return null;
    },

    saveFile(path, data) {
        return fs.writeFileSync(path, data);
    },

    copyFile(scrPath, destPath) {
        if (fs.existsSync(scrPath)) fs.copyFileSync(scrPath, destPath);
    },

    makeDir(path) {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
    },

    destroy(path) {
        if (fs.existsSync(path)) {
            fs.rmSync(path, { recursive: true, force: true });
        }
    },

};
