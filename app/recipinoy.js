var recipinoy = angular.module('recipinoy',['onsen','ngCordova','ngResource','angular.filter',
											'login','guest','user','recipe','admin','recipinoyService',
											'recipeService','ng-mfb','angularMoment']);

recipinoy.constant('angularMomentConfig',{
	timezone: 'Asia'
});
recipinoy.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
 }); //to allow cross origin request

var restUrl = 'http://localhost/rpserver/api/';
// var restUrl = 'https://recipinoyv2-sdpixels.rhcloud.com/api/';
// var restUrl = 'https://rpserver-sdpixels.rhcloud.com/api/';
var localStorage = window.localStorage;
var adminViewUrl = 'app/views/admin/';
var guestViewUrl = 'app/views/guest/';
var userViewUrl = 'app/views/user/';
var recipeViewUrl = 'app/views/recipe/';
var rootViewUrl = 'app/views/';
var view_recipe_id;
recipinoy.controller('AppController',['$scope','$rootScope','recipinoyService','recipeService','$cordovaCamera','$cordovaNetwork',
	function($scope,$rootScope,recipinoyService,recipeService,$cordovaCamera,$cordovaNetwork){

	if(localStorage.getItem('user') != null || localStorage.getItem('admin') != null)
	{
		$scope.loggedIn = true;
		if(localStorage.getItem('user') != null)
		{
			$scope.userLoggedIn = true;
		}
		else if(localStorage.getItem('admin') != null)
		{
			$scope.adminLoggedIn = true;
		}
		console.log('naka login');
	}
	else
	{
		$scope.loggedIn = false;
		console.log('d login');
	}

	ons.createDialog(rootViewUrl + 'noInternetDialog.html');
	document.addEventListener("deviceready", function () {
		
	    var type = $cordovaNetwork.getNetwork()

	    var isOnline = $cordovaNetwork.isOnline()

	    var isOffline = $cordovaNetwork.isOffline()

	    // listen for Online event
	    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
	      var onlineState = networkState;
	      console.log(networkState);
	      if(networkState == '2g' || networkState == 'cell')
	      {
	      	noInternetDialog.show();
	      }
	      else
	      {
	      	noInternetDialog.hide();
	      }
	      
	    
	    });

	    // listen for Offline event
	    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	      var offlineState = networkState;
	      console.log(networkState);
		  // noInternetDialog.show();
	    });



	    
		
		

  }, false);

	$rootScope.exitApplication = function() {
			 ons.notification.confirm({
			    message: 'Exit application?',
			    cancelable: true,
			    callback: function(answer) {
			      if(answer == 1) {
			      	navigator.app.exitApp(); // Close the app
			      }
			    }
			  });
	};


	recipinoyService.regions().$promise.then(function(regions){
				$scope.regions = regions;
	});

	recipinoyService.provinces().$promise.then(function(provinces){
				$scope.provinces = provinces;
	});	

	recipeService.categories().$promise.then(function(categories){
				$scope.categories = categories;
				console.log(categories);
	});



	$rootScope.moreMostViewed = function() {
		nav.pushPage(rootViewUrl + 'most_viewed.html');
	};

	$rootScope.moreRecentlyAdded = function() {
		nav.pushPage(rootViewUrl + 'recently_added.html');
	}

	$rootScope.moreTopRated = function() {
		nav.pushPage(rootViewUrl + 'top_rated.html');
	}

	$rootScope.back = function() {
		nav.popPage();
	}


	
	
	
}]);