//All neede modules
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var fs = require('fs');
//Include redis npm module then select default db 0 to use
var redis = require('redis'),
    rClient = redis.createClient();

var app = express();
var port = process.env.PORT || 8000;

//Main modules to parse various info for routes
var mainMod = {
    'parseURL': function(url){
        //Provides routes for both DEV and PROD
        var routeArray = [];
        routeArray.push(this.formatPath(url));
        routeArray.push(envParam.dev.prepend + this.formatPath(url));
        return routeArray;
    },
    //Concat the route to work with htaccess
    'formatPath': function (addPath) {
        return '/'+__dirname.split('/').slice(__dirname.split('/').indexOf('public_html')+1, __dirname.length).join('/')+addPath;
    },
    //Parse all node user args
    'parseArgs': function () {
        var args = [];
        process.argv.forEach(function (val, index, array) {
            args.push(val);
        });
    }
};
mainMod.parseArgs();

//Param keys to utilize throughout the app, scalable later
var envParam = {
    'prod': {
        //PRIVATE KEY DO NOT GIVE OUT!
        'apiKey': 'you cant see this lulz',
        'formID': '1853804',
        'rCompanyPrefix': 'wsc',
        'rImgPrefix': 'wsi',
        'rCompanyTTL': 10800
    },
    'dev':{
        'prepend': '/~jacob'
    }
};
//Redis logging middleware
rClient.on("error", function (err) {
    console.log("Error " + err);
});

//Generic cookie and body parsing take place
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Middleware to log stuff, more middleware will be added later
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

/* Routes for main modules */

app.get(mainMod.parseURL('/formInfo'), function(req, res){
    var formMod = require('./formInfo.js');
    var completionCallback = function(result){
        res.setHeader('Content-Type', 'application/json');
        res.send(result);
    };
    formMod.init(envParam, rClient, completionCallback);
});

app.get(mainMod.parseURL('/companyInfo/:id'), function (req, res) {
    var companyMod = require('./companyInfo.js');
    var cid = req.params.id;
    var completionCallback = function(result){
        res.setHeader('Content-Type', 'application/json');
        res.send(result);
    };
    companyMod.init(envParam, rClient, cid, completionCallback);
});

/* Routes for cache/aux modules */

app.get(mainMod.parseURL('/ccClear'), function (req, res) {
    var ccClearMod = require('./cacheClear.js');
    ccClearMod.init(req, res, envParam, rClient, envParam.prod.rCompanyPrefix);
});

app.get(mainMod.parseURL('/ciClear'), function (req, res) {
    var ccClearMod = require('./cacheClear.js');
    ccClearMod.init(req, res, envParam, rClient, envParam.prod.rImgPrefix);
});

/* Routes for resizing img */

//Testing Route
app.get(mainMod.parseURL('/imgResize'), function (req, res) {
    var imgResizeMod = require('./imgResize.js');
    imgResizeMod.init(req, res, envParam, rClient);
});

//Image Service
app.get(mainMod.parseURL('/img/:cid/:height/:iid'), function (req, res) {
    var imgResizeMod = require('./imgService.js');
    var img = {
        'height': req.params.height,
        'cid': req.params.cid,
        'iid': req.params.iid
    };
    var completionCallback = function(result){
        res.contentType("image/jpeg");
        res.end(result, 'binary');
    };
    imgResizeMod.init(img, envParam, rClient, completionCallback);
});

app.listen(port);
console.log('Sever started on port ' + port);

/*Notes

 Restrict redis to local only - in config bind 127.0.0.1

 module prefix:
 wsc:id - company cache data
 wsg:addr - geocode cache data
 */