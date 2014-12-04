//Make a new controller controller
var app = angular.module('ngCom', []);

//Controller for company-page.php
//cdata is the obj to be binded
app.controller("ngComCtrl", function ($scope, httpFac) {
    $scope.testString = 'hello world';
    $scope.cdata = {};
    var response = httpFac.init($scope.cdata, 'idv');
});