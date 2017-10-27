(function(){
  'use strict';

  angular
  	.module('app')
  	.controller('RecipeDetailController', [
  		'$scope',
  		'$location',
  		'$routeParams',
  		'dataService',
  		function($scope, $location, $routeParams, dataService) {

        // get the recipe data of the selected recipe
        function getRecipeData(){
          dataService
  					.apiGet(endpoints.recipes, recipeId)
  					.then(function(data) {
  						// console.log(data.data);
  						$scope.recipe = data.data;
  						$scope.recipeName = $scope.recipe.name.slice();
  					}
          );
        }

  			// aids in determining whether a recipe is being added or edited
  			var recipeId = $routeParams.id || null;
  			var endpoints = dataService.endpoints;

        $scope.recipe = {};
  			$scope.recipeErrors = [];
        $scope.recipeModel = null;
        $scope.recipeId = recipeId;
        $scope.saveSuccessMessage = '';
        $scope.recipeName = null;


        // use an existing record from the database to determine how the data should be structured
  			dataService
  				.apiGet(endpoints.recipes)
  				.then(function(data) {
  					$scope.recipeModel = data.data[0];
  				})

        // if an id exists in the route parameters, get that data for the selected recipe
  			if (recipeId) {
  				getRecipeData();
  			}

        // get the categories
  			dataService
  				.apiGet(endpoints.categories)
  				.then(function(data) {
  					console.log(data.data);
  					$scope.categories = data.data;
  				});

        // get the food items
  			dataService
  				.apiGet(endpoints.foodItems)
  				.then(function(data) {
  					console.log(data.data);
  					$scope.foodItems = data.data;
  				});

        // when the user decides to add an ingredient, pushes an empty object into the ingredients array to be populated with ingredient information
  			$scope.addIngredient = function(collection) {
  				// console.log($scope.recipe);
  				collection.push({});
  			};

  			$scope.removeIngredient = function(collection, index) {
          // prevents a user from not having any ingredients listed in the recipe
  				if (collection.length === 1) { return; }

          // deletes the ingredient at the specified index
  				collection.splice(index, 1);
  			};

        // redirects the user back to the home route
  			$scope.cancelRecipe = function() {
  				$location.path('/');
  			};

        // validates the recipe data before inserting it into the database
        $scope.validateFields = function(){

          $scope.recipeErrors = [];

          for(var key in $scope.recipe){

            // helper function for validating recipe object keys that contain arrays of objects
            function check(collection, keys){
              if(!Array.isArray(keys)){ keys = [keys] }

              return collection.every(function(obj){
                var currentKeys = Object.keys(obj);

                return keys.every(function(key){
                  return currentKeys.indexOf(key) !== -1 && obj[key]
                });
              });
            }


            var value = $scope.recipe[key];


            if(Array.isArray(value) && value.length > 0){

              if(key === 'ingredients'){
                value = check(value, ['foodItem', 'amount']);
              }

              if(key === 'steps'){
                value = check(value, 'description');
              }

            }else if(Array.isArray(value) && value.length === 0){
              value = false;
            }

            // if there is an error with the validation, push the value key to the errors array which will display on the view
            if(!value){
              $scope.recipeErrors.push(key);
            }
          }
        };


        $scope.saveRecipe = function(){

          $scope.addRecipeProps();
          $scope.validateFields();

          if($scope.recipeErrors.length > 0){
            return;
          }

          // update existing recipe
          if($scope.recipeId){

            var url = endpoints.recipes + '/' + $scope.recipeId;

            dataService.apiPut(url, $scope.recipe)
              .then(function(data){

                console.log(data);

                $scope.saveSuccessMessage = 'Your changes were saved!';
                getRecipeData();

              }, function(error){
                console.log(error);
              }
            );

          // add a new recipe
          }else{

            dataService.apiPost(endpoints.recipes, $scope.recipe)
              .then(function(data){
                console.log(data);
                $location.path('/');

              }, function(error){
                console.log(error);
              }
            );
          }
          // console.log($scope.recipeErrors);
        };

        // bind the input value to the recipe object key
  			$scope.updateRecipe = function(key, value) {
  				$scope.recipe[key] = value;
  				// console.log($scope.recipe);
  			};

        // adds the appropriate keys to the recipe object based on the model so that the object can be validated
        $scope.addRecipeProps = function(){

          for(var key in $scope.recipeModel){
            var value = $scope.recipeModel[key];

            if(!$scope.recipe[key] && key !== '_id'){
              $scope.recipe[key] = Array.isArray($scope.recipeModel[key]) ? [] : null;
            }
          }
        };

        // push collection to recipe prop if an array (ingredients, steps)
        $scope.addToCollection = function(recipeKey){
          $scope.addRecipeProps();
          $scope.recipe[recipeKey].push({});
        };
  		}
  	]
  );

})();
