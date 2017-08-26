const _ = require('lodash');

angular
  .module('smartFridge')
  .filter('genitive', function() {
    return function(name) {
      if (_.endsWith(name, 's')) {
        return `${name}'`;
      } else {
        return `${name}s`;
      }
    };
  });
