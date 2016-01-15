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
// var restUrl = 'https://rpserver-sdpixels.rhcloud.com/api/'; //-ito un latest
var localStorage = window.localStorage;
var adminViewUrl = 'app/views/admin/';
var guestViewUrl = 'app/views/guest/';
var userViewUrl = 'app/views/user/';
var recipeViewUrl = 'app/views/recipe/';
var rootViewUrl = 'app/views/';
var view_recipe_id;
recipinoy.controller('AppController',['$scope','$rootScope','recipinoyService','recipeService','$cordovaCamera','$cordovaNetwork','$cordovaSQLite',
	function($scope,$rootScope,recipinoyService,recipeService,$cordovaCamera,$cordovaNetwork,$cordovaSQLite){
	
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
	      	// noInternetDialog.show();
	      }
	      else
	      {
	      	// noInternetDialog.hide();
	      }
	      
	    
	    });

	    // listen for Offline event
	    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	      var offlineState = networkState;
	      console.log(networkState);
		  // noInternetDialog.show();
	    });

	    $cordovaSQLite.deleteDB("my.db");
	    db = $cordovaSQLite.openDB("my.db");
	    var query1 = "CREATE TABLE IF NOT EXISTS Favorite_Recipes(recipe_id INT,recipe_img VARCHAR(100),recipe_name VARCHAR(50),recipe_desc VARCHAR(500),region VARCHAR(30),province VARCHAR(30),city VARCHAR(30),ave_rating DECIMAL(3,2) DEFAULT 0,date_posted TIMESTAMP,category VARCHAR(30),no_of_serving INT,no_of_view INT,procedures VARCHAR(10000),username VARCHAR(20),PRIMARY KEY(recipe_id));";
		var query2 = "CREATE TABLE IF NOT EXISTS Ingredient(ingredient_id INT,ingredient_name VARCHAR(50),ingredient_uom VARCHAR(20),ingredient_cal INT, date_added TIMESTAMP, date_updated TIMESTAMP,username VARCHAR(20),PRIMARY KEY(ingredient_id))";
		var query3 = "CREATE TABLE IF NOT EXISTS Recipe_Ingredient(rcp_ingrdnt_id INT,qty INT,qty_fraction VARCHAR(5),recipe_id INT,ingredient_id INT, PRIMARY KEY(rcp_ingrdnt_id))";

		
		
	    $cordovaSQLite.execute(db,query1);
	    $cordovaSQLite.execute(db,query2);
	    $cordovaSQLite.execute(db,query3);
	   
	  
	    // var query = "INSERT INTO Favorite_Recipes VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
     //    $cordovaSQLite.execute(db, query, [1,'image','Kare kare','Favorite ko to','Region III','Bataan','Balanga',5,'2016-01-31 11:00:00','Main dishes',5,100,'Luto mo na lang','charlene']).then(function(res) {
     //        console.log("Insert id -> " + res.insertId);
     //    }, function (err) {
     //        console.error(err);
     //    });


     //    query = "INSERT INTO Ingredient VALUES(?,?,?,?,?,?,?)";
     //    $cordovaSQLite.execute(db, query, [1,'sugar','kilo(s)',5,'2016-01-31 12:00:00','','charlene']).then(function(res){
     //    	console.log("Insert ingredient id -> " + res.insertId);
     //    },function(err){
     //    	console.log(err);
     //    });


     //    query = "INSERT INTO Ingredient VALUES(?,?,?,?,?,?,?)";
     //    $cordovaSQLite.execute(db, query, [2,'salt','kilo(s)',5,'2016-01-31 12:00:00','','charlene']).then(function(res){
     //    	console.log("Insert ingredient id -> " + res.insertId);
     //    },function(err){
     //    	console.log(err);
     //    });
     //    query = "INSERT INTO Recipe_Ingredient VALUES(?,?,?,?,?)";
     //    $cordovaSQLite.execute(db, query,[1,2,'1/2',1,2]).then(function(res){
     //    	console.log("Insert recipe ingredient id -> " + res.insertId);
     //    },function(err){
     //    	console.log(err);
     //    })

     //    query = "INSERT INTO Recipe_Ingredient VALUES(?,?,?,?,?)";
     //    $cordovaSQLite.execute(db, query,[2,2,'1/2',1,1]).then(function(res){
     //    	console.log("Insert recipe ingredient id -> " + res.insertId);
     //    },function(err){
     //    	console.log(err);
     //    })


       


     //    $rootScope.rcpingOffline = [];
     //    var query = "SELECT rcp_ingrdnt_id,qty,qty_fraction,recipe_id,ingredient_name,ingredient_uom,ingredient_cal FROM Recipe_Ingredient JOIN Ingredient ON Ingredient.ingredient_id = Recipe_Ingredient.ingredient_id WHERE recipe_id = ?";
     //    $cordovaSQLite.execute(db, query,[1]).then(function(res) {
     //        if(res.rows.length > 0) {
     //            // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
     //     		console.log('list of recipe ing item');
     //        	for (var i = 0; i < res.rows.length; i++) {
            		
     //        		$rootScope.rcpingOffline[i] = res.rows.item(i);
     //        		console.log(res.rows.item(i).rcp_ingrdnt_id);
     //        	};
            
            	
     //        } else {
     //            console.log("No recipe ingredient found");
     //        }
     //    }, function (err) {
     //        console.error(err);
     //    });

     //    $scope.frcp = [];

     //    var query = "SELECT recipe_name, recipe_desc FROM Favorite_Recipes";
     //    $cordovaSQLite.execute(db, query).then(function(res) {
     //        if(res.rows.length > 0) {
     //            // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
     //     		console.log('list of item');
     //        	for (var i = 0; i < res.rows.length; i++) {
     //        		console.log(res.rows.item(i).recipe_name);
     //        		$scope.frcp = res.rows.item(i);
     //        	};

     //        	console.log($scope.frcp);
     //        } else {
     //            console.log("No results found");
     //        }
     //    }, function (err) {
     //        console.error(err);
     //    });

     //    $scope.ing = [];
     //    var query = "SELECT ingredient_id, ingredient_name FROM Ingredient";
     //    $cordovaSQLite.execute(db, query).then(function(res) {
     //        if(res.rows.length > 0) {
     //            // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
     //     		console.log('list of item');
     //        	for (var i = 0; i < res.rows.length; i++) {
     //        		console.log(res.rows.item(i).ingredient_name);
     //        		$scope.ing = res.rows.item(i);
     //        	};

     //        	console.log($scope.ing);
     //        } else {
     //            console.log("No results found");
     //        }
     //    }, function (err) {
     //        console.error(err);
     //    });
	    
	    
		
		

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