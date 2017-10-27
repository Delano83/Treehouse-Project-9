
//This directive asks the user to confirm a recipe deletion before it is deleted.(exceeds)

(function() {
  'use strict';

	angular
		.module('app')
		.directive('confirmDeletion', function() {

      return {

        restrict: 'A',

        scope: {
          recipes: '='
        },

        controller: [
          '$scope',
          'dataService',
          function($scope, dataService){

            var endpoints = dataService.endpoints;

            // make the call to the delete the recipe record from the database
            $scope.deleteRecipe = function(index){
              var url = endpoints.recipes + '/' + $scope.recipes[index]._id;

              dataService.apiDelete(url)
                .then(
                  deleteSuccessCallback,
                  function(error){
                    console.log(error);
                  }
              );
            };


            function deleteSuccessCallback(data){

              dataService.apiGet(endpoints.recipes)
                .then(function(data){
                  // trigger an event so that the parent controller can know when to update the view
                  $scope.$emit('updateRecipes', data.data);
                }
              );
            }
          }
        ],


        link: function(scope, node, attrs){

          var index = Number(attrs.recipeIndex);

          // keeps track of the number of times a user has clicked on the delete option, two clicks in a succession will delete the recipe
          var deleteCount = 0;

          node.on('focus', function(){
            node.html('Are you sure?');
          });

          node.on('blur', function(){
            deleteCount = 0;
            node.html('<img src="images/delete.svg" height="12px"> Delete');
          });

          node.on('click', function(){
            deleteCount += 1;

            if(deleteCount === 2){
              deleteCount = 0;
              scope.deleteRecipe(index);
            }
          });
        }
      };
    });
})();
