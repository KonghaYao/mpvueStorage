const fse = require("fs-extra");
const fetch = require("node-fetch");
// 用于解析保存 html 的图片
function parser(string, articleName) {
    const html = string.replace(/(?<=<img[^<]*?src=["'])https?:\/\/[^'"]+/g, function (url) {
        const newUrl = url.replace(/https?:\/\//, "").replace(/[\?|#|&][\s\S]*/, "");
        let Url = "./new/" + newUrl;
        if (!fse.existsSync(Url)) {
            fetch(url)
                .then((res) => res.buffer())
                .then((res) => {
                    fse.outputFile(Url, res, { flag: "w" });
                    console.log("save " + url);
                });
        }
        console.log("   " + newUrl);
        return "https://cdn.jsdelivr.net/gh/KonghaYao/mpvueStorage/new/" + newUrl;
    });
    const article = /\.[^.]*?$/.test(articleName) ? articleName : articleName + ".html";
    fse.outputFile(`./article/${article}`, html);
    console.log(articleName, "    https://cdn.jsdelivr.net/gh/KonghaYao/mpvueStorage/article/" + article);
}
module.exports = parser;
