const angular = require('angular');
const moment = require('moment');
const _ = require('lodash');

angular
  .module('aviatarFridge')
  .controller('LoginController', function ($scope, AuthenticationService, $location) {
    'use strict';

    $scope.logIn = function() {
      AuthenticationService
        .logIn($scope.username, $scope.password)
        .then(function(user) {
          $location.url('/admin');
        })
        .catch(function(err) {
          $scope.error = err;
        });
    }
  });
