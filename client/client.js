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
      $location.path(response.data);
    });
  }
}]);

app.controller('HomeController', ['$scope', '$http', function($scope, $http){
  $scope.data = {};


  $scope.getPets = function(){
    var filter = {
      "apikey":"vngSNgO9",
      "objectType":"animals",
      "objectAction":"publicSearch",
      "search":
      {
        "resultStart": "0",
        "resultLimit": "10",
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
                "operation": "radius",
                "criteria": "50"
            },
            {
                "fieldName": "animalLocation",
                "operation": "equals",
                "criteria": $scope.data.zip
            },
            {
                "fieldName": "animalSpecies",
                "operation": "equals",
                "criteria": $scope.data.species
            },
            {
                "fieldName": "animalBreed",
                "operation": "equals",
                "criteria": $scope.data.breed
            }
        ],
        "fields":
        [
          "animalSpecies","animalBreed", "animalLocation"
        ]

      }
    }

    var encoded = angular.toJson(filter);
    console.log(encoded);
    $http({
      method: 'JSONP',
      url: 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + encoded
    })
      .then(
        function(response) {
          console.log(response);
        }
      );
  }

  $scope.breedLookup = function(){
    var breedFilter = {
      "apikey": "vngSNgO9",
      "objectType":"animalBreeds",
      "objectAction":"publicSearch",
      "search":
      {
        "resultStart": "0",
        "resultLimit": "100",
        "resultSort": "breedName",
        "resultOrder": "asc",
        "filters":
        [
          {
            "fieldName": "breedSpecies",
            "operation": "equals",
            "criteria": "Cat"
          },
          {
            "fieldName": "breedSpecies",
            "operation": "equals",
            "criteria": "Dog"
          },
        ],
        "fields": ["breedID","breedName","breedSpecies","breedSpeciesID"]
      }
    }
  }

  var breedEncoded = angular.toJson(breedFilter);
  $http({
    method: 'JSONP',
    url: 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + breedencoded
  })
    .then(
      function(response) {
        console.log(response);
      }
    );

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

app.controller('SearchController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.getPets = function(){
    $http.jsonp('http://api.petfinder.com/pet.getRandom?format=json&output=full&callback=JSON_CALLBACK&key=a8104ae25d98a48d91e8b689b547417c').then(function(response){
      console.log(response);
    });
  }
}]);
