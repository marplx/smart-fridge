const angular = require('angular');
const moment = require('moment');
const _ = require('lodash');
const SCAN_SECONDS = 30;

angular
  .module('smartFridge')
  .controller('RegisterController', function ($scope, $interval, UserService) {
    'use strict';

    var interval, websocket;
    var collapsible = $('.collapsible').collapsible();

    $scope.startScanning = startScanning;
    $scope.submitData = submitData;
    $scope.goToStep = goToStep;
    $scope.range = _.range;
    $scope.resetRfid = resetRfid;

    $scope.user = {};
    $scope.secondsRemaining = SCAN_SECONDS;
    $scope.scanStatus = {
      status: 'pristine' //loading, receiving, waiting, received, timeout
    };

    function goToStep(step) {
      collapsible.collapsible('open', step - 1);
    }

    function submitData() {
      $scope.saving = true;
      UserService.createUser($scope.user)
        .then(function(user) {
          $scope.saving = false;
          $scope.user = user;
          goToStep(4);
        }).catch(function(err) {
          console.log(err);
          $scope.saving = false;
        });
    }

    function startScanning() {
      $scope.user.rfid = undefined;
      $scope.scanStatus = {status: 'loading'};
      startWebsocket();
    }

    function startWebsocket() {
      let protocol = window.location.protocol === "https:" ? 'wss://' : 'ws://';
      let url = protocol + window.location.host.replace('9000', '5000') + '/api/scanRfid';
      websocket = new WebSocket(url)

      websocket.onmessage = function(message) {
        if (angular.isString(message.data)) {
          var msgObj = angular.fromJson(message.data);
          $scope.scanStatus = msgObj;

          if (msgObj.status === 'receiving') {
            $interval.cancel(interval);
            interval = $interval(function() {
              $scope.secondsRemaining -= 1;
              if ($scope.secondsRemaining === 0) {
                $scope.scanStatus = {status: 'timeout'};
                stopWebsocket();
                $interval.cancel(interval);
                $scope.secondsRemaining = SCAN_SECONDS;
              }
            }, 1000, 1000);
          } else if (msgObj.status === 'received') {
            $scope.user.rfid = msgObj.rfid;
            stopWebsocket();
          }
        }
        $scope.$digest();
      };

      websocket.onerror = function(err) {
        $scope.scanStatus = {status: 'timeout'};
        $interval.cancel(interval);
        $scope.secondsRemaining = SCAN_SECONDS;
        $scope.$digest();
      };

      websocket.onclose = function(evt) {
        console.log(evt);
        if (!$scope.user.rfid) {
          $scope.scanStatus = {status: 'timeout'};
        }
        $interval.cancel(interval);
        $scope.secondsRemaining = SCAN_SECONDS;
        $scope.$digest();
      };
    }

    function stopWebsocket() {
      if (websocket) {
        websocket.close();
        websocket = undefined;
      }
    }

    function resetRfid() {
      stopWebsocket();
      $interval.cancel(interval);
      $scope.secondsRemaining = SCAN_SECONDS;
      $scope.user.rfid = undefined;
    }

  });
