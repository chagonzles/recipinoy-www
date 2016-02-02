var guest = angular.module('guest',['recipeService']);

guest.controller('guestCtrlr',['$rootScope','$scope','recipeService',function($rootScope,$scope,recipeService){
	$scope.search = false;
	$rootScope.showFilter = false;
	$rootScope.isEmptySearch = true;
	$scope.range = 5;
	$rootScope.selectedProvinces = [];
	$scope.isSelectedRegion = false;
	
  	$rootScope.noInputAlert = ["Seems like you're looking for nothing.",
						   "Type something at the search bar",
						   "Something is missing. Look at the top.",
						   "Don't you want to search something?",
						   "You're looking for a recipe right??",
						   "Feel free to search any recipe you want"
						  ];
	
	$rootScope.i = getRandomNumber(6);

	$rootScope.refreshData = function() {
		refreshData();
	}
	refreshData();

	function refreshData()
	{	
		$scope.isLoadingMostViewed = true;
		$scope.isLoadingTopRated = true;
		$scope.isLoadingRecent = true;

		recipeService.query().$promise.then(function(recipes){
			$rootScope.recipes = recipes;
			$scope.isLoadingRecent= false;
			// $scope.isLoadingMostViewed = false;
			$scope.isLoadingTopRated = false;
		});

		recipeService.most_viewed().$promise.then(function(most_viewed){
			$rootScope.most_viewed = most_viewed;
			$scope.isLoadingMostViewed = false;
		});


		
		// recipeService.top_rated().$promise.then(function(top_rated){
		// 	$rootScope.top_rated = top_rated;
		// 	$scope.isLoadingTopRated = false;
		// });
	};
	
	function refreshRecipes()
	{
		$scope.isLoadingRecent= false;
		recipeService.query().$promise.then(function(recipes){
			$rootScope.recipes = recipes;
			$scope.isLoadingRecent= false;
		});
	}

	function refreshMostViewed()
	{
		$scope.isLoadingMostViewed = true;
		recipeService.most_viewed().$promise.then(function(most_viewed){
			$rootScope.most_viewed = most_viewed;
			$scope.isLoadingMostViewed = false;
		});
		
	}

	function getRandomNumber(max) {
		return Math.floor((Math.random()*max));
	};

	$rootScope.getProvinces = function(region_id) {
		console.log('asd');
			$rootScope.selectedProvinces.splice(0,$rootScope.selectedProvinces.length);
			for (var i = 0; i < $scope.provinces.length; i++) {
				if($scope.provinces[i].region_id == region_id)
				{
					$rootScope.selectedProvinces.push($scope.provinces[i].name);
				}				
			};
			$rootScope.isRegion(region_id);
	};
	$rootScope.goToRecipeView = function(recipe_id) {
		$rootScope.view_recipe_id = recipe_id;
		nav.pushPage('app/views/recipe/main.html');
		recipeService.update_view_no({id: $rootScope.view_recipe_id}).$promise.then(function(){
			
		});
	};
	
	console.log('rak en rol');

	$rootScope.isRegion = function(region) {
		if(region > 0 || region != undefined)
		{
			$rootScope.isSelectedRegion = true;
		}
		else
		{
			$rootScope.isSelectedRegion = false;
		}
	};

	$rootScope.back = function() {
		refreshData();
		nav.popPage();
	};

	$scope.search = function() {
		refreshRecipes();
		nav.pushPage('app/views/guest/search.html');
	};

	$rootScope.toggleFilter = function(value) {
		$rootScope.showFilter = !value;
	};

	$scope.changeFilter = function() {
		filterDialog.hide();
	};

	$scope.more = function() {
		$scope.range += 5;
		console.log($scope.range);
	}

	$rootScope.isValidSearchInput = function(input) {
		if(input.length > 0)
		{
			$rootScope.isEmptySearch = false;
		}
		else
		{
			$rootScope.isEmptySearch = true;			
			$rootScope.i = getRandomNumber(6);
			console.log($rootScope.i);
		}
	};


}]);




