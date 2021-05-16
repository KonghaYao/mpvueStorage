const fse = require("fs-extra");
const fetch = require("node-fetch");
const cookie = "_ga=GA1.2.1869634349.1620630106; sid=s%3ANtk-xALJFq6y7MJCgp4hVLN-JrGSzqZA.4ukaylluwf60C2pcjaWwWSkAQriIuVcKOhh9iws3%2By8; _gid=GA1.2.1699910626.1621069475";
// fetch("https://sd.xiumius.com/xmi/pd/3lZGy/67830b33459f3d159d7fddd2e0b8a136.json", {
//     headers: {
//         accept: "application/json, text/plain, */*",
//         "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
//         "cache-control": "no-cache",
//         pragma: "no-cache",
//         "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "cross-site",
//     },
//     referrer: "https://xiumi.us/",
//     method: "GET",
// })
//     .then((res) => res.json())
//     .then(console.log);
function sleep(ms) {
    return new Promise((res) => {
        setTimeout(() => res(), ms);
    });
}
fetch("https://xiumi.us/api/shows/by/untag?show_type&team_id=321738&limit=20&page=0", {
    headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie,
    },
    referrer: "https://xiumi.us/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
})
    .then((res) => res.json())
    .then((res) => res.data)
    .then(async (res) => {
        console.log("总文章请求成功");
        let collection = [];
        for (const i of res) {
            let back = await fetch("https:" + i.show_data_url)
                .then((res) => res.json())
                .then(({ title, cover, desc, $appendix: { htmlForPreview } }) => {
                    let Title = title.replace("|", "丨");
                    parser(htmlForPreview, Title);
                    return { Title, headerImg: "https:" + cover, desc, dataUrl: `https://cdn.jsdelivr.net/gh/KonghaYao/mpvueStorage/article/${Title}.html` };
                });
            collection.push(back);
            await sleep(100);
        }
        return collection;
    })
    .then((res) => fse.outputJSON("./test.json", res));
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
        return "https://cdn.jsdelivr.net/gh/KonghaYao/mpvueStorage/new/" + newUrl;
    });
    const article = /\.[^.]*?$/.test(articleName) ? articleName : articleName + ".html";
    fse.outputFile(`./article/${article}`, html);
    console.log(articleName, "    https://cdn.jsdelivr.net/gh/KonghaYao/mpvueStorage/article/" + article);
}
