//Finds existing controller
var app = angular.module('ngCom');

app.factory('httpFac', function ($http, parseFac) {

    var companyName = decodeURIComponent(window.location.pathname).substring(11);
    var matchedData=false;
    var cListData = [];

    var indFinalizer = function(input, cdata){
        angular.forEach(input, function(v,k){
            if(v.field==='28902141' && v.value==="true"){
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
        //Constructor here
        'init': function (cdata, type) {
            $http.get('/webs/formInfo/').then(function (response) {
                var matchedCompany;
                //For individual company pages
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
                //For complete submissions list
                }else if(type==='list'){
                    angular.forEach(response.data, function(v,k){
                        matchedData=v;
                        angular.forEach(v.data, function(vc,kc){
                            if(vc.field==='28902141' && vc.value==="true"){
                                cListData.push(matchedData.data);
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