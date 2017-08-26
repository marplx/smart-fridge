'use strict';

angular
  .module('smartFridge')
  .service('MailService', MailService)

function MailService($http) {

  function sendPaymentReminder(user) {
    return $http({
        method: 'POST',
        url: `/api/mail/paymentReminder/${user.id}`
    }).then(function(result) {
      return result.data;
    });
  }

  function sendRegistrationConfirmation(user) {
    return $http({
        method: 'POST',
        url: `/api/mail/registrationConfirmation/${user.id}`
    }).then(function(result) {
      return result.data;
    });
  }

  function sendPaymentConfirmation(payment) {
    return $http({
        method: 'POST',
        url: `/api/mail/paymentConfirmation/${payment.user_id}/${payment.id}`
    }).then(function(result) {
      return result.data;
    });
  }

  function sendPaymentDeclineInformation(payment) {
    return $http({
        method: 'POST',
        url: `/api/mail/sendPaymentDecline/${payment.user_id}/${payment.id}`
    }).then(function(result) {
      return result.data;
    });
  }

  return {
    sendPaymentReminder,
    sendRegistrationConfirmation,
    sendPaymentConfirmation,
    sendPaymentDeclineInformation
  };
}
