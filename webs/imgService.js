var im = require("imagemagick");

//xxxxxxxx - cid
//Key format wsi:xxxxxxxx:500w:0/1/2/3
//http://redis.io/topics/data-types-intro

var lookup = function(array){
    var lookup = {};
    for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].field] = array[i];
    }
    return lookup;
};

var imgField = function(imgInfo){
    switch(imgInfo){
        case '0':
            return '28269545';
        case '1':
            return '28271496';
        case '2':
            return '28271502';
        case '3':
            return '28271504';
        default:
            return null;
    }
};

var checkCache = function(envParam, rClient, imgInfo, completionCallback){
    var currentKey = envParam.prod.rImgPrefix+':'+imgInfo.cid+':'+imgInfo.height+':'+imgInfo.iid;
    rClient.get(currentKey, function(err, res){
        if(err){ throw err; }

        if (res){
            console.log(currentKey, ' retrieved from cache');
            completionCallback(res);
        }else{
            console.log(currentKey, ' retrieved from api');
            retrieveData(envParam, rClient, imgInfo, completionCallback, currentKey);
        }
    });
};

var retrieveData = function(envParam, rClient, imgInfo, completionCallback, currentKey){

    var imgURL = '';

    var companyMod = require('./companyInfo.js');
    var cid = imgInfo.cid;
    var companyInfoCallBack = function(result){

        result = JSON.parse(result);
        var returnData = lookup(result.data);

        try{
            imgURL = returnData[imgInfo.field].value;
        }catch(err){
            console.log(currentKey, 'image not found');
            return false;
        }

        im.resize({
            srcPath: imgURL,
            height: imgInfo.height
        }, function(err, stdout, stderr){
            if (err) throw err;
            storeData(envParam, rClient, stdout, completionCallback, currentKey);
        });

    };
    companyMod.init(envParam, rClient, cid, companyInfoCallBack);

};

var storeData = function(envParam, rClient, img, completionCallback, currentKey){

    rClient.set(currentKey, img, function(err, res){
        if(err){ throw err; }

        rClient.expire(currentKey, envParam.prod.rCompanyTTL, function(){
            console.log(currentKey, 'cached!');
            completionCallback(img);

        });
    });
};

exports.init = function (img, envParam, rClient, completionCallback) {


    console.log(img.cid, 'inside imgService');

    img['field'] = imgField(img.iid);

    checkCache(envParam, rClient, img, completionCallback);

};