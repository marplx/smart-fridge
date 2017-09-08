const angular = require('angular');
const moment = require('moment');
const _ = require('lodash');

angular
  .module('smartFridge')
  .controller('UserController', function ($scope, $routeParams, UserService, PurchaseService, PaymentService) {
    'use strict';

    $scope.payNow = payNow;
    $scope.isPayment = isPayment;
    $scope.isPurchase = isPurchase;
    $scope.buyDrink = buyDrink;

    $scope.purchased = false;
    $scope.purchasing = false;

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
        updateCurrentDebts();
      });

    function updateCurrentDebts() {
      var countingPayments = _.filter($scope.payments, function(payment) {
        return payment.status !== 'declined';
      });
      $scope.currentDebts = _.sumBy($scope.purchases, 'price_cents') - _.sumBy(countingPayments, 'amount_cents');
    }

    // $scope.isRevertable = function(item) {
    //   var type = item.amount_cents ? 'payment' : 'purchase';
    //   var isUnconfirmedPayment = (type === 'payment' && !item.confirmed);
    //   var isPurchaseNotLongAgo = (type === 'purchase' && moment().diff(moment(item.timestamp), 'm') < 10);
    //   return isUnconfirmedPayment || isPurchaseNotLongAgo;
    // }

    function payNow() {
      $scope.currentPayment = {
        'amount_cents': $scope.currentDebts
      }

      PaymentService
        .createPaymentWithSecret(userId, $scope.user.secret, $scope.currentDebts)
        .then(function(payment) {
          payment.isNew = true;
          $scope.payments.push(payment);
          $scope.history = _($scope.purchases).concat($scope.payments).orderBy(['timestamp'], ['desc']).value();
          updateCurrentDebts();
        });
    }

    function buyDrink() {
      $scope.purchasing = true;
      PurchaseService
        .createPurchaseForUserIdWithSecret(userId, $scope.user.secret)
        .then(function(newPurchase) {
          $scope.purchased = true;
          $scope.purchasing = false;
          newPurchase.isNew = true;
          $scope.history.unshift(newPurchase);
          $scope.currentDebts += newPurchase.price_cents;
        });
    }

    function isPayment(item) {
      return angular.isDefined(item.amount_cents);
    }

    function isPurchase(item) {
      return !$scope.isPayment(item);
    }

  });
