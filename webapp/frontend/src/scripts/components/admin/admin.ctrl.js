const angular = require('angular');
const moment = require('moment');
const Highcharts = require('highcharts');
const _ = require('lodash');

angular
  .module('aviatarFridge')
  .controller('AdminController', function ($scope, UserService, DebtService, MailService, PaymentService, PurchaseService) {
    'use strict';

    //loadUsers
    UserService.getUsers().then(function(users) {
      $scope.users = users;
      $scope.usersById = _.reduce(users, function(result, user) {
        result[user.id] = user;
        return result;
      }, {});
    });

    DebtService.getDebts().then(function(debts) {
      $scope.debts = debts;
      $scope.totalDebts = _.sum(_.values(debts));
    });

    PaymentService.getPayments().then(function(payments) {
      $scope.payments = payments;
    });

    $scope.$watch('payments', function() {
      $scope.pendingPayments = _.filter($scope.payments, {status: 'pending'});
    }, true);


    PurchaseService.getPurchases().then(function(purchases) {
      $scope.purchases = purchases;
      createChart();
    });

    $scope.deleteUser = function(user) {
      UserService
        .deleteUserById(user.id)
        .then(function() {
          _.remove($scope.users, {id: user.id});
        });
    };

    $scope.updateUser = UserService.updateUser;
    $scope.sendEmailReminder = MailService.sendPaymentReminder;

    $scope.confirmPayment = function (payment) {
      payment.confirming = true;
      PaymentService.confirmPaymentById(payment.id)
        .then(function() {
          MailService.sendPaymentConfirmation(payment);
          payment.confirming = false;
          payment.status = 'confirmed';
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

    $scope.createUser = function() {
      $scope.inserting = true;
      UserService.createUser({
        name: $scope.newUserName,
        email: $scope.newUserEmail,
        rfid: $scope.newUserRfid
      }).then(function(user) {
        MailService.sendRegistrationConfirmation(user);

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
      var data = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}];

      _.forEach($scope.purchases, function(purchase) {
        var dayOfWeek = moment(purchase.timestamp).day();
        var germanDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; //Mo = 0 till So = 6
        data[germanDayOfWeek].y += 1;
      });

      var myChart = Highcharts.chart('chart-container', {
        chart: {
          type: 'line'
        },
        title: {
          text: null
        },
        xAxis: {
          categories: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
          title: false
        },
        yAxis: {
          title: false
        },
        legend: false,
        credits: false,
        series: [{
          name: 'Einkäufe',
          data
        }]
      });
    }
  });
