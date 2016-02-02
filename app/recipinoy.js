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

// var restUrl = 'http://localhost/rpserver/api/';
// var restUrl = 'https://recipinoyv2-sdpixels.rhcloud.com/api/';
var restUrl = 'https://rpserver-sdpixels.rhcloud.com/api/'; //-ito un latest
var localStorage = window.localStorage;
var adminViewUrl = 'app/views/admin/';
var guestViewUrl = 'app/views/guest/';
var userViewUrl = 'app/views/user/';
var recipeViewUrl = 'app/views/recipe/';
var rootViewUrl = 'app/views/';
var view_recipe_id;
recipinoy.controller('AppController',['$scope','$rootScope','recipinoyService','recipeService','$cordovaCamera','$cordovaNetwork','$cordovaSQLite',
	function($scope,$rootScope,recipinoyService,recipeService,$cordovaCamera,$cordovaNetwork,$cordovaSQLite){
	$rootScope.noInternet = false;
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
	ons.createDialog(rootViewUrl + 'onlineDialog.html');
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
	      	// noInternetDialog.show();
	      	$rootScope.noInternet = true;
	      }
	      else
	      {
	      	// noInternetDialog.hide();
	      	$rootScope.noInternet = false;
	      	
	      }
	      
	 
	    	console.log('meron internet');
	    	noInternetDialog.hide();
	    	onlineDialog.show();
	    	// if(localStorage.getItem('user'))
	    	// {
	    	// 	nav.resetToPage(userViewUrl	+ 'home.html');
	    	// }
	    	// else
	    	// {
	    	// 	nav.resetToPage(rootViewUrl + 'login.html');
	    	// }
	    });

	    // listen for Offline event
	    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	      var offlineState = networkState;
	      console.log(networkState);
	      onlineDialog.hide();
		  noInternetDialog.show();
		  console.log('walang internet');
		  $rootScope.noInternet = true;
	    });

	    
	    db = $cordovaSQLite.openDB("my.db");
	    // var query1 = "CREATE TABLE IF NOT EXISTS Favorite_Recipes(recipe_id INT,recipe_img VARCHAR(100),recipe_name VARCHAR(50),recipe_desc VARCHAR(500),region VARCHAR(30),province VARCHAR(30),city VARCHAR(30),ave_rating DECIMAL(3,2) DEFAULT 0,date_posted TIMESTAMP,category VARCHAR(30),no_of_serving INT,no_of_view INT,procedures VARCHAR(10000),username VARCHAR(20),PRIMARY KEY(recipe_id));";
		var query1 = "CREATE TABLE IF NOT EXISTS Recipe(recipe_id INT,recipe_img VARCHAR(100),recipe_name VARCHAR(50),recipe_desc VARCHAR(500),region VARCHAR(30),province VARCHAR(30),city VARCHAR(30),ave_rating DECIMAL(3,2) DEFAULT 0,date_posted TIMESTAMP,category VARCHAR(30),no_of_serving INT,no_of_view INT,procedures VARCHAR(10000),username VARCHAR(20),PRIMARY KEY(recipe_id));";
		var query2 = "CREATE TABLE IF NOT EXISTS Ingredient(ingredient_id INT,ingredient_name VARCHAR(50),ingredient_uom VARCHAR(20),ingredient_cal INT, date_added TIMESTAMP, date_updated TIMESTAMP,username VARCHAR(20),PRIMARY KEY(ingredient_id))";
		var query3 = "CREATE TABLE IF NOT EXISTS Recipe_Ingredient(rcp_ingrdnt_id INT,qty INT,qty_fraction VARCHAR(5),recipe_id INT,ingredient_id INT, PRIMARY KEY(rcp_ingrdnt_id))";
		var query4 = "CREATE TABLE IF NOT EXISTS Category(category_id INT,category_name VARCHAR(100),category_img VARCHAR(100), PRIMARY KEY(category_id))";
		
		
	    $cordovaSQLite.execute(db,query1);
	    $cordovaSQLite.execute(db,query2);
	    $cordovaSQLite.execute(db,query3);
	    $cordovaSQLite.execute(db,query4);
	   

	 //   	recipeService.categories().$promise.then(function(categories){
		// 		$rootScope.categories = categories;
		// 		console.log('categoriesss');
		// 		console.log(categories);
		// });

		checkCategories();
	   	function checkCategories()
		{

			recipeService.categories().$promise.then(function(categories){
				
				$rootScope.no_of_online_categories = categories.length;
				$scope.categories_online = categories;
				var q = "SELECT category_id FROM Category";
				console.log('no of online categories ' + categories.length);
		        $cordovaSQLite.execute(db, q).then(function(res) {
		        	if(res.rows.length > 0 || res.rows.length == 0)
		        	{
		        		$rootScope.no_of_offline_categories = res.rows.length;
		        		console.log('no of offline categories ' + res.rows.length);
		        		if($rootScope.no_of_online_categories > $rootScope.no_of_offline_categories)
		        		{
		        			//drop the db and insert everything on online to offline
		        			angular.forEach($scope.categories_online, function(category,i){
		        					var query = "INSERT INTO Category VALUES (?,?,?)";
							        $cordovaSQLite.execute(db, query, [category.category_id,category.category_name,category.category_img]).then(function(res) {
							            console.log("Insert category id -> " + res.insertId);
							        }, function (err) {
							            console.error(err);
							        });

		        			});

		        		}
		        	}
		           getCategories();
		        }, function (err) {
		            console.error(err);
		        });
				
			}); //get categories online

			
			

		} //check categories


		function getCategories()
		{

				$rootScope.categories = [];
				var query = "SELECT category_id, category_name, category_img FROM Category";
		        $cordovaSQLite.execute(db, query).then(function(res) {
		            if(res.rows.length > 0) {
		                // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
		         		console.log('list of category');
		            	for (var i = 0; i < res.rows.length; i++) {
		            		
		            		$rootScope.categories[i] = res.rows.item(i);
		            		console.log($rootScope.categories[i].category_name);

		            	};
		            	
		            } else {
		                console.log("No results found");
		            }
		        }, function (err) {
		            console.error(err);
		        });

		}

	  
		
		

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
				$rootScope.provinces = provinces;
				console.log(provinces);
				var lat = findCoor($scope.provinces,'name','Malabon','lat');
				var lng = findCoor($scope.provinces,'name','Malabon','lng');
				console.log(lat + ' ' + lng);

	});	

	function findCoor(arraytosearch, key, valuetosearch,coor) {
 
		for (var i = 0; i < arraytosearch.length; i++) {
	 
			if (arraytosearch[i][key] == valuetosearch) {
				return arraytosearch[i][coor];
			}
		}
		return null;
	}



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


	$rootScope.goBackToUserDiscover = function() {
		nav.resetToPage(userViewUrl + 'home.html');
	}
	
	
}]);