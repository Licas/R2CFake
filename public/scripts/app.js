'use strict';

var app = angular.module('r2cfake', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',

    'config',
    'controllers.player',
    'controllers.login'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
             templateUrl: 'views/main/main.html',
            controller: 'HomeCtrl'
        })
        .when('/cookie-policy', {
            templateUrl: 'views/main/cookie-policy.html',
        })
        .when('/login', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            templateUrl: 'views/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/contact', {
            templateUrl: 'views/main/contact.html'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);

app.run(['$http', '$rootScope', '$location', '$cookies', function($http, $rootScope, $location, $cookies) {
    // keep user logged in after page refresh
    if ($cookies.get('loggedin')) {

        var authdata = $cookies.getObject('globals').currentUser.authdata;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
    }

    $rootScope.isloggedin = $cookies.get('loggedin');

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $location.path() != '/' && ($.inArray($location.path(), ["/login"]) !== -1);
        $rootScope.isloggedin = $cookies.get('loggedin');

        if (restrictedPage && !$cookies.get('loggedin')) {
            $location.path('/login');
        }
    });
}]);
