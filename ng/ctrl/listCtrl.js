//Make a new controller controller
var app = angular.module('ngCom', []);

//Controller for index.php
//cList is the obj to be binded
app.controller('ngListCtrl', function($scope, httpFac){
    $scope.testString = 'hello world';
    $scope.cList = [];
    $scope.selectCity = 'All';
    var response = httpFac.init($scope.cList, 'list');
    $scope.uniqueCities = function(){
        var cities = [];
        angular.forEach($scope.cList, function(v,k){
            cities.push(v.address.city);
        });

        var returnObj = [];
        angular.forEach(cities, function(v,k){
            if(returnObj.indexOf(v)===-1){
                returnObj.push(v);
            }
        });
        returnObj.unshift('All');
        return returnObj;
    };
    $scope.showDiv = function(currentCity){
        if($scope.selectCity==='All'){
            return true;
        }
        return (currentCity.toLowerCase()===$scope.selectCity.toLowerCase());
    };

    $scope.imageHeight=280;

    $scope.resizeImage = function(cid, height, iid){
        var resizeURL = '/webs/img/' + cid + '/' + height + '/' + iid;
        return resizeURL;
    };
});


