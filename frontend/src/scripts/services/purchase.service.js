'use strict';

angular
  .module('smartFridge')
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

    function createPurchaseForUserIdWithSecret(userId, secret) {
      return $http({
          method: 'POST',
          url: `/api/purchases/${userId}/${secret}`
      }).then(function(result) {
        return result.data;
      });
    }

    return {
      createPurchaseForUserIdWithSecret,
      getPurchasesForUserIdWithSecret,
      getPurchases
    }
}
