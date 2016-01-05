var recipeService = angular.module('recipeService',[]);
recipeService.factory('recipeService',['$resource',function($resource) {
return $resource(restUrl + 'recipes/:action/:id/:content',{id: '@id',content: '@content'},
    {
    	'query': {method: 'GET', params: {action: 'index'}, isArray: true},
    	'view': {method: 'GET', params: {action: 'view'}, isArray: true},
    	'top_rated': {method: 'GET', params: {action: 'top_rated'}, isArray: true},
    	'recent': {method: 'GET', params: {action: 'recent'}, isArray: true },
    	'rating': {method: 'GET', params: {action: 'view'}, isArray: true},
    	'categories': {method: 'GET', params: {action: 'categories'}, isArray: true},
    	'most_viewed': {method: 'GET', params: {action: 'most_viewed'}, isArray: true},
    	'update_view_no': {method: 'PUT', params: {action: 'view_no'}}
    });
}]);

