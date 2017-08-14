'use strict';

angular
  .module('aviatarFridge')
  .service('DebtService', DebtService)

function DebtService($http) {
    function getDebts() {
        return $http({
            method: 'GET',
            url: `/api/debts`
        }).then(function(result) {
          return result.data;
        });
    };

    return {
      getDebts
    };
}
