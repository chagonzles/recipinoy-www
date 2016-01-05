var adminService = angular.module('adminService',[]);
adminService.factory('adminService',['$resource',function($resource) {
return $resource(restUrl + 'admin/:action/:id/',{id: '@id'},
    {
    	'notifications': {method: 'GET', params: {action: 'notifications'}, isArray: true},
    	'notificationsCount': {method: 'GET', params: {action: 'notificationsCount'}},
    	'addCalorie': {method: 'PUT', params: {action: 'calorie'}},
    	'ingredients': {method: 'GET', params: {action: 'ingredients'}, isArray: true},
    	'updateIngredient': {method: 'PUT', params: {action: 'ingredient'}},
    	'addIngredient': {method: 'POST', params: {action: 'ingredient'}},
    	'list': {method: 'GET', params: {action: 'index'}, isArray: true},
    	'addCategory': {method: 'POST', params: {action: 'category'}},
    	'updateCategory': {method: 'PUT', params: {action: 'category'}}
    });
}]);



// var adminService = angular.module('adminService',[]);
// adminService.factory('adminService',['$resource',function($resource) {
// return $resource(restUrl + 'admin/:action/:params1/',{params1: '@params1'},
//     {
//     	'notifications': {method: 'GET', params: {action: 'notifications'}, isArray: true},
//     	'addCalorie': {method: 'PUT', params: {action: 'calorie'}},
//     	'ingredients': {method: 'GET', params: {action: 'ingredients'}, isArray: true},
//     	'updateIngredient': {method: 'PUT', params: {action: 'ingredient'}},
//     	'addIngredient': {method: 'POST', params: {action: ''}}
//     });
// }]);

