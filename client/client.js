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
          "animalSpecies","animalBreed", "animalLocation"
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

app.controller('SearchController', ['$scope', '$http', 'apiService', function($scope, $http, apiService){
  // http://localhost:5000/searchPage?species=dog&breed=schnauzer&zip=55405

  // TODO: Get parameters from URL, example above

  var apiUrl = apiService('Cat','Domestic Short Hair','55405');

  $http({
    method: 'JSONP',
    url: apiUrl
  })
  .then(
    function(response) {
      console.log(response);
    }
  );
}]);
