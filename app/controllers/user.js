var user = angular.module('user',['recipeService','userService']);

user.controller('userCtrlr',['$scope','$rootScope','$timeout','$filter','$interval','$http','userService',
	'recipeService','adminService','$cordovaCamera','$cordovaFileTransfer','$cordovaSQLite',
	function($scope,$rootScope,$timeout,$filter,$interval,$http,userService,recipeService,adminService,
			 $cordovaCamera,$cordovaFileTransfer,$cordovaSQLite){
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

	$scope.suggestionsClicked = false;
	$scope.ingnamelist = [];
	$scope.showIngListError = false;
	var ans;
	console.log($scope.dob);

	var recipeImgExtension;

	// var offlineDb = new loki('favorites.json');
	// var favorites = offlineDb.addCollection('favorites');
	// favorites.insert({name:'Sisig'});
	// favorites.insert({name:'Kare kares'});
	// favorites.insert({name:'Bicol express'});

	// offlineDb.saveDatabase();



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

	refreshData();

	function refreshData()
	{	
		$scope.isLoadingMostViewed = true;
		$scope.isLoadingTopRated = true;
		$scope.isLoadingRecent = true;

		recipeService.query().$promise.then(function(recipes){
			$rootScope.recipes = recipes;
			$scope.isLoadingRecent= false;
		});

		recipeService.most_viewed().$promise.then(function(most_viewed){
			$rootScope.most_viewed = most_viewed;
			$scope.isLoadingMostViewed = false;
		});
		
		recipeService.top_rated().$promise.then(function(top_rated){
			$rootScope.top_rated = top_rated;
			$scope.isLoadingTopRated = false;
		});
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
		$rootScope.userAlreadyReviewed = false;
		recipeService.update_view_no({id: $rootScope.view_recipe_id}).$promise.then(function(){
			refreshRatingReviews(recipe_id);
		});

		$scope.getUserReviewCount($rootScope.loggedUsername,recipe_id);
		
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
            // alert(JSON.stringify(err.response));
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
			username: localStorage.getItem('user')
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
		logoutModal.show();
		$timeout(function(){
			localStorage.removeItem('user');
			$rootScope.loggedUsername = '';
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
		console.log(userRating + ' ' + recipe_id);
		$scope.ratingReview = {
			recipe_id: recipe_id,
			username: localStorage.getItem('user'),
			rating: userRating,
			review_content: review
		};
		console.log($scope.ratingReview);
		userService.addRatingReview({},$scope.ratingReview).$promise.then(function(response){
			console.log(response);
			refreshRatedRecipe(recipe_id);
			ratingReviewDialog.hide();
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
		$scope.editReviewRatingInfo = {
			rating: $rootScope.userRating,
			review_content: review,
			date_edited: moment().format('YYYY-MM-DD HH:mm:ss'),
			recipe_id: $rootScope.view_recipe_id
		};

		console.log($scope.editReviewRatingInfo);
		
		userService.updateReviewRating({id: $rootScope.editUserReviewId},$scope.editReviewRatingInfo).$promise.then(function(response){
			console.log(response);
			refreshRatedRecipe($rootScope.view_recipe_id);
			ratingReviewDialog.hide();
			editDeleteReviewPopOver.hide();
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


	$rootScope.addToFavorites = function(recipe_id) {
		$scope.favorite = {
			recipe_id: recipe_id,
			username: $rootScope.loggedUsername
		};
		userService.addToFavorites({},$scope.favorite).$promise.then(function(res){
			console.log(res);
		});

	};

	$rootScope.removeToFavorites = function(favorite_id) {
		userService.removeToFavorites({id: favorite_id}).$promise.then(function(res){
			console.log(res);
		});
	}

	function refreshMyFavorites()
	{
		userService.getFavorites({id: $rootScope.loggedUsername}).$promise.then(function(res){
			$rootScope.myfavorites = res;
		});
	}

	$rootScope.getMyFavorites = function() {
		nav.pushPage(userViewUrl + 'my_favorites/list.html');
		refreshMyFavorites();
	}

}]);