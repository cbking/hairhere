var landingpage = angular.module("landingpage", ['ngRoute']);

landingpage.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/view1.html',
        controller: ''
      }).
      when('/login', {
        templateUrl: '/partials/login.html',
        controller: ''
      }).
      when('/signup', {
        templateUrl: '/partials/signup.html',
        controller: ''
      }).
      otherwise({
        redirectTo: '/partials/view1.html'
      });
  }]);

