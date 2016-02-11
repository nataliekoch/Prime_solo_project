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
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileController'
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

app.controller('SignUpController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.data = {};

  $scope.newUser = function(){
    $http.post('/newUser', $scope.data).then(function(response){
      console.log(response);
      $location.path(response.data);
    });
  }
}]);

app.controller('HomeController', ['$scope', '$location', function($scope, $location){
  $scope.getPets = function(){
    $location.path('searchPage');
    $location.search('species', $scope.data.species);
    $location.search('breed', $scope.data.breed);
    $location.search('zip', $scope.data.zip);
    $location.search('locationDistance', '100');
  }
}]);

app.controller('SearchController', ['$scope', '$http', '$location' ,'apiService', function($scope, $http, $location, apiService){
  var animalSpecies = $location.search().species;
  var animalBreed = $location.search().breed;
  var animalZip = $location.search().zip;
  var animalDistance = $location.search().locationDistance;

  var apiUrl = apiService(animalSpecies, animalBreed, animalZip, animalDistance);

  $http({
    method: 'JSONP',
    url: apiUrl
  })
  .then(
    function(response) {
      $scope.searchResults = response.data;
    }
  );

  $scope.goToProfile = function(animalID, animalOrgId){
    $location.path('/profile');
    $location.search('animalId', animalID);
    $location.search('animalOrgId', animalOrgId);
  }

  $scope.getPets = function(){
    var apiUrl = apiService($scope.data.species, $scope.data.breed, $scope.data.zip, animalDistance);

    $http({
      method: 'JSONP',
      url: apiUrl
    })
    .then(
      function(response) {
        $location.search('species', $scope.data.species);
        $location.search('breed', $scope.data.breed);
        $location.search('zip', $scope.data.zip);
        $location.search('locationDistance', animalDistance);
        $scope.searchResults = response.data;
      }
    );
  }

  $scope.updateDistance = function(){
    var animalSpecies = $location.search().species;
    var animalBreed = $location.search().breed;
    var animalZip = $location.search().zip;
    var animalDistance = $scope.data.distance;
    console.log(animalDistance);

    var apiUrl = apiService(animalSpecies, animalBreed, animalZip, animalDistance);
    $http({
      method: 'JSONP',
      url: apiUrl
    })
    .then(
      function(response) {
        $location.search('species', animalSpecies);
        $location.search('breed', animalBreed);
        $location.search('zip', animalZip);
        $location.search('locationDistance', animalDistance);
        $scope.searchResults = response.data;
        console.log(response);
      }
    );
  }

  // $scope.updateGenderMale = function(){
  //   console.log($scope.data.genderMale);
  // }
}]);

app.controller('ProfileController', ['$scope', '$http', '$location', 'ProfileCall', 'OrgCall', function($scope, $http, $location, ProfileCall, OrgCall){
  var animalId = $location.search().animalId;
  var animalOrgId = $location.search().animalOrgId;

  var apiUrl = ProfileCall(animalId);
  var apiUrlOrg = OrgCall(animalOrgId);

  $http({
    method: 'JSONP',
    url: apiUrl
  })
  .then(
    function(response) {
      $scope.profileResults = response.data;
      console.log(response);
    }
  );

  $http({
    method: 'JSONP',
    url: apiUrlOrg
  })
  .then(
    function(response) {
      $scope.orgResults = response.data;
      console.log(response);
    }
  );

}]);

app.factory('apiService', ['$http', function($http){

  var urlConstructor = function(species, breed, zip, distance) {
    var filter = {
      "apikey":"vngSNgO9",
      "objectType":"animals",
      "objectAction":"publicSearch",
      "search":
      {
        "resultStart": "0",
        "resultLimit": "20",
        "resultSort": "animalLocationDistance",
        "resultOrder": "asc",
        "filters":
        [
          {
            "fieldName": "animalLocationDistance",
            "operation": "lessthan",
            "criteria": distance
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
          "animalID","animalPictures","animalSpecies","animalBreed","animalLocation","animalLocationCitystate","animalName","animalOKWithAdults","animalOKWithCats","animalOKWithDogs","animalOKWithKids","animalSpecialneeds","animalSex", "animalOrgID"
        ]
      }
    }

    var encoded = angular.toJson(filter);

    var url = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data='
    url += encoded;

    return url;
  };

  return function(species, breed, zip, distance) {
    var url = urlConstructor(species, breed, zip, distance)
    return url;
  };

}]);

app.factory('ProfileCall', ['$http', function($http){
  var urlConstructor = function(animalId) {
    var filter = {
      "apikey":"vngSNgO9",
      "objectType":"animals",
      "objectAction":"publicView",
      "values":
        [
          {
            "animalID": animalId
          }
        ],
        "fields":
        [
          "animalPictures","animalBreed","animalLocationCitystate","animalName","animalOKWithAdults","animalOKWithCats","animalOKWithDogs","animalOKWithKids","animalSex","animalOrgID","locationName","locationUrl","locationAddress","animalDescription","animalDescriptionPlain","animalGeneralAge","animalSpecialneeds","animalCoatLength"
        ]
    }

    var encoded = angular.toJson(filter);

    var url = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data='
    url += encoded;

    return url;
  }

  return function(animalId) {
    var url = urlConstructor(animalId);
    return url;
  };

}]);

app.factory('OrgCall', ['$http', function($http){
  var urlConstructor = function(orgID) {
    var filter = {
      "apikey": "vngSNgO9",
      "objectType":"orgs",
      "objectAction":"publicView",
      "values":
      [
          {
              "orgID": orgID
          }
      ],
      "fields":["orgName","orgAddress","orgCity","orgState","orgPostalcode","orgPhone","orgEmail","orgWebsiteUrl","orgType"]
    }

    var encoded = angular.toJson(filter);

    var url = 'https://api.rescuegroups.org/http/json/?callback=JSON_CALLBACK&data='
    url += encoded;

    return url;
  }

  return function(orgID) {
    var url = urlConstructor(orgID);
    return url;
  };
}]);


app.controller('SuccessController', ['$scope', '$http', function($scope, $http){

}]);

app.controller('FailureController', ['$scope', '$http', function($scope, $http){

}]);
