const fse = require("fs-extra");
const fetch = require("node-fetch");
function saveImg(path, savePath) {
    return fetch(path)
        .then((res) => res.buffer())
        .then((res) => fse.outputFile(savePath, res));
}
module.exports = saveImg;
