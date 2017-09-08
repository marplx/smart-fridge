const angular = require('angular');
const moment = require('moment');
const Highcharts = require('highcharts');
const _ = require('lodash');
const $ = require('jquery');
require('materialize-css/js/collapsible.js');
require('materialize-css/js/jquery.easing.1.4.js');

angular
  .module('smartFridge')
  .controller('AdminController', function ($scope, UserService, DebtService, MailService, PaymentService, PurchaseService, $q) {
    'use strict';

    $('.collapsible').collapsible();

    $scope.updateUser = UserService.updateUser;
    $scope.sendEmailReminder = MailService.sendPaymentReminder;
    $scope.order = 'alphabet';

    //loadUsers
    var userPromise = UserService.getUsers().then(function(users) {
      $scope.users = _.orderBy(users, ['name'], ['asc']);

      $scope.usersById = _.reduce(users, function(result, user) {
        result[user.id] = user;
        return result;
      }, {});
    });

    var purchasePromise = PurchaseService.getPurchases().then(function(purchases) {
      $scope.purchases = purchases;
      $scope.todaysPurchases = _.filter(purchases, function(purchase) {
        return moment().isSame(moment(purchase.timestamp), 'd');
      }).length;
      createChart();
    });

    $q.all([userPromise, purchasePromise]).then(function() {
      $scope.purchasesByUsers = _($scope.purchases).groupBy('user_id').value();

      if ($scope.purchases.length > 0) {
        var purchasesOfBestCustomer = _($scope.purchasesByUsers).sortBy(function(userPurchases) {
          return -_.sumBy(userPurchases, 'price_cents');
        }).value()[0];

        $scope.bestCustomer = _.cloneDeep(_.find($scope.users, {id: purchasesOfBestCustomer[0].user_id}));
        $scope.bestCustomer.totalPurchases = purchasesOfBestCustomer.length;
        $scope.bestCustomer.totalAmount = _.sumBy(purchasesOfBestCustomer, 'price_cents');
      }
    });

    PaymentService.getPayments().then(function(payments) {
      $scope.payments = payments;
      $scope.totalEarnings = _.sumBy(_.filter($scope.payments, {status: 'confirmed'}), 'amount_cents');
    });

    DebtService.getDebts().then(function(debts) {
      $scope.debts = debts;
      $scope.totalDebts = _.sum(_.values(debts));
    });

    $scope.$watch('payments', function() {
      $scope.pendingPayments = _.filter($scope.payments, {status: 'pending'});
    }, true);

    $scope.$watch('order', function() {
      switch($scope.order) {
        case 'alphabet':
          $scope.users = _.orderBy($scope.users, ['name'], ['asc']);
          break;
        case 'purchases':
          $scope.users = _.sortBy($scope.users, function(user) {
            return - ($scope.purchasesByUsers[user.id] || []).length;
          });
          break;
        case 'debts':
          $scope.users = _.sortBy($scope.users, function(user) {
            return - $scope.debts[user.id];
          });
          break;
      }
    });

    $scope.deleteUser = function(user) {
      UserService
        .deleteUserById(user.id)
        .then(function() {
          _.remove($scope.users, {id: user.id});
        });
    };

    $scope.confirmPayment = function (payment) {
      payment.confirming = true;
      PaymentService.confirmPaymentById(payment.id)
        .then(function() {
          //No confirmation! MailService.sendPaymentConfirmation(payment);
          payment.confirming = false;
          payment.status = 'confirmed';
          $scope.totalDebts -= payment.amount_cents;
          $scope.totalEarnings += payment.amount_cents;
        }).catch(function(err) {
          payment.confirming = false;
        });
    };

    $scope.declinePayment = function (payment) {
      payment.declining = true;
      PaymentService.declinePaymentById(payment.id)
        .then(function() {
          MailService.sendPaymentDeclineInformation(payment);
          payment.declining = false;
          payment.status = 'declined';
          $scope.totalDebts += payment.amount_cents;
          $scope.debts[payment.user_id] += payment.amount_cents;
        }).catch(function(err) {
          payment.declining = false;
        });
    };

    $scope.createUser = function createUser() {
      $scope.inserting = true;
      UserService.createUser({
        name: $scope.newUserName,
        email: $scope.newUserEmail,
        rfid: $scope.newUserRfid
      }).then(function(user) {
        $scope.users.unshift(user);
        $scope.inserting = false;
        $scope.newUserName = '';
        $scope.newUserEmail = '';
        $scope.newUserRfid = '';
      }).catch(function(err) {
        console.error(err);
        $scope.inserting = false;
      })
    };

    function createChart() {
      var categories = [], data = [];

      _.forEach(_.range(14),function(day) {
        var date = moment().subtract(14 - day - 1, 'd').startOf('d');
        categories.push(date.format('ddd'));
        data.push(_.filter($scope.purchases, function(purchase) {
          return moment(purchase.timestamp).isSame(date, 'd');
        }).length);
      });

      var myChart = Highcharts.chart('chart-container', {
        chart: {
          type: 'line',
          backgroundColor: 'none'
        },
        title: {
          text: ''
        },
        xAxis: {
          title: false,
          categories,
          lineColor: 'none',
          tickColor: 'none',
          labels: {
            style: {
              color: '#000'
            }
          }
        },
        yAxis: {
          title: false,
          visible: false,
          endOnTick: false
        },
        legend: false,
        credits: false,
        series: [{
          name: 'Einkäufe',
          data,
          color: '#000'
        }]
      });
      // var max = _.maxBy(data, 'y').y;
      // var min = _.minBy(data, 'y').y;
      // myChart.yAxis[0].setExtremes(min, max, true, false);
    }
  });
