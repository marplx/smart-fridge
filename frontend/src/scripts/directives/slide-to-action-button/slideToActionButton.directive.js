const Draggabilly = require('Draggabilly');

angular
  .module('smartFridge')
  .directive('slideToActionButton', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/slide-to-action-button/slideToActionButton.tpl.html',
      scope: {
        action: '<',
        loading: '<'
      },
      transclude: true,
      link: function(scope, element, attributes) {

        var handleDomElement = element[0].querySelector('.handle');
        var handleContainer = handleDomElement.parentElement;
        scope.dragPercentage = 0;
        scope.done = false;
        var distance = handleContainer.offsetWidth - handleDomElement.offsetWidth;

        var draggie = new Draggabilly( handleDomElement, {
          axis: 'x',
          containment: handleContainer
        });

        draggie.on( 'dragMove', onDragMove );
        draggie.on( 'dragEnd', onDragEnd );
        draggie.on( 'dragStart', onDragStart );

        function onDragMove(event, moveVector) {
          scope.dragPercentage = this.position.x / distance;
          scope.$digest();
        }

        function onDragEnd(event, pointer, moveVector) {
          if (scope.dragPercentage >= 0.9) {
            scope.done = true;
            if (angular.isFunction(scope.action)) {
              scope.$apply(scope.action);
            }
          } else {
            scope.dragPercentage = 0;
          }
          scope.$digest();
        }

        function onDragStart(event, pointer, moveVector) {
          scope.$digest();
        }

      }
    };
  });
