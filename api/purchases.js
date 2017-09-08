const authBySecret = require('./auth/authBySecret.js');
const authByLogin = require('./auth/authByLogin.js');
const PurchaseService = require('../services/purchaseService.js');

module.exports = function(app) {

  app.get('/api/purchases/:userId/:secret', authBySecret, function(request, response) {
    PurchaseService
      .getPurchasesForUser(request.params.userId)
      .then(function(purchases) {
        response.status(200).send(purchases);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.post('/api/purchases/:userId/:secret', authBySecret, function(request, response) {
    PurchaseService
      .createPurchaseForUserId(request.params.userId)
      .then(function(purchase) {
        response.status(200).send(purchase);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });

  app.get('/api/purchases', authByLogin, function(request, response) {
    PurchaseService
      .getPurchases()
      .then(function(purchases) {
        response.status(200).send(purchases);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });
}
