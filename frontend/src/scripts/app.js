'use strict';
const angular = require('angular');
require('angular-route');
require('angular-translate');
require('angular-relative-date');
require('angular-animate');
window.$ = window.jQuery = require('jquery');

//setup
angular
  .module('smartFridge', [
    'ngRoute',
    'pascalprecht.translate',
    'relativeDate',
    'ngAnimate'
  ]);

angular
  .module('smartFridge')
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
    })
  });
