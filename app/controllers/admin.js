var admin = angular.module('admin',['recipeService','adminService']);

admin.controller('adminCtrlr',['$scope','$rootScope','$timeout','$interval','adminService',
	'recipeService','$cordovaCamera','$cordovaFileTransfer',
	function($scope,$rootScope,$timeout,$interval,adminService,recipeService,$cordovaCamera,$cordovaFileTransfer){
	$rootScope.imgSrc = '';

	$scope.title = "Admin";
	$scope.ingredient = {};
	var count; 
	var temp;
	var imageExtension;
	var imageName;
	var rpimg;
	$rootScope.category_img = '';
	$scope.changeTitle = function(title) {
		$scope.title = title;
	}

	
	refreshNotifications();
	refreshIngredients();
	refreshAdminList();
	refreshCategories();

	$interval(checkNewNotifications,500);

	function checkNewNotifications()
	{
		getNotificationsCount();
		if(count != undefined)
		{
			if(temp < count)
			{
				refreshNotifications();
			}
		}
	}
	function getNotificationsCount()
	{
		//get the number of notification
		adminService.notificationsCount().$promise.then(function(notificationsCount){
			count = notificationsCount[0];
		});
	}
	
	function refreshNotifications()
	{
		//get the ingredient calorie request notification
		adminService.notifications().$promise.then(function(notifications){
			$rootScope.notifications = notifications;
			temp = notifications.length;
		});	
	}
	
	function refreshIngredients()
	{
		//get the list of ingredientws
		adminService.ingredients().$promise.then(function(ingredients){
			$rootScope.ingredients = ingredients;
		});
	}

	function refreshAdminList()
	{
		adminService.list().$promise.then(function(admins){
			$rootScope.admins = admins;
			console.log(admins);
		});
	}
	
	//load the notification
	$rootScope.loadNotifications = function($done) {
		var ingredientCount = $rootScope.notifications.length;
	      $timeout(function() {
	        refreshNotifications();
	        $done();
	      }, 1000);
    };

    //load ingredients
    $rootScope.loadIngredients = function($done) {
	      $timeout(function() {
	        refreshIngredients();
	        $done();
	      }, 1000);
    };


    function refreshCategories()
    {
    	recipeService.categories().$promise.then(function(categories){
			$scope.categories = categories;
		});
    }
	
	/*=========================================================================
				ADD INGREDIENT CALORIE
	===========================================================================*/
	$scope.showAddCalorieDialog = function(ingredient) {
		adminTabBar.setActiveTab(1);
		//root scope para hanggang dialog makuha pa din un value ng ingredient object kaht walang controller dun
		ons.createDialog(adminViewUrl + 'notifications/addCalorie.html').then(function(addCalorieDialog){
			addCalorieDialog.show();
			$rootScope.addCal_name = ingredient.ingredient_name;
			$rootScope.addCal_measurement = ingredient.ingredient_uom;
			$rootScope.addCal_id = ingredient.ingredient_id;
		});
	};
	$rootScope.addCalorie = function(addCal_cal) {
		//@params - ito yun ieedit ng function na to
		$scope.ingredient = {
			cal: addCal_cal,
			updated_by_admin: 1,
			date_updated: moment().format('YYYY-MM-DD HH:mm:ss')
		};
		console.log(addCal_cal);
		console.log($rootScope.addCal_id);
		adminService.addCalorie({id: $rootScope.addCal_id}, $scope.ingredient).$promise.then(function(res){
			console.log(res.response);
			refreshNotifications();
			refreshIngredients();
			addCalorieDialog.hide();
		});
		
	};

	/*=========================================================================
				UPDATE INGREDIENT
	===========================================================================*/
	$scope.showUpdateIngredientDialog = function(ingredient) {
		ons.createDialog(adminViewUrl + 'ingredients/updateIngredient.html').then(function(updateIngredientDialog){
			updateIngredientDialog.show();
			$rootScope.updateIng_name = ingredient.ingredient_name;
			$rootScope.updateIng_measurement = ingredient.ingredient_uom;
			$rootScope.updateIng_id = ingredient.ingredient_id;
			$rootScope.updateIng_cal = parseInt(ingredient.ingredient_cal);
		});
	};
	$rootScope.updateIngredient = function(name,measurement,cal) {
		$scope.ingredient = {
			name: name,
			measurement: measurement,
			cal: cal,
			date_updated: moment().format('YYYY-MM-DD HH:mm:ss')
		};
		console.log($scope.ingredient);
		adminService.updateIngredient({id: $rootScope.updateIng_id}, $scope.ingredient).$promise.then(function(res){
			console.log(res.response);
			refreshIngredients();
			updateIngredientDialog.hide();
		});
		
	};

	$rootScope.updateIngDisableInput = function(name,measurement,cal) {
		if(name == false || measurement == false || cal == false)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	/*=========================================================================
				ADD INGREDIENT
	===========================================================================*/
	$scope.showAddIngredientDialog = function() {
		ons.createDialog(adminViewUrl + 'ingredients/addIngredient.html').then(function(addIngredientDialog){
			addIngredientDialog.show();
		});
	};
	$rootScope.addIngredient = function(name,measurement,cal) {
		console.log(name + ' ' + measurement + ' ' + cal);
		$scope.ingredient = {
			name: name,
			measurement: measurement,
			cal: cal,
			updated_by_admin: 1,
			date_added: moment().format('YYYY-MM-DD HH:mm:ss'),
			date_updated: moment().format('YYYY-MM-DD HH:mm:ss'),
			username: localStorage.getItem('admin') 
		};
		adminService.addIngredient({},$scope.ingredient).$promise.then(function(res){
			refreshIngredients();
			addIngredientDialog.hide();
		});
		
	};

	$rootScope.addIngDisableInput = function(name,measurement,cal) {
		if(name == undefined || measurement == undefined || cal == undefined || 
		   name == '' || measurement == '' || cal == '')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	$scope.showAddCategoryDialog = function() {
		ons.createDialog(adminViewUrl + 'categories/addCategoryDialog.html').then(function(addCategoryDialog){
			addCategoryDialog.show();
		});	
	};

	$rootScope.addCategory = function(name,image) {
			$scope.category = {
				category_img: image,
				category_name: name
			};
			adminService.addCategory({},$scope.category).$promise.then(function(res){
				categoryModal.hide();
				refreshCategories();
				
			});
	}

	$rootScope.addCategoryDisableInput = function(name,imgSrc) {
		if(name == undefined || name == '' || imgSrc == undefined || imgSrc == null || imgSrc == '' || imgSrc == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	$scope.showUpdateCategoryDialog = function(category) {
		console.log(category.category_id + category.category_name);
		ons.createDialog(adminViewUrl + 'categories/updateCategoryDialog.html').then(function(updateCategoryDialog){
			$rootScope.updateCategory_id  = category.category_id;
			$rootScope.updateCategory_name = category.category_name;
			updateCategoryDialog.show();
		});	
	};
	
	$rootScope.updateCategory = function(name) {
		$scope.category = {
			category_name: name
		};
		adminService.updateCategory({id: $rootScope.updateCategory_id },$scope.category).$promise.then(function(res){
			console.log(res.response);
			refreshCategories();
			updateCategoryDialog.hide();
		});
		
	};

	$rootScope.updateCategoryDisableInput = function(name) {
		if(name == undefined || name == '')
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	$scope.toggleCategories = function(val) {
		console.log(val);
	}

	$scope.showLogout = function() {
		ons.createPopover(adminViewUrl + 'logout.html').then(function(logoutPopOver){
			logoutPopOver.show('#logout');
		});
	}

	$rootScope.goToLogin = function() {
		logoutPopOver.hide();
		logoutModal.show();
		$timeout(function(){
			localStorage.removeItem('admin');
			nav.replacePage(rootViewUrl + 'login.html');
		},2000);
		
	};

	$rootScope.uploadPicture = function(name) {
		imageName = name + '.' + imageExtension;
		$cordovaFileTransfer.upload("http://recipinoyimg-sdpixels.rhcloud.com/uploadCategoryImg.php?imageName=" + imageName, $rootScope.imgSrc)
          .then(function(result) {
            if(JSON.stringify(result.response) == "Image upload success");
           	{
           		$rootScope.category_img = 'http://recipinoyimg-sdpixels.rhcloud.com/uploads/categories/' + imageName;
           		
           		//add category when image is already uploaded
           		$rootScope.addCategory(name,$rootScope.category_img);
           		
           	}


          }, function(err) {
            // alert(JSON.stringify(err.response));
          }, function (progress) {
          		$timeout(function () {
		          $rootScope.uploadProgress = Math.round((progress.loaded / progress.total) * 100);
		        });
          		addCategoryDialog.hide();
          		categoryModal.show();
          });
	};

	$rootScope.selectPicture = function() { 
		var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	      allowEdit: true,
	      quality: 100,
	      targetWidth: 512,
	      targetHeight: 512
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      var image = document.getElementById('myImage');
	      $rootScope.imgSrc = imageURI;
	      imageExtension = imageURI.substr(imageURI.lastIndexOf('.') + 1,3);
	    }, function(err) {
	      // error
	    });

	};


	



}]);