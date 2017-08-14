const PaymentService = require('./paymentService');
const PurchaseService = require('./purchaseService');
const _ = require('lodash');

function getCurrentDebtsForUserId(userId) {
  var payments, purchases;
  return PaymentService
    .getPaymentsForUser(userId)
    .then(function(pymnts) {
      payments = pymnts;
      return userId;
    })
    .then(PurchaseService.getPurchasesForUser)
    .then(function(prchss) {
      purchases = prchss;
      return _.sumBy(purchases, 'price_cents') - _.sumBy(payments, 'amount_cents');
    });
}

function getDebts() {
  var payments, purchases;
  return PaymentService
    .getPayments()
    .then(function(pymnts) {
      payments = pymnts;
    })
    .then(PurchaseService.getPurchases)
    .then(function(prchss) {
      purchases = prchss;

     var userIds = _(purchases)
        .concat(payments)
        .map('user_id')
        .uniq().value();

      return _.reduce(userIds, function(result, userId) {
          var purchasesForUser = _.sumBy(_.filter(purchases, {'user_id': userId}), 'price_cents');
          var relevantPayments = _.filter(payments, function(payment) {
            return payment.user_id === userId && payment.status !== 'declined';
          });
          var paymentsForUser = _.sumBy(relevantPayments, 'amount_cents');
          result[userId] = purchasesForUser - paymentsForUser;
          return result;
        }, {});
    });
}


module.exports = {
    getDebts,
    getCurrentDebtsForUserId
};
