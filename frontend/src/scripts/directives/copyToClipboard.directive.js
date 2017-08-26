const Clipboard = require('clipboard');

angular
  .module('smartFridge')
  .directive('copyToClipboard', function() {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attributes) {

        new Clipboard(element[0], {
          text: function() {
            element[0].className += " copied";
            return attributes.copyToClipboard;
          }
        });

      }
    };
  });
