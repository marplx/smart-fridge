const authBySecret = require('./auth/authBySecret.js');
const authByLogin = require('./auth/authByLogin.js');
const PaymentService = require('../services/paymentService.js');

module.exports = function(app) {
  app.get('/api/payments/:userId/:secret', authBySecret, function(request, response) {
    PaymentService
      .getPaymentsForUser(request.params.userId)
      .then(function(payments) {
        response.status(200).send(payments);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.post('/api/payments/:userId/:secret', authBySecret, function(request, response) {
    PaymentService
      .createPayment(request.params.userId, request.body.amount_cents)
      .then(function(payment) {
        response.status(200).send(payment);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.get('/api/payments', authByLogin, function(request, response) {
    PaymentService
      .getPayments()
      .then(function(payments) {
        response.status(200).send(payments);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.get('/api/confirmPayment/:id', authByLogin, function(request, response) {
    PaymentService
      .updatePaymentStatusById(request.params.id, 'confirmed')
      .then(function(payment) {
        response.status(200).send(payment);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.get('/api/declinePayment/:id', authByLogin, function(request, response) {
    PaymentService
      .updatePaymentStatusById(request.params.id, 'declined')
      .then(function(payment) {
        response.status(200).send(payment);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.delete('/api/payments/:id', authByLogin, function(request, response) {
    PaymentService
      .deletePaymentById(request.params.id)
      .then(function(payment) {
        response.status(201).send(payment);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });
}
