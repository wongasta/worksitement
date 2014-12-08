var https = require('https');
var request = require('request');
var async = require('async');

//Makes nested call to Formstack API if needed, otherwise it will pick upon Redis cached data
var formMod = {
    'data': [],
    //Constructor more or less, more to be added
    'eachSub': function(envParam, rClient, v, callback){
        formMod.checkCache(v, envParam, rClient, callback);
    },
    //Check to see if the data is in cache or not
    'checkCache': function(v, envParam, rClient, callback){
        rClient.get(envParam.prod.rCompanyPrefix+':'+ v.id, function(err, res){
            if(err){ throw err; }
            //Execute below if found in cache - return to user
            if (res){
                //console.log(v.id, ' retrieved from cache');
                formMod.data.push(JSON.parse(res));
                return callback(null);
            //Otherwise make call to API and retrieve from API
            }else{
                //console.log(v.id, ' retrieved from api');
                var optSub = {
                    url: 'https://www.formstack.com/api/v2/submission/'+ v.id +'.json',
                    headers: {
                        'Authorization': 'Bearer ' + envParam.prod.apiKey
                    }
                };

                request(optSub, function(error, response, body){
                    if (!error && response.statusCode == 200) {
                        formMod.data.push(JSON.parse(body));
                        //Calls below function to cache each JSON data in redis
                        formMod.storeCache(v, envParam, body, rClient, callback);
                    }
                });
            }
        });
    },
    'storeCache': function(v, envParam, body, rClient, callback){
        var currentKey = envParam.prod.rCompanyPrefix+':'+ v.id;
        rClient.set(currentKey, body, function(err, res){
            if(err){
                throw err;
            }
            rClient.expire(currentKey, envParam.prod.rCompanyTTL, function(){
                return callback(null);
            });
        });
    }
};

exports.init = function (envParam, rClient, completionCallback) {
    formMod.data=[];
    //Calls the form initially - call config
    var optForm = {
        url: 'https://www.formstack.com/api/v2/form/'+envParam.prod.formID+'/submission.json',
        headers: {
            'Authorization': 'Bearer ' + envParam.prod.apiKey
        }
    };
    //Called after request finishes executing
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var content = JSON.parse(body);
            //For each submission returned from the call, will call formMod.eachSub - append 2 more args using bind
            async.each(content.submissions, formMod.eachSub.bind(null, envParam, rClient), function(err){
                if(err){
                    throw err;
                }
                completionCallback(formMod.data);
            })

        }
    }
    //Makes the request - then call the callback function above
    request(optForm, callback);
};