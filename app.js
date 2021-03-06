var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//ROUTE
weatherApp.config(function ($routeProvider) {
		
		$routeProvider

		.when('/', {
			templateUrl: 'pages/home.htm',
			controller: 'mainController'
		})

		.when('/forecast', {
			templateUrl: 'pages/forecast.htm',
			controller: 'forecastController'
		})

		.when('/forecast/:days', {
			templateUrl: 'pages/forecast.htm',
			controller: 'forecastController'
		})

});


//SERVICES

weatherApp.service('cityService', function(){
	this.city = "New York, NY";
})

weatherApp.service('weatherService', ['$resource', function($resource){
	this.getTheWeather = function(city, days){
		var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?q=London&cnt=2&appid=44db6a862fba0b067b1930da0d769e98", {callback : "JSON_CALLBACK"}, {get: {method : "JSONP"}});
		return weatherAPI.get({ q : city, cnt: days });
	}
}]);

//CONTROLLERS
weatherApp.controller('mainController', ['$scope', '$location', 'cityService', function($scope, $location, cityService){
	$scope.city = cityService.city;

	$scope.$watch('city', function(){
		cityService.city = $scope.city;
	})

	$scope.getForecast = function(){
		$location.path("/forecast");
	};
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', 'weatherService', function($scope, $resource, $routeParams, cityService, weatherService){
	$scope.city = cityService.city;

	$scope.days = $routeParams.days || 2;

	$scope.weatherResult = weatherService.getTheWeather($scope.city, $scope.days);

	$scope.convertToFarenheit = function(degreesK) {

			return Math.round((1.8 * (degreesK - 273)) + 32);
	};

	$scope.convertToDate = function(dt) {

			return new Date(dt * 1000);
	};
}]);

//DIRECTIVES
weatherApp.directive("weatherReport", function(){
	return{
		restrict: 'E',
		templateUrl: 'directives/weatherReport.html',
		replace: true,
		scope: {
			weatherDay: "=",
			convertToStandard: "&",
			convertToDate: "&",
			dateFormat: "@"
		}
	}
});