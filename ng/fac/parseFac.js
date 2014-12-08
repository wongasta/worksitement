//Finds existing controller
var app = angular.module('ngCom');

app.factory('parseFac', function(){

    var appendScope = function(k, v, cdata){
        console.log(k,v);
        cdata[k] = v;
    };

    var evalMethod = function(key, value, method, cdata){
        switch(method){
            case 'scope':
                appendScope(key, value, cdata);
                break;
        }
    };

    //todo make new function that takes the method and field name then decide to either parse it for list or company
    var evalID = function(v, method, cdata){
        var metaKey;
        switch(v.field){
            case '28269098':
                metaKey = 'logo';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28268975':
                metaKey = 'company';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28276072':
                metaKey = 'address';
                var addrArray = v.value.split('\n');
                var rtnObj = {};
                angular.forEach(addrArray, function(v,k){
                    var currKey = v.substring(0, v.indexOf('=')-1);
                    var currValue = v.substring(v.indexOf('=')+2);
                    rtnObj[currKey]=currValue;
                });
                evalMethod(metaKey, rtnObj, method, cdata);
                return {'key':metaKey, 'value': rtnObj};
            case '28613266':
                metaKey = 'founded';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28268978':
                metaKey = 'industry';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28613299':
                metaKey = 'employeeNumber';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28269159':
                metaKey = 'companyInfo';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28269348':
                metaKey = 'companyCulture';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28269545':
                metaKey = 'pic1';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28271496':
                metaKey = 'pic2';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28271502':
                metaKey = 'pic3';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            case '28271504':
                metaKey = 'pic4';
                evalMethod(metaKey, v.value, method, cdata);
                return {'key':metaKey, 'value': v.value};
            //todo still got lot more fields to parse
        }
    };

    return{
        'parseCompanyPage': function(data, cdata){
            console.log(data);
            angular.forEach(data, function(v, k){
                evalID(v, 'scope', cdata);
            })
        },
        'parseList': function(data, cdata){
            console.log(data);
            angular.forEach(data, function(comV,comK){
                var compObj = {};
                compObj['id']=comV.id;
                angular.forEach(comV.data, function(v,k){
                    var rtnObj = evalID(v, '', cdata);
                    if (typeof rtnObj != 'undefined'){
                        compObj[rtnObj.key]= rtnObj.value;
                    }
                });
                cdata[comK]=compObj;
            });
            console.log(cdata);
        }
    }
});