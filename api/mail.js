const authByLogin = require('./auth/authByLogin.js');
const DebtService = require('../services/debtService.js');
const UserService = require('../services/userService.js');
const MailService = require('../services/mailService.js');
const PaymentService = require('../services/paymentService.js');

module.exports = function(app) {

  app.post('/api/mail/paymentReminder/:userId/', authByLogin, function(request, response) {
    UserService
      .getUserById(request.params.userId)
      .then(function(user) {
        return DebtService.getCurrentDebtsForUserId(request.params.userId)
          .then(function(debts){
            return MailService.sendPaymentReminder(user, debts);
          });
      }).then(function(result) {
        response.status(200).send(result);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.post('/api/mail/registrationConfirmation/:userId', authByLogin, function(request, response) {
    UserService
      .getUserById(request.params.userId)
      .then(MailService.sendRegistrationConfirmation)
      .then(function(result) {
        response.status(200).send(result);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.post('/api/mail/paymentConfirmation/:userId/:paymentId', authByLogin, function(request, response) {
    var user;
    UserService
      .getUserById(request.params.userId)
      .then(function(result) {
        user = result;
        return PaymentService.getPaymentById(request.params.paymentId);
      })
      .then(function(payment) {
        return MailService.sendPaymentConfirmation(user, payment);
      })
      .then(function(result) {
        response.status(200).send(result);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });


  app.post('/api/mail/sendPaymentDecline/:userId/:paymentId', authByLogin, function(request, response) {
    var user;
    UserService
      .getUserById(request.params.userId)
      .then(function(result) {
        user = result;
        return PaymentService.getPaymentById(request.params.paymentId);
      })
      .then(function(payment) {
        return MailService.sendPaymentDeclineInformation(user, payment);
      })
      .then(function(result) {
        response.status(200).send(result);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });
}
