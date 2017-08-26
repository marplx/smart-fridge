'use strict';

angular
  .module('smartFridge')
  .service('PaymentService', PaymentService)

function PaymentService($http) {
  function getPaymentsForUserIdWithSecret(userId, secret) {
    return $http({
      method: 'GET',
      url: `/api/payments/${userId}/${secret}`
    }).then(function(result) {
      return result.data;
    });
  };

  function getPayments() {
    return $http({
      method: 'GET',
      url: `/api/payments`
    }).then(function(result) {
      return result.data;
    });
  };

  function confirmPaymentById(id) {
    return $http({
        method: 'GET',
        url: `/api/confirmPayment/${id}`
    }).then(function(result) {
      return result.data;
    });
  };

  function declinePaymentById(id) {
    return $http({
        method: 'GET',
        url: `/api/declinePayment/${id}`
    }).then(function(result) {
      return result.data;
    });
  };

  function createPaymentWithSecret(userId, secret, amountCents) {
    return $http.post(`/api/payments/${userId}/${secret}`, {
        'amount_cents': amountCents
      })
      .then(function(result) {
        return result.data;
      });
  }

  function deletePaymentById(id) {
    return $http({
        method: 'DELETE',
        url: `/api/payments/${id}`
    }).then(function(result) {
      return result.data;
    });
  }

  return {
    getPaymentsForUserIdWithSecret,
    getPayments,
    confirmPaymentById,
    declinePaymentById,
    createPaymentWithSecret,
    deletePaymentById
  }
}
