var user = angular.module('user',['recipeService','userService']);

user.controller('userCtrlr',['$scope','$rootScope','$timeout','$filter','$interval','$http','userService',
	'recipeService','adminService','$cordovaCamera','$cordovaFileTransfer','$cordovaSQLite','$cordovaFile',
	function($scope,$rootScope,$timeout,$filter,$interval,$http,userService,recipeService,adminService,
			 $cordovaCamera,$cordovaFileTransfer,$cordovaSQLite,$cordovaFile){
	$('#menu-page').css('background', '#333834 !important');
	$scope.userChecking = false;
	$scope.emailChecking = false;
	$scope.gender = 'Male';
	$scope.isUsernameAvailable = false;
	$scope.isEmailAvailable = false;
	$scope.agreement = false;
	$rootScope.submittedUser = {};
	$rootScope.loggedUsername = localStorage.getItem('user');
	$rootScope.ingCount;
	$rootScope.ingTemp;
	$rootScope.loadingIngredients = false;
	$scope.rcpIngredient = [];
	$rootScope.starRating = [];
	$rootScope.noStarRating = [];
	$rootScope.userAlreadyReviewed = false;
	$rootScope.userAlreadyFavorited = false;
	$scope.totalCalorie = 0;


	$rootScope.no_of_online_favorites = 0;






	$scope.suggestionsClicked = false;
	$scope.ingnamelist = [];
	$scope.showIngListError = false;
	var ans;
	console.log($scope.dob);

	var recipeImgExtension;


	document.addEventListener("deviceready", function () {
		


		
		


		getCategories();
		checkIfThereIsOnlineRecipes();
		function initializeUserDB()
		{
			// $cordovaSQLite.deleteDB("my.db");
			db = $cordovaSQLite.openDB("my.db");
		    var query1 = "CREATE TABLE IF NOT EXISTS Recipe(recipe_id INT,recipe_img VARCHAR(100),recipe_name VARCHAR(50),recipe_desc VARCHAR(500),region VARCHAR(30),province VARCHAR(30),city VARCHAR(30),ave_rating DECIMAL(3,2) DEFAULT 0,date_posted TIMESTAMP,category VARCHAR(30),no_of_serving INT,no_of_view INT,procedures VARCHAR(10000),username VARCHAR(20),PRIMARY KEY(recipe_id));";
			var query2 = "CREATE TABLE IF NOT EXISTS Ingredient(ingredient_id INT,ingredient_name VARCHAR(50),ingredient_uom VARCHAR(20),ingredient_cal INT, date_added TIMESTAMP, date_updated TIMESTAMP,username VARCHAR(20),PRIMARY KEY(ingredient_id))";
			var query3 = "CREATE TABLE IF NOT EXISTS Recipe_Ingredient(rcp_ingrdnt_id INT,qty INT,qty_fraction VARCHAR(5),recipe_id INT,ingredient_id INT, PRIMARY KEY(rcp_ingrdnt_id))";
		
			
			
		    $cordovaSQLite.execute(db,query1);
		    $cordovaSQLite.execute(db,query2);
		    $cordovaSQLite.execute(db,query3);
	
			 
		}



		function checkIfThereIsOnlineRecipes()
		{
			initializeUserDB();
		

			recipeService.query().$promise.then(function(result){
				
				$rootScope.no_of_online_recipes = result.length;
				$scope.recipes_online = result;
				console.log('no of online recipes ' + result.length);
				var query = "SELECT recipe_id FROM Recipe";
		        $cordovaSQLite.execute(db, query).then(function(res) {
		        	if(res.rows.length > 0 || res.rows.length == 0)
		        	{
		        		$rootScope.no_of_offline_recipes = res.rows.length;
		        		console.log('no of offline recipes ' + res.rows.length);
		        		if($rootScope.no_of_online_recipes > $rootScope.no_of_offline_recipes)
		        		{
		        			//drop the db and insert everything on online to offline
		        			angular.forEach($scope.recipes_online, function(recipe,i){
		        				console.log(recipe);
		        				addToRecipesOffline(recipe);
		        			});

		        		}
		        	}
		           
		        }, function (err) {
		            console.error(err);
		        });
				
			});


		};



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


	



	userService.profile({id: localStorage.getItem('user')}).$promise.then(function(profile){
			$rootScope.userProfile = profile;
			console.log($rootScope.userProfile);
	});

	$rootScope.backToUserDiscover = function() {
		
		nav.pushPage(userViewUrl + 'home.html');
	};
	
	
	$scope.changeTitle = function(title) {
		$scope.title = title;
	};
	$scope.checkUsername = function() {
		$scope.usernameChecking = true;
		$scope.user = {
			username: $scope.username
		};
		userService.checkUsername({},$scope.user).$promise.then(function(res){
			if(res[0] == 1)
			{
				$scope.isUsernameAvailable = false;
			}
			else
			{
				$scope.isUsernameAvailable = true;
			}
			$scope.usernameChecking = false;
		});
	};
	$scope.checkEmail = function() {
		$scope.emailChecking = true;
		$scope.emailAdd = {
			email: $scope.email
		};
		userService.checkEmail({},$scope.emailAdd).$promise.then(function(res){
			if(res[0] == 1)
			{
				$scope.isEmailAvailable = false;
			}
			else
			{
				$scope.isEmailAvailable = true;
			}
			$scope.emailChecking = false;
		});
	};

	$scope.signUp = function() {
		var bday = new Date($scope.dob);
		var dob = bday.getFullYear() + '-' + (bday.getMonth() + 1) + '-' + bday.getDate();
		console.log(dob);
		signUpModal.show();
		$rootScope.submittedUser = {
			user_img: 		'assets/img/user.png',
			fname: 		$scope.fname,
			lname: 		$scope.lname,
			mname: 		$scope.mname,
			dob: 		dob,
			gender: 	$scope.gender,
			address: 	$scope.address,
			email: 		$scope.email,
			contact_no: $scope.contact_no,
			username: 	$scope.username,
			password: 	$scope.password
		};
		userService.signUp({},$rootScope.submittedUser).$promise.then(function(res){
			signUpModal.hide();
			if(res.response == "Successfully added 1 new user.")
			{
				$rootScope.loggedUsername = $rootScope.submittedUser['username'];
				nav.pushPage(userViewUrl + 'welcome.html');
				localStorage.setItem('user',$scope.username);
			}
		});
	};


	$rootScope.goToUserHomePage = function() {
		nav.pushPage(userViewUrl + 'home.html');
	};

	$rootScope.goToMyProfile = function() {
		userService.profile({id: localStorage.getItem('user')}).$promise.then(function(profile){
			console.log(profile);
			$rootScope.userProfile = profile;
			console.log($rootScope.userProfile);
			nav.pushPage(userViewUrl + 'account/profile.html');
		});

	}

	function refreshMyRecipes()
	{
		userService.getMyRecipes({id: $rootScope.loggedUsername}).$promise.then(function(res){
			$rootScope.myrecipes = res;
		});
	}

	$rootScope.refreshMyRecipes = function() {
		refreshMyRecipes();
	}
	refreshMyRecipes();


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
		$scope.isLoadingMostViewed = true;
		$scope.isLoadingTopRated = true;
		$scope.isLoadingRecent = true;
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

		console.log('refreshing data');
		
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
			$rootScope.selectedProvinces.splice(0,$rootScope.selectedProvinces.length);
			for (var i = 0; i < $scope.provinces.length; i++) {
				if($scope.provinces[i].region_id == region_id)
				{
					$rootScope.selectedProvinces.push($scope.provinces[i].name);
				}				
			};
			$rootScope.isRegion(region_id);
			console.log($rootScope.selectedProvinces);
	};
	$rootScope.goToRecipeView = function(recipe_id) {
		$rootScope.view_recipe_id = recipe_id;
		nav.pushPage('app/views/recipe/main.html');
		$rootScope.recipe = {};
		$rootScope.userAlreadyReviewed = false;
		recipeService.update_view_no({id: $rootScope.view_recipe_id}).$promise.then(function(){
			refreshRatingReviews(recipe_id);
		});

		$scope.getUserReviewCount($rootScope.loggedUsername,recipe_id);
		checkIfFavorited(recipe_id);
		
	};
	

	$rootScope.isRegion = function(region) {
		console.log($rootScope.selectedProvinces);
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
		refreshMyRecipes();
		nav.popPage();
	};

	$scope.search = function() {
		refreshRecipes();
		nav.pushPage('app/views/user/search.html');
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
		}
	};


	$rootScope.goToDiscover = function() {
		userMenu.setMainPage(userViewUrl + 'discover.html', {closeMenu: true});
		refreshMyRecipes();
	}

	$rootScope.goToAbout = function() {
		nav.pushPage(rootViewUrl + 'about.html');
	}

	$rootScope.goToMyRecipes = function(){
		nav.pushPage(userViewUrl + 'my_recipe/list.html');
		refreshMyRecipes();
	}



	$rootScope.goToAddRecipe = function(){
		$rootScope.addRecipeImg = '';
		$rootScope.recipeImgExtension = '';
		nav.pushPage(userViewUrl + 'add_recipe/information.html');
		refreshIngredients();
	}

	
	$rootScope.selectRecipeImg = function() {
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
	      $rootScope.addRecipeImg = imageURI;
	      recipeImgExtension = imageURI.substr(imageURI.lastIndexOf('.') + 1,3);
	    }, function(err) {
	      // error
	    });
	};


	$rootScope.takeRecipeImg = function() {
		var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      encodingType: Camera.EncodingType.JPEG,
	      allowEdit: true,
	      quality: 100,
	      targetWidth: 512,
	      targetHeight: 512
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      var image = document.getElementById('myImage');
	      $rootScope.addRecipeImg = imageURI;
	    }, function(err) {
	      // error
	    });
	};



	$rootScope.uploadRecipeImg = function() {
		addRecipeModal.show();
		name =  $rootScope.recipeInfo['recipe_name'].replace(/\s/g, '').toLowerCase();
		imageExtension = $rootScope.addRecipeImg.substr($rootScope.addRecipeImg.lastIndexOf('.') + 1,3);
		imageName = name + '.' + imageExtension;
		// alert(imageName);
		$cordovaFileTransfer.upload("http://recipinoyimg-sdpixels.rhcloud.com/uploadRecipeImg.php?imageName=" + imageName, $rootScope.addRecipeImg)
          .then(function(result) {
            if(JSON.stringify(result.response) == "Image upload success");
           	{
           		$rootScope.recipeInfo['recipe_img'] = 'http://recipinoyimg-sdpixels.rhcloud.com/uploads/recipes/' + imageName;
        		$rootScope.recipeInfo['procedures'] = $scope.procedure;
           		//add recipe when image is being uploaded
           		$rootScope.shareRecipe($rootScope.recipeInfo);
           	}

          }, function(err) {
          		addRecipeModal.hide();
            	ons.notification.alert({
			      message: 'Something went wrong! Please try again'
			    });

          }, function (progress) {
          		$timeout(function () {
		          $scope.uploadRecipeImgProgress = Math.round((progress.loaded / progress.total) * 100);
		        });
               	
          });
	};

	$rootScope.shareRecipe = function(recipe) {
		$scope.no = 0;
		console.log($rootScope.recipeInfo);
		userService.shareRecipe({},recipe).$promise.then(function(res){
			if(!isNaN(res.recipe_id)) //if number un recipe_id or nakuha nya un recipe_id
			{
				$rootScope.addedRecipeName = recipe['recipe_name'];

				angular.forEach($scope.rcpIngredient, function(rcpIngredient,index){
					userService.checkIfExistIngredient({},rcpIngredient).$promise.then(function(ingredient){
						console.log(ingredient); //array
						if(ingredient.length > 0) // pag nasa ingredient table
						{
							console.log('ingredient id: ' + ingredient[0].ingredient_id);
							console.log(rcpIngredient.qty + ' ' + rcpIngredient.qty_fraction + ' ' + rcpIngredient.name);
							console.log('current index of array ' + index);
							$scope.recipeIngredient = {
								qty: rcpIngredient.qty,
								qty_fraction: rcpIngredient.qty_fraction,
								ingredient_id: ingredient[0].ingredient_id,
								recipe_id: res.recipe_id
							};
							userService.addRecipeIngredient({},$scope.recipeIngredient).$promise.then(function(rcpIngredient){
								console.log(rcpIngredient);
							});
						}
						else
						{
							console.log('wala sa ingredient table');
							console.log(rcpIngredient.qty + ' ' + rcpIngredient.qty_fraction + ' ' + rcpIngredient.name);
						
							$scope.ingredienToBeAddToDb = {
								qty: rcpIngredient.qty,
								qty_fraction: rcpIngredient.qty_fraction,
								ingredient_name: rcpIngredient.name,
								ingredient_uom: rcpIngredient.measurement,
								username: localStorage.getItem('user')
							};
							console.log('current index of array ' + index);
							console.log($scope.ingredienToBeAddToDb);
							userService.addIngredient({},$scope.ingredienToBeAddToDb).$promise.then(function(newingredient){
									$scope.newIngredientId = newingredient.ingredient_id;
									if($scope.newIngredientId > 0)
									{
										$scope.newrecipeIngredient = {
											qty: rcpIngredient.qty,
											qty_fraction: rcpIngredient.qty_fraction,
											recipe_id: res.recipe_id,
											ingredient_id: $scope.newIngredientId
										};
										console.log($scope.newrecipeIngredient);
										userService.addRecipeIngredient({},$scope.newrecipeIngredient);
									};
									
							}); // addIngredient service
						} //if nasa ingredient or wala
				
					}); //check ingredient calorie		
				
				}); // foreach
				
				nav.pushPage(userViewUrl + 'add_recipe/verification.html');
			} // if recipe id is a number
			
		}); // share recipe
	}; // post recipe


	$rootScope.goToAddRcpIngrdntProc = function(name,description,category,region,province,no_of_serving) {
		if(description == '' || description == null || description == undefined)
		{
			description = 'No description';
		}
		$rootScope.recipeInfo = {
			recipe_name: name,
			recipe_desc: description,
			category_id: category.category_id,
			region: region.name, 
			province: province,
			no_of_serving: no_of_serving,
			username: localStorage.getItem('user'),
			date_posted: moment().format('YYYY-MM-DD HH:mm:ss')
		};

		console.log($rootScope.recipeInfo);
		console.log($rootScope.addRecipeImg);
		nav.pushPage(userViewUrl + 'add_recipe/ingredients_procedures.html');
	};

	/*============================================== INGREDIENTS================================================*/
	function checkNewIngredients()
	{
		getIngredientsCount();
		if($rootScope.ingCount != undefined)
		{
			if($rootScope.ingTemp < $rootScope.ingCount)
			{
				$scope.loadingIngredients = true;
				refreshIngredients();

			}
		}
	}

	function getIngredientsCount()
	{
		userService.ingredientsCount().$promise.then(function(ingredientsCount){
			$rootScope.ingCount = ingredientsCount[0];
		});
	}

	function refreshIngredients()
	{
		//get the list of ingredientws
		userService.getIngredients().$promise.then(function(ingredients){
			$rootScope.ingredients = ingredients;
			$rootScope.ingTemp = ingredients.length;
			$scope.loadingIngredients = false;
		});	
	}


	
	$rootScope.checkIngredients = function() {
		checkNewIngredients();
	}

	$scope.pickIngredient = function(ingredient) {
		$scope.ingName = ingredient.ingredient_name;
		$scope.ingUnit = ingredient.ingredient_uom;
		$scope.suggestionsClicked = true;
	}

	$rootScope.existingIngredientsinList = function(ingName) {
		if($scope.ingnamelist.length > 0 && $scope.ingnamelist.indexOf(ingName) >= 0)
		{
				$scope.showIngListError = true;
		}
		else
		{
				$scope.showIngListError = false;
		}
	}
	$rootScope.disableButton = function(ingQty,ingFraction,ingName,ingUnit) {

		if(ingName == undefined || ingUnit == undefined || ingQty == undefined  || ingQty < 0
			|| ingFraction == '' || ingName == '' || ingUnit == ''|| ingQty == null  
			|| ingFraction == null || ingUnit == null || $scope.ingnamelist.indexOf(ingName) >= 0)
			{	
			if($scope.ingnamelist.length > 0 && $scope.ingnamelist.indexOf(ingName) >= 0)
			{
				$scope.ingListError = ingName + ' is already in your ingredients.';
				$scope.showIngListError = true;
			}
			else
			{
				$scope.showIngListError = false;
			}
			return true;
		}
		else
		{
			return false;
		}
	}
	$rootScope.addToRcpIngredient = function(qty,fraction,name,unit) {
		console.log('gjgj');
		if($scope.ingnamelist.indexOf(name) < 0)
		{
			if(fraction == '--')
			{
				fraction = '';
			}
			$scope.ing = {
				qty: qty,
				qty_fraction: fraction,
				name: name,
				measurement: unit
			}
			$scope.ingnamelist.push(name);
			$scope.rcpIngredient.push(
				$scope.ing
			);

			console.log($scope.rcpIngredient);
		}
		$scope.ingQty = '';
		$scope.ingFraction = '';
		$scope.ingName = '';
		$scope.ingUnit = '';
	}
	$scope.confirmRemoveIngredient = function(ingredient) {
		$scope.ingredientToBeRemoved = ingredient;
		ons.createDialog(userViewUrl + 'add_recipe/confirmDelete.html').then(function(confirmDelete){
			$rootScope.message = 'Are you sure you want to remove ' + ingredient.name + '?';
			confirmDelete.show();
		});

	}

	$rootScope.removeIngredient = function() {
		console.log($scope.ingredientToBeRemoved);
		$scope.rcpIngredient.splice($scope.rcpIngredient.indexOf($scope.ingredientToBeRemoved),1);
		$scope.ingnamelist.splice($scope.ingnamelist.indexOf($scope.ingredientToBeRemoved.name),1); 
		if($scope.ingredientToBeRemoved.name == $scope.ingName)
		{
			$scope.showIngListError = false;
		}
		confirmDeleteIngredient.hide();
		console.log($scope.rcpIngredient);
		console.log($scope.ingnamelist);
		$scope.ingredientToBeRemoved = {};
	}







	

	$rootScope.goToLogin = function() {
		// $cordovaSQLite.deleteDB("my.db");
		logoutModal.show();
		$timeout(function(){
			localStorage.removeItem('user');
			$rootScope.loggedUsername = null;
			// $rootScope.loggedUsername = '';
			nav.replacePage(rootViewUrl + 'login.html');
		},2000);
		
	};



	$rootScope.showRateDialog = function(recipe_id,recipe_name,review,rating) {
		console.log('dasd');
		console.log($rootScope.userAlreadyReviewed);
		$rootScope.dialogInitRating = [];
		for(var x = 0; x < 5; x++)
		{
			$rootScope.dialogInitRating[x] = x;
		}
		console.log(recipe_id);
		ons.createDialog(userViewUrl + 'ratingReviewDialog.html').then(function(ratingReviewDialog){
			ratingReviewDialog.show();
			$rootScope.rateDialogRecipe_Id = recipe_id;
			$rootScope.rateDialogRecipe_Name = recipe_name;
			if((rating != null || rating != undefined || rating != '' || rating != 0) && $rootScope.userAlreadyReviewed == true)
			{
				$rootScope.userRating = rating;
			}
			else
			{
				$rootScope.userRating = 0;
			}
			if((review != null || review != '' || review != undefined) &&  $rootScope.userAlreadyReviewed == true)
			{
				$rootScope.review_content = review;
				console.log('may review');
			}
			else
			{
				$rootScope.review_content = '';
				console.log('walangss review');
			}

		});
		
	};

	$rootScope.getRatingNo = function(no) {
		$rootScope.userRating = parseInt(no) + 1;
	}

	$rootScope.addRatingReview = function(userRating,review,recipe_id) {
		ratingReviewDialog.hide();
		addReviewRatingModal.show();
		console.log(userRating + ' ' + recipe_id);
		$scope.ratingReview = {
			recipe_id: recipe_id,
			username: localStorage.getItem('user'),
			rating: userRating,
			review_content: review,
			date_reviewed: moment().format('YYYY-MM-DD HH:mm:ss'),
		};
		console.log($scope.ratingReview);
		userService.addRatingReview({},$scope.ratingReview).$promise.then(function(response){
			console.log(response);
			refreshRatedRecipe(recipe_id);
			
			addReviewRatingModal.hide();
			$rootScope.userRating = 0;
		});

	};


	function refreshRatedRecipe(recipe_id)
	{
		$rootScope.starRating = [];
		$rootScope.noStarRating = [];
		recipeService.view({id: recipe_id}).$promise.then(function(recipe){
			$rootScope.recipe = recipe[0];
				
			
				for(var i = 0; i < Math.round(recipe[0].ave_rating); i++)
				{
					$rootScope.starRating[i] = i;
				}
				$rootScope.noStarRating.length = 5 - $rootScope.starRating.length;
				console.log('updated: ' + $rootScope.starRating.length);

				refreshRatingReviews(recipe_id);
		
		});

		// recipeService.view({id: recipe_id, content: 'reviews'}).$promise.then(function(reviews){
		// 	$rootScope.recipeReviews = reviews;
		// 	console.log(reviews);
		// });

		
	}



	function refreshRatingReviews(recipe_id)
	{
		$rootScope.recipeReviews = [];
		recipeService.view({id: recipe_id, content: 'reviews'}).$promise.then(function(reviews){
			$rootScope.recipeReviews = reviews;
			if(findIndex(reviews,'username',$rootScope.loggedUsername) != null)
			{
				$rootScope.userAlreadyReviewed = true;
			}
			else
			{
				$rootScope.userAlreadyReviewed = false;
			}

		},function(){
			$rootScope.recipeReviews = [];
		});


	}


	$scope.getUserReviewCount = function(username,recipe_id){
		userService.reviewCount({id: username,params: recipe_id}).$promise.then(function(res){
			$rootScope.userReviewCount = res.review_count;
		});
	}


	function findIndex(arraytosearch, key, valuetosearch) {
 
		for (var i = 0; i < arraytosearch.length; i++) {
	 
			if (arraytosearch[i][key] == valuetosearch) {
				return i;
			}
		}
		return null;
	}
	

	$rootScope.showEditDeleteReview = function(rating,review,review_id) {
		ons.createPopover(userViewUrl + 'editDeleteReview.html').then(function(editDeleteReviewPopOver){
			$rootScope.editUserRating = rating;
			$rootScope.editUserReview = review;
			$rootScope.editUserReviewId = review_id;
			editDeleteReviewPopOver.show('#editDeleteReview');
		});
		console.log('fckasd');
	}



	$rootScope.editReviewRating = function() {
		$rootScope.dialogInitRating = [];
		for(var x = 0; x < 5; x++)
		{
			$rootScope.dialogInitRating[x] = x;
		}
		console.log($rootScope.recipe.recipe_id + ' ' + $rootScope.recipe.recipe_name + ' ' + $rootScope.editUserRating + ' ' + $rootScope.editUserReview); 
		ons.createDialog(userViewUrl + 'editRatingReviewDialog.html').then(function(ratingReviewDialog){
			ratingReviewDialog.show();
			$rootScope.rateDialogRecipe_Id = $rootScope.view_recipe_id;
			$rootScope.rateDialogRecipe_Name = $rootScope.recipe.recipe_name;
			$rootScope.userRating = $rootScope.editUserRating;
			$rootScope.review = $rootScope.editUserReview;
		});


	}

	$rootScope.updateReviewRating = function(review) {
		ratingReviewDialog.hide();
		updateReviewRatingModal.show();
		$scope.editReviewRatingInfo = {
			rating: $rootScope.userRating,
			review_content: review,
			date_edited: moment().format('YYYY-MM-DD HH:mm:ss'),
			recipe_id: $rootScope.view_recipe_id
		};

		console.log($scope.editReviewRatingInfo);
		editDeleteReviewPopOver.hide();
		userService.updateReviewRating({id: $rootScope.editUserReviewId},$scope.editReviewRatingInfo).$promise.then(function(response){
			console.log(response);
			
			refreshRatedRecipe($rootScope.view_recipe_id);
			updateReviewRatingModal.hide();
		
		});


	}



	$rootScope.confirmDeleteReviewRating = function() {
		ons.createDialog(userViewUrl + 'review/confirmDelete.html').then(function(confirmDelete){
			$rootScope.message = 'Are you sure you want to delete your review?';
			confirmDelete.show();
		});

	}


	$rootScope.deleteReviewRating = function() {
		$scope.deleteReviewRating = {
			recipe_id: $rootScope.view_recipe_id
		};
		console.log('recipe id ' + $rootScope.view_recipe_id);
		userService.deleteReviewRating({id: $rootScope.editUserReviewId}).$promise.then(function(res){
		
			if(res.response == 'Successfully deleted review and rating')
			{
				console.log($rootScope.view_recipe_id);
				userService.updateAveRating({id: $rootScope.view_recipe_id}).$promise.then(function(response){
					console.log(response);

					editDeleteReviewPopOver.hide();
					
					confirmDeleteReview.hide();
					editDeleteReviewPopOver.hide();
					refreshRatedRecipe($rootScope.view_recipe_id);
					$rootScope.userAlreadyReviewed = false;
				});
			}
		});
	}

	// User Reply/Replies
	function refreshUserReplies(review)
	{
		userService.getReplies({id: review.review_id}).$promise.then(function(res){
			$rootScope.userReplies = res;
		});
	}



	$rootScope.goToUserReplies = function(review) {
		nav.pushPage(userViewUrl + 'review/replies.html');
		$rootScope.userRepliesReview = review;
		refreshUserReplies(review);
	}


	$rootScope.addReply = function(reply,review) {
		$scope.reply = {
			review_id: $rootScope.userRepliesReview.review_id,
			reply_content: reply,
			date_replied: moment().format('YYYY-MM-DD HH:mm:ss'),
			username: $rootScope.loggedUsername
		};
		userService.addReply({},$scope.reply).$promise.then(function(res){
			console.log(res);

			refreshUserReplies(review);
		});
	}


	$rootScope.showEditDeleteReply = function(reply_id,reply_content) {
		ons.createPopover(userViewUrl + 'editDeleteReply.html').then(function(editpopover){
			$rootScope.editUserRating = rating;
			$rootScope.editUserReview = review;
			$rootScope.editUserReviewId = review_id;
			editpopover.show('#editDeleteReply');
		});
		console.log('fckasd');
	}


	$rootScope.addToFavorites = function(recipe) {
		$scope.favorite = {
			recipe_id: recipe.recipe_id,
			username: $rootScope.loggedUsername
		};
		userService.addToFavorites({},$scope.favorite).$promise.then(function(res){
			console.log(res);
			ons.notification.alert({
		      message: 'Successfully added to your favorites!',
		      title: 'Success',
		      modifier: true ? 'material' : undefined
		    });

		    checkIfFavorited(recipe.recipe_id);

		    addToFavoritesOffline(recipe);
		    refreshMyFavorites();
		});
	};

	function addToFavoritesOffline(recipe)
	{
		var rp = recipe;


		//url of the online recipe image
		var imgUrl = rp.recipe_img;
	    
	    var trustHosts = true;
	    var options = {};


	    var imageFileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
	  	$cordovaFile.createDir(cordova.file.externalRootDirectory, 'Recipinoy', true).then(function(results){
	  		console.log(results);
	  		if(results.isDirectory == true && results.nativeURL)
	  		{
	  			var targetPath =  results.nativeURL  + imageFileName;
			    $cordovaFileTransfer.download(imgUrl,targetPath, options, trustHosts)
			      .then(function(result) {
			      	// $rootScope.downloadedImg = result.nativeURL;
			      	console.log(result.nativeURL);
			      	
			      	var query = "INSERT INTO Favorite_Recipes VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			        $cordovaSQLite.execute(db, query, [rp.recipe_id, 
			        result.nativeURL, rp.recipe_name, rp.recipe_desc,
			        rp.region, rp.province, rp.city, rp.ave_rating,
			        rp.date_posted, rp.category_name, rp.no_of_serving,
			        rp.no_of_view, rp.procedures, rp.username]).then(function(res) {
			            console.log("Insert id -> " + res.insertId);
			        }, function (err) {
			            console.error(err);
			        });


			        userService.getRecipeIngredients({id: rp.recipe_id}).$promise.then(function(res){
			        	angular.forEach(res,function(rcpi,i){

			        		query = "SELECT ingredient_id FROM Ingredient WHERE ingredient_id = ?";
			        		$cordovaSQLite.execute(db,query, [rcpi.ingredient_id]).then(function(resulta){
			        			//if meron na sa ingredient table na existing ingredient data 
			        			if(resulta.rows.length > 0 )
			        			{
			        				console.log('meron na sa ingredient table e');
			        			}
			        			else
			        			{
			        				query = "INSERT INTO Ingredient VALUES(?,?,?,?,?,?,?)";
							        $cordovaSQLite.execute(db, query,[rcpi.ingredient_id,
						        	rcpi.ingredient_name, rcpi.ingredient_uom, 
						        	rcpi.ingredient_cal, rcpi.date_added, 
						        	rcpi.date_updated, rcpi.username]).then(function(res){
							        	console.log("Insert ingredient id -> " + res.insertId);
							        },function(err){
							        	console.log(err);
							        });
			        			}

			        			query = "INSERT INTO Recipe_Ingredient VALUES(?,?,?,?,?)";
						        $cordovaSQLite.execute(db, query,[rcpi.rcp_ingrdnt_id, rcpi.qty,
						        	rcpi.qty_fraction, rcpi.recipe_id, rcpi.ingredient_id
						        	]).then(function(res){
						        	console.log("Insert recipe ingredient id -> " + res.insertId);
						        },function(err){
						        	console.log(err);
						        });

			        		}); //select if meron na sa ingredient atble
					     
			        	}); //for each
			        }); //get recipe ingredients service




			      }, function(err) {
			        // Error
			        console.log(err);
			      }, function (progress) {
			        $timeout(function () {
			        console.log('downloading..');
			          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
			        });
			      });
	  		}
		}, function(err) {
	  		console.log(err);
		});






		
	}


	function addToRecipesOffline(recipe)
	{
		var rp = recipe;


		//url of the online recipe image
		var imgUrl = rp.recipe_img;
	    
	    var trustHosts = true;
	    var options = {};


	    var imageFileName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
	  	$cordovaFile.createDir(cordova.file.externalRootDirectory, 'Recipinoy', true).then(function(results){
	  		console.log(results);
	  		if(results.isDirectory == true && results.nativeURL)
	  		{
	  			var targetPath =  results.nativeURL  + imageFileName;
			    $cordovaFileTransfer.download(imgUrl,targetPath, options, trustHosts)
			      .then(function(result) {
			      	// $rootScope.downloadedImg = result.nativeURL;
			      	console.log(result.nativeURL);
			      	
			      	var query = "INSERT INTO Recipe VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			        $cordovaSQLite.execute(db, query, [rp.recipe_id, 
			        result.nativeURL, rp.recipe_name, rp.recipe_desc,
			        rp.region, rp.province, rp.city, rp.ave_rating,
			        rp.date_posted, rp.category_name, rp.no_of_serving,
			        rp.no_of_view, rp.procedures, rp.username]).then(function(res) {
			            console.log("Insert id -> " + res.insertId);
			        }, function (err) {
			            console.error(err);
			        });


			        userService.getRecipeIngredients({id: rp.recipe_id}).$promise.then(function(res){
			        	angular.forEach(res,function(rcpi,i){

			        		query = "SELECT ingredient_id FROM Ingredient WHERE ingredient_id = ?";
			        		$cordovaSQLite.execute(db,query, [rcpi.ingredient_id]).then(function(resulta){
			        			//if meron na sa ingredient table na existing ingredient data 
			        			if(resulta.rows.length > 0 )
			        			{
			        				console.log('meron na sa ingredient table e');
			        			}
			        			else
			        			{
			        				query = "INSERT INTO Ingredient VALUES(?,?,?,?,?,?,?)";
							        $cordovaSQLite.execute(db, query,[rcpi.ingredient_id,
						        	rcpi.ingredient_name, rcpi.ingredient_uom, 
						        	rcpi.ingredient_cal, rcpi.date_added, 
						        	rcpi.date_updated, rcpi.username]).then(function(res){
							        	console.log("Insert ingredient id -> " + res.insertId);
							        },function(err){
							        	console.log(err);
							        });
			        			}

			        			query = "INSERT INTO Recipe_Ingredient VALUES(?,?,?,?,?)";
						        $cordovaSQLite.execute(db, query,[rcpi.rcp_ingrdnt_id, rcpi.qty,
						        	rcpi.qty_fraction, rcpi.recipe_id, rcpi.ingredient_id
						        	]).then(function(res){
						        	console.log("Insert recipe ingredient id -> " + res.insertId);
						        },function(err){
						        	console.log(err);
						        });

			        		}); //select if meron na sa ingredient atble
					     
			        	}); //for each
			        }); //get recipe ingredients service




			      }, function(err) {
			        // Error
			        console.log(err);
			      }, function (progress) {
			        $timeout(function () {
			        console.log('downloading..');
			          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
			        });
			      });
	  		}
		}, function(err) {
	  		console.log(err);
		});






		
	}

	$rootScope.removeToFavorites = function(recipe) {
		userService.removeToFavorites({id: recipe.recipe_id, params: $rootScope.loggedUsername}).$promise.then(function(res){
			console.log(res);
				console.log('naremove');
			        ons.notification.alert({
				      message: 'Successfully removed to your favorites!',
				      title: 'Success',
				      modifier: true ? 'material' : undefined
				    });

				    checkIfFavorited(recipe.recipe_id);
				    refreshMyFavorites();


		});
	};

	function refreshMyFavorites()
	{
		userService.getFavorites({id: $rootScope.loggedUsername}).$promise.then(function(res){
			$rootScope.myfavorites = res;
			console.log('no ng favorite mo is ' + res.length);
			$rootScope.no_of_favorites = res.length;

		});
	};


	$rootScope.getMyFavorites = function() {
		nav.pushPage(userViewUrl + 'my_favorites/list.html');
		refreshMyFavorites();
	};

	$rootScope.refreshMyFavorites = function() {
		refreshMyFavorites();
	};

	$rootScope.getMyFavoritesOffline = function() {
		
		$rootScope.offlineFavorites = [];
		var query = "SELECT recipe_img,recipe_id,recipe_name, recipe_desc, ave_rating, region, province, city, category, no_of_view, date_posted, no_of_serving, procedures, username FROM Favorite_Recipes";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
                // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
         		console.log('list of item');
            	for (var i = 0; i < res.rows.length; i++) {
            		
            		$rootScope.offlineFavorites[i] = res.rows.item(i);
            		console.log($rootScope.offlineFavorites[i].recipe_name);

            	};



            	console.log($rootScope.offlineFavorites);
            	nav.pushPage(userViewUrl + 'my_favorites/list_offline.html');
            	// angular.forEach(res.rows.item, function(){

            	// })

            	
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
	}


	$rootScope.getMyRecipesOffline = function() {
		
		$rootScope.offlineRecipes = [];
		var query = "SELECT recipe_img,recipe_id,recipe_name, recipe_desc, ave_rating, region, province, city, category, no_of_view, date_posted, no_of_serving, procedures, username FROM Recipe";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
                // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
         		console.log('list of item');
            	for (var i = 0; i < res.rows.length; i++) {
            		
            		$rootScope.offlineRecipes[i] = res.rows.item(i);
            		console.log($rootScope.offlineRecipes[i].recipe_name);

            	};



            	console.log($rootScope.offlineRecipes);
            	nav.pushPage(userViewUrl + 'offline/list.html');
            	noInternetDialog.hide();
            	// angular.forEach(res.rows.item, function(){

            	// })

            	
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
	}

	$rootScope.viewRecipeOffline = function(recipe_id) {
		$rootScope.view_recipe_id = recipe_id;
		var rcp_id =  findIndex($rootScope.offlineRecipes,'recipe_id',recipe_id);
		console.log('recipe_id: ' + recipe_id);
		console.log('ave rating' + $rootScope.offlineRecipes[rcp_id].ave_rating);
		for(var i = 0; i < Math.round($rootScope.offlineRecipes[rcp_id].ave_rating); i++)
		{
					$rootScope.starRating[i] = i;
					console.log('star rating ' + i);
		}
		$rootScope.noStarRating.length = 5 - $rootScope.starRating.length;
		console.log('no star rating ' + $rootScope.noStarRating.length);
		nav.pushPage(userViewUrl + 'offline/recipe/main.html');

		
		console.log('index ng recipe id n un ' + rcp_id);
		$rootScope.recipe = $rootScope.offlineRecipes[rcp_id];

		

		$rootScope.rcpingOffline = [];
        var query = "SELECT rcp_ingrdnt_id,qty,qty_fraction,recipe_id,ingredient_name,ingredient_uom,ingredient_cal FROM Recipe_Ingredient JOIN Ingredient ON Ingredient.ingredient_id = Recipe_Ingredient.ingredient_id WHERE recipe_id = ?";
        $cordovaSQLite.execute(db, query,[recipe_id]).then(function(res) {
            if(res.rows.length > 0) {
                // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
         		console.log('list of recipe ing item');
            	for (var i = 0; i < res.rows.length; i++) {
            		
            		$rootScope.rcpingOffline[i] = res.rows.item(i);
            		console.log(res.rows.item(i).rcp_ingrdnt_id);
            	};
            
            	
            } else {
                console.log("No recipe ingredient found");
            }
        }, function (err) {
            console.error(err);
        });

	}

	// $rootScope.viewRecipeOffline = function(recipe_id) {
	// 	$rootScope.view_recipe_id = recipe_id;
	// 	var rcp_id =  findIndex($rootScope.offlineFavorites,'recipe_id',recipe_id);
	// 	console.log('recipe_id: ' + recipe_id);
	// 	console.log('ave rating' + $rootScope.offlineFavorites[rcp_id].ave_rating);
	// 	for(var i = 0; i < Math.round($rootScope.offlineFavorites[rcp_id].ave_rating); i++)
	// 	{
	// 				$rootScope.starRating[i] = i;
	// 				console.log('star rating ' + i);
	// 	}
	// 	$rootScope.noStarRating.length = 5 - $rootScope.starRating.length;
	// 	console.log('no star rating ' + $rootScope.noStarRating.length);
	// 	nav.pushPage(userViewUrl + 'my_favorites/recipe/main.html');

		
	// 	console.log('index ng recipe id n un ' + rcp_id);
	// 	$rootScope.recipe = $rootScope.offlineFavorites[rcp_id];

		

	// 	$rootScope.rcpingOffline = [];
 //        var query = "SELECT rcp_ingrdnt_id,qty,qty_fraction,recipe_id,ingredient_name,ingredient_uom,ingredient_cal FROM Recipe_Ingredient JOIN Ingredient ON Ingredient.ingredient_id = Recipe_Ingredient.ingredient_id WHERE recipe_id = ?";
 //        $cordovaSQLite.execute(db, query,[recipe_id]).then(function(res) {
 //            if(res.rows.length > 0) {
 //                // console.log("SELECTED -> " + res.rows.item(0).recipe_name + " " + res.rows.item(0).recipe_desc);
 //         		console.log('list of recipe ing item');
 //            	for (var i = 0; i < res.rows.length; i++) {
            		
 //            		$rootScope.rcpingOffline[i] = res.rows.item(i);
 //            		console.log(res.rows.item(i).rcp_ingrdnt_id);
 //            	};
            
            	
 //            } else {
 //                console.log("No recipe ingredient found");
 //            }
 //        }, function (err) {
 //            console.error(err);
 //        });

	// }

	function checkIfFavorited(recipe_id)
	{
		userService.checkIfFavorited({id: recipe_id, params: $rootScope.loggedUsername}).$promise.then(function(res){
			if(res.response > 0 )
			{
				$rootScope.userAlreadyFavorited = true;
				console.log('favorite mo na to');
			}
			else
			{
				$rootScope.userAlreadyFavorited = false;
				console.log('di mo pa favorite');
			}	

		});
	};



	$rootScope.calculateCalorie = function(qty,qty_fraction,cal)
	{
		if(cal == null)
		{
			return 'Not yet available';
		}
		else
		{
			console.log(qty + ' ' + $rootScope.convertFractionToDecimal(qty_fraction) + ' ' + cal);
			return ((parseInt(qty) + $rootScope.convertFractionToDecimal(qty_fraction)) * cal) + ' calories';
		}

	}

	$rootScope.getTotalCalorie = function(ingredients,no_of_serving) 
	{
		$scope.totalCalorie = 0;
		if(!angular.isUndefined(ingredients))
		{
			angular.forEach(ingredients, function(ingredient,index){
				$scope.calorie = (parseInt(ingredient.qty) + $rootScope.convertFractionToDecimal(ingredient.qty_fraction)) * ingredient.ingredient_cal;
				$scope.totalCalorie += parseInt($scope.calorie);
				if(ingredient.ingredient_cal == null)
				{
					$scope.totalisNull = true;
				}
			});

			console.log('Total calorie ' + $scope.totalCalorie + ' totalisNull' + $scope.totalisNull);
			
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
	$rootScope.convertFractionToDecimal = function(qty_fraction) {
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

	$rootScope.goToMapView = function(recipe) {
		$rootScope.recipe_map = recipe;
		
		nav.pushPage(userViewUrl + 'offline/recipe/mapview.html');
		
	}

	
	$rootScope.goToProvinceRecipesList = function(province) {
		$rootScope.province_name = province;
		nav.pushPage(rootViewUrl + 'provinceRecipeList.html');
	}

	$rootScope.goToRegionRecipesList = function(region) {
		$rootScope.region_name = region;
		nav.pushPage(rootViewUrl + 'regionRecipeList.html');
	}

}]);






