var async = require('async');

//Clears all redis wsc cache for Formstack API calls
exports.init = function (req, res, envParam, rClient) {

    var deletedRows = [];
    //to be called by below keys first
    var delRow = function(row, callback){
        rClient.del(row, function(err){
            console.log(row, 'getting deleted from cache');
            deletedRows.push(row);
            return callback(null);
        });
    };

    //Loops through KEYS wsc: etc - then async run each deletes
    rClient.keys(envParam.prod.rCompanyPrefix+'*', function(err, row){
        if(err){
            throw(err);
        }

        async.forEach(row, delRow, function(err){
            if(err){
                throw(err);
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(deletedRows);
        });
    });
};