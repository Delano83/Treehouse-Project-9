(function() {
	'use strict';

	angular
		.module('app')
		.controller('RecipesController', [
			'$scope',
			'$location',
			'dataService',
			function($scope, $location, dataService) {

				var endpoints = dataService.endpoints;

				$scope.recipes = null;
				$scope.activeCategory = '';
				$scope.categories = null;

        // retrieve recipes
        dataService
					.apiGet(endpoints.recipes)
					.then(function(data) {
						$scope.recipes = data.data;
					});

        // retrieve categories
				dataService
					.apiGet(endpoints.categories)
					.then(function(data) {
						$scope.categories = data.data;
					});

        // direct user to add route
				$scope.goToAddRecipePage = function() {
					$location.path('/add');
				};

        // update the active category in the drop down menu
				$scope.updateRecipeList = function(value) {
					$scope.activeCategory = value;
				};

        // update the view when a recipe is deleted
        $scope.$on('updateRecipes', function(event, data){
          $scope.recipes = data;
        });
			}
		]);

})();
