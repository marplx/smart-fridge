angular
  .module('smartFridge')
  .service('AuthenticationService', function($q, $timeout, $http, $location, $rootScope) {
    function isLoggedIn() {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user){
        // Authenticated
        if (user !== '0') {
          console.log('Already logged in', user);
          deferred.resolve();
        }

        // Not Authenticated
        else {
          console.warn('Not logged in, rejecting!');
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    }

    function logIn(username, password) {
      return $http.post('/api/login', {
        username,
        password
      }).success(function(response) {
        console.log('Login successful', response);
      });
    }

    return {
      isLoggedIn: isLoggedIn,
      logIn: logIn
    };
  });