user.controller('mapCtrl',['$scope','$rootScope','$timeout',function($scope,$rootScope,$timeout){

	$rootScope.backToRecipeView = function() {
		nav.popPage();
		 $('.page__background').not('.page--menu-page__background').css('background-color', 'transparent');
		 $('#menu-page').css('background', '#333834 !important');
		 $rootScope.map.clear();
         $rootScope.map.remove();
         $('.gmap_div:not(:last)').remove();
         // $rootScope.map = '';
	}
	
	 $rootScope.initMap = function() {
	        $('.page__background').not('.page--menu-page__background').css('background-color', 'transparent');
	        $('#menu-page').css('background', '#333834 !important');
	        if($rootScope.map) {
	            $rootScope.map.clear();
	            $rootScope.map.remove();
	            $('.gmap_div:not(:last)').remove();
	            $rootScope.map = '';
	        }
	        const PH = new plugin.google.maps.LatLng(13.000,122.0000);
	        $timeout(function(){
	            var div = document.getElementById("map_canvas");
	            $rootScope.map = plugin.google.maps.Map.getMap(div,{
	                    'backgroundColor': '#f9f9f9',
	                    'mapType': plugin.google.maps.MapTypeId.ROADMAP,
	                    'controls': {
	                    'compass': true,
	                    'myLocationButton': false,
	                    'indoorPicker': false,
	                    'zoom': true
	                },
	                    'gestures': {
	                    'scroll': true,
	                    'tilt': true,
	                    'rotate': true
	                },
	                	'camera': {
	                	'latLng': PH,
	                	'zoom': 5
	                }
	            });
	            $rootScope.map.setDebuggable(true);
	            $rootScope.map.on(plugin.google.maps.event.MAP_READY, function(map){
	            
					recipelat = findCoor($rootScope.provinces,'name',$rootScope.recipe_map.province,'lat');
					recipelng = findCoor($rootScope.provinces,'name',$rootScope.recipe_map.province,'lng');
				    console.log(recipelat + ' ' + recipelng);
	                const recipeCoor = new plugin.google.maps.LatLng(recipelat,recipelng);
	                map.addMarker({
					      'position': recipeCoor,
					       icon: '#169216',
					      'title': $rootScope.recipe_map.recipe_name,
					      'snippet': $rootScope.recipe_map.recipe_desc,
					      'styles' : {
							    'font-weight': 'bold'},
						  'infoClick': function(marker) {
						    	
						  } 
					    }, function(marker) {

					      map.animateCamera({
					        'target': recipeCoor,
					        'zoom': 8,
					        'duration': 3000
					      }, function() {
					        marker.showInfoWindow();
					      }); // anime camera

					}); // add marker

	              
				

				
	              


	            }); // on map ready
	        }, 600, false);
	    } 



    ons.ready(function(){console.log('Map onsen ready');
        $rootScope.initMap();
    });

    function findCoor(arraytosearch, key, valuetosearch,coor) {
 
		for (var i = 0; i < arraytosearch.length; i++) {
	 
			if (arraytosearch[i][key] == valuetosearch) {
				return arraytosearch[i][coor];
			}
		}
		return null;
	}







		
}]);