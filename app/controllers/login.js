var login = angular.module('login',['userService','ngCordova']);

login.controller('loginCtrl',['$scope','$timeout','userService','$cordovaSpinnerDialog','$cordovaSQLite',function($scope,$timeout,userService,$cordovaSQLite){
	$scope.showLoginError = false;
	
	$scope.exitApplication = function() {
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
	$scope.goToGuestFeed = function() {
		nav.pushPage('app/views/guest/home.html');
		$scope.showLoginError = false;
	};	

	$scope.goToSignUp = function() {
		nav.pushPage(userViewUrl + 'sign_up.html');
		$scope.showLoginError = false;
	};

	$scope.checkInput = function() {
		if(angular.isUndefined($scope.username) || angular.isUndefined($scope.password) 
		|| $scope.username == '' || $scope.password == '')
		{
			$scope.isValid = false;
		}
		else
		{
			$scope.isValid = true;
		}
	}
	$scope.auth = function() {
		loginModal.show();
		$scope.accountInfo = {
			username: $scope.username,
			password: $scope.password
		};

		userService.auth({},$scope.accountInfo).$promise.then(function(result){
			if(result.length > 0)
			{
				if(result[0].type === 'admin')
				{
					localStorage.setItem('admin',$scope.username);
					nav.pushPage(adminViewUrl + 'main.html');
				}
				else
				{
					localStorage.setItem('user',$scope.username);
					nav.pushPage(userViewUrl + 'home.html');
				}
				$scope.showLoginError = false;
				$scope.username = '';
				$scope.password = '';
				db = $cordovaSQLite.openDB("my.db");
			    var query1 = "CREATE TABLE IF NOT EXISTS Recipe(recipe_id INT,recipe_img VARCHAR(100),recipe_name VARCHAR(50),recipe_desc VARCHAR(500),region VARCHAR(30),province VARCHAR(30),city VARCHAR(30),ave_rating DECIMAL(3,2) DEFAULT 0,date_posted TIMESTAMP,category VARCHAR(30),no_of_serving INT,no_of_view INT,procedures VARCHAR(10000),username VARCHAR(20),PRIMARY KEY(recipe_id));";
				var query2 = "CREATE TABLE IF NOT EXISTS Ingredient(ingredient_id INT,ingredient_name VARCHAR(50),ingredient_uom VARCHAR(20),ingredient_cal INT, date_added TIMESTAMP, date_updated TIMESTAMP,username VARCHAR(20),PRIMARY KEY(ingredient_id))";
				var query3 = "CREATE TABLE IF NOT EXISTS Recipe_Ingredient(rcp_ingrdnt_id INT,qty INT,qty_fraction VARCHAR(5),recipe_id INT,ingredient_id INT, PRIMARY KEY(rcp_ingrdnt_id))";
				var query4 = "CREATE TABLE IF NOT EXISTS Category(category_id INT,category_name VARCHAR(100),category_img VARCHAR(100), PRIMARY KEY(category_id))";
				
				
			    $cordovaSQLite.execute(db,query1);
			    $cordovaSQLite.execute(db,query2);
			    $cordovaSQLite.execute(db,query3);
			    $cordovaSQLite.execute(db,query4);
			}
			else
			{
				$scope.showLoginError = true;
			}
			
			loginModal.hide();
		});
	};

	$scope.goToAdmin = function() {
		nav.pushPage(adminViewUrl + 'main.html');
		$scope.showLoginError = false;
	};

	$scope.goToAdminBackDoor = function() {
		nav.pushPage(adminViewUrl + 'main.html');
		localStorage.setItem('admin',$scope.username);
	};


}]);