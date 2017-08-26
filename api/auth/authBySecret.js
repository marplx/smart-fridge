const UserService = require('../../services/userService.js');

module.exports = function authBySecret(request, response, next) {
  var userId = request.params.userId;
  var secret = request.params.secret;

  UserService
    .getUserById(userId)
    .then(function(user) {
      if (secret === user.secret) {
        next();
      } else {
        response.sendStatus(401);
      }
    });
  }
