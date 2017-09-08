const PurchaseService = require('../services/purchaseService.js');
const DebtService = require('../services/debtService.js');
const UserService = require('../services/userService.js');
const MailService = require('../services/mailService.js');
const cors = require('cors');
const MAIL_TRIGGER_DEBT_CENTS = 10 * 100;

module.exports = function(app, unknownRfidCallback) {

  //PUBLIC UNAUTHENTICATED API
  app.post('/api/purchases/', cors(), function(request, response) {
    //TODO authBySignature
    //id: 0x440x4a0x300xbb, signature: jG5iN8GuWOg/ncjXy73DklstZ5UhHVgDM5KOwIotNcY

    var rfid = request.body.id;
    var user;

    UserService
      .getUserByRfid(rfid)
      .then(function(u) {
        user = u;
        if (!user) {
          console.info('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.info('┃    NEW RFID CARD RECEIVED');
          console.info('┃      '   + rfid);
          console.info('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          var registrationSuccess = unknownRfidCallback(rfid);
          if (registrationSuccess) {
            return Promise.reject('registration')
          } else {
            return Promise.reject(404)
          }
        }
        return user;
      })
      .then(function(user) {
        return PurchaseService.createPurchaseForUserId(user.id);
      }).then(function(purchase) {
        sendPaymentReminder(user, purchase);

        response.status(200).send(purchase);
      }).catch(function (err) {
        if (err === 404) {
          response.status(404).send('RFID unknown!');
        } else if (err === 'registration') {
          response.status(201).send('RFID registered.');
        } else {
          console.error(err);
          response.status(500).send(err);
        }
      });
  });

  //send mail if > x€
  function sendPaymentReminder(user, purchase) {
    DebtService
      .getCurrentDebtsForUserId(user.id)
      .then(function(debts) {
        var debtsBefore = debts - purchase.price_cents;
        if (debtsBefore < MAIL_TRIGGER_DEBT_CENTS && debts >= MAIL_TRIGGER_DEBT_CENTS) {
          console.log('Debts of ' + user.name + '(' + user.id + ') exceeded ' + MAIL_TRIGGER_DEBT_CENTS/100 + '€. Sending mail.');
          MailService.sendPaymentReminder(user, debts);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

}
