var im = require("imagemagick");
var fs = require('fs');

exports.init = function (req, res, envParam, rClient) {

    var imgUrl = 'https://s3.amazonaws.com/files.formstack.com/uploads/1853804/28269545/170891852/28269545_office_photo_1.jpg';

    im.resize({
        srcPath: imgUrl,
        height: 280
    }, function(err, stdout, stderr){
        if (err) throw err;


        res.contentType("image/jpeg");
        res.end(stdout, 'binary');

//        rClient.set('wsi:testimg', stdout, function(err, rres){
//            if(err){
//                throw err;
//            }
//            console.log('set now');
//
//            res.contentType("image/jpeg");
//            res.end(stdout, 'binary');
//        });
    });
//
//    rClient.get('wsi:testimg', function(err, rres){
//        if(err){ throw err; }
//
//        console.log(rres);
//
//        res.contentType("image/jpeg");
//        res.end(rres, 'binary');
//
//    });

};