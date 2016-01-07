var userService = angular.module('userService',[]);
userService.factory('userService',['$resource',function($resource) {
return $resource(restUrl + 'user/:action/:id/:params',{id:'@id',params:'@params'},
    {
    	'auth': {method: 'POST', params: {action: 'auth'}, isArray: true},
    	'checkUsername': {method: 'POST', params: {action: 'checkUsername'}},
    	'checkEmail': {method: 'POST', params: {action: 'checkEmail'}},
    	'signUp': {method: 'POST', params: {action: 'signUp'}},
    	'getMyRecipes': {method: 'GET', params: {action: 'view',params: 'recipes'},isArray: true},
    	'getIngredients': {method: 'GET', params: {action: 'ingredients'},isArray:true},
    	'ingredientsCount': {method: 'GET',params: {action: 'ingredientsCount'}},
    	'shareRecipe': {method: 'POST',params: {action: 'recipe'}},
    	'checkIfExistIngredient': {method: 'POST', params: {action: 'checkIfExistIngredient'},isArray:true},
    	'addRecipeIngredient': {method: 'POST', params: {action: 'addRecipeIngredient'}},
    	'addIngredient': {method: 'POST', params: {action: 'addIngredient'}},
        'profile': {method: 'GET',params: {action: 'view',params: ''},isArray: true},
        'addRatingReview': {method: 'POST', params: {action: 'reviewRating'}},
        'reviewCount': {method: 'GET', params: {action: 'review_count'}},
        'updateReviewRating': {method: 'PUT', params: {action: 'review'}},
        'deleteReviewRating': {method: 'DELETE', params: {action: 'review'}},
        'updateAveRating': {method: 'PUT', params: {action: 'ave_rating'}},
        'addReply': {method: 'POST', params: {action: 'reply'}},
        'getReplies': {method: 'GET', params: {action: 'review_replies'},isArray: true},
        'addToFavorites': {method: 'POST', params: {action: 'favorite'}},
        'removeToFavorites': {method: 'DELETE', params: {action: 'favorite'}},
        'getFavorites': {method: 'GET', params: {action: 'view',params: 'favorites'},isArray: true}
    });
}]);

