angular
  .module('aviatarFridge')
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/register', {
          templateUrl: 'components/register/register.tpl.html',
          controller: 'RegisterController'
      })
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
      .otherwise('/register');
  });
