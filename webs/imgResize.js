var im = require("imagemagick");
var fs = require('fs');
//todo - since resizing each image will take forever, I need to cache each image as binary data in Redis
//xxxxxxxx - cid
//Key format wsi:xxxxxxxx:0/1/2/3
//http://redis.io/topics/data-types-intro
exports.init = function (req, res, envParam) {
    var imgUrl = req.query.imgurl;

    im.resize({
        srcPath: imgUrl,
        width: 256
    }, function(err, stdout, stderr){
        if (err) throw err;

        res.contentType("image/jpeg");
        res.end(stdout, 'binary');
    });
};