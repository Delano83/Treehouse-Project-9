(function() {
	'use strict';

	angular
		.module('app')
		.service('dataService', [
			'$http',
			'$q',
			function($http, $q) {

        // endpoints
				this.endpoints = {
					recipes: 'http://localhost:5000/api/recipes',
					categories: 'http://localhost:5000/api/categories',
					foodItems: 'http://localhost:5000/api/foodItems'
				};

        // make get request
				this.apiGet = function(url, id) {
					var deferred = $q.defer();

					if (id) {
						url = url + '/' + id;
					}

					$http
						.get(url)
						.then(function(data) {
							deferred.resolve(data);
						}, function(error) {
							deferred.reject(error);
						});

					return deferred.promise;
				};

        // make post request
				this.apiPost = function(url, body) {

					var deferred = $q.defer();

					$http
						.post(url, body)
						.then(function(data) {
							deferred.resolve(data);
						}, function(error) {
							deferred.reject(error);
						});

					return deferred.promise;
				};

        // make put request
				this.apiPut = function(url, body) {

					var deferred = $q.defer();

					$http
						.put(url, body)
						.then(function(data) {
							deferred.resolve(data);
						}, function(error) {
							deferred.reject(error);
						});

					return deferred.promise;
				};

        // make delete request
				this.apiDelete = function(url) {

					var deferred = $q.defer();

					$http
						.delete(url)
						.then(function(data) {
							deferred.resolve(data);
						}, function(error) {
							deferred.reject(error);
						});

					return deferred.promise;
				};
			}
		]);

})();
