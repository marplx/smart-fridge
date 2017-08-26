'use strict';

angular
  .module('smartFridge')
  .directive('header', function() {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: 'components/header/header.template.html'
    };
  });
