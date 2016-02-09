var app = angular.module('pawFinderApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/homepage.html',
      controller: 'HomeController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .when('/signUp', {
      templateUrl: 'views/signUp.html',
      controller: 'SignUpController'
    })
    .when('/success', {
      templateUrl: 'views/success.html',
      controller: 'SuccessController'
    })
    .when('/failure', {
      templateUrl: 'views/failure.html',
      controller: 'FailureControler'
    })
    .when('/searchPage', {
      templateUrl: 'views/searchPage.html',
      controller: 'SearchController'
    })

    $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.data = {};

  $scope.submitData = function(){
    $http.post('/', $scope.data).then(function(response){
      console.log(response);
      $location.path('searchPage');
    });
  }
}]);

app.controller('HomeController', ['$scope', '$location', function($scope, $location){
  $scope.getPets = function(){
    $location.path('searchPage');
    $location.search('species', $scope.data.species);
    $location.search('breed', $scope.data.breed);
    $location.search('zip', $scope.data.zip);
  }
}]);

app.factory('apiService', ['$http', function($http){

  var urlConstructor = function(species, breed, zip) {
    var filter = {
      "apikey":"vngSNgO9",
      "objectType":"animals",
      "objectAction":"publicSearch",
      "search":
      {
        "resultStart": "0",
        "resultLimit": "20",
        "resultSort": "animalID",
        "resultOrder": "asc",
        "filters":
        [
          {
            "fieldName": "animalStatus",
            "operation": "equals",
            "criteria": "Available"
          },
          {
            "fieldName": "animalLocationDistance",
            "operation": "lessthan",
            "criteria": "100"
          },
          {
            "fieldName": "animalLocation",
            "operation": "equals",
            "criteria": zip
          },
          {
            "fieldName": "animalSpecies",
            "operation": "equals",
            "criteria": species
          },
          {
            "fieldName": "animalBreed",
            "operation": "equals",
            "criteria": breed
          }
        ],
        "fields":
        [
          "animalID","animalPictures","animalSpecies","animalBreed","animalLocation","animalLocationCitystate","animalName","animalOKWithAdults","animalOKWithCats","animalOKWithDogs","animalOKWithKids","animalSex"
        ]
      }
    }

    var encoded = angular.toJson(filter);

    var url = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data='
    url += encoded;

    return url;
  };

  return function(species, breed, zip) {
    var url = urlConstructor(species, breed, zip)
    return url;
  };

}]);

app.controller('SignUpController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.data = {};

  $scope.newUser = function(){
    $http.post('/newUser', $scope.data).then(function(response){
      console.log(response);
      $location.path(response.data);
    });
  }
}]);

app.controller('SuccessController', ['$scope', '$http', function($scope, $http){

}]);

app.controller('FailureController', ['$scope', '$http', function($scope, $http){

}]);

app.controller('SearchController', ['$scope', '$http', '$location' ,'apiService', function($scope, $http, $location, apiService){
  var animalSpecies = $location.search().species;
  var animalBreed = $location.search().breed;
  var animalZip = $location.search().zip;

  var apiUrl = apiService(animalSpecies, animalBreed, animalZip);

  $http({
    method: 'JSONP',
    url: apiUrl
  })
  .then(
    function(response) {
      $scope.searchResults = response.data;
    }
  );

  $scope.goToProfile = function(){

  }

  $scope.getPets = function(){
    var apiUrl = apiService($scope.data.species, $scope.data.breed, $scope.data.zip);

    $http({
      method: 'JSONP',
      url: apiUrl
    })
    .then(
      function(response) {
        console.log(response);
        $scope.searchResults = response.data;
      }
    );
  }
}]);