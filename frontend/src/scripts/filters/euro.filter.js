angular
  .module('smartFridge')
  .filter('euro', function() {
    return function(cents) {
      if (cents) {
        return (cents / 100).toFixed(2).replace('.', ',') + '\u00A0€';
      } else {
        return '0,00\u00A0€';
      }
    };
  });
