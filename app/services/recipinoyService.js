var recipinoyService = angular.module('recipinoyService',[]);
recipinoyService.factory('recipinoyService',['$resource',function($resource) {
return $resource('app/services/json/:file.json',{file: '@file',region_id: '@region_id'},
    {
   		'regions': {method: 'GET', params: {file: 'regions'}, isArray: true},
   		// 'categories': {method: 'GET', params: {file: 'categories'}, isArray: true},
   		'provinces': {method: 'GET', params: {file: 'provinces2'}, isArray: true}                                                                                     
    });
}]);


