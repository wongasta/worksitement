var app = angular.module('ngCom', []);

app.controller("ngComCtrl", function ($scope, httpFac) {
    $scope.testString = 'hello world';
    $scope.cdata = {};
    var response = httpFac.init($scope.cdata, 'idv');
});

app.controller('ngListCtrl', function($scope){
    $scope.testString = 'hello world';
    $scope.cList = {};
    var response = httpFac.init($scope.cList, 'list');
});



app.factory('httpFac', function ($http, parseFac) {

    var companyName = decodeURIComponent(window.location.pathname).substring(11);
    var matchedData=false;
    var cListData = [];

    var indFinalizer = function(input, cdata){
        angular.forEach(input, function(v,k){
            if(v.field==='28902141' && v.value){
                parseFac.parseCompanyPage(input, cdata);
                return input;
            }else{
                //todo - 404 redirect if page not found

            }
        });
    };

    var listFinalizer = function(input, cdata){
        parseFac.parseList(input, cdata);
        return false;
    };

    return{
        'init': function (cdata, type) {
            $http.get('/webs/formInfo/').then(function (response) {
                var matchedCompany;

                if(type==='idv'){
                    angular.forEach(response.data, function(v,k){
                        matchedData=v;
                        angular.forEach(v.data, function(vc,kc){
                            if(vc.field==='28268975'){
                                if(companyName.toLocaleLowerCase()=== vc.value.toLocaleLowerCase()){
                                    matchedCompany= matchedData.data;
                                    return matchedCompany;
                                }
                            }
                        });
                    });
                    indFinalizer(matchedCompany, cdata);
                }else if(type==='list'){
                    angular.forEach(response.data, function(v,k){
                        matchedData=v;
                        angular.forEach(v.data, function(vc,kc){
                            if(vc.field==='28902141' && vc.value){
                                cListData.push(matchedData);
                            }
                        });
                    });
                    listFinalizer(cListData, cdata);
                }

                return false;
            }, function (response) {
                var err = response;
                console.log(err);
            });
        }
    }
});

app.factory('parseFac', function(){

    function appendScope(k, v, cdata){
        console.log(k,v);
        cdata[k] = v;
    }

    return{
        'parseCompanyPage': function(data, cdata){
            angular.forEach(data, function(v, k){
                switch(v.field){
                    case '28269098':
                        appendScope('logo', v.value, cdata)
                        break;
                    case '28268975':
                        appendScope('company', v.value, cdata);
                        break;
                    case '28613266':
                        appendScope('founded', v.value, cdata);
                        break;
                    case '28268978':
                        appendScope('industry', v.value, cdata);
                        break;
                    case '28613299':
                        appendScope('employeeNumber', v.value, cdata);
                        break;
                    case '28269159':
                        appendScope('companyInfo', v.value, cdata);
                        break;
                    case '28269348':
                        appendScope('companyCulture', v.value, cdata);
                }
            })
        },
        'parseList': function(data, cdata){
            console.log(data);
        }
    }
});