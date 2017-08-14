'use strict';

angular
  .module('aviatarFridge')
  .service('UserService', UserService)

function UserService($http) {
    function getUsers() {
        return $http({
            method: 'GET',
            url: `/api/users`
        }).then(function(result) {
          return result.data;
        });
    };

    function getUserByIdWithSecret(id, secret) {
        return $http({
            method: 'GET',
            url: `/api/users/${id}/${secret}`
        }).then(function(result) {
          return result.data;
        });
    };

    function createUser(user) {
      return $http.post('/api/users', user)
        .then(function(result) {
          return result.data;
        });
    }

    function updateUser(user) {
      return $http.put('/api/users/' + user.id, user)
        .then(function(result) {
          return result.data;
        });
    }

    function deleteUserById(userId) {
      return $http.delete('/api/users/' + userId);
    }

    return {
      getUsers,
      getUserByIdWithSecret,
      createUser,
      updateUser,
      deleteUserById
    }
}
