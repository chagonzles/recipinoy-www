var login = angular.module('login',['userService','ngCordova']);

login.controller('loginCtrl',['$scope','$timeout','userService','$cordovaSpinnerDialog',function($scope,$timeout,userService){
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