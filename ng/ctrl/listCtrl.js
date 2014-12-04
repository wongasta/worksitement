//Make a new controller controller
var app = angular.module('ngCom', []);

//Controller for index.php
//cList is the obj to be binded
app.controller('ngListCtrl', function($scope, httpFac){
    $scope.testString = 'hello world';
    $scope.cList = {};
    var response = httpFac.init($scope.cList, 'list');
});