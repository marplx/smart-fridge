angular
  .module('aviatarFridge')
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider
      // .when('/register', {
      //     templateUrl: 'templates/main.tpl.html',
      //     controller: 'MainCtrl'
      // })
      .when('/user/:userId/:secret', {
        templateUrl: 'components/user/user.tpl.html',
        controller: 'UserController'
      })
      .when('/admin', {
        templateUrl: 'components/admin/admin.tpl.html',
        controller: 'AdminController',
        resolve: {
          loggedIn: function (AuthenticationService) {
            return AuthenticationService.isLoggedIn();
          }
        }
      })
      .when('/login', {
        templateUrl: 'components/login/login.tpl.html',
        controller: 'LoginController'
      })
      .otherwise('/login');
  });
