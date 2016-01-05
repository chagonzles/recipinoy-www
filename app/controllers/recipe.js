var recipe = angular.module('recipe',['recipeService']);


recipe.controller('recipeCtrl',['$rootScope','$scope','recipeService',function($rootScope,$scope,recipeService){
	$scope.totalCalorie = 0;
	$rootScope.starRating = [];
	$rootScope.noStarRating = [];
	$scope.rpRating;
	recipeService.view({id: $rootScope.view_recipe_id}).$promise.then(function(recipe){
		$rootScope.recipe = recipe[0];
		for(var i = 0; i < Math.round(recipe[0].ave_rating); i++)
		{
			$rootScope.starRating[i] = i;
		}
		$rootScope.noStarRating.length = 5 - $scope.starRating.length; 
	});

	recipeService.view({id: $rootScope.view_recipe_id, content: 'ingredients'}).$promise.then(function(ingredients){
		$scope.ingredients = ingredients;
	});

	
	recipeService.view({id: $rootScope.view_recipe_id, content: 'reviews'}).$promise.then(function(reviews){
		$rootScope.recipeReviews = reviews;
	});

	$scope.goToLogin = function() {
		nav.pushPage('app/views/login.html');
	}



	$scope.calculateCalorie = function(qty,qty_fraction,cal)
	{
		if(cal == null)
		{
			return 'Not yet available';
		}
		else
		{
			console.log(qty + ' ' + $scope.convertFractionToDecimal(qty_fraction) + ' ' + cal);
			return ((parseInt(qty) + $scope.convertFractionToDecimal(qty_fraction)) * cal) + ' calories';
		}

	}

	$scope.getTotalCalorie = function(ingredients,no_of_serving) 
	{
		$scope.totalCalorie = 0;
		if(!angular.isUndefined(ingredients))
		{
			angular.forEach(ingredients, function(ingredient,index){
				$scope.calorie = (parseInt(ingredient.qty) + $scope.convertFractionToDecimal(ingredient.qty_fraction)) * ingredient.ingredient_cal;
				$scope.totalCalorie += parseInt($scope.calorie);
				if(ingredient.ingredient_cal == null)
				{
					$scope.totalisNull = true;
				}
			});
			
			// console.log('total calorie' + $scope.totalCalorie);
			if($scope.totalisNull)
			{
				return 'Calorie per serving: N/A';
			}
			else
			{
				return 'Calorie per serving: ' + Math.round(($scope.totalCalorie / no_of_serving));
			}
		}
		
	}
	$scope.convertFractionToDecimal = function(qty_fraction) {
		if(qty_fraction == '1/2')
		{
			return 0.5;
		}
		else if(qty_fraction == '1/4')
		{
			return 0.25;
		}
		else if(qty_fraction == '1/8')
		{
			return 0.125;
		}
		else if(qty_fraction == '1/3')
		{
			return 0.33;
		}
		else if(qty_fraction == '2/3')
		{
			return 0.67;	
		}
		else if(qty_fraction == '3/4')
		{
			return 0.75;
		}
		else 
		{
			return 0;
		}
	}
}]);