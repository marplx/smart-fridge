'use strict';
const angular = require('angular');
require('angular-route');
window.$ = window.jQuery = require('jquery');

//setup
angular
  .module('aviatarFridge', [
    'ngRoute'
  ]);

angular
  .module('aviatarFridge')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          return response;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $location.url('/login');
          }
          return $q.reject(response);
        }
      };
    });
  });
