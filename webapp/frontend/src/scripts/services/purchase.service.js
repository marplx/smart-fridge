'use strict';

angular
  .module('aviatarFridge')
  .service('PurchaseService', PurchaseService)

function PurchaseService($http) {
    function getPurchasesForUserIdWithSecret(userId, secret) {
        return $http({
            method: 'GET',
            url: `/api/purchases/${userId}/${secret}`
        }).then(function(result) {
          return result.data;
        });
    };

    function getPurchases() {
      return $http({
          method: 'GET',
          url: `/api/purchases`
      }).then(function(result) {
        return result.data;
      });
    }

    return {
      getPurchasesForUserIdWithSecret,
      getPurchases
    }
}
