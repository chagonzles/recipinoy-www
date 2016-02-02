var recipe = angular.module('recipe',['recipeService']);


recipe.controller('recipeCtrl',['$rootScope','$scope','recipeService',function($rootScope,$scope,recipeService){
	

	// if($rootScope.noInternet == false)
	// {
	// 	$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB80ok1kdISiT-NTApqD6iqaC3Wezpm2Cw');
	// }

	$rootScope.removeMap = function() {
		$rootScope.map = null;
		$('#map').remove();

	}
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


	$rootScope.goToMapView = function(recipe) {
		$rootScope.recipe_map = recipe;
		
		nav.pushPage('app/views/recipe/mapview.html');
		
	}

	$rootScope.backToRecipeView = function() {
		nav.popPage();
		
	}
	











}]);

recipe.controller('mapCtrl',['$scope','$rootScope','$timeout',function($scope,$rootScope,$timeout){

	$rootScope.backToRecipeView = function() {
		nav.popPage();
		 $('.page__background').not('.page--menu-page__background').css('background-color', 'transparent');
		 $('#menu-page').css('background', '#333834 !important');
		 $rootScope.map.clear();
         $rootScope.map.remove();
         $('.gmap_div:not(:last)').remove();
         // $rootScope.map = '';
	}
	// $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB80ok1kdISiT-NTApqD6iqaC3Wezpm2Cw').done(function( script, textStatus ) {
	// 		var geocoder = new google.maps.Geocoder();
	// 		var map = new google.maps.Map(document.getElementById('map'), {
	// 		    zoom: 8,
	// 		    center: {lat: 13.0000, lng: 122.0000}
	// 		  });
	
		
	// 	    geocodeAddress(geocoder,map,$rootScope.recipe_map.province,$rootScope.recipe_map);
 // 	});


 // 	 function geocodeAddress(geocoder, resultsMap,address,recipe) {
	
	//   geocoder.geocode({'address': address}, function(results, status) {
	//     if (status === google.maps.GeocoderStatus.OK) {
	//       resultsMap.setCenter(results[0].geometry.location);
	//       var marker = new google.maps.Marker({
	//         map: resultsMap,
	//         position: results[0].geometry.location,
	//         title: recipe.recipe_name
	//       });

	      
	//       var infowindow = new google.maps.InfoWindow({
	// 	    content: '<span style="font-size: 15px;"><b>' + recipe.recipe_name + '</b></span>' +
	// 	    		 '<br /><span> ' + recipe.province + '</span>' + '<p>' + recipe.recipe_desc + '</p>'
	// 	  });

	// 	  marker.addListener('click', function() {
	// 	    infowindow.open(resultsMap, marker);
	// 	  });

	   

	//       $scope.map = new google.maps.Map(document.getElementById('map'), marker);
      

   
	//     } else {
	//       alert('Geocode was not successful for the following reason: ' + status);
	//     }
	//   });
	// }


	// $rootScope.initMap = function() {
 //        $('.page__background').not('.page--menu-page__background').css('background-color', 'transparent');
 //        $('#menu-page').css('background', '#333834 !important');
 //        if($rootScope.map) {
 //            $rootScope.map.clear();
 //            $rootScope.map.remove();
 //            $('.gmap_div:not(:last)').remove();
 //            $rootScope.map = '';
 //        }
 //        const PH = new plugin.google.maps.LatLng(13.000,122.0000);
 //        $timeout(function(){
 //            var div = document.getElementById("map_canvas");
 //            $rootScope.map = plugin.google.maps.Map.getMap(div,{
 //                    'backgroundColor': '#f9f9f9',
 //                    'mapType': plugin.google.maps.MapTypeId.ROADMAP,
 //                    'controls': {
 //                    'compass': true,
 //                    'myLocationButton': false,
 //                    'indoorPicker': false,
 //                    'zoom': true
 //                },
 //                    'gestures': {
 //                    'scroll': true,
 //                    'tilt': true,
 //                    'rotate': true
 //                },
 //                	'camera': {
 //                	'latLng': PH,
 //                	'zoom': 5
 //                }
 //            });
 //            $rootScope.map.setDebuggable(true);
 //            $rootScope.map.on(plugin.google.maps.event.MAP_READY, function(map){
 //            	var request = {
	// 			  'address': $rootScope.recipe_map.province
	// 			};
 //                plugin.google.maps.Geocoder.geocode(request, function(results) {
	// 			  if (results.length) {
	// 			    var result = results[0];
	// 			    var position = result.position; 

	// 			    map.addMarker({
	// 			      'position': position,
	// 			       icon: 'green',
	// 			      'title': $rootScope.recipe_map.recipe_name,
	// 			      'snippet': $rootScope.recipe_map.recipe_desc,
	// 			      'styles' : {
	// 					    'font-weight': 'bold'
	// 					  } 
	// 			    }, function(marker) {

	// 			      map.animateCamera({
	// 			        'target': position,
	// 			        'zoom': 9,
	// 			        'duration': 3000
	// 			      }, function() {
	// 			        marker.showInfoWindow();
	// 			      });

	// 			    });
	// 			  } else {
	// 			    alert("Not found");
	// 			  }
	// 			}); //geocode
 //            }); // on map ready
 //        }, 600, false);
 //    } 




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







		
}])