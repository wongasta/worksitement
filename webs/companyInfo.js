var url = require('url');
var https = require('https');
var request = require('request');

//Currently not in use - for dev purpose only
exports.init = function (req, res, envParam) {
    var cid = req.params.id;

    var options = {
        url: 'https://www.formstack.com/api/v2/submission/'+cid+'.json',
        headers: {
            'Authorization': 'Bearer ' + envParam.prod.apiKey
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }

    request(options, callback);
};