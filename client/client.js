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
      "token":"EVguG4C8vyuQ",
      "tokenHash":"577ad920503e0331dbd20f5534e32b5d",
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
             "fieldName": "speciesSingular",
             "operation": "equals",
             "criteria": "Dog"
          },
        ],
        "filterProcessing": "1",
        "fields":
        [
          "animalID","animalOrgID","animalLocation","animalStatus","animalSpecies","animalLocationDistance"
        ]

      }
    }

    var encoded = angular.toJson(filter);
    $http({
      method: 'JSONP',
      url: 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data=' + encoded
    })
      .then(
        function(response) {
          console.log(response);
        },
        function(response) {
          console.log(response);
        }
      );
  }
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
