var url = require('url');
var https = require('https');
var request = require('request');

var makeRequest = function(envParam, cid, rClient, completionCallback){
    var options = {
        url: 'https://www.formstack.com/api/v2/submission/'+cid+'.json',
        headers: {
            'Authorization': 'Bearer ' + envParam.prod.apiKey
        }
    };

    var requestCallback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var selectKey = envParam.prod.rCompanyPrefix+':'+cid;
            rClient.set(selectKey, body, function(err, res){
                if(err){ throw err; }
                rClient.expire(selectKey, envParam.prod.rCompanyTTL, function(){
                    completionCallback(body);
                });
            });
        }
    };

    request(options, requestCallback);
};

exports.init = function (envParam, rClient, cid, completionCallback) {

    rClient.get(envParam.prod.rCompanyPrefix+':'+ cid, function(err, rres){
        if(err){ throw err; }
        //Execute below if found in cache - return to user
        if (rres){
            //console.log(envParam.prod.rCompanyPrefix+':'+cid, ' retrieved from cache');
            completionCallback(rres);

        }else{
            //console.log(envParam.prod.rCompanyPrefix+':'+cid, ' retrieved from api');
            makeRequest(envParam, cid, rClient, completionCallback);
        }
    });

};