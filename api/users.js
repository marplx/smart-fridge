const authBySecret = require('./auth/authBySecret.js');
const authByLogin = require('./auth/authByLogin.js');
const UserService = require('../services/userService.js');
const PurchaseService = require('../services/purchaseService.js');
const MailService = require('../services/mailService.js');
const PaymentService = require('../services/paymentService.js');
const crypto = require('crypto');

module.exports = function(app) {

  app.get('/api/users', authByLogin, function(request, response) {
    UserService.getUsers().then(function(users) {
      response.status(200).send(users);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
  });

  app.get('/api/users/:userId/:secret', authBySecret, function(request, response) {
    UserService.getUserById(request.params.userId)
    .then(function(user) {
      response.status(200).send(user);
    }).catch(function (err) {
      console.error(err);
      response.status(500).send(err);
    });
  });

  //PUBLIC!
  app.post('/api/users', function(request, response) {
    var newUser = request.body;
    if (newUser.name && newUser.email && newUser.rfid) {
      var secretLength = 20;
      newUser.secret = crypto.randomBytes(32).toString('hex');
      newUser.registration_timestamp = new Date();

      UserService
      .createUser(newUser)
      .then(function(user) {
        MailService.sendRegistrationConfirmation(user);
        response.status(201).send(user);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err.detail);
      });
    } else {
      response.status(400).send('Missing user data.');
    }
  });

  app.delete('/api/users/:userId', authByLogin, function(request, response) {
    var userId = request.params.userId;
    PaymentService
      .deletePaymentsForUserId(userId)
      .then(function() {
        return PurchaseService.deletePurchasesForUserId(userId);
      })
      .then(function() {
        return UserService.deleteUserById(userId);
      })
      .then(function(deletedUser) {
        response.status(200).send(deletedUser);
      }).catch(function (err) {
        response.status(500).send(err);
      });
  });

  app.put('/api/users/:userId', authByLogin, function(request, response) {
    UserService
      .updateUser(request.params.userId, request.body)
      .then(function(updatedUser) {
        response.status(200).send(updatedUser);
      }).catch(function (err) {
        console.error(err);
        response.status(500).send(err);
      });
  });
}
