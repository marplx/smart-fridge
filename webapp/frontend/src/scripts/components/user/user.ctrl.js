const angular = require('angular');
const moment = require('moment');
const _ = require('lodash');

angular
  .module('aviatarFridge')
  .controller('UserController', function ($scope, $routeParams, UserService, PurchaseService, PaymentService) {
    'use strict';

    var userId = $routeParams.userId;
    var secret = $routeParams.secret;

    UserService
      .getUserByIdWithSecret(userId, secret)
      .then(function(user) {
        $scope.user = user;
        $scope.firstName = user.name.split(' ')[0];
        return user;
      });

    PurchaseService
      .getPurchasesForUserIdWithSecret(userId, secret)
      .then(function(purchases) {
        $scope.purchases = purchases;
      })
      .then(function() {
        return PaymentService.getPaymentsForUserIdWithSecret(userId, secret);
      })
      .then(function(payments) {
        $scope.payments = payments;

        $scope.history = _($scope.purchases).concat($scope.payments).orderBy(['timestamp'], ['desc']).value();
        var countingPayments = _.filter($scope.payments, function(payment) {
          return payment.status !== 'declined';
        });
        $scope.currentDebts = _.sumBy($scope.purchases, 'price_cents') - _.sumBy(countingPayments, 'amount_cents');
      });

      $scope.isRevertable = function(item) {
        var type = item.amount_cents ? 'payment' : 'purchase';
        var isUnconfirmedPayment = (type === 'payment' && !item.confirmed);
        var isPurchaseNotLongAgo = (type === 'purchase' && moment().diff(moment(item.timestamp), 'm') < 10);
        return isUnconfirmedPayment || isPurchaseNotLongAgo;
      };

      $scope.addPayment = function(amountCents) {
        PaymentService
          .createPaymentWithSecret(userId, $scope.user.secret, amountCents)
          .then(function(payment) {
            $scope.payments.push(payment);
            $scope.history = _($scope.purchases).concat($scope.payments).orderBy(['timestamp'], ['desc']).value();
            $scope.currentDebts = _.sumBy($scope.purchases, 'price_cents') - _.sumBy($scope.payments, 'amount_cents');
          });
      };

      $scope.endsWithS = function(string) {
        return _.endsWith(string, 's');
      }
  });
